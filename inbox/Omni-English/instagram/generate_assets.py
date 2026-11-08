from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets"
LOGO_PATH = ROOT.parent / "assets" / "omnica-logo.jpg"

W_FEED, H_FEED = 1080, 1350
W_REEL, H_REEL = 1080, 1920

YELLOW = "#FFCA00"
PURPLE = "#6716A3"
INK = "#161218"
CREAM = "#FFF9E8"
WHITE = "#FFFFFF"
MUTED = "#6D6470"

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


@dataclass(frozen=True)
class Slide:
    folder: str
    filename: str
    eyebrow: str
    title: str
    body: str = ""
    background: str = CREAM
    foreground: str = INK
    accent: str = PURPLE
    number: str = ""
    strike_first_line: bool = False


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size=size)


def text_width(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> float:
    return draw.textlength(text, font=fnt)


def wrap_line(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        proposal = f"{current} {word}"
        if text_width(draw, proposal, fnt) <= max_width:
            current = proposal
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        lines.extend(wrap_line(draw, paragraph, fnt, max_width))
    return lines


def draw_lines(
    draw: ImageDraw.ImageDraw,
    lines: Iterable[str],
    xy: tuple[int, int],
    fnt: ImageFont.FreeTypeFont,
    fill: str,
    spacing: int,
) -> int:
    x, y = xy
    line_height = fnt.size + spacing
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_height
    return y


def add_corner_rings(draw: ImageDraw.ImageDraw, width: int, height: int, accent: str, *, top: bool = True) -> None:
    center = (width + 40, -30) if top else (-40, height + 20)
    for radius, stroke in [(260, 34), (190, 28), (125, 22)]:
        box = (center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius)
        draw.arc(box, 25, 295, fill=accent, width=stroke)


def make_logo_badge(size: int) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size - 1, size - 1), fill=255)
    badge = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    badge.paste(logo.convert("RGBA"), (0, 0), mask)
    return badge


def add_footer(img: Image.Image, slide_number: str = "") -> None:
    draw = ImageDraw.Draw(img)
    badge = make_logo_badge(58)
    img.paste(badge, (72, img.height - 112), badge)
    draw.text((146, img.height - 96), "Ominca English", font=font(FONT_BOLD, 30), fill=INK if img.getpixel((20, 20)) != (103, 22, 163) else WHITE)
    if slide_number:
        draw.text((img.width - 150, img.height - 96), slide_number, font=font(FONT_BOLD, 28), fill=MUTED if img.getpixel((20, 20)) != (103, 22, 163) else YELLOW)


def render_slide(spec: Slide) -> Path:
    path = OUT / spec.folder / spec.filename
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W_FEED, H_FEED), spec.background)
    draw = ImageDraw.Draw(img)

    ring_color = spec.accent if spec.background != PURPLE else YELLOW
    add_corner_rings(draw, W_FEED, H_FEED, ring_color, top=True)

    eyebrow_font = font(FONT_BOLD, 24)
    eyebrow_text = spec.eyebrow.upper()
    eyebrow_width = max(258, int(text_width(draw, eyebrow_text, eyebrow_font)) + 58)
    draw.rounded_rectangle((72, 72, 72 + eyebrow_width, 126), radius=27, fill=spec.accent if spec.background != PURPLE else YELLOW)
    eyebrow_fill = WHITE if spec.background != PURPLE else PURPLE
    draw.text((98, 86), eyebrow_text, font=eyebrow_font, fill=eyebrow_fill)

    title_font = font(FONT_BLACK, 82)
    title_lines = wrap_text(draw, spec.title, title_font, 890)
    y = 225
    title_positions: list[tuple[str, int]] = []
    for line in title_lines:
        title_positions.append((line, y))
        draw.text((72, y), line, font=title_font, fill=spec.foreground)
        y += title_font.size + 18

    if spec.strike_first_line and title_positions:
        first, first_y = title_positions[0]
        line_w = int(text_width(draw, first, title_font))
        draw.line((62, first_y + 50, 72 + line_w + 12, first_y + 33), fill=spec.accent, width=16)

    if spec.body:
        y += 38
        body_font = font(FONT_REGULAR, 48)
        body_lines = wrap_text(draw, spec.body, body_font, 870)
        draw_lines(draw, body_lines, (76, y), body_font, spec.foreground, 19)

    add_footer(img, spec.number)
    img.save(path, quality=95)
    return path


