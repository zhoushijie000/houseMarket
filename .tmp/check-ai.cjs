const {chromium}=require('playwright');
const http=require('http'),fs=require('fs'),path=require('path');
(async()=>{
 const server=http.createServer((req,res)=>{const p=path.join(process.cwd(),decodeURIComponent(req.url.split('?')[0]));try{res.setHeader('Content-Type',p.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');res.end(fs.readFileSync(p));}catch{res.statusCode=404;res.end();}}).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const browser=await chromium.launch({channel:'msedge',headless:true}); const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 const base='http://127.0.0.1:'+server.address().port;
 try{
 await page.goto(base+'/0917-AI类别管理.html');await page.locator('#rows tr').first().waitFor();await page.screenshot({path:'outputs/AI类别管理-preview.png',fullPage:true});
 await page.locator('#add').click();await page.locator('#name').fill('测试类别');await page.locator('#editForm').getByRole('button',{name:'保存',exact:true}).click();if(await page.locator('#rows').getByText('测试类别',{exact:true}).count()!==1)throw Error('category save');
 await page.goto(base+'/0917-AI引导语设置.html');await page.locator('#add').click();await page.locator('#content').fill('字'.repeat(31));if(await page.locator('#content').evaluate(e=>e.checkValidity()))throw Error('length validation');await page.locator('#content').fill('字'.repeat(30));await page.locator('#category').selectOption({label:'测试类别'});await page.locator('#editForm').getByRole('button',{name:'保存',exact:true}).click();await page.reload();if(!await page.locator('#rows').getByText('字'.repeat(30),{exact:true}).count())throw Error('persist');
 await page.locator('#rows tr').last().getByRole('switch').click();if(await page.locator('#rows tr').last().getByRole('switch').getAttribute('aria-checked')!=='false')throw Error('toggle');
 await page.evaluate(()=>localStorage.clear());await page.reload();await page.screenshot({path:'outputs/AI引导语设置-preview.png',fullPage:true});if(errors.length)throw Error(errors.join('\n'));console.log('PASS: render, shared category, create, 30-character boundary, persistence, status toggle; no browser errors');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});


