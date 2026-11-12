import sys; sys.path.insert(0,"tools")
from cliplib import *
import librosa
V="20261110_162238"
T=[(15.69,17.97,140.90,"Did you learn words and never use them?"),
   (27.75,29.97,140.90,"Did you learn words but never use them?"),
   (49.53,52.35,140.90,"You know the grammar, but the words just won't come out?"),
   (67.53,69.27,140.90,"Are you just paying to chat in English?"),
   (70.95,72.81,140.90,"Are you just paying to chat in English?"),
   (82.35,84.39,140.90,"Are you just paying to chat in English?"),
   (91.11,92.91,140.90,"Are you just paying to chat in English?"),
   (114.51,116.55,140.90,"Are you just paying to chat in English?"),
   (178.35,181.83,114.156,"So you close the laptop and the English just stops."),
   (190.35,192.69,114.156,"Speaking once a week is not enough."),
   (203.19,205.47,114.156,"Speaking once a week is not enough.")]
os.makedirs("cut/hooks",exist_ok=True); rows=[]
for i,(a,b,g,txt) in enumerate(T,1):
    a0,b0=a-0.12,b+0.25
    off=fine_offset(V,a0,b0-a0,g)
    y=pcm(VOICE,a+off,b-a,16000,False).astype(np.float64)
    rms=20*np.log10(np.sqrt(np.mean(y**2))+1e-9)
    f0,vf,_=librosa.pyin(y,fmin=80,fmax=600,sr=16000)
    f0=f0[~np.isnan(f0)]; semis=12*np.log2(f0/np.median(f0)); rng=np.percentile(semis,90)-np.percentile(semis,10)
    rows.append((i,txt,round(b-a,2),round(rms,1),round(float(rng),1),round(float(np.median(f0))),round(off,3)))
    lbl=f"drawtext=fontfile=/usr/share/fonts/opentype/inter/Inter-Bold.otf:text='{i}':fontsize=140:fontcolor=white:borderw=6:bordercolor=black:x=60:y=80"
    render(V,a0,b0,off,f"cut/hooks/{i:02d}.mp4",lbl)
for r in rows: print(r)
open("cut/hooks/list.txt","w").write("".join(f"file '{i:02d}.mp4'\n" for i in range(1,len(T)+1)))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","cut/hooks/list.txt","-af","loudnorm=I=-16:TP=-1.5","-c:v","libx264","-crf","26","-preset","fast","-vf","scale=720:1280","-c:a","aac","cut/hook-options.mp4"],check=True)
