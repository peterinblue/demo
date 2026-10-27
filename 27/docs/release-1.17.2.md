**NeonPlan 3D 1.17.2** brings roof windows into the room card, four wishes from a customer's e-mail – an air conditioner, cooktops that glow while they cook, lamps that only show one colour and a watt threshold for appliances behind smart plugs – and a fix for the play button on Echo speakers.

### New

- **Air conditioner (wall):** a new item under *Work & other*. It hangs high on the wall, takes a climate entity and glows at its air outlet in the colour of its mode – red heating, blue cooling, green automatic, yellow drying, white fan only; bright while it works, dimmed on standby.
- **Cooktops glow:** a stove glows on its cooking zones while it cooks – the built-in stove and the hobs and cookers of the Kitchen pack (by their power sensor, their state or an operating-state sensor such as Home Connect's `run` / `ready` / `inactive`: faint at *ready*, dark at *inactive*). With the Kitchen pack's update (release 4), no zone is painted red for ever any more.
- **Lamps in one colour only:** *Glow in one colour only* in a lamp's form – the lamp only glows while the light shows about that colour. A colour light used as a signal (yellow for "water" at the washbasin) no longer shows its other colours there.
- **Running from (watts):** appliances with a power sensor get their own threshold (empty: 10 W) – for old appliances behind a smart plug that draw a few watts on standby, e.g. 100 W.
- **Roof windows in the room card:** every roof window belongs to the room below it – its blind, contact and window motor are in the room card, and the sun falls through it onto the room's floor (#482).

### Changed

- **Roof windows when the roof fades out:** they fade out with the roof again, as before 1.17.1. Who wants a window to stay over the room ticks **Show over the room without the roof** in its form (#482). Windows in a slope that reaches down over a lower floor stay in the roof, so they no longer hang in the air below the floor shown.

### Fixed

- **Weather outside switched off** stayed on after a reload until switched on and off again – in the panel and in the dashboard card (card option *Weather*) (#509).
- **Echo speakers (Klang & Kino):** ▶ after ⏸ sends play even while the Echo still reports "playing" – it answers late; the button shows what was pressed until the speaker catches up (#400).

### How to update

Settings → System → Updates. HACS only looks for new versions every few hours, so a fresh update may not show there yet. Then: HACS → NeonPlan 3D → ⋮ → **Update information** → **Download**. Restart Home Assistant and reload the page (Ctrl+F5).

---

**NeonPlan 3D 1.17.2** bringt Dachfenster in die Raumkarte, vier Wünsche aus der E-Mail eines Kunden – ein Klimagerät, Kochfelder, die beim Kochen glühen, Lampen, die nur eine Farbe zeigen, und eine Watt-Schwelle für Geräte hinter Steckdosen – und einen Fix für die Play-Taste bei Echo-Lautsprechern.

### Neu

- **Klimagerät (Wand):** ein neues Möbel unter *Arbeiten & Sonstiges*. Es hängt oben an der Wand, nimmt eine Klima-Entität und leuchtet am Luftauslass in der Farbe seines Modus – rot Heizen, blau Kühlen, grün Automatik, gelb Entfeuchten, weiß nur Lüften; hell, solange es arbeitet, gedämpft im Standby.
- **Kochfelder glühen:** Ein Herd glüht auf den Kochfeldern, solange er kocht – der eingebaute Herd und die Kochfeld-Unterschränke und Herde aus dem Pack Küche (über ihren Leistungssensor, ihren Zustand oder einen Betriebszustand-Sensor wie den von Home Connect `run` / `ready` / `inactive`: schwach bei *ready*, aus bei *inactive*). Mit dem Update des Packs Küche (Release 4) ist keine Platte mehr dauerhaft rot gemalt.
- **Lampen nur in einer Farbe:** *Nur in einer Farbe leuchten* im Formular einer Lampe – sie leuchtet nur, solange das Licht ungefähr diese Farbe zeigt. Ein Farblicht als Signal (gelb für „Wasser“ am Waschbecken) zeigt dort seine anderen Farben nicht mehr.
- **Läuft ab (Watt):** Geräte mit Leistungssensor bekommen eine eigene Schwelle (leer: 10 W) – für alte Geräte hinter einer smarten Steckdose, die im Standby ein paar Watt ziehen, z. B. 100 W.
- **Dachfenster in der Raumkarte:** Jedes Dachfenster gehört zum Raum darunter – Rollladen, Kontakt und Fenstermotor stehen in der Raumkarte, und die Sonne fällt durch das Fenster auf den Boden des Raums (#482).

### Geändert

- **Dachfenster, wenn das Dach ausblendet:** Sie blenden wieder mit dem Dach aus, wie vor 1.17.1. Wer ein Fenster über dem Raum stehen lassen will, setzt in seinem Formular den Haken **Ohne Dach über dem Raum zeigen** (#482). Fenster in einer Schräge, die über eine tiefere Etage reicht, bleiben im Dach – sie hängen nicht mehr unter der gezeigten Etage in der Luft.

### Behoben

- **Wetter draußen ausgeschaltet** blieb nach dem Neuladen an, bis man es einmal an- und wieder ausschaltete – im Panel und in der Dashboard-Karte (Option *Wetter*) (#509).
- **Echo-Lautsprecher (Klang & Kino):** ▶ nach ⏸ schickt Play, auch wenn das Echo noch „spielt“ meldet – es antwortet spät; die Taste zeigt, was gedrückt wurde, bis der Lautsprecher nachzieht (#400).

### So bekommst du das Update

Einstellungen → System → Updates. HACS sucht nur alle paar Stunden nach neuen Versionen, deshalb fehlt ein frisches Update dort manchmal noch. Dann: HACS → NeonPlan 3D → ⋮ → **Informationen aktualisieren** → **Herunterladen**. Home Assistant neu starten und die Seite neu laden (Strg+F5).
