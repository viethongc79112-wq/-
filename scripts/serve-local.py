#!/usr/bin/env python3
"""Preview the built website with Python's standard library, without Node.js."""

import argparse
import errno
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import platform
import subprocess
import webbrowser


def main():
    parser = argparse.ArgumentParser(description="启动吴言个人网站")
    parser.add_argument("--port", type=int, default=5173)
    parser.add_argument("--no-open", action="store_true", help="只启动服务，不打开浏览器")
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error("端口必须在 0 到 65535 之间")

    directory = Path(__file__).resolve().parents[1] / "dist"
    if not (directory / "index.html").is_file():
        parser.exit(1, "找不到网页文件。请在项目目录运行 pnpm install 和 pnpm run build，再重新启动。\n")

    handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
    for port in range(args.port, min(args.port + 100, 65536)):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", port), handler)
            break
        except OSError as error:
            if error.errno != errno.EADDRINUSE:
                raise
    else:
        parser.exit(1, "本地端口均被占用，请关闭旧的网站终端后再启动。\n")

    url = f"http://127.0.0.1:{server.server_port}/"
    print(f"吴言个人网站已启动：{url}", flush=True)
    print("视频由 B站提供，请保持联网。保留此终端窗口；按 Control+C 可停止网站。", flush=True)
    # Bind the server before opening the browser, so the first request can connect.
    if not args.no_open:
        opened = False
        if platform.system() == "Darwin":
            opened = subprocess.run(["open", "-a", "Google Chrome", url], capture_output=True).returncode == 0
        if not opened:
            webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
