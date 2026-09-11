const {chromium}=require('C:/Users/ZhuanZ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url');const path=require('path');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const p=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const name of ['0910-消息管理.html','0910-消息记录.html']){
await p.goto(pathToFileURL(path.resolve(name)).href);await p.getByRole('button',{name:'展开用户菜单',exact:true}).click();await p.getByRole('menu',{name:'用户',exact:true}).waitFor({state:'visible'});await p.keyboard.press('Escape');
await p.locator('input[name="title"]').fill('无匹配内容');await p.getByRole('button',{name:'查询',exact:true}).click();if(await p.locator('.empty').count()!==1)throw Error('Empty state failed');await p.getByRole('button',{name:'重置',exact:true}).click();
await p.getByRole('button',{name:'查看详情'}).first().click();await p.getByRole('dialog').waitFor({state:'visible'});await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'hidden'});
if(name.includes('记录')){await p.locator('#next').click();if(await p.locator('#pageNumber').textContent()!=='2')throw Error('Pagination failed');await p.locator('#prev').click()}
await p.screenshot({path:'tmp/'+name.replace('.html','-preview.png')});}
for(const name of ['0715-房源展示价格管理.html','0819-直播专区标签管理.html','0821-直播管理.html','0828-专题管理.html','0831-客户管理.html','0831-区县管理.html','0902-户型图VR链接管理.html','0902-项目报告管理.html']){await p.goto(pathToFileURL(path.resolve(name)).href);await p.getByRole('button',{name:'展开用户菜单',exact:true}).click();await p.getByRole('menu',{name:'用户',exact:true}).waitFor({state:'visible'});await p.getByRole('menu',{name:'用户',exact:true}).getByRole('link',{name:'消息管理',exact:true}).click();if(!decodeURI(p.url()).includes('0910-消息管理.html'))throw Error('Navigation failed: '+name)}
if(errors.length)throw Error(errors.join('\n'));console.log('PASS: 8 menu entry points; 2 lists; filters, reset, empty state, details, pagination; no page errors.');}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
