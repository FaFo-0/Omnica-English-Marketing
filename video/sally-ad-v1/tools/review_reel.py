"""Stitch the screen recordings into one captioned review video for FaFo (720x1280)."""
import subprocess, os
D="/home/user/sally-ad/screens"; O=f"{D}/review"; os.makedirs(O,exist_ok=True)
FONT="/usr/share/fonts/opentype/inter/Inter-Bold.otf"
SC=[("s0n_live","1 · Live lesson: speech becomes text",[(0,28.8,1)]),
    ("s1_mistakes","2 · AI finds speaking mistakes",[(0,2.8,1),(2.8,9.7,3),(9.7,24.3,1)]),
    ("s2_publish","3 · AI summary + word list → Publish",[(0,2.5,1),(2.5,32.5,8),(32.5,39.5,1),(39.5,85,8),(85,96.8,1)]),
    ("s3_student_lesson","4 · Student: own mistakes + new words",[(0,28.9,1)]),
    ("s4_flashcards","5 · Flashcards from the lesson",[(0,25.1,1)]),
    ("s5_library","6 · Library: tap a word → saved, green",[(0,17.6,1)]),
    ("s6a_teacher_hw","7 · AI homework from her own mistakes",[(0,3.3,1),(3.3,12.2,3),(12.2,30.9,1)]),
    ("s6b_student_hw","8 · Student does the homework",[(0,32.2,1.5)]),
    ("s6c_review","9 · Teacher checks every answer",[(0,30.6,1.5)]),
    ("s6d_feedback","10 · Student sees marks and comments",[(0,30.9,1)]),
    ("s7_calendar","11 · Booking a lesson in the calendar",[(0,10.2,1)])]
def esc(t): return t.replace("'", "’").replace(":", "\\:")
parts=[]
for name,cap,ranges in SC:
    for k,(a,b,sp) in enumerate(ranges):
        out=f"{O}/{name}_{k}.mp4"
        if name=="s0n_live":
            base="crop=560:996:0:0,scale=720:1280:flags=lanczos"
        else:
            base="scale=720:1280"
        vf=(f"trim={a}:{b},setpts=(PTS-STARTPTS)/{sp},{base},fps=30,"
            f"drawbox=x=0:y=ih-150:w=iw:h=150:color=black@0.72:t=fill,"
            f"drawtext=fontfile={FONT}:text='{esc(cap)}':fontcolor=white:fontsize=23:x=(w-tw)/2:y=h-118"
            + (f",drawtext=fontfile={FONT}:text='×{sp:g} speed':fontcolor=0xFFD54A:fontsize=22:x=(w-tw)/2:y=h-72" if sp>1 else ""))
        cmd=["ffmpeg","-v","error","-y","-i",f"{D}/{name}.mp4"]
        if name=="s0n_live":
            cmd+=["-i","/home/user/sally-ad/audio/live/sally_live.wav","-filter_complex",
                  f"[0:v]{vf}[v];[1:a]adelay=1840,apad,atrim=0:{b-a},aresample=48000[a]","-map","[v]","-map","[a]"]
        else:
            cmd+=["-f","lavfi","-i","anullsrc=r=48000:cl=stereo","-filter_complex",f"[0:v]{vf}[v]","-map","[v]","-map","1:a","-shortest"]
        cmd+=["-c:v","libx264","-crf","24","-preset","fast","-c:a","aac","-ac","2","-ar","48000",out]
        subprocess.run(cmd,check=True); parts.append(out)
open(f"{O}/list.txt","w").write("".join(f"file '{p}'\n" for p in parts))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",f"{O}/list.txt","-c","copy",f"{D}/screens-review.mp4"],check=True)
print("ok")
