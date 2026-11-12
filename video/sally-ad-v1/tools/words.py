import json,sys
t=json.load(open(sys.argv[1]))["tokens"]; a,b=float(sys.argv[2]),float(sys.argv[3])
w=[];
for k in t:
    s=k["start_ms"]/1000
    if a<=s<=b:
        if k["text"].startswith(" ") or not w: w.append([s,k["end_ms"]/1000,k["text"].strip()])
        else: w[-1][1]=k["end_ms"]/1000; w[-1][2]+=k["text"]
print(" ".join(f"{x[2]}[{x[0]:.2f}-{x[1]:.2f}]" for x in w))
