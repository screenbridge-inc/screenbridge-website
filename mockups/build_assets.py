import base64, json, subprocess, os, pathlib
SRC="/Users/homefoldertim/Code/screenbridge-website/public/images/"
OUT=pathlib.Path(".").resolve()
imgs={
 "hero":("Wonderskin--15-Second-Signature-Screenbridge-Ad.jpg",1800),
 "sacheu":("SB109SacheuBeauty_PremiumAd_Still_03-1.png",1000),
 "harrys":("Harrys_CTVBodyWash_Still_01-1.png",1000),
 "jonesroad":("JonesRoad_PremiumAD_Concept_02_30_Still_01-1.png",1000),
 "smalls":("Smalls-30-Second-Premium-Screenbridge-Ad.jpg",1000),
 "calpak":("Calpak-Luka-Duffel-30-Second-Premium-Screenbridge-Ad.jpg",1000),
 "carve":("CarveDesigns-Carve-your-own-Way-30-sec-SignatureAd-p-1600.jpg",1000),
 "fatty15":("Fatty15signature-ad-Thumb-p-1600.jpg",1000),
}
man={}
for k,(f,w) in imgs.items():
    tmp=OUT/f"{k}.jpg"
    subprocess.run(["sips","-s","format","jpeg","-s","formatOptions","72","--resampleWidth",str(w),SRC+f,"--out",str(tmp)],check=True,capture_output=True)
    b=tmp.read_bytes()
    man[k]="data:image/jpeg;base64,"+base64.b64encode(b).decode()
    print(k, len(b)//1024, "KB")
svgs={"logo":"ScreenbridgeLogo.svg","logo_dark":"SBLOGODark.svg","harrys_l":"Harrys.svg","sacheu_l":"Sacheu.svg","mixbook_l":"Mixbook.svg","cheribundi_l":"Cherribundi.svg","fatty15_l":"Fatty15.svg","dose_l":"Dose.svg","graza_l":"Graza.svg","smalls_l":"Smalls.svg","thirdlove_l":"ThirdLove.svg","hulu":"Hulu-Logo.svg","roku":"Roku-tv-Logo.svg","firetv":"Fire-tv-Logo.svg","appletv":"apple-tv-logo.svg","youtube":"YoutubeIcon.svg"}
for k,f in svgs.items():
    b=open(SRC+f,"rb").read()
    man[k]="data:image/svg+xml;base64,"+base64.b64encode(b).decode()
    # report fill colors + viewBox
    s=b.decode("utf-8","ignore")
    import re
    fills=set(re.findall(r'fill="(#[0-9A-Fa-f]{3,6}|white|black|[a-z]+)"',s))
    vb=re.search(r'viewBox="([^"]+)"',s)
    print(k, vb.group(1) if vb else "?", fills)
json.dump(man,open(OUT/"manifest.json","w"))
print("total KB", sum(len(v) for v in man.values())//1024)
