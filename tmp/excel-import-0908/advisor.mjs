import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const dir='C:/Users/ZhuanZ/Desktop/zhou/houseMarket/outputs/import-template-0908';
const wb=Workbook.create();
const sh=wb.worksheets.add('置业顾问信息');
sh.showGridLines=false;
sh.getRange('A1:E25').format={font:{name:'Microsoft YaHei',size:11,color:'#303133'},verticalAlignment:'center',rowHeight:30,wrapText:true};
sh.getRange('A1:A25').format.columnWidth=8;
sh.getRange('B1:B25').format.columnWidth=22;
sh.getRange('C1:D25').format.columnWidth=28;
sh.getRange('E1:E25').format.columnWidth=32;
function merge(range,text,fill){const r=sh.getRange(range);r.merge();sh.getRange(range.split(':')[0]).values=[[text]];if(fill)r.format.fill=fill;return r;}
merge('A1:E1','置业顾问信息录入表','#214B9C').format.font={bold:true,color:'#FFFFFF',size:17};
sh.getRange('A1:E1').format.rowHeight=44;
merge('A2:E2','请尽可能完整、准确地提供置业顾问信息。一行填写一人，预留20行，可向下增加。').format.rowHeight=34;
merge('A3:E3','手机号和微信号按文本填写。二维码图片放在对应行内，保持完整清晰、按原比例缩放。').format.font.color='#697589';
sh.getRange('A5:E5').values=[['序号','置业顾问姓名','置业顾问手机号','置业顾问微信号','置业顾问微信二维码']];
sh.getRange('A5:E5').format={fill:'#3F6FE8',font:{bold:true,color:'#FFFFFF'},rowHeight:36,horizontalAlignment:'center'};
for(let row=6;row<=25;row++){
 sh.getRange(`A${row}`).values=[[row-5]];
 sh.getRange(`A${row}`).format.horizontalAlignment='center';
 sh.getRange(`B${row}:E${row}`).format.fill=row%2===0?'#EFF6FF':'#F7FAFF';
 sh.getRange(`B${row}:D${row}`).setNumberFormat('@');
 sh.getRange(`A${row}:E${row}`).format.rowHeight=100;
 sh.getRange(`A${row}:E${row}`).format.borders={bottom:{style:'thin',color:'#D9E3F3'}};
}
sh.freezePanes.freezeRows(5);
wb.recalculate();
console.log((await wb.inspect({kind:'match',searchTerm:'置业顾问',options:{maxResults:8},maxChars:1600})).ndjson);
const preview=await wb.render({sheetName:sh.name,range:'A1:E9',scale:1,format:'png'});
await fs.writeFile(`${dir}/置业顾问模板预览.png`,new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(`${dir}/置业顾问信息录入模板_多人版.xlsx`);
console.log('Exported advisor template');
