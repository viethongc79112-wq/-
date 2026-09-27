#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if command -v node >/dev/null 2>&1 && command -v pnpm >/dev/null 2>&1; then
  exec pnpm dev --port 5173
fi
runtime_dir="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"
if [ -x "$runtime_dir/node/bin/node" ]; then
  export PATH="$runtime_dir/node/bin:$PATH"
  exec "$runtime_dir/bin/fallback/pnpm" run dev --port 5173
fi
echo '请安装 Node.js 20.19+ 和 pnpm，然后执行 pnpm install、pnpm dev。' >&2
exit 1
