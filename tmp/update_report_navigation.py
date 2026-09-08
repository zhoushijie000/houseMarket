from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
for p in root.glob('*.html'):
    raw=p.read_bytes(); s=raw.decode('utf-8')
    pattern=r'<button class="nav-menu-link" type="button"(?: data-placeholder-menu)?>内容管理</button>\s*<a class="nav-menu-link(?: active)?" href="\./0902-项目报告管理.html"(?: aria-current="page")? style="padding-left:32px">项目报告</a>'
    active=p.name=='0902-项目报告管理.html'
    link='<a class="nav-menu-link'+(' active' if active else '')+'" href="./0902-项目报告管理.html"'+(' aria-current="page"' if active else '')+'>内容管理</a>'
    updated,count=re.subn(pattern,lambda m:link,s)
    if active:
        updated=updated.replace('<title>项目报告管理</title>','<title>内容管理 - 项目报告</title>')
        updated=updated.replace('display: grid; grid-template-columns: 312px minmax(780px, 1fr); gap: 12px;', 'display: block;')
        updated=re.sub(r'    <aside class="org-panel">[\s\S]*?</aside>\s*', '',updated,count=1)
        updated=updated.replace('<div class="workspace-tab">内容管理</div><div class="workspace-tab active">项目报告 <span class="close">×</span></div>', '<div class="workspace-tab active">内容管理 <span class="close">×</span></div>')
        updated=updated.replace('<section class="report-main">', '<section class="report-main">\n      <div class="content-tabs" role="tablist" aria-label="内容管理">\n        <button class="content-tab is-active" type="button" role="tab" id="projectReportTab" aria-selected="true" aria-controls="projectReportPanel">项目报告</button>\n      </div>\n      <div id="projectReportPanel" role="tabpanel" aria-labelledby="projectReportTab">',1)
        updated=updated.replace('    </section>\n  </main>', '      </div>\n    </section>\n  </main>',1) if '\r\n' not in s else updated.replace('    </section>\r\n  </main>', '      </div>\r\n    </section>\r\n  </main>',1)
        updated=updated.replace('    .report-main { min-width: 0; }', '''    .report-main { min-width: 0; }
    .content-tabs { display: flex; align-items: center; min-height: 54px; padding: 0 20px; background: #fff; border-bottom: 1px solid var(--border-light); }
    .content-tab { align-self: stretch; padding: 0 8px; color: var(--regular); background: transparent; border: 0; border-bottom: 2px solid transparent; }
    .content-tab.is-active { color: var(--primary); border-bottom-color: var(--primary); font-weight: 600; }
    .content-tab:focus-visible { outline: 2px solid var(--primary); outline-offset: -4px; }''')
        updated=updated.replace('min-height: calc(100vh - 232px)', 'min-height: calc(100vh - 286px)')
    if updated!=s:
        p.write_bytes(updated.encode('utf-8'));print(p.name,count)
