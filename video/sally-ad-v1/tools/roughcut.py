import numpy as np, subprocess, json
SR=8000
def pcm(path,ss,dur):
    raw=subprocess.run(["ffmpeg","-v","error","-ss",str(ss),"-t",str(dur),"-i",path,"-ac","1","-ar",str(SR),
        "-af","highpass=f=150,lowpass=f=3500","-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.float32)
VOICE="raw/voice_20261110_162017.m4a"
OFF={"20261110_170538":994.858,"20261110_171528":1584.154,"20261110_171701":1663.582}
# (video, start, end, line)
CUTS=[("20261110_170538",31.30,34.15,"hook"),
      ("20261110_170538",68.35,71.55,"lesson start"),
      ("20261110_170538",107.95,112.50,"after the call"),
      ("20261110_170538",238.75,244.00,"repetition"),
      ("20261110_170538",262.00,264.55,"library 1"),
      ("20261110_170538",293.90,299.85,"library 2"),
      ("20261110_170538",329.65,333.40,"homework 1"),
      ("20261110_170538",350.13,354.15,"homework 2"),
      ("20261110_170538",447.05,452.70,"schedule"),
      ("20261110_171528",34.70,39.25,"native teachers"),
      ("20261110_170538",484.80,487.55,"CTA")]
report=[]
for i,(v,a,b,name) in enumerate(CUTS):
    o=OFF[v]; dur=b-a
    # refine offset locally: clip audio vs voice window +-1.5s
    x=pcm(f"raw/{v}.mp4",a,dur); y=pcm(VOICE,a+o-1.5,dur+3)
    n=1<<int(np.ceil(np.log2(len(y)+len(x))))
    X=np.fft.rfft(y,n)*np.conj(np.fft.rfft(x,n)); X/=np.abs(X)+1e-9
    c=np.fft.irfft(X,n)[:len(y)-len(x)+1]; k=int(np.argmax(c))
    fine=a+o-1.5+k/SR; report.append((name,round(fine-a,3)))
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(a),"-t",str(dur),"-i",f"raw/{v}.mp4",
        "-ss",f"{fine:.4f}","-t",str(dur),"-i",VOICE,"-map","0:v","-map","1:a",
        "-vf","scale=720:1280:flags=lanczos,fps=30,format=yuv420p","-c:v","libx264","-crf","21","-preset","fast",
        "-af","afade=t=in:d=0.04,afade=t=out:st=%.3f:d=0.06,aresample=48000"%(dur-0.06),"-c:a","aac","-b:a","160k","-ac","2",
        f"cut/{i:02d}.mp4"],check=True)
print(report)
open("cut/list.txt","w").write("".join(f"file '{i:02d}.mp4'\n" for i in range(len(CUTS))))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i","cut/list.txt","-af","loudnorm=I=-16:TP=-1.5:LRA=11",
    "-c:v","copy","-c:a","aac","-b:a","160k","cut/rough.mp4"],check=True)
