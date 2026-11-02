(async()=>{
const source={data:{version:2,prototypeName:'置业顾问端',pageId:'advisor',nodes:[],updatedAt:Date.now()},documents:{nodes:[{id:'advisor-requirements',type:'markdown',title:'客户管理与电话回拨 · 需求说明',readerMode:'split',markdown:'# 客户管理\n\n客户列表保留姓名、脱敏手机号、最近时间和沟通状态。移除列表中的楼盘、购房意向、重点客户标签及原因；取消只看重点客户功能及全部、未沟通、已沟通筛选 Tab。保留客户搜索及数量展示。\n\n# 消息详情－拨打电话\n\n顶部“客户资料”入口替换为“拨打电话”。\n\n## 回拨前置条件\n\n置业顾问必须在客户先拨打该顾问电话后，才能向该客户拨打电话。在线聊天、已沟通状态、关注或浏览楼盘均不构成回拨资格。\n\n| 场景 | 操作结果 |\n| --- | --- |\n| 客户尚未拨打当前顾问 | 不发起呼叫，提示“客户尚未拨打您的电话，暂不可回拨” |\n| 客户已经拨打当前顾问 | 允许通过隐私号回拨 |\n| 无法确认呼入记录 | 不发起呼叫，待服务端确认资格 |\n\n## 实现约束\n\n服务端根据当前顾问与当前客户的真实呼入记录判断资格，并在每次发起呼叫前校验；不能只依赖前端字段。客户详情页的电话入口遵守同样规则。\n\n## 原型说明\n\n原型以 hasCalledAdvisor 字段模拟资格，默认无资格；未接入真实通话记录和拨号服务。有资格时展示现有隐私号演示弹窗，不发起真实电话。'}]},presentation:{layerSelectors:['dialog[open]']}};
const api=window.AxhubAnnotation;
const viewer=api.createAnnotationViewer({source,options:{emptyWhenNoData:true,getCurrentPageId:()=> 'advisor'}});
await viewer.start();
async function validate(){viewer.refresh();window.advisorAnnotationValidation=await api.validateAnnotationRuntime(source,{pageId:'advisor'});console.log('Advisor annotation validation',window.advisorAnnotationValidation)}
window.addEventListener('hashchange',validate);await validate();
})().catch(console.error);
