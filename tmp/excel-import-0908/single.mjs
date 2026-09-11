import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir='C:/Users/ZhuanZ/Desktop/zhou/houseMarket/outputs/import-template-0908';
const source=await fs.readFile(new URL('./build.mjs',import.meta.url),'utf8');
// Reuse only the field definitions from the existing template builder.
const definitions=source.slice(source.indexOf('const keys='),source.indexOf('const groups='));
const {basics,homes}=new Function(definitions+'; return {basics,homes};')();
const wb=Workbook.create();wb.comments.setSelf({displayName:'填写说明'});
const sh=wb.worksheets.add('单项目录入');sh.showGridLines=false;
sh.getRange('A1:H85').format={font:{name:'Microsoft YaHei',size:11,color:'#303133'},rowHeight:32,wrapText:true};
sh.getRange('A1:A85').format.columnWidth=26;
sh.getRange('B1:D85').format.columnWidth=15;
sh.getRange('E1:H85').format.columnWidth=13;
sh.freezePanes.freezeRows(4);
function merged(range,text,fill){sh.getRange(range).merge();const c=range.split(':')[0];sh.getRange(c).values=[[text]];if(fill)sh.getRange(range).format.fill=fill;return sh.getRange(range);}
function band(row,text){const r=merged(`A${row}:H${row}`,text,'#3F6FE8');r.format.font={bold:true,color:'#FFFFFF'};r.format.rowHeight=34;}
merged('A1:H1','单项目数据录入表','#214B9C').format.font={bold:true,color:'#FFFFFF',size:18};sh.getRange('A1:H1').format.rowHeight=44;
merged('A2:H2','请开发商尽可能完整、准确地提供项目信息，以便全面展示项目情况。').format.rowHeight=30;
merged('A3:H3','基础信息只填一次，下方预售许可证和住宅信息自动归属于本项目分期。').format.rowHeight=28;
merged('A4:H4','保持字段名称与区域结构；填写完成后另存为项目名称.xlsx。格式校验不能替代导入系统的业务校验。','#F0F4FC');
const inputs=[];
function field(row,f){let [label,type,required,rule,example,options]=f;rule=rule.replace('；三个数据表保持一致。','。').replace('；三个数据表按相同开发商、项目、分期名关联。','；本文件内仅填写一次。');
 sh.getRange(`A${row}`).values=[[label]];sh.getRange(`A${row}`).format.font={bold:false,color:'#303133'};
 const input=merged(`B${row}:D${row}`,'','#EFF6FF');input.format.borders={preset:'bottom',style:'thin',color:'#BCD0EF'};
 const note=merged(`E${row}:H${row}`,rule);note.format.font={color:'#697589',size:10};
 sh.getRange(`A${row}:H${row}`).format.rowHeight=rule.length>65?62:46;
 const cell=sh.getRange(`B${row}`);input.setNumberFormat(type==='text'?'@':type==='date'?'yyyy-mm-dd':type==='int'?'0':'0.00');
 if(label==='物业类型')cell.values=[['住宅']];
 if(options)cell.dataValidation={rule:{type:'list',values:options}};
 if(type==='int')cell.dataValidation={rule:{type:'whole',operator:'greaterThanOrEqual',formula1:label==='项目期数'?1:0}};
 if(type==='num')cell.dataValidation={rule:{type:'decimal',operator:'between',formula1:label.includes('经度')?-180:label.includes('纬度')?-90:0,formula2:label.includes('经度')?180:label.includes('纬度')?90:label.includes('绿化率')?100:999999999999}};
 if(['分期名（推广名）','分期别名','售楼部地址'].includes(label))cell.dataValidation={rule:{type:'textLength',operator:'lessThanOrEqual',formula1:label==='售楼部地址'?100:50}};
 wb.comments.addThread({cell},rule);inputs.push([label,`B${row}`]);
}
band(5,'01  项目基础信息');basics.filter(f=>f[0]!=='项目简介').forEach((f,i)=>field(6+i,f));
band(34,'02  项目简介');merged('A35:H35','填写纯文本介绍，可使用 Alt+Enter 换行；无需填写富文本代码。').format.font.color='#697589';
merged('A36:H39','','#EFF6FF').setNumberFormat('@');inputs.push(['项目简介','A36']);
band(41,'03  预售许可证');merged('A42:H42','一行一张证，无证可留空。证号和账户按文本填写；本区域均属于上方项目，支持填写10张证。').format.rowHeight=34;
const cols=[['A','A','序号'],['B','C','预售许可证'],['D','F','监管银行'],['G','H','监管账户']];
for(const [start,end,label] of cols){merged(`${start}43:${end}43`,label,'#E6EDF9').format.font.bold=true;}
for(let row=44;row<=53;row++){
 sh.getRange(`A${row}`).values=[[row-43]];sh.getRange(`A${row}`).format.font.color='#909399';
 for(const [start,end,label] of cols.slice(1)){merged(`${start}${row}:${end}${row}`,'','#EFF6FF').setNumberFormat('@');wb.comments.addThread({cell:sh.getRange(`${start}${row}`)},label.includes('许可')?'请提供完整证号及对应监管信息；证号按文本保存，不转为数值。':label.includes('账户')?'文本格式；保留前导零及全部位数。':'填写监管银行全称。');}
 sh.getRange(`A${row}:H${row}`).format.rowHeight=36;
}
band(55,'04  住宅物业信息');homes.slice(3).forEach((f,i)=>field(56+i,f));
band(73,'填写提示');
merged('A74:H74','多选项用中文分号“；”分隔，例如“毛坯；精装修”。电话、证号、街景id和监管账户均按文本保存。').format.rowHeight=36;
merged('A75:H75','绿化率填35表示35%；面积为㎡，距离为米，物业费为元/㎡/月。日期统一填写yyyy-mm-dd。').format.rowHeight=36;
merged('A76:H76','请尽可能补充各项信息；暂未掌握的信息可留空，核实后补充。蓝色区域为输入区，经纬度成对填写。').format.rowHeight=36;
merged('A77:H77','本模板为单项目（分期）表单结构；正式导入需由系统适配此录入布局。超过10张预售证时，在证件区复制增加行。').format.rowHeight=40;
// Compact checks for field coverage and absence of repeated project identifiers.
if(inputs.length!==44)throw new Error('Unexpected input field count: '+inputs.length);
for(const label of ['所属开发商','所属项目','分期名（推广名）'])if(inputs.filter(f=>f[0]===label).length!==1)throw new Error('Repeated key');
for(const [name,range] of [['基础信息','A1:H15'],['基础信息下部','A16:H32'],['简介及证件','A34:H53'],['住宅信息','A55:H71'],['说明','A73:H77']]){const b=await wb.render({sheetName:'单项目录入',range,scale:1,format:'png'});await fs.writeFile(`${dir}/单项目-${name}.png`,new Uint8Array(await b.arrayBuffer()));}
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?',options:{useRegex:true,maxResults:5},maxChars:300})).ndjson);
await fs.writeFile(`${dir}/单项目字段位置.json`,JSON.stringify(inputs,null,2));
const file=`${dir}/单项目数据录入模板_更新版.xlsx`;await (await SpreadsheetFile.exportXlsx(wb)).save(file);console.log(file);
