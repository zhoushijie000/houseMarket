const {chromium}=require('C:/Users/ZhuanZ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path'),fs=require('fs'),{pathToFileURL}=require('url');
const root=path.resolve(__dirname,'../..'),dir=path.join(__dirname,'screens');fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const p=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
 const go=async f=>{await p.goto(pathToFileURL(path.join(root,f.split('?')[0])).href+(f.includes('?')?'?'+f.split('?')[1]:''));await p.waitForTimeout(250)};
 const shot=async(n,selector)=>{await p.waitForTimeout(200);await (selector?p.locator(selector):p).screenshot({path:path.join(dir,n+'.png')});console.log(n)};
 await go('project-detail.html');await p.locator('[data-location-target="project"]').first().click();await shot('01-楼盘导航');await p.locator('[data-location-tab="sales"]').click();await shot('02-售楼部导航');await p.locator('#closeLocationSheet').click();
 await shot('03-最新预售证','#permit');await p.locator('#openPermitArchiveButton').click();await shot('04-全部预售证');await p.locator('#closePermitArchiveButton').click();
 for(const [action,n] of [['detail','05-取证详情'],['price-map','06-一房一价'],['available','07-剩余房源']]){await p.locator(`[data-permit-action="${action}"]`).first().click();await shot(n);await p.locator('#closePermitButton').click()}
 await shot('08-报告摘要','.ai-summary-card');await p.locator('#openAdvisorInfoButton').click();await shot('09-联系置业顾问');
 await go('0902-楼盘AI分析.html');await shot('10-楼盘报告');
 await go('房产超市_住进成都.html?screen=mine');await shot('11-我的');await p.locator('.mine-profile').click();await shot('12-资料设置');
 await go('房产超市_住进成都.html?screen=mine');
 // Local prototype fixture: exercise the existing host phone-bound event without real authorization or transmission.
 await p.evaluate(()=>{window.dispatchEvent(new CustomEvent('housemarket:phone-bound',{detail:{phone:'13800000000'}}));openMessageDetailScreen('message-consult-001',{name:'李晓雨',role:'高级置业顾问',initial:'李',wechat:'AJCD-LXY2026',estate:'招商·时代花园'})});await shot('13-顾问对话');
 await p.setViewportSize({width:1600,height:1000});
 await go('0902-户型图VR链接管理.html');await p.locator('.manage-phase').first().click();await shot('14-地址维护');await p.locator('[data-coordinate-target="project"]').click();await shot('15-地图选点');
 await go('0715-房源展示价格管理.html');await shot('16-批量价格列表');await p.locator('#importBtn').click();await shot('17-价格导入');await p.locator('[data-close="importModal"]').last().click();await p.locator('#batchBtn').click();await shot('18-批量比例设置');
 await go('0902-项目报告管理.html');await shot('19-项目报告列表');await p.locator('#newReport').click();await shot('20-项目报告录入');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
