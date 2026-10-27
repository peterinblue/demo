"""Turns the frames of frontend/record-gif.mjs into the README animation (GIF and WebP)."""

from pathlib import Path
import sys

from PIL import Image

frames_dir, out = Path(sys.argv[1]), Path(sys.argv[2])
width = int(sys.argv[3]) if len(sys.argv) > 3 else 800
files = sorted(frames_dir.glob("f*.png"))
frames = []
for f in files:
    im = Image.open(f).convert("RGB")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    frames.append(im)
# one shared palette from a few frames keeps the colours steady (no flicker between frames)
sample = Image.new("RGB", (width, frames[0].height * 4))
for i, k in enumerate(range(0, len(frames), max(1, len(frames) // 4))):
    if i < 4:
        sample.paste(frames[k], (0, frames[0].height * i))
palette = sample.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
gif = [im.quantize(palette=palette, dither=Image.Dither.NONE) for im in frames]
gif[0].save(out, save_all=True, append_images=gif[1:], duration=80, loop=0, optimize=True)
frames[0].save(
    out.with_suffix(".webp"), save_all=True, append_images=frames[1:], duration=80, loop=0, quality=80, method=6
)
print(
    out,
    out.stat().st_size // 1024,
    "KB;",
    out.with_suffix(".webp").stat().st_size // 1024,
    "KB webp;",
    len(frames),
    "frames",
)
