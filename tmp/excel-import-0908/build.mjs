import fs from 'node:fs/promises';
import path from 'node:path';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root=path.resolve('C:/Users/ZhuanZ/Desktop/zhou/houseMarket');
const out=path.join(root,'outputs/import-template-0908');await fs.mkdir(out,{recursive:true});
const wb=Workbook.create();wb.comments.setSelf({displayName:'模板说明'});
// [field, type, required, guidance, example, dropdown]
const keys=[['所属开发商','text',true,'填写系统中已存在的开发商全称；三个数据表保持一致。','示例开发商有限公司'],['所属项目','text',true,'填写系统中的项目名称；三个数据表保持一致。','示例花园'],['分期名（推广名）','text',true,'最多50字；三个数据表按相同开发商、项目、分期名关联。','示例花园一期']];
const basics=[...keys,
 ['分期别名','text',false,'最多50字。','示例一期'],['项目期数','int',false,'正整数，不带“期”。',1],['投资商','text',false,'填写系统中已存在的投资商名称。',''],
 ['项目区域（区县）','text',false,'填写系统区县名称。','温江区'],['项目区域（板块）','text',false,'填写所选区县下的板块名称。','柳林'],['环线','text',false,'填写系统现有选项；截图仅能确认“不限”。','不限'],
 ['项目地址','text',true,'填写完整地址，不用坐标代替地址。','四川省成都市温江区示例路1号'],
 ['项目经度','num',false,'地图选点辅助字段；经度与纬度成对填写，范围-180～180；坐标系需与导入系统一致。',null],['项目纬度','num',false,'地图选点辅助字段；范围-90～90。',null],
 ['销售状态','text',true,'按现有原型选项填写。','在售',['在售','待售','售罄']],
 ['总建筑面积（㎡）','num',false,'非负数，按字段名称填写；不使用截图中对调的占位提示。',120000],['总占地面积（㎡）','num',false,'非负数；与总建筑面积区分。',40000],['容积率','num',false,'非负数，不带单位。',3],['绿化率（%）','num',false,'输入0～100的数值，如35表示35%；不要输入0.35表示35%。',35],['车位数（个）','int',false,'非负整数，不带单位。',900],
 ['售楼部地址','text',false,'最多100字；可与项目地址不同。','四川省成都市温江区示例路2号'],['售楼部经度','num',false,'补充地图选点辅助字段；与售楼部纬度成对填写。',null],['售楼部纬度','num',false,'补充地图选点辅助字段；坐标系与系统一致。',null],
 ['售楼部电话','text',false,'按文本填写，保留区号和连接符。','028-00000000'],['街景id','text',false,'按文本填写，保留前导零。','000012345678901234'],['是否保障性住宅','text',false,'选择是或否。','否',['是','否']],['是否支持公积金','text',false,'选择是或否。','否',['是','否']],['方位','text',false,'使用系统选项；截图仅能确认“不限”。','不限'],['分期标签','text',false,'多选用中文分号分隔；截图选项为精装、商业。','精装；商业'],['项目简介','text',false,'以纯文本填写，可在单元格内换行；不包含富文本图片或样式，最多32767字符。','此处填写项目介绍、交通配套及产品特点。']];
