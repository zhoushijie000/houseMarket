from pathlib import Path

import pdfplumber
from PIL import Image, ImageOps, ImageDraw


PDF_PATH = Path(r"C:\Users\ZhuanZ\Desktop\成都住建房产超市促销二维码.pdf")
OUT_DIR = Path(r".tmp\pdf-reference")


def extract_text() -> None:
    with pdfplumber.open(PDF_PATH) as pdf:
        for index, page in enumerate(pdf.pages, start=1):
            print(f"\n===== PAGE {index} =====\n")
            print(page.extract_text() or "[NO EXTRACTABLE TEXT]")


def make_contact_sheets() -> None:
    pages = sorted(OUT_DIR.glob("page-*.png"))
    for sheet_index, start in enumerate(range(0, len(pages), 5), start=1):
        chunk = pages[start : start + 5]
        thumbs = []
        for path in chunk:
            image = Image.open(path).convert("RGB")
            thumb = ImageOps.contain(image, (380, 540))
            card = Image.new("RGB", (400, 580), "white")
            card.paste(thumb, ((400 - thumb.width) // 2, 24))
            draw = ImageDraw.Draw(card)
            draw.text((12, 550), path.stem, fill="black")
            thumbs.append(card)

        sheet = Image.new("RGB", (400 * len(thumbs), 580), "#d9d9d9")
        for index, thumb in enumerate(thumbs):
            sheet.paste(thumb, (400 * index, 0))
        sheet.save(OUT_DIR / f"contact-{sheet_index}.png")


if __name__ == "__main__":
    make_contact_sheets()
    extract_text()
