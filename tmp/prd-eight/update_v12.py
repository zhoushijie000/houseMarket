from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import etree as E
import posixpath
root=Path(__file__).resolve().parents[2];tmp=Path(__file__).parent
src=root/'output/成都住建房产超市_小程序及管理端调整需求_V1.1_含页面截图.docx'
out=root/'output/成都住建房产超市_小程序及管理端调整需求_V1.2_含页面截图.docx'
with ZipFile(src) as z:parts={n:z.read(n) for n in z.namelist()}
tree=E.fromstring(parts['word/document.xml'])
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
changes={
 '版本：V1.1（补充页面截图）':'版本：V1.2（取证日期与配套标签调整）',
 '默认展开配套面板，含交通、公园、商业、医疗':'默认展开配套面板，含交通、公园、商业、医疗；配套名称旁展示分类标签，与楼盘详情保持一致，如地铁站、公交站、公交快线',
 '切换类别更新配套列表及标点；点击配套项高亮对应标点':'切换类别更新配套列表、分类标签及标点；点击配套项高亮对应标点。楼盘位置与售楼部均使用同一套标签规则',
 '配套名称、类别、地址':'配套名称、类别、分类标签、地址',
 '类别与列表、标点保持一致':'类别与列表、标点保持一致；分类标签复用楼盘详情配套标签数据与样式，无标签数据时不展示空标签',
 '查看当前预售证下的楼栋及房源价格':'从最新取证卡片进入时，仅展示所点预售证对应的一个取证日期及其楼栋、房源价格',
 '选择楼栋，查看对应房源价格信息':'取证日期为只读展示，不提供其他日期切换；选择当前证件下的楼栋／单元查看价格，切换楼栋／单元不改变取证日期',
 '不得混入其他证件房源；无价格显示“暂无价格”':'不得混入其他证件的日期或房源；查看其他证件需返回预售证列表后进入；无价格显示“暂无价格”'
}
found=set()
for t in tree.findall('.//w:t',ns):
 if t.text in changes:found.add(t.text);t.text=changes[t.text]
assert found==set(changes),set(changes)-found
rels=E.fromstring(parts['word/_rels/document.xml.rels'])
targets={r.get('Id'):posixpath.normpath('word/'+r.get('Target')) for r in rels}
blips=tree.findall('.//a:blip',ns)
for index,name in [(0,'01-楼盘导航'),(1,'02-售楼部导航'),(5,'06-一房一价')]:
 rid=blips[index].get('{'+ns['r']+'}embed')
 parts[targets[rid]]=(tmp/'screens'/f'{name}.png').read_bytes()
parts['word/document.xml']=E.tostring(tree,xml_declaration=True,encoding='UTF-8',standalone=True)
assert len(blips)==20
assert '验收要点' not in ''.join(tree.xpath('//w:t/text()',namespaces=ns))
with ZipFile(out,'w',ZIP_DEFLATED) as z:
 for n,b in parts.items():z.writestr(n,b)
print(out)
print('8 text updates; 3 screenshots replaced; 20 screenshots retained; no acceptance sections')
