#!/usr/bin/env python3
"""Soniox async transcription with token timestamps. Usage: transcribe.py in.(m4a|wav|...) out.json"""
import json, os, sys, time, urllib.request, uuid
KEY = os.environ["SONIOX_API_KEY"]; B = "https://api.soniox.com/v1"
def req(method, path, data=None, ctype="application/json"):
    r = urllib.request.Request(B + path, data=data, method=method,
        headers={"Authorization": f"Bearer {KEY}", **({"Content-Type": ctype} if data else {})})
    with urllib.request.urlopen(r, timeout=600) as resp:
        body = resp.read(); return json.loads(body) if body else None
src, out = sys.argv[1], sys.argv[2]
bnd = uuid.uuid4().hex; name = os.path.basename(src)
payload = (f"--{bnd}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{name}\"\r\n"
           "Content-Type: application/octet-stream\r\n\r\n").encode() + open(src, "rb").read() + f"\r\n--{bnd}--\r\n".encode()
fid = req("POST", "/files", payload, f"multipart/form-data; boundary={bnd}")["id"]
tid = req("POST", "/transcriptions", json.dumps({"model": "stt-async-v4", "file_id": fid,
      "language_hints": ["en", "ru"]}).encode())["id"]
try:
    while True:
        s = req("GET", f"/transcriptions/{tid}")
        if s["status"] == "completed": break
        if s["status"] == "error": sys.exit(f"error: {s}")
        time.sleep(5)
    t = req("GET", f"/transcriptions/{tid}/transcript")
    json.dump(t, open(out, "w"), ensure_ascii=False)
    print(out, len(t["tokens"]), "tokens")
finally:
    for p in (f"/transcriptions/{tid}", f"/files/{fid}"):
        try: req("DELETE", p)
        except Exception: pass
