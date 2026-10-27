<?php
/**
 * NeonPlan 3D – personalised pack downloads for WooCommerce.
 *
 * Every purchased furniture pack is signed with the buyer's name at download time, so the file the
 * buyer gets says "licensed to <name>" when it is imported. The integration accepts the shop key
 * (PACK_PUBLIC_KEYS in custom_components/neonplan3d/packs.py) next to the publisher's master key.
 *
 * Setup:
 *   1. wp-config.php: define('MS_NP_SIGNING_SEED', '<base64 seed>');   (from: python tools/fp3dpack.py seed shop-signing-key.pem)
 *   2. Next to each <pack>.fp3dpack in wp-content/uploads/woocommerce_uploads/neonplan3d/ put the
 *      template <pack>.canonical.json (from: python tools/fp3dpack.py canonical <pack>.json).
 *   3. Products carry the meta _ms_np_key = pack key (living, kitchen, …). The bundle lists the packs.
 *   4. Drop this file into wp-content/novamira-sandbox/ (auto-loaded) or a plugin.
 * Without seed or template the download falls through to WooCommerce's normal delivery.
 *
 * With ms-np-license.php next to this file, a download from the website is also bound to the
 * installation the buyer's key was activated on last (none activated yet: the file stays unbound).
 */

if (!defined('ABSPATH')) {
    exit;
}

const MS_NP_KEY_ID = '867371cc70e6';
const MS_NP_UPLOAD_DIR = 'woocommerce_uploads/neonplan3d';

add_action('woocommerce_download_product', 'ms_np_sign_download', 10, 6);

/**
 * Serves a purchased pack signed with the buyer's name; returns to WooCommerce when it cannot.
 */
function ms_np_sign_download(string $email, string $order_key, int $product_id, int $user_id, string $download_id, int $order_id): void
{
    if (!defined('MS_NP_SIGNING_SEED') || !function_exists('sodium_crypto_sign_seed_keypair')) {
        return;
    }
    $product = wc_get_product($product_id);
    $order = wc_get_order($order_id);
    if (!$product || !$order || !$product->get_meta('_ms_np_key')) {
        return;
    }
    // the file WooCommerce would deliver: <pack>.fp3dpack -> its canonical template
    $download = $product->get_file($download_id);
    if (!$download) {
        return;
    }
    $file = basename((string) $download->get_file());
    if (!preg_match('/^([a-z0-9_]+)\.fp3dpack$/', $file, $m)) {
        return;
    }
    $uploads = wp_upload_dir();
    $template = trailingslashit($uploads['basedir']) . MS_NP_UPLOAD_DIR . '/' . $m[1] . '.canonical.json';
    if (!is_readable($template)) {
        return;
    }
    $canonical = file_get_contents($template);
    $name = ms_np_buyer_name($order);
    $signed = ms_np_put_licensee($canonical, $name);
    if ($signed === null) {
        return;
    }
    if (function_exists('ms_np_ensure_license') && function_exists('ms_np_latest_instance_of_key')) {
        $key = ms_np_ensure_license($order);
        $instance = $key !== '' ? ms_np_latest_instance_of_key($key) : null;
        if ($instance !== null) {
            $signed = ms_np_put_instance($signed, $instance) ?? $signed;
        }
    }
    $seed = base64_decode(MS_NP_SIGNING_SEED, true);
    if ($seed === false || strlen($seed) !== SODIUM_CRYPTO_SIGN_SEEDBYTES) {
        return;
    }
    $keypair = sodium_crypto_sign_seed_keypair($seed);
    $sig = sodium_crypto_sign_detached($signed, sodium_crypto_sign_secretkey($keypair));
    $body = '{"payload":' . $signed . ',"signature":{"key":"' . MS_NP_KEY_ID . '","sig":"' . base64_encode($sig) . '"}}';

    // count the download like WooCommerce does, then deliver the personalised file
    // (WooCommerce 11: get_downloads + track_download; the older helpers do not exist any more)
    $data_store = WC_Data_Store::load('customer-download');
    $permissions = $data_store->get_downloads([
        'order_id' => $order_id,
        'product_id' => $product_id,
        'download_id' => $download_id,
        'return' => 'objects',
    ]);
    $ip = class_exists('WC_Geolocation') ? WC_Geolocation::get_ip_address() : '';
    foreach ($permissions as $permission) {
        $permission->track_download($user_id > 0 ? $user_id : null, $ip !== '' ? $ip : null);
    }
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    nocache_headers();
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $file . '"');
    header('Content-Length: ' . strlen($body));
    header('X-Robots-Tag: noindex, nofollow');
    echo $body;
    exit;
}

/** The buyer's name as it goes into the file: trimmed, single spaces, at most 80 characters. */
function ms_np_buyer_name(WC_Order $order): string
{
    $name = trim($order->get_formatted_billing_full_name());
    if ($name === '') {
        $name = trim((string) $order->get_billing_email());
    }
    $name = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $name);
    $name = preg_replace('/\s+/u', ' ', trim((string) $name));
    if ($name === '' || $name === null) {
        $name = 'Kunde ' . $order->get_order_number();
    }
    return mb_substr($name, 0, 80);
}

/**
 * Puts the name into the canonical template: the LAST "licensee":null belongs to the pack itself
 * (the keys after it are name, publisher and version); JSON encoding matches Python's canonical form
 * (UTF-8 kept, slashes unescaped).
 */
function ms_np_put_licensee(string $canonical, string $name): ?string
{
    $marker = '"licensee":null';
    $at = strrpos($canonical, $marker);
    if ($at === false) {
        return null;
    }
    $json = json_encode($name, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_LINE_TERMINATORS);
    if ($json === false) {
        return null;
    }
    return substr($canonical, 0, $at) . '"licensee":' . $json . substr($canonical, $at + strlen($marker));
}
