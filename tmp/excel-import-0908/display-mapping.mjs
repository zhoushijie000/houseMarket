import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir='C:/Users/ZhuanZ/Desktop/zhou/houseMarket/outputs/import-template-0908';
const wb=Workbook.create();
const sh=wb.worksheets.add('小程序展示位置说明');
sh.showGridLines=false;
sh.getRange('A1:H25').format={font:{name:'Microsoft YaHei',size:11,color:'#303133'},verticalAlignment:'center',rowHeight:30,wrapText:true};
for(const [col,width] of [['A',7],['B',10],['C',22],['D',30],['E',20],['F',28],['G',42],['H',25]])sh.getRange(`${col}1:${col}25`).format.columnWidth=width;
function banner(row,text,fill){const r=sh.getRange(`A${row}:H${row}`);r.merge();sh.getRange(`A${row}`).values=[[text]];if(fill)r.format.fill=fill;return r;}
banner(1,'字段及相册小程序展示位置说明模板','#214B9C').format.font={bold:true,color:'#FFFFFF',size:17};
sh.getRange('A1:H1').format.rowHeight=44;
banner(2,'一行说明一个字段或一类相册。填写内容说明及小程序展示位置，在对应行插入截图。').format.rowHeight=34;
banner(3,'截图区域已留空，可调整行高和图片大小。同一内容有多个展示位置时，可分行填写；行数可按需增加。').format.font.color='#697589';
const headers=['序号','类型','字段/相册名称','内容说明','小程序页面','具体展示位置','展示位置截图','备注'];
sh.getRange('A5:H5').values=[headers];
sh.getRange('A5:H5').format={fill:'#3F6FE8',font:{bold:true,color:'#FFFFFF'},rowHeight:38,horizontalAlignment:'center'};
for(let row=6;row<=25;row++){
 sh.getRange(`A${row}:B${row}`).values=[[row-5,row<=15?'字段':'相册']];
 sh.getRange(`A${row}:B${row}`).format.horizontalAlignment='center';
 sh.getRange(`B${row}`).dataValidation={rule:{type:'list',values:['字段','相册']}};
 sh.getRange(`C${row}:H${row}`).setNumberFormat('@');
 sh.getRange(`B${row}:H${row}`).format.fill=row%2===0?'#EFF6FF':'#F7FAFF';
 sh.getRange(`G${row}`).format.fill='#E6EDF9';
 sh.getRange(`A${row}:H${row}`).format.rowHeight=150;
 sh.getRange(`A${row}:H${row}`).format.borders={bottom:{style:'thin',color:'#D9E3F3'}};
}
sh.freezePanes.freezeRows(5);
wb.recalculate();
console.log((await wb.inspect({kind:'table',range:'小程序展示位置说明!A5:H6',include:'values',tableMaxRows:2,tableMaxCols:8,maxChars:1600})).ndjson);
const preview=await wb.render({sheetName:sh.name,range:'A1:H7',scale:1,format:'png'});
await fs.writeFile(`${dir}/展示位置模板预览.png`,new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(`${dir}/字段及相册小程序展示位置说明模板.xlsx`);
