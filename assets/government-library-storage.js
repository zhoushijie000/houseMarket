(() => {
  const databaseName = 'houseMarket.governmentLibrary';
  const chengduFolderId = 'sample-work-materials';
  const chengduFolderName = '走进成都';
  const workbookName = '甘孜团购推介会备选项目表-武侯区.xlsx';
  const chengduWorkbook = {
    path: workbookName,
    size: 13343,
    districts: ['武侯区'],
    assetUrl: './assets/government-library/' + encodeURIComponent(workbookName)
  };
  const seedTime = Date.parse('2026-11-23T09:15:00+08:00');
  const sampleText = (text, type = 'text/plain') => new Blob(['\uFEFF', text], { type: type + ';charset=utf-8' });
  const samples = [
    {
      id: chengduFolderId,
      name: chengduFolderName,
      folder: true,
      districts: ['锦江区', '武侯区', '成华区'],
      files: [
        { path: '材料整理说明.txt', blob: sampleText('区市县工作资料（演示）\r\n请按业务分类整理文件，并在报送前核对文件名与版本。\r\n') },
        { path: '填报模板/材料清单.csv', blob: sampleText('序号,材料名称,更新时间,备注\r\n1,工作情况说明,,\r\n', 'text/csv') }
      ]
    },
    {
      id: 'sample-jinjiang',
      name: '锦江区材料报送清单（示例）.csv',
      districts: ['锦江区'],
      files: [{ path: '锦江区材料报送清单（示例）.csv', blob: sampleText('序号,材料,是否已准备\r\n1,材料目录,\r\n2,工作情况说明,\r\n', 'text/csv') }]
    },
    {
      id: 'sample-wuhou',
      name: '武侯区工作联系单（示例）.txt',
      districts: ['武侯区'],
      files: [{ path: '武侯区工作联系单（示例）.txt', blob: sampleText('武侯区工作联系单（演示）\r\n事项名称：\r\n办理进度：\r\n备注：\r\n') }]
    }
  ];

  function queueUpload(transaction, entry) {
    const fileStore = transaction.objectStore('files');
    const files = entry.files.map(({ path, blob }) => {
      fileStore.add({ entryId: entry.id, path, blob });
      return { path, size: blob.size };
    });
    transaction.objectStore('entries').add({ ...entry, files });
  }

  function addChengduWorkbook(transaction) {
    const store = transaction.objectStore('entries');
    const request = store.get(chengduFolderId);
    request.onsuccess = () => {
      const folder = request.result;
      if (!folder) return;
      folder.name = chengduFolderName;
      if (!folder.files.some(file => file.path === workbookName)) folder.files.push(chengduWorkbook);
      store.put(folder);
    };
  }

  let connection;
  function open() {
    connection ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 2);
      request.onupgradeneeded = event => {
        const database = request.result;
        if (event.oldVersion === 0) {
          database.createObjectStore('entries', { keyPath: 'id' });
          database.createObjectStore('files', { keyPath: ['entryId', 'path'] });
          samples.forEach((sample, index) => queueUpload(request.transaction, { ...sample, uploadedAt: seedTime - index * 420000 }));
        }
        addChengduWorkbook(request.transaction);
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          connection = undefined;
        };
        resolve(database);
      };
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  async function run(stores, mode, work) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(stores, mode);
      let result;
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(transaction.error || new Error('数据库操作已取消'));
      try {
        work(transaction, value => { result = value; });
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    });
  }

  function list() {
    return run('entries', 'readonly', (transaction, setResult) => {
      const request = transaction.objectStore('entries').getAll();
      request.onsuccess = () => setResult(request.result);
    });
  }

  function upload(entries) {
    return run(['entries', 'files'], 'readwrite', transaction => {
      entries.forEach(entry => queueUpload(transaction, entry));
    });
  }

  function changeScope(id, districts, path) {
    return run('entries', 'readwrite', (transaction, setResult) => {
      const store = transaction.objectStore('entries');
      const request = store.get(id);
      request.onsuccess = () => {
        const entry = request.result;
        if (!entry || (path && !entry.files.some(file => file.path === path))) return setResult(false);
        if (path) {
          entry.files = entry.files.map(file => file.path === path ? { ...file, districts } : file);
        } else {
          entry.districts = districts;
        }
        store.put(entry);
        setResult(true);
      };
    });
  }

  function download(id, path, district) {
    return run(['entries', 'files'], 'readonly', (transaction, setResult) => {
      const request = transaction.objectStore('entries').get(id);
      request.onsuccess = () => {
        const entry = request.result;
        const metadata = entry?.files.find(file => file.path === path);
        if (!metadata || (district && !(metadata.districts || entry.districts).includes(district))) return;
        if (metadata.assetUrl) return setResult({ url: metadata.assetUrl });
        const file = transaction.objectStore('files').get([id, path]);
        file.onsuccess = () => {
          if (file.result) setResult({ blob: file.result.blob });
        };
      };
    });
  }

  window.governmentLibraryStorage = { list, upload, changeScope, download, chengduFolderId };
})();
