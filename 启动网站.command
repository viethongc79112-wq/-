#!/bin/zsh
set -e
cd "$(dirname "$0")/dist"
PORT=5173
while lsof -iTCP:$PORT -sTCP:LISTEN -n -P >/dev/null 2>&1; do PORT=$((PORT + 1)); done
echo "网站已启动：http://127.0.0.1:$PORT/"
open "http://127.0.0.1:$PORT/"
python3 -m http.server "$PORT" --bind 127.0.0.1