const permits=[...keys,['预售许可证','text',true,'每张许可证单独一行；按文本填写完整证号；同一分期证号不可重复。','000000000000001'],['监管银行','text',false,'填写银行及支行全称；建议与监管账户配套填写。','示例银行示例支行'],['监管账户','text',false,'必须按文本填写，不转换为数值，保留前导零。','000000000000000001']];
const homes=[...keys,['物业类型','text',true,'本模板仅覆盖截图中的住宅。','住宅',['住宅']],['产权年限（年）','int',false,'非负整数，不带“年”。',70],['建筑类型','text',false,'多选用中文分号分隔：小高层、超高层、独栋、双拼、联排、叠拼、高层、多层。截图中重复的“高层”已去重。','小高层'],['装修情况','text',false,'多选用中文分号分隔：毛坯、普通装修、精装修、豪华装修、其它。','毛坯；精装修'],['住宅占地面积（㎡）','num',false,'非负数。',30000],['住宅建筑面积（㎡）','num',false,'非负数。',90000],['开盘时间','date',false,'按yyyy-mm-dd填写实际日期。',new Date('2026-09-01T00:00:00Z')],['交房时间','date',false,'按yyyy-mm-dd填写实际日期。',new Date('2028-03-31T00:00:00Z')],['总户数（户）','int',false,'非负整数。',600],['户型区间','text',false,'截图未明确单位口径，按系统现有口径填写，不依据错误占位提示填写建筑面积。',''],['最大楼间距（米）','num',false,'非负数，应不小于最小楼间距。',110],['最小楼间距（米）','num',false,'非负数，应不大于最大楼间距。',40],['梯户比','text',false,'使用系统既有格式，如2T2。','2T2'],['营销代理','text',false,'填写系统中已存在的机构名称。',''],['物业公司','text',false,'填写系统中已存在的公司名称。',''],['物业费（元/㎡/月）','num',false,'非负数，单元格中不带单位。',3.5]];
const groups=[['分期基础信息',basics],['预售许可证',permits],['住宅物业信息',homes]];
const col=n=>{let x='';for(n++;n;n=Math.floor((n-1)/26))x=String.fromCharCode(65+(n-1)%26)+x;return x};
function style(sh,range){sh.showGridLines=false;sh.getRange(range).format.font={name:'Microsoft YaHei',size:11,color:'#303133'};sh.getRange(range).format.rowHeight=28;sh.getRange(range).format.wrapText=true;}
function head(sh,r){sh.getRange(r).format={fill:'#3F6FE8',font:{bold:true,color:'#FFFFFF'},rowHeight:42,wrapText:true};}
const read=wb.worksheets.add('填写说明');style(read,'A1:F22');read.getRange('A1:F1').merge();read.getRange('A1').values=[['项目分期数据导入模板']];head(read,'A1:F1');read.getRange('A2:F2').merge();read.getRange('A2').values=[['依据提供的3张页面截图整理｜2026-09-08｜空白数据表从第2行填写']];read.getRange('A2:F2').format.rowHeight=32;read.getRange('A1:F22').format.columnWidth=20;
const notes=[
 ['数据表','分期基础信息：一行一个分期；预售许可证：一行一张证；住宅物业信息：一行一个分期的住宅信息。'],
 ['导入方式','三个数据表第1行为字段名、第2行起为数据。正式导入只读取三个数据表；“填写说明”“字段说明”“填写示例”不参与导入。'],
 ['关联方式','三个表统一填写所属开发商、所属项目、分期名（推广名）。同一组合需唯一匹配；有多张预售证时重复填写关联字段。'],
 ['必填规则','橙色表头为必填。基础信息按截图红星标记；子表关联字段、证号及物业类型为本模板建议必填。表头批注及字段说明提供规则。'],
 ['名称字典','开发商、项目、投资商、区县、板块、营销代理、物业公司等使用系统现有名称；同名对象应由导入端使用真实ID校验。'],
 ['文本字段','证号、监管账户、街景id、电话及关联名称已设置文本格式。不得将证号和账户改为数值，避免前导零丢失或科学计数。'],
 ['单位与日期','面积为㎡，距离为米，物业费为元/㎡/月；绿化率输入35表示35%。日期按yyyy-mm-dd填写，不带额外文字。'],
 ['多选字段','分期标签、建筑类型、装修情况用中文分号“；”分隔。Excel普通下拉不支持多选，因此这些列采用手工填写。'],
 ['坐标字段','项目及售楼部经纬度是为地图选点补充的导入辅助列，可留空；填写时必须成对。坐标系由导入接口统一，不默认猜测。'],
 ['截图差异','总建筑面积／总占地面积按标签含义填写，忽略对调的输入提示。建筑类型中的重复“高层”仅保留一个。'],
 ['未明确口径','户型区间、环线和方位的完整选项截图未展开，使用现有系统口径；本模板不硬编码未知选项。'],
 ['示例与空值','示例为虚构数据，仅用于说明格式，不要作为真实资料导入。空值表示未提供；是否清空已有数据由导入接口约定。'],
 ['范围与兼容','本文件为建议的Excel字段结构，未修改网页或接入导入接口。正式导入需由系统适配工作表、字段映射、重复校验和数据字典。'],
 ['校验范围','预设100行输入区及常用数值／选项校验；超过100条时复制带格式的空白行。粘贴可能绕过Excel校验，仍需导入端校验。']];
