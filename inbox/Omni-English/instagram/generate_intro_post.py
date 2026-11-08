from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from generate_assets import Slide, render_slide, CREAM, INK, PURPLE, YELLOW

INTRO = Slide(
    folder="post-00-introduction",
    filename="01.png",
    eyebrow="Знакомство",
    title="OMINCA ENGLISH",
    body=(
        "Английский онлайн\n"
        "для взрослых из Казахстана.\n"
        "Работа • путешествия • переезд.\n\n"
        "Занятия + платформа\n"
        "для изучения и повторения слов."
    ),
    background=YELLOW,
    foreground=PURPLE,
    accent=PURPLE,
    number="",
)

path = render_slide(INTRO)
print(path)
