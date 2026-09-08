const {chromium}=require('C:/Users/ZhuanZ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path'),{pathToFileURL}=require('url'),assert=require('assert/strict');
(async()=>{
 const b=await chromium.launch({channel:'msedge',headless:true});
 try{
 const p=await b.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
 await p.goto(pathToFileURL(path.resolve(__dirname,'../../project-detail.html')).href);
 const expected=await p.locator('#supportList .support-type').allTextContents();
 for(const [target,name] of [['project','01-楼盘导航'],['sales','02-售楼部导航']]){
  await p.locator(`[data-location-target="${target}"]`).first().click();
  assert.deepEqual(await p.locator('#locationSupportList .support-type').allTextContents(),expected);
  await p.locator('#locationSupportList .location-support-item').first().click();
  await p.screenshot({path:path.join(__dirname,'screens',name+'.png')});
  for(const type of ['park','commerce','medical','traffic']){
   await p.locator(`[data-location-support="${type}"]`).click();
   assert.equal(await p.locator('#locationSupportList .location-support-item').count(),3);
  }
  await p.locator('#closeLocationSheet').click();
 }
 for(const [id,date] of [['permit-20260918','2026-07-08'],['permit-20260626','2026-06-26']]){
  if(id==='permit-20260626')await p.locator('#openPermitArchiveButton').click();
  const list=id==='permit-20260626'?'#permitArchiveList':'#permit';
  await p.locator(`${list} [data-permit-id="${id}"] [data-permit-action="price-map"]`).click();
  assert.equal(await p.locator('.sales-control__date').count(),1);
  assert.equal(await p.locator('.sales-control__date strong').innerText(),date);
  await p.locator('.sales-control__unit').last().click();
  assert.equal(await p.locator('.sales-control__date strong').innerText(),date);
  if(id==='permit-20260918')await p.screenshot({path:path.join(__dirname,'screens','06-一房一价.png')});
  await p.locator('#closePermitButton').click();
 }
 console.log('PASS: each permit has one matching date; unit switches preserve date; both navigation targets share detail category tags; all four categories work.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
