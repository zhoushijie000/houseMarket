from pathlib import Path
import re
root = Path.cwd()
base = (root/'0831-客户管理.html').read_text(encoding='utf-8')
menu = '''<div class="nav-item" data-nav-menu>
        <a class="nav-primary-link" href="./0910-消息管理.html">用户</a><button class="nav-trigger nav-menu-toggle" type="button" aria-label="展开用户菜单" aria-expanded="false"><span class="chevron"></span></button>
        <div class="nav-menu" role="menu" aria-label="用户">
          <a class="nav-menu-link" href="./0910-消息管理.html">消息管理</a>
          <a class="nav-menu-link" href="./0910-消息记录.html">消息记录</a>
        </div>
      </div>
      '''
for p in root.glob('*.html'):
    s=p.read_text(encoding='utf-8')
    if 'id="headerNav"' not in s and 'aria-label="后台一级菜单"' not in s: continue
    addition=menu
    if p.name.startswith('0715-'):
        toggle=re.search(r'<button class="nav-menu-toggle"[^>]*>.*?</button>',s).group()
        addition=re.sub(r'<button.*?</button>',toggle.replace('展开项目菜单','展开用户菜单'),menu)
    s=re.sub(r'(<nav\b[^>]*(?:id="headerNav"|aria-label="后台一级菜单")[^>]*>)([\s\S]*?)(</nav>)',lambda m:m[1]+m[2]+addition+m[3],s,count=1)
    p.write_text(s,encoding='utf-8')
base=(root/'0831-客户管理.html').read_text(encoding='utf-8')
head=base[:base.index('  <div class="workspace-tabs">')]
head=head.replace('nav-item active','nav-item').replace('nav-menu-link active','nav-menu-link').replace(' aria-current="page"','')
head=head.replace('<div class="nav-item" data-nav-menu>\n        <a class="nav-primary-link" href="./0910-', '<div class="nav-item active" data-nav-menu>\n        <a class="nav-primary-link" href="./0910-')
for kind in ['消息管理','消息记录']:
    h=head.replace('<title>客户 - 客户管理</title>',f'<title>用户 - {kind}</title>')
    h=h.replace(f'class="nav-menu-link" href="./0910-{kind}.html"',f'class="nav-menu-link active" aria-current="page" href="./0910-{kind}.html"')
    body='''
  <div class="workspace-tabs"><a class="workspace-tab FIRST" href="./0910-消息管理.html" style="text-decoration:none">消息管理</a><a class="workspace-tab SECOND" href="./0910-消息记录.html" style="text-decoration:none">消息记录</a></div>
  <main class="page" data-page="KIND">
    <div class="page-title">KIND</div>
    <form class="filter-card" id="filters">
      <div class="filter-fields">
        <label class="filter-item"><span class="filter-label">消息标题</span><input class="control-input" name="title" placeholder="请输入消息标题"></label>
        <label class="filter-item"><span class="filter-label">消息类型</span><select class="control-select" name="type"><option value="">全部</option><option>系统通知</option><option>活动通知</option><option>业务提醒</option></select></label>
        <label class="filter-item"><span class="filter-label">STATUSLABEL</span><select class="control-select" name="status"><option value="">全部</option>OPTIONS</select></label>
      </div>
      <div class="filter-actions"><button class="btn btn-primary" type="submit">查询</button><button class="btn" type="reset">重置</button></div>
    </form>
    <section class="list-card"><div class="toolbar"><div class="toolbar-title">KIND列表</div><div class="toolbar-tip">示例数据</div></div>
      <div class="table-wrap"><table><thead id="tableHead"></thead><tbody id="messageRows"></tbody></table></div>
      <div class="pagination"><span id="totalText"></span><button class="page-btn" id="prev" aria-label="上一页">‹</button><span class="page-btn active" id="pageNumber">1</span><button class="page-btn" id="next" aria-label="下一页">›</button><span>10条/页</span></div>
    </section>
  </main>
  <div class="overlay" id="detailOverlay" aria-hidden="true"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="detailTitle"><header class="dialog-header"><div class="dialog-title" id="detailTitle">消息详情</div><button class="dialog-close" id="closeDialog" aria-label="关闭">×</button></header><div class="dialog-body" id="detailBody" style="line-height:1.9;white-space:pre-wrap"></div><footer class="dialog-footer"><button class="btn btn-primary" id="confirmDialog">关闭</button></footer></section></div>
  <style>.page-btn:disabled{opacity:.45;cursor:not-allowed}td{overflow-wrap:anywhere}.brand-logo{flex-shrink:0}.nav-primary-link{padding-left:11px}.user{margin-left:18px}</style>
  <script src="./assets/user-messages.js"></script>
</body></html>
'''
    record=kind=='消息记录'
    body=body.replace('KIND',kind).replace('FIRST','' if record else 'active').replace('SECOND','active' if record else '').replace('STATUSLABEL','阅读状态' if record else '消息状态').replace('OPTIONS','<option>已读</option><option>未读</option>' if record else '<option>已发送</option><option>草稿</option>')
    (root/f'0910-{kind}.html').write_text(h+body,encoding='utf-8')
print('Updated 8 admin menus; created 2 user list pages.')
