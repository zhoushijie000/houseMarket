const {chromium}=require('C:/Users/ZhuanZ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url');const path=require('path');const assert=require('assert');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const context=await b.newContext({viewport:{width:1440,height:1000}}),p=await context.newPage();const errors=[];context.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(path.resolve('0910-消息管理.html')).href);
assert.equal(await p.getByRole('tab').first().textContent(),'屏蔽关键词');
async function add(word){await p.locator('#addKeyword').click();await p.locator('#keywordInput').fill(word);await p.getByRole('button',{name:'确定添加'}).click()}
await add('预约');assert.equal(await p.locator('#keywordRows tr').count(),1);
await add('预约');assert.match(await p.locator('#keywordError').textContent(),/已存在/);await p.locator('#cancelKeyword').click();
await p.reload();assert.match(await p.locator('#keywordRows').textContent(),/预约/);
assert.equal(await p.locator('.keyword-demo, #keywordNotice').count(),0);
await p.screenshot({path:'tmp/0910-屏蔽关键词-preview.png'});
const mobile=await context.newPage();await mobile.setViewportSize({width:390,height:900});await mobile.goto(pathToFileURL(path.resolve('房产超市_住进成都.html')).href+'?screen=message-detail');
assert.equal(await mobile.evaluate(()=>BlockedKeywords.mask('预约看房')),'**看房');
assert.equal(await mobile.locator('[data-unmasked]').evaluateAll(nodes=>nodes.some(n=>n.textContent.includes('预约'))),false);
await mobile.locator('#messageReplyInput').fill('预约预约看房');await mobile.locator('#messageReplyInput').press('Enter');
await mobile.waitForTimeout(300);assert.match(await mobile.locator('#messageDetailConversation').textContent(),/\*\*\*\*看房/);
const result=await mobile.evaluate(()=>{const old=BlockedKeywords.read();BlockedKeywords.save([{word:'aba'},{word:'bab'},{word:'.*'},{word:'😀'}]);const result=BlockedKeywords.mask('ababa .* 😀');BlockedKeywords.save(old);return result});assert.equal(result,'***** ** *');
p.on('dialog',d=>d.accept());await p.getByRole('button',{name:'删除',exact:true}).click();await mobile.bringToFront();await mobile.evaluate(()=>window.dispatchEvent(new Event('focus')));assert.equal(await mobile.evaluate(()=>BlockedKeywords.mask('预约')),'预约');
assert.match(await mobile.locator('#messageDetailConversation').textContent(),/预约预约看房/);
await p.getByRole('tab',{name:'消息列表',exact:true}).click();await p.locator('#messageRows').waitFor({state:'visible'});
assert.deepEqual(errors,[]);console.log('PASS: default tab, add, duplicate validation, persistence, preview, cross-page masking, sent messages, overlap/literal/emoji matching, delete and restore, message tab.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
