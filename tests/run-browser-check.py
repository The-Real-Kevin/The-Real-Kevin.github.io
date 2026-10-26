"""Run a local HTML regression harness with real Chromium timing, without packages."""

import base64
import json
import os
from pathlib import Path
import socket
import struct
import subprocess
import sys
import tempfile
import time
from urllib.parse import urlsplit
from urllib.request import urlopen


class BrowserConnection:
    def __init__(self, url):
        parsed = urlsplit(url)
        self.socket = socket.create_connection((parsed.hostname, parsed.port), timeout=90)
        self.counter = 0
        key = base64.b64encode(os.urandom(16)).decode()
        self.socket.sendall((
            f"GET {parsed.path} HTTP/1.1\r\nHost: {parsed.netloc}\r\n"
            "Upgrade: websocket\r\nConnection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
        ).encode())
        header = b""
        while not header.endswith(b"\r\n\r\n"):
            header += self.read(1)
        if b"101" not in header.split(b"\r\n")[0]:
            raise RuntimeError("Browser debug connection failed")

    def read(self, length):
        data = b""
        while len(data) < length:
            chunk = self.socket.recv(length - len(data))
            if not chunk:
                raise EOFError("Browser closed its debug connection")
            data += chunk
        return data

    def receive(self):
        _, second = self.read(2)
        length = second & 127
        if length == 126:
            length = struct.unpack("!H", self.read(2))[0]
        elif length == 127:
            length = struct.unpack("!Q", self.read(8))[0]
        return json.loads(self.read(length))

    def command(self, method, params=None):
        self.counter += 1
        payload = json.dumps({"id": self.counter, "method": method, "params": params or {}}).encode()
        length = len(payload)
        prefix = bytes([129, 128 | length]) if length < 126 else bytes([129, 254]) + struct.pack("!H", length)
        mask = os.urandom(4)
        self.socket.sendall(prefix + mask + bytes(c ^ mask[i % 4] for i, c in enumerate(payload)))
        while True:
            response = self.receive()
            if response.get("id") == self.counter:
                if "error" in response:
                    raise RuntimeError(response["error"])
                return response.get("result", {})


def main():
    name = sys.argv[1] if len(sys.argv) > 1 else "projects"
    if not name.replace("-", "").isalnum():
        raise ValueError("Use a test name such as projects or home")
    motion = sys.argv[2] if len(sys.argv) > 2 else "reduce"
    if motion not in ("reduce", "no-preference"):
        raise ValueError("Motion preference must be reduce or no-preference")
    # Chromium helper processes may briefly retain profile files after exit.
    with tempfile.TemporaryDirectory(prefix="portfolio-browser-", ignore_cleanup_errors=True) as profile:
        with tempfile.TemporaryFile() as log:
            process = subprocess.Popen([
                "chromium", "--headless", "--no-sandbox", "--disable-gpu",
                "--disable-dev-shm-usage", "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding", "--remote-debugging-port=0",
                "--user-data-dir=" + profile, "about:blank",
            ], stdout=log, stderr=log)
            try:
                port_file = Path(profile) / "DevToolsActivePort"
                for _ in range(100):
                    if port_file.exists():
                        break
                    time.sleep(0.1)
                port = port_file.read_text().splitlines()[0]
                with urlopen(f"http://127.0.0.1:{port}/json/list") as response:
                    targets = json.load(response)
                target = next(item for item in targets if item["type"] == "page")
                browser = BrowserConnection(target["webSocketDebuggerUrl"])
                browser.command("Page.enable")
                browser.command("Page.bringToFront")
                browser.command("Emulation.setEmulatedMedia", {
                    "features": [{"name": "prefers-reduced-motion", "value": motion}],
                })
                browser.command("Page.navigate", {
                    "url": f"http://127.0.0.1:5000/tests/{name}.browser.html",
                })
                time.sleep(0.5)
                result = browser.command("Runtime.evaluate", {
                    "expression": """(async()=>{for(let i=0;i<1400;i++){
                      const text=document.querySelector('#results')?.textContent;
                      if(text&&text!=='RUNNING')return text;
                      await new Promise(resolve=>setTimeout(resolve,50));
                    }return 'TIMEOUT: '+(window.testProgress||'unknown stage');})()""",
                    "awaitPromise": True, "returnByValue": True,
                })
                text = result.get("result", {}).get("value", str(result))
                print(text)
                return 0 if text.startswith("ALL PASSED") else 1
            finally:
                process.terminate()
                process.wait(timeout=10)


if __name__ == "__main__":
    sys.exit(main())
