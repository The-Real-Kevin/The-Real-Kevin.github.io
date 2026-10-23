"""Serve the static portfolio on both ports used by Replit's preview routes."""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Preview should reflect edits immediately, not reuse cached styles.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main():
    root = Path(__file__).resolve().parent
    handler = partial(PreviewHandler, directory=str(root))
    servers = []
    try:
        # Bind both before starting so a port conflict fails explicitly.
        servers = [ThreadingHTTPServer(("0.0.0.0", 5000), handler)]
        servers.append(ThreadingHTTPServer(("0.0.0.0", 8000), handler))
        Thread(target=servers[1].serve_forever, daemon=True).start()
        print("Serving portfolio on 0.0.0.0 ports 5000 and 8000", flush=True)
        servers[0].serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        for server in servers:
            server.server_close()


if __name__ == "__main__":
    main()
