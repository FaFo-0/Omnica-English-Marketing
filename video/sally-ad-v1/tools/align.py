import numpy as np, subprocess, sys, json
SR=4000
def load(p):
    raw=subprocess.run(["ffmpeg","-v","error","-i",p,"-ac","1","-ar",str(SR),"-af","highpass=f=150,lowpass=f=1900","-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.float32).copy()
voice=load("raw/voice_20261110_162017.m4a")
N=1<<int(np.ceil(np.log2(len(voice)+SR*30)))
V=np.fft.rfft(voice,N)
res={}
for b in sys.argv[1:]:
    a=load(f"raw/{b}.mp4"); out=[]
    for t in np.arange(0,len(a)/SR-15,15.0):
        w=a[int(t*SR):int((t+15)*SR)]
        if np.sqrt(np.mean(w**2))<1e-4: continue
        W=np.fft.rfft(w,N); X=V*np.conj(W); X/=np.abs(X)+1e-9
        c=np.fft.irfft(X,N)[:len(voice)]
        k=int(np.argmax(c)); pk=c[k]; s=np.sort(c)[-50:]; 
        # peak-to-second ratio excluding neighbourhood
        c2=c.copy(); c2[max(0,k-SR):k+SR]=0; ratio=pk/max(c2.max(),1e-9)
        out.append((float(t),k/SR,float(ratio)))
    res[b]=out
    for t,off,r in out: print(f"{b} vid {t:6.1f}s -> voice {off:8.3f}s  diff {off-t:9.3f}  conf {r:4.1f}")
json.dump(res,open("transcripts/align_raw.json","w"))
