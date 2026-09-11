const {chromium}=require('C:/Users/ZhuanZ/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url'); const path=require('path');
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
const p=await b.newPage({viewport:{width:390,height:900},deviceScaleFactor:1});
await p.goto(pathToFileURL(path.resolve('房产超市_住进成都.html')).href+'?screen=message-detail');
await p.locator('#messageContact').waitFor({state:'visible'});
await p.locator('#messageDetailScreen').screenshot({path:'tmp/chat-prd-chat.png'});
await p.locator('#messageMediaToggle').click();
await p.locator('#messageOnlinePanel').screenshot({path:'tmp/chat-prd-media.png'});
await p.locator('#messageMediaToggle').click();
await p.locator('#messageContactAvatar').click();
await p.locator('#advisorProfileScreen').screenshot({path:'tmp/chat-prd-advisor.png'});
await p.locator('#backAdvisorProfileButton').click();
await p.locator('#backMessageDetailButton').click();
await p.locator('#messageScreen').screenshot({path:'tmp/chat-prd-list.png'});
console.log('Captured current list, chat, media panel and advisor detail.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
