"""Generate portable web copies; never modify original files.
Usage: python scripts/prepare_media.py /path/to/作品集
Requires Pillow and imageio-ffmpeg.
"""
import json
import re
import subprocess
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

import imageio_ffmpeg
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / 'Desktop/作品集'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
ENTRIES = [
    ('hope', 'Ai微电影《HOPE》.mp4', 210),
    ('future', '向未来生长.mp4', 130),
    ('six', '《六尺巷》.mp4', 250),
    ('door', '踢开门.mp4', 25),
    ('hero', '侠客.mp4', 8),
    ('yunnan', '云南风光.mov', 25),
    ('shangrila', '香格里拉.mov', 10),
    ('changguang', '长广文艺片.mp4', 40),
    ('departure', '转身即是出征.mp4', 65),
    ('yiguo', '易果应聘考核试剪.mov', 12),
]

for folder in ['videos', 'posters', 'previews', 'photos']:
    (ROOT / 'public/media' / folder).mkdir(parents=True, exist_ok=True)
(ROOT / 'src/data').mkdir(parents=True, exist_ok=True)

def run(args):
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)

def prepare(entry):
    key, filename, timestamp = entry
    path = SOURCE / filename
    probe = subprocess.run([FFMPEG, '-hide_banner', '-i', str(path)], capture_output=True, text=True).stderr
    hours, minutes, seconds = re.search(r'Duration: (\d+):(\d+):([\d.]+)', probe).groups()
    duration = int(hours) * 3600 + int(minutes) * 60 + float(seconds)
    timestamp = min(timestamp, duration - 1)
    size = re.search(r'Video:.*?\b(\d{3,5})x(\d{3,5})\b', probe)
    width, height = map(int, size.groups())
    base = ROOT / 'public/media'
    poster = base / 'posters' / f'{key}.jpg'
    if not poster.exists():
        run(['-ss', str(timestamp), '-i', str(path), '-frames:v', '1', '-vf', 'scale=1600:1600:force_original_aspect_ratio=decrease', '-q:v', '2', str(poster)])
    target = base / 'videos' / f'{key}.mp4'
    if not target.exists():
        run(['-i', str(path), '-map', '0:v:0', '-map', '0:a:0?', '-vf', 'scale=1920:1080:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1', '-c:v', 'h264_videotoolbox', '-b:v', '3500k', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', str(target)])
    if key == 'hope':
        preview = base / 'previews/hope.mp4'
        if not preview.exists():
            run(['-ss', str(timestamp), '-i', str(path), '-t', '6', '-an', '-vf', 'scale=960:-2,fps=24', '-c:v', 'h264_videotoolbox', '-b:v', '1200k', '-movflags', '+faststart', str(preview)])
    print(f'{key}: {duration:.1f}s, {width}x{height}, {target.stat().st_size / 1024**2:.1f}MB', flush=True)
    return key, {'duration': duration, 'width': width, 'height': height, 'poster': f'/media/posters/{key}.jpg', 'src': f'/media/videos/{key}.mp4'}

with ThreadPoolExecutor(max_workers=2) as pool:
    media = dict(pool.map(prepare, ENTRIES))

(ROOT / 'src/data/media.json').write_text(json.dumps(media, ensure_ascii=False, indent=2) + '\n')
for source, name in [('ac6a587b7872c1b2ea30d3469fd63c8a.jpg', 'working'), ('微信图片_20260919184515_19267_1.jpg', 'portrait')]:
    im = ImageOps.exif_transpose(Image.open(SOURCE / source)).convert('RGB')
    im.thumbnail((1500, 1800))
    im.save(ROOT / f'public/media/photos/{name}.jpg', quality=90)
qr_source = SOURCE / '3911a2967a6bfa8477a9c99b7d7cf4dd.jpg'
if qr_source.exists():
    Image.open(qr_source).convert('RGB').crop((117, 288, 770, 940)).save(ROOT / 'public/media/photos/wechat-qr.png')
print('Media and photos ready.', flush=True)
