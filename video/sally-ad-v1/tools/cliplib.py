"""Shared helpers: fine sync of a video clip to the hand-held voice file, zoomed render."""
import numpy as np, subprocess, json, os
SR=8000
VOICE="raw/voice_20261110_162017.m4a"
CW,CH=1440,2560
def pcm(path,ss,dur,sr=SR,filt=True):
    af=["-af","highpass=f=150,lowpass=f=3500"] if filt else []
    raw=subprocess.run(["ffmpeg","-v","error","-ss",str(ss),"-t",str(dur),"-i",path,"-ac","1","-ar",str(sr),*af,"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.float32)
def fine_offset(v,a,dur,guess,win=1.5):
    x=pcm(f"raw/{v}.mp4",a,dur); y=pcm(VOICE,a+guess-win,dur+2*win)
    n=1<<int(np.ceil(np.log2(len(y)+len(x))))
    X=np.fft.rfft(y,n)*np.conj(np.fft.rfft(x,n)); X/=np.abs(X)+1e-9
    c=np.fft.irfft(X,n)[:len(y)-len(x)+1]; k=int(np.argmax(c))
    return guess-win+k/SR
def face(v,t):
    import cv2
    casc=cv2.CascadeClassifier(cv2.data.haarcascades+"haarcascade_frontalface_default.xml")
    raw=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",f"raw/{v}.mp4","-frames:v","1","-vf","scale=540:960","-f","rawvideo","-pix_fmt","gray","-"],capture_output=True).stdout
    f=casc.detectMultiScale(np.frombuffer(raw,np.uint8).reshape(960,540),1.1,6,minSize=(40,40))
    if not len(f): return None
    r=max(f,key=lambda r:r[2])*4; return (r[0]+r[2]/2, r[1]+r[3]/2)
def crop_for(v,a,b):
    pts=[p for p in (face(v,t) for t in np.linspace(a+0.1,b-0.1,4)) if p]
    fx,fy=np.median(pts,axis=0) if pts else (1080,2010)
    x=int(min(max(fx-CW/2,0),2160-CW)); y=int(min(max(fy-0.36*CH,0),3840-CH))
    return f"crop={CW}:{CH}:{x}:{y},scale=1080:1920:flags=lanczos,fps=30,format=yuv420p"
def render(v,a,b,off,out,extra_vf=""):
    dur=b-a; vf=crop_for(v,a,b)+(","+extra_vf if extra_vf else "")
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-t",str(dur),"-i",f"raw/{v}.mp4",
        "-ss",f"{a+off:.4f}","-t",str(dur),"-i",VOICE,"-map","0:v","-map","1:a",
        "-vf",vf,"-c:v","libx264","-crf","18","-preset","medium",
        "-af","afade=t=in:d=0.03,afade=t=out:st=%.3f:d=0.05,aresample=48000"%(dur-0.05),
        "-c:a","aac","-b:a","160k","-ac","2",out],check=True)