def render_reel_cover(folder: str, headline: str, eyebrow: str, background: str, foreground: str, accent: str) -> Path:
    path = OUT / folder / "cover-1080x1920.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (W_REEL, H_REEL), background)
    draw = ImageDraw.Draw(img)

    add_corner_rings(draw, W_REEL, H_REEL, accent, top=True)
    add_corner_rings(draw, W_REEL, H_REEL, accent, top=False)

    label_font = font(FONT_BOLD, 28)
    label_text = eyebrow.upper()
    label_width = max(282, int(text_width(draw, label_text, label_font)) + 60)
    draw.rounded_rectangle((72, 300, 72 + label_width, 362), radius=31, fill=accent)
    label_fill = PURPLE if accent == YELLOW else WHITE
    draw.text((102, 317), label_text, font=label_font, fill=label_fill)

    headline_font = font(FONT_BLACK, 94)
    lines = wrap_text(draw, headline, headline_font, 900)
    total_h = len(lines) * (headline_font.size + 20)
    y = max(500, (H_REEL - total_h) // 2)
    draw_lines(draw, lines, (72, y), headline_font, foreground, 20)

    badge = make_logo_badge(76)
    img.paste(badge, (72, H_REEL - 190), badge)
    draw.text((166, H_REEL - 166), "Ominca English", font=font(FONT_BOLD, 34), fill=foreground)
    img.save(path, quality=95)
    return path


def crop_reel_to_feed(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGB")
    top = (img.height - H_FEED) // 2
    return img.crop((0, top, W_FEED, top + H_FEED))


def make_contact_sheet(paths: list[Path]) -> Path:
    thumb_w, thumb_h = 360, 450
    sheet = Image.new("RGB", (thumb_w * 3, thumb_h * 2), CREAM)
    for index, path in enumerate(paths):
        img = Image.open(path).convert("RGB")
        if img.height == H_REEL:
            img = crop_reel_to_feed(path)
        img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = (index % 3) * thumb_w
        y = (index // 3) * thumb_h
        sheet.paste(img, (x, y))
    output = OUT / "launch-grid-preview.png"
    sheet.save(output)
    return output


def make_carousel_sheet(paths: list[Path]) -> Path:
    thumb_w, thumb_h = 216, 270
    sheet = Image.new("RGB", (thumb_w * 5, thumb_h * 3), CREAM)
    for index, path in enumerate(paths):
        img = Image.open(path).convert("RGB")
        img.thumbnail((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = (index % 5) * thumb_w
        y = (index // 5) * thumb_h
        sheet.paste(img, (x, y))
    output = OUT / "carousel-proof-sheet.png"
    sheet.save(output)
    return output


def main() -> None:
    slides = [
        Slide("post-02-agree-carousel", "01.png", "Рабочий английский", "I AM AGREE", "3 фразы, которые звучат естественно на работе", CREAM, INK, PURPLE, "1 / 5", True),
        Slide("post-02-agree-carousel", "02.png", "Вместо ошибки", "I AGREE.", "Я согласен / согласна.", YELLOW, PURPLE, PURPLE, "2 / 5"),
        Slide("post-02-agree-carousel", "03.png", "Естественный вариант", "THAT MAKES SENSE.", "Это имеет смысл.", PURPLE, WHITE, YELLOW, "3 / 5"),
        Slide("post-02-agree-carousel", "04.png", "Мягкое согласие", "I SEE YOUR POINT.", "Я понимаю вашу точку зрения.", CREAM, INK, PURPLE, "4 / 5"),
        Slide("post-02-agree-carousel", "05.png", "Сохраните пост", "ИСПОЛЬЗУЙТЕ НА СЛЕДУЮЩЕМ СОЗВОНЕ", "На пробном уроке разберём фразы под вашу ситуацию.", YELLOW, PURPLE, PURPLE, "5 / 5"),
        Slide("post-03-method-carousel", "01.png", "После занятия", "УРОК ЗАКОНЧИЛСЯ. ЧТО ОСТАЁТСЯ У ВАС?", "Не только случайные заметки.", PURPLE, WHITE, YELLOW, "1 / 5"),
        Slide("post-03-method-carousel", "02.png", "01 · Материал урока", "ТРАНСКРИПЦИЯ", "Можно вернуться к тому, что обсуждали.", CREAM, INK, PURPLE, "2 / 5"),
        Slide("post-03-method-carousel", "03.png", "02 · Главное", "ПОЛЕЗНЫЕ СЛОВА", "Не теряются в случайных заметках.", YELLOW, PURPLE, PURPLE, "3 / 5"),
        Slide("post-03-method-carousel", "04.png", "03 · Практика", "FLASHCARDS И ПОВТОРЕНИЕ", "Материал возвращается в практику.", PURPLE, WHITE, YELLOW, "4 / 5"),
        Slide("post-03-method-carousel", "05.png", "Ominca English", "АНГЛИЙСКИЙ ПРОДОЛЖАЕТСЯ МЕЖДУ УРОКАМИ", "Пробный урок — 1 500 тенге. Ссылка в профиле.", CREAM, INK, PURPLE, "5 / 5"),
        Slide("post-05-pricing-carousel", "01.png", "Начните спокойно", "ПРОБНЫЙ УРОК", "1 500 ТЕНГЕ", PURPLE, WHITE, YELLOW, "1 / 5"),
        Slide("post-05-pricing-carousel", "02.png", "Lite", "4 ЗАНЯТИЯ В МЕСЯЦ", "60 минут каждое · 15 000 тенге", CREAM, INK, PURPLE, "2 / 5"),
        Slide("post-05-pricing-carousel", "03.png", "Standard", "8 ЗАНЯТИЙ В МЕСЯЦ", "60 минут каждое · 26 000 тенге", YELLOW, PURPLE, PURPLE, "3 / 5"),
        Slide("post-05-pricing-carousel", "04.png", "Intensive", "12 ЗАНЯТИЙ В МЕСЯЦ", "60 минут каждое · 36 000 тенге", PURPLE, WHITE, YELLOW, "4 / 5"),
        Slide("post-05-pricing-carousel", "05.png", "После пробного", "1 500 ТЕНГЕ ВЫЧИТАЮТСЯ ИЗ ВЫБРАННОГО ПАКЕТА", "Запись — по ссылке в профиле.", CREAM, INK, PURPLE, "5 / 5"),
    ]

    generated = [render_slide(slide) for slide in slides]
    reel_1 = render_reel_cover("post-01-founder-reel", "АНГЛИЙСКИЙ НЕ ЗАКАНЧИВАЕТСЯ ПОСЛЕ УРОКА", "Знакомство", YELLOW, PURPLE, PURPLE)
    reel_4 = render_reel_cover("post-04-work-reel", "3 ФРАЗЫ ДЛЯ РАБОЧЕГО СОЗВОНА", "Практика", PURPLE, WHITE, YELLOW)
    reel_6 = render_reel_cover("post-06-travel-reel", "БАГАЖ НЕ ПРИЕХАЛ. ЧТО СКАЗАТЬ?", "Английский в поездке", YELLOW, PURPLE, PURPLE)

    # The profile preview shows the recommended pinned row first, followed by
    # the remaining educational Reels/carousel covers.
    preview = make_contact_sheet([
        reel_1,
        OUT / "post-03-method-carousel" / "01.png",
        OUT / "post-05-pricing-carousel" / "01.png",
        reel_6,
        reel_4,
        OUT / "post-02-agree-carousel" / "01.png",
    ])
    proof = make_carousel_sheet(generated)

    print(f"Generated {len(generated) + 3} post image files")
    print(f"Grid preview: {preview}")
    print(f"Carousel proof: {proof}")


if __name__ == "__main__":
    main()
