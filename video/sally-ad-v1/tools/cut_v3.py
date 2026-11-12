import sys; sys.path.insert(0,"tools")
from cliplib import *
# (video, first-word start, last-word end, offset guess, name) — word times from Soniox
CUTS=[("20261110_162238",27.75,29.97,140.90,"hook EN take 2"),
      ("20261110_170538",31.47,33.93,994.84,"hook RU"),
      ("20261110_170538",68.49,71.31,994.84,"lesson start"),
      ("20261110_170538",108.09,112.29,994.84,"after the call"),
      ("20261110_170538",238.89,243.81,994.84,"repetition"),
      ("20261110_170538",262.11,264.33,994.84,"library 1"),
      ("20261110_170538",293.97,299.61,994.84,"library 2"),
      ("20261110_170538",329.79,333.15,994.84,"homework 1"),
      ("20261110_170538",350.19,353.91,994.84,"homework 2"),
      ("20261110_170538",447.21,452.49,994.84,"schedule"),
      ("20261110_171528",34.83,39.03,1584.12,"native teachers"),
      ("20261110_170538",484.95,487.29,994.84,"CTA")]
def tighten(v,s,e,off):
    """Snap to where the hand-held voice actually starts/stops (20 ms envelope, 28 dB below the take's peak)."""
    a0=s-0.5; y=pcm(VOICE,a0+off,(e-s)+1.0,16000,False); hop=320
    env=np.array([np.sqrt(np.mean(y[i:i+hop]**2)) for i in range(0,len(y)-hop,hop)])
    db=20*np.log10(env+1e-9); thr=max(np.percentile(db,20)+10, db.max()-30)
    hot=(db>thr)&(np.r_[db[1:],-99]>thr-3)  # two loud frames in a row = speech, not a click
    on=np.where(hot)[0]
    # only accept energy near the transcribed words (ignore other people talking just before/after)
    on=on[(on*0.02>=0.25)&(on*0.02<=(e-s)+0.80)]
    st=min(a0+on[0]*0.02, s)-0.07; en=max(a0+(on[-1]+1)*0.02, e-0.05)+0.12
    return st, en
os.makedirs("cut/v3",exist_ok=True); names=[]
for i,(v,s,e,g,name) in enumerate(CUTS):
    off=fine_offset(v,s-0.3,(e-s)+0.6,g)
    a,b=tighten(v,s,e,off)
    print(f"{name:16s} words {s:.2f}-{e:.2f}  cut {a:.2f}-{b:.2f}  pad {s-a:+.2f}/{b-e:+.2f}")
    render(v,a,b,off,f"cut/v3/{i:02d}.mp4"); names.append(f"{i:02d}.mp4")
open("cut/v3/list.txt","w").write("".join(f"file '{n}'\n" for n in names))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","cut/v3/list.txt","-af","loudnorm=I=-16:TP=-1.5:LRA=11",
    "-c:v","copy","-c:a","aac","-b:a","160k","cut/rough-v3.mp4"],check=True)
