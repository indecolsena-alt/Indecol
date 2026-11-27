"""Build the light copies of the crime and category images used by the "Delitos" pages.

Run from the project root after adding or replacing an image (needs Pillow):
    python scripts/optimizar_imagenes.py

The originals are kept as the source; the page only downloads the copies.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
CATEGORIES = IMAGES / "categoria y delitos"
CRIMES = CATEGORIES / "delitos"
OUTPUT = IMAGES / "web"
THUMBNAIL = 180  # 60 px on screen, sharp up to 3x displays


def save(image: Image.Image, target: Path, quality: int) -> int:
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", quality=quality, method=6)
    return target.stat().st_size


def resized(path: Path, max_width: int) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.LANCZOS)
    return image


def main() -> None:
    before = after = 0
    for path in sorted(CATEGORIES.glob("*.jpg")):
        before += path.stat().st_size
        after += save(resized(path, 1280), OUTPUT / "categorias" / f"{path.stem}.webp", 76)
    for path in sorted(CRIMES.glob("*.jpg")):
        before += path.stat().st_size
        image = resized(path, 1100)
        after += save(image, OUTPUT / "delitos" / f"{path.stem}.webp", 74)
        thumbnail = ImageOps.fit(image, (THUMBNAIL, THUMBNAIL), Image.LANCZOS)
        after += save(thumbnail, OUTPUT / "miniaturas" / f"{path.stem}.webp", 72)
    print(f"Originales: {before / 1e6:.1f} MB · copias web: {after / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
