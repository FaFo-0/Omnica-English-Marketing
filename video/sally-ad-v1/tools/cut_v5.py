"""v4: seamless cuts. Tight energy-based trims, internal-pause removal on app-covered lines,
denoised hand-held voice, per-line loudness levelling, short audio crossfades at every cut."""
import sys; sys.path.insert(0,"tools")
from cliplib import *
CLEAN="audio/voice_eq.wav"   # v5: no noise reduction (sounded muffled); light presence EQ instead
# (video, first word start, last word end, offset guess, name, squeeze internal pauses?)
LINES=[("20261110_162238",27.75,29.97,140.90,"hook EN",False),
       ("20261110_170538",31.47,33.93,994.84,"hook RU",False),
       ("20261110_170538",68.49,71.31,994.84,"lesson start",True),
       ("20261110_170538",108.09,112.29,994.84,"after the call",True),
       ("20261110_170538",238.89,243.81,994.84,"repetition",True),
       ("20261110_170538",262.11,264.33,994.84,"library 1",True),
       ("20261110_170538",293.97,299.61,994.84,"library 2",True),
       ("20261110_170538",329.79,333.15,994.84,"homework 1",True),
       ("20261110_170538",350.19,353.91,994.84,"homework 2",True),
       ("20261110_170538",447.21,452.49,994.84,"schedule",True),
       ("20261110_171528",34.83,39.03,1584.12,"teachers",False),
       ("20261110_171701",61.35,63.93,1663.58,"WhatsApp",False)]
H=0.03      # audio handle each side, used for the crossfade (2H overlap)
GAP=0.30    # internal silences longer than this get squeezed...
KEEP=0.10   # ...down to this
HOP=0.01
def env_db(t0,dur):
    y=pcm(CLEAN,t0,dur,16000,False); n=int(16000*HOP)
    e=np.array([np.sqrt(np.mean(y[i:i+n]**2)) for i in range(0,len(y)-n,n)])
    return 20*np.log10(e+1e-9)
segs=[]  # (video, a, b, offset, crop, gain_db)
for v,s,e,g,name,squeeze in LINES:
    off=fine_offset(v,s-0.3,(e-s)+0.6,g)
    t0=s-0.4; db=env_db(t0+off,(e-s)+0.9)
    thr=max(np.percentile(db,15)+9, db.max()-32)
    hot=np.where((db>thr)&(np.r_[db[1:],-99]>thr-3))[0]
    hot=hot[(hot*HOP>=0.25)&(hot*HOP<=(e-s)+0.65)]
    a=min(t0+hot[0]*HOP-0.02, s-0.07); b=max(t0+(hot[-1]+1)*HOP, e)+0.08
    pieces=[(a,b)]
    if squeeze:  # split at long internal silences
        loud=(db>thr); i0=int((a-t0)/HOP); i1=int((b-t0)/HOP); pieces=[]; start=a; run=0
        for i in range(i0,i1):
            if not loud[i]: run+=1
            else:
                if run*HOP>GAP:
                    gs=t0+(i-run)*HOP; ge=t0+i*HOP
                    pieces.append((start,gs+KEEP/2)); start=ge-KEEP/2
                run=0
        pieces.append((start,b))
    # loudness of this line (speech frames only) -> gain to a common level
    lvl=np.mean(db[db>thr]); gain=-20-lvl
    crop=crop_for(v,a,b)
    for p in pieces: segs.append((v,p[0],p[1],off,crop,gain,name))
    print(f"{name:15s} cut {a:.2f}-{b:.2f} (words {s:.2f}-{e:.2f})  pieces {len(pieces)}  gain {gain:+.1f} dB")
os.makedirs("cut/v4",exist_ok=True)
vlist=[]; afiles=[]
# the ad itself needs a breath before the first word and after the last one
segs[0]=(segs[0][0],segs[0][1]-0.15,*segs[0][2:]); segs[-1]=(*segs[-1][:2],segs[-1][2]+0.5,*segs[-1][3:])
# snap every cut to the frame grid (source 60 fps, output 30 fps) so picture and sound stay locked
segs=[(v,round(a*60)/60,round(a*60)/60+round((b-a)*30)/30,off,crop,gain,name) for v,a,b,off,crop,gain,name in segs]
for i,(v,a,b,off,crop,gain,name) in enumerate(segs):
    nf=round((b-a)*30)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-t",f"{b-a:.4f}","-i",f"raw/{v}.mp4","-an","-vf",crop,"-frames:v",str(nf),
        "-c:v","libx264","-crf","18","-preset","medium",f"cut/v4/v{i:02d}.mp4"],check=True)
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{a+off-H:.4f}","-t",f"{b-a+2*H:.4f}","-i",CLEAN,
        "-af",f"volume={gain:.2f}dB","-ar","48000",f"cut/v4/a{i:02d}.wav"],check=True)
    vlist.append(f"v{i:02d}.mp4"); afiles.append(f"cut/v4/a{i:02d}.wav")
open("cut/v4/vlist.txt","w").write("".join(f"file '{n}'\n" for n in vlist))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","cut/v4/vlist.txt","-c","copy","cut/v4/video.mp4"],check=True)
# chain audio with equal-power crossfades of 2H; result is sum(b-a)+2H long -> trim H at both ends
ins=sum([["-i",f] for f in afiles],[]); n=len(afiles); fc=""; last="[0:a]"
for k in range(1,n):
    out=f"[x{k}]"; fc+=f"{last}[{k}:a]acrossfade=d={2*H}:c1=qsin:c2=qsin{out};"; last=out
total=sum(b-a for _,a,b,*_ in segs)
fc+=f"{last}atrim=start={H}:duration={total:.4f},asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=7[out]"
subprocess.run(["ffmpeg","-v","error","-y",*ins,"-filter_complex",fc,"-map","[out]","-ar","48000","cut/v4/audio.wav"],check=True)
subprocess.run(["ffmpeg","-v","error","-y","-i","cut/v4/video.mp4","-i","cut/v4/audio.wav","-map","0:v","-map","1:a",
    "-c:v","copy","-c:a","aac","-b:a","192k","-shortest","cut/rough-v5.mp4"],check=True)
json.dump([[v,a,b,off] for v,a,b,off,*_ in segs],open("cut/v4/segs.json","w"))
print("segments",len(segs),"total",round(total,2))
