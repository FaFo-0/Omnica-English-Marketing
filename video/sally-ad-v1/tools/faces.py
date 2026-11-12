import cv2, subprocess, numpy as np, json, sys
casc=cv2.CascadeClassifier(cv2.data.haarcascades+"haarcascade_frontalface_default.xml")
def frame(v,t):
    raw=subprocess.run(["ffmpeg","-v","error","-ss",str(t),"-i",f"raw/{v}.mp4","-frames:v","1","-vf","scale=540:960","-f","rawvideo","-pix_fmt","gray","-"],capture_output=True).stdout
    return np.frombuffer(raw,np.uint8).reshape(960,540)
clips=json.loads(sys.argv[1]); out=[]
for v,a,b in clips:
    fs=[]
    for t in np.linspace(a+0.2,b-0.2,5):
        f=casc.detectMultiScale(frame(v,t),1.1,6,minSize=(40,40))
        if len(f): fs.append(max(f,key=lambda r:r[2]))
    fs=np.array(fs)*4  # back to 2160x3840
    m=np.median(fs,axis=0) if len(fs) else None
    out.append(None if m is None else [float(m[0]+m[2]/2),float(m[1]+m[3]/2),float(m[2])])
    print(v,a,len(fs),out[-1])
json.dump(out,open("cut/faces.json","w"))
