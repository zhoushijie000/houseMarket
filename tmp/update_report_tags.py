from pathlib import Path
p=Path(__file__).resolve().parents[1]/'0819-直播专区标签管理.html'
s=p.read_text(encoding='utf-8')
s=s.replace('<button class="segment active" data-type="live">直播专区</button>','<button class="segment active" data-type="live">直播专区</button>\n          <button class="segment" data-type="report">项目报告</button>')
s=s.replace("      legacy: {", "      reportTags: [],\n      legacy: {")
s=s.replace("live: '直播专区' };", "live: '直播专区', report: '项目报告' };")
s=s.replace("    function getRows() {", "    function editableTags() { return state.currentType === 'report' ? state.reportTags : state.liveTags; }\n\n    function getRows() {")
s=s.replace("state.currentType === 'live' ? state.liveTags : state.legacy[state.currentType]", "['live', 'report'].includes(state.currentType) ? editableTags() : state.legacy[state.currentType]")
s=s.replace("      const live = state.currentType === 'live';", "      const live = state.currentType === 'live';\n      const report = state.currentType === 'report';")
s=s.replace(': `<tr><th class="col-sort">排序</th><th>标签</th>', ': report ? `<tr><th class="col-sort">排序</th><th>标签名称</th><th class="col-time">创建时间</th><th class="col-action">操作</th></tr>` : `<tr><th class="col-sort">排序</th><th>标签</th>')
s=s.replace('${live ? 6 : 5}', '${live ? 6 : report ? 4 : 5}')
s=s.replace("      } else if (live) {", """      } else if (report) {
        $('#tableBody').innerHTML = rows.map(item => `<tr><td>${item.sort}</td><td class="tag-name">${escapeHtml(item.name)}</td><td>${item.createdAt}</td><td class="col-action"><button class="table-action" data-edit="${item.id}">编辑</button><button class="table-action danger" data-delete="${item.id}">删除</button></td></tr>`).join('');
      } else if (live) {""")
s=s.replace("$('#nameHelp').textContent = '建议使用2–6个汉字，用于小程序直播专区导航';", "$('#nameHelp').textContent = state.currentType === 'report' ? '建议使用2–6个汉字，用于项目报告类型分类' : '建议使用2–6个汉字，用于小程序直播专区导航';")
s=s.replace("$('#modalTitle').textContent = item ? '编辑直播专区标签' : '新增直播专区标签';", "$('#modalTitle').textContent = `${item ? '编辑' : '新增'}${typeNames[state.currentType]}标签`;\n      ['selectedFile', 'unselectedFile'].forEach(id => { $('#'+id).closest('.form-row').style.display = state.currentType === 'report' ? 'none' : ''; });")
s=s.replace('state.liveTags.some(', 'editableTags().some(').replace('state.liveTags.find(', 'editableTags().find(').replace('state.liveTags.push(', 'editableTags().push(')
s=s.replace('if (!state.selectedIcon)', "if (state.currentType === 'live' && !state.selectedIcon)").replace('if (!state.unselectedIcon)', "if (state.currentType === 'live' && !state.unselectedIcon)")
s=s.replace("if (!String(state.selectedIcon).startsWith('existing:'))", "if (state.currentType === 'live' && !String(state.selectedIcon).startsWith('existing:'))").replace("if (!String(state.unselectedIcon).startsWith('existing:'))", "if (state.currentType === 'live' && !String(state.unselectedIcon).startsWith('existing:'))")
s=s.replace("id: Date.now(), sort, name, icon: 'spark', createdAt: nowText(),\n          selectedData: state.selectedIcon, unselectedData: state.unselectedIcon", "id: Date.now(), sort, name, createdAt: nowText(),\n          ...(state.currentType === 'live' ? { icon: 'spark', selectedData: state.selectedIcon, unselectedData: state.unselectedIcon } : {})")
s=s.replace("if (state.currentType !== 'live')", "if (!['live', 'report'].includes(state.currentType))")
s=s.replace("state.liveTags = state.liveTags.filter(tag => tag.id !== item.id);", "if (state.currentType === 'report') state.reportTags = state.reportTags.filter(tag => tag.id !== item.id);\n          else state.liveTags = state.liveTags.filter(tag => tag.id !== item.id);")
p.write_text(s,encoding='utf-8')
