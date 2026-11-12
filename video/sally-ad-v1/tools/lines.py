import json,sys
t=json.load(open(sys.argv[1]))["tokens"]
line=[];st=None;prev=None
def flush():
    if line: print(f"{st/1000:7.1f}  {''.join(line).strip()}")
for k in t:
    if prev is not None and k["start_ms"]-prev>900:
        flush(); line.clear(); st=None
    if st is None: st=k["start_ms"]
    line.append(k["text"]); prev=k["end_ms"]
flush()
