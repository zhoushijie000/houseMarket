from pathlib import Path
p=Path(__file__).resolve().parents[1]/'0902-项目报告管理.html'
s=p.read_text(encoding='utf-8')
s=s.replace('项目/分期名称</th>','分期名称</th>').replace('Deepseek一句话总结','总结').replace('一句话总结','总结')
s=s.replace('<option value="已发布">已发布</option>','<option value="已发布">已发布</option><option value="未发布">未发布</option>')
s=s.replace('.status-published { color: #218762; background: #eaf8f2; }','.status-published { color: #218762; background: #eaf8f2; }\n    .status-unpublished { color: #909399; background: #f2f3f5; }')
s=s.replace('<button class="action-link preview-report" type="button">预览</button>','<button class="action-link toggle-report" type="button">取消发布</button>')
s=s.replace("const status = '已发布';", "const status = editingRow ? editingRow.dataset.status : '未发布';")
s=s.replace("statusCell.innerHTML = '<span class=\"status status-published\">已发布</span>';", "statusCell.innerHTML = reportStatusMarkup(status);")
s=s.replace('<td><span class="status status-published">已发布</span></td><td><button class="action-link edit-report" type="button">编辑</button><button class="action-link toggle-report" type="button">取消发布</button><button class="action-link danger delete-report" type="button">删除</button></td>`;', '<td>${reportStatusMarkup(status)}</td><td><button class="action-link edit-report" type="button">编辑</button><button class="action-link toggle-report" type="button">发布</button><button class="action-link danger delete-report" type="button">删除</button></td>`;')
s=s.replace("      notify('项目报告已保存并发布');", "      bindRowActions();\n      filterReports(false);\n      notify(status === '未发布' ? '项目报告已保存，可在列表中发布' : '项目报告已保存');")
s=s.replace("    function bindRowActions() {", """    function reportStatusMarkup(status) {
      return `<span class="status ${status === '已发布' ? 'status-published' : 'status-unpublished'}">${status}</span>`;
    }

    function bindRowActions() {""")
s=s.replace("      document.querySelectorAll('.preview-report').forEach(button => button.onclick = () => window.open('./0902-楼盘AI分析.html', '_blank'));", """      document.querySelectorAll('.toggle-report').forEach(button => {
        const row = button.closest('tr');
        button.textContent = row.dataset.status === '已发布' ? '取消发布' : '发布';
        button.onclick = () => {
          const nextStatus = row.dataset.status === '已发布' ? '未发布' : '已发布';
          if (nextStatus === '未发布' && !confirm('确定取消发布该项目报告吗？')) return;
          row.dataset.status = nextStatus;
          row.children[3].innerHTML = reportStatusMarkup(nextStatus);
          row.children[2].textContent = currentTime();
          button.textContent = nextStatus === '已发布' ? '取消发布' : '发布';
          filterReports(false);
          notify(nextStatus === '已发布' ? '项目报告已发布' : '项目报告已取消发布');
        };
      });""")
s=s.replace('function filterReports() {','function filterReports(showFeedback = true) {').replace("      notify('查询完成');", "      if (showFeedback) notify('查询完成');")
# Retain edited report content while changing publication status or reopening the editor.
s=s.replace("document.getElementById(id).value = value;", "document.getElementById(id).value = row.reportContent?.[id] ?? value;")
s=s.replace("      bindRowActions();\n      filterReports(false);", "      const savedRow = editingRow || document.getElementById('reportTableBody').firstElementChild;\n      savedRow.reportContent = Object.fromEntries(textFields.map(field => [field.id, field.value.trim()]));\n      bindRowActions();\n      filterReports(false);")
p.write_text(s,encoding='utf-8')
