from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E
root=Path(__file__).resolve().parents[2]
src=root/'output/成都住建房产超市_小程序及管理端调整需求_V1.2_含页面截图.docx'
out=root/'output/成都住建房产超市_小程序及管理端调整需求_V1.3_含页面截图.docx'
with ZipFile(src) as z:parts={n:z.read(n) for n in z.namelist()}
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
t=E.fromstring(parts['word/document.xml']);found=0
for el in t.findall('.//w:t',ns):
 if el.text=='展示取证及资金监管信息':el.text='展示证件名称及取证、资金监管详情；删除标题下重复的“取证范围＋预售证号”摘要行，保留详情列表中的取证范围、预售证号字段';found+=1
 if el.text=='版本：V1.2（取证日期与配套标签调整）':el.text='版本：V1.3（取证详情调整）';found+=1
assert found==2
rid=t.findall('.//a:blip',ns)[4].get('{'+ns['r']+'}embed')
rels=E.fromstring(parts['word/_rels/document.xml.rels'])
target=next(r.get('Target') for r in rels if r.get('Id')==rid)
parts['word/'+target]=(root/'tmp/prd-eight/screens/05-取证详情.png').read_bytes()
parts['word/document.xml']=E.tostring(t,xml_declaration=True,encoding='UTF-8',standalone=True)
assert len(t.findall('.//a:blip',ns))==20
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for n,b in parts.items():z.writestr(n,b)
print(out)