notes.forEach(([a,b],i)=>{let r=i+4;read.getRange(`A${r}`).values=[[a]];read.getRange(`B${r}:F${r}`).merge();read.getRange(`B${r}`).values=[[b]];read.getRange(`A${r}:F${r}`).format.rowHeight=48;read.getRange(`A${r}`).format.font.bold=true;if(i%2===0)read.getRange(`A${r}:F${r}`).format.fill='#F2F6FE'});
const dictRows=[],exampleRows=[];
for(const [idx,[name,fields]] of groups.entries()){
 const sh=wb.worksheets.add(name),last=col(fields.length-1);style(sh,`A1:${last}101`);sh.getRange(`A1:${last}101`).format.columnWidth=23;sh.getRange(`A1:${last}1`).values=[fields.map(f=>f[0])];head(sh,`A1:${last}1`);sh.freezePanes.freezeRows(1);sh.freezePanes.freezeColumns(3);
 sh.tables.add(`A1:${last}101`,true,`ImportData${idx+1}`);
 for(const [j,f] of fields.entries()){
  const [label,type,req,rule,example,values]=f;const c=col(j),r=sh.getRange(`${c}2:${c}101`);
  r.setNumberFormat(type==='text'?'@':type==='date'?'yyyy-mm-dd':type==='int'?'0':'0.######');
  if(req)sh.getRange(`${c}1`).format.fill='#B65C14';
  wb.comments.addThread({cell:sh.getRange(`${c}1`)},`${req?'必填':'选填'}；${rule}`);
  if(values)r.dataValidation={rule:{type:'list',values}};
  if(type==='int')r.dataValidation={rule:{type:'whole',operator:'greaterThanOrEqual',formula1:label==='项目期数'?1:0}};
  if(type==='num')r.dataValidation={rule:{type:'decimal',operator:'between',formula1:label.includes('经度')?-180:label.includes('纬度')?-90:0,formula2:label.includes('经度')?180:label.includes('纬度')?90:label.includes('绿化率')?100:999999999999}};
  if(label==='分期名（推广名）'||label==='分期别名'||label==='售楼部地址')r.dataValidation={rule:{type:'textLength',operator:'lessThanOrEqual',formula1:label==='售楼部地址'?100:50}};
  if(/地址|项目简介/.test(label))sh.getRange(`${c}1:${c}101`).format.columnWidth=42;
  dictRows.push([name,label,req?'是':'否',{text:'文本',num:'数值',int:'整数',date:'日期'}[type],rule]);
  exampleRows.push([name,label,example??'', '示例数据，不参与导入']);
 }
}
function supporting(name,headers,rows,widths){const sh=wb.worksheets.add(name);const last=col(headers.length-1);style(sh,`A1:${last}${rows.length+1}`);sh.getRange(`A1:${last}${rows.length+1}`).values=[headers,...rows];head(sh,`A1:${last}1`);sh.freezePanes.freezeRows(1);widths.forEach((w,i)=>sh.getRange(`${col(i)}1:${col(i)}${rows.length+1}`).format.columnWidth=w);sh.getRange(`A2:${last}${rows.length+1}`).format.rowHeight=44;return sh;}
supporting('字段说明',['数据表','字段名称','必填','格式','填写规则'],dictRows,[20,28,9,10,90]);
const ex=supporting('填写示例',['对应数据表','字段名称','填写示例值','说明'],exampleRows,[20,28,54,26]);ex.getRange(`C2:C${exampleRows.length+1}`).setNumberFormat('@');
exampleRows.forEach((r,i)=>{if(r[2] instanceof Date)ex.getRange(`C${i+2}`).setNumberFormat('yyyy-mm-dd');else if(typeof r[2]==='number')ex.getRange(`C${i+2}`).setNumberFormat('0.######')});
for(const [name,range] of [['填写说明','A1:F10'],['分期基础信息','A1:G6'],['预售许可证','A1:F6'],['住宅物业信息','A1:G6'],['字段说明','A1:E9'],['填写示例','A1:D10']]){
 const preview=await wb.render({sheetName:name,range,scale:1,format:'png'});await fs.writeFile(path.join(out,name+'-检查.png'),new Uint8Array(await preview.arrayBuffer()));
}
console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:1500})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?',options:{useRegex:true,maxResults:10},maxChars:500})).ndjson);
const final=path.join(out,'项目分期数据导入模板.xlsx');await (await SpreadsheetFile.exportXlsx(wb)).save(final);console.log(final);
