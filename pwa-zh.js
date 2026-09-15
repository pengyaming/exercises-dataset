(() => {
  const translations = {
    'Category': '身体部位',
    'Equipment': '器械',
    'Target Muscle': '目标肌肉',
    'All': '全部',
    'body weight': '徒手',
    'dumbbell': '哑铃',
    'barbell': '杠铃',
    'cable': '绳索',
    'band': '弹力带',
    'kettlebell': '壶铃',
    'weighted': '负重',
    'stability ball': '健身球',
    'upper arms': '上臂',
    'upper legs': '大腿',
    'lower arms': '前臂',
    'lower legs': '小腿',
    'back': '背部',
    'waist': '腰腹',
    'chest': '胸部',
    'shoulders': '肩部',
    'cardio': '有氧',
    'neck': '颈部',
    'abs': '腹肌',
    'biceps': '肱二头肌',
    'triceps': '肱三头肌',
    'glutes': '臀肌',
    'quads': '股四头肌',
    'hamstrings': '腘绳肌',
    'calves': '小腿肌',
    'pectorals': '胸肌',
    'delts': '三角肌',
    'forearms': '前臂肌',
    'lats': '背阔肌'
  };

  function translateText(root) {
    root.querySelectorAll('.filter-summary, .filter-chip, .active-filter-chip, .meta-chip-label, .modal-muscles-label, .muscles-group-label').forEach(el => {
      const key = el.textContent.trim();
      if (translations[key] && el.textContent !== translations[key]) el.textContent = translations[key];
    });

    const count = root.getElementById('results-count');
    if (count) count.textContent = count.textContent
      .replace(/exercises?/i, '个动作')
      .replace(/results?/i, '个结果');

    const labels = {
      'Body Part': '身体部位',
      'Target': '目标肌肉',
      'Muscles': '参与肌肉',
      'Primary': '主要',
      'Secondary': '辅助',
      'Instructions': '动作步骤'
    };
    root.querySelectorAll('.meta-chip-label, .modal-muscles-label, .muscles-group-label, .modal-instructions-label').forEach(el => {
      const key = el.textContent.trim();
      if (labels[key]) el.textContent = labels[key];
    });
  }

  function localize() {
    const frame = document.querySelector('iframe');
    const doc = frame.contentDocument;
    if (!doc) return;

    doc.documentElement.lang = 'zh-CN';
    doc.title = '健身动作库';

    const search = doc.getElementById('search');
    if (search) search.placeholder = '搜索动作名称…';

    const clear = doc.getElementById('search-clear');
    if (clear) clear.setAttribute('aria-label', '清除搜索');

    const setup = doc.querySelector('.db-setup-btn');
    if (setup) {
      const svg = setup.querySelector('svg');
      setup.textContent = '数据库';
      if (svg) setup.prepend(svg);
    }

    translateText(doc);

    const observer = new MutationObserver(() => {
      translateText(doc);
      const overlay = doc.getElementById('modal-overlay');
      if (!overlay || !overlay.classList.contains('open')) return;
      const chineseTab = [...doc.querySelectorAll('.lang-tab')]
        .find(tab => tab.textContent.trim() === '简体中文');
      if (chineseTab && !chineseTab.classList.contains('active')) chineseTab.click();
    });
    observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
  }

  const frame = document.querySelector('iframe');
  frame.addEventListener('load', localize);
})();