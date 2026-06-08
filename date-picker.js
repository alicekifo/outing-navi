(function () {
  // ファイル名からベース名と現在日付を取得
  var path = window.location.pathname;
  var file = path.replace(/.*\//, '');
  var dateMatch = file.match(/_(\d{4}-\d{2}-\d{2})\.html$/);
  var curDate = dateMatch ? dateMatch[1] : null;
  var base = file.replace(/_\d{4}-\d{2}-\d{2}\.html$/, '').replace(/\.html$/, '');

  // CSS注入
  var style = document.createElement('style');
  style.textContent = '.dp-sel{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(235,235,245,0.7);border-radius:8px;padding:3px 10px;font-size:11px;cursor:pointer;display:none;font-family:inherit;}';
  document.head.appendChild(style);

  // 日付一覧を取得してセレクターを挿入
  fetch('./' + base + '_dates.json')
    .then(function (r) { return r.json(); })
    .then(function (dates) {
      if (dates.length <= 1) return;

      var sel = document.createElement('select');
      sel.className = 'dp-sel';
      sel.title = '過去の記事を見る';
      sel.addEventListener('change', function () {
        var v = this.value;
        window.location.href = './' + base + '_' + v + '.html';
      });

      dates.forEach(function (d) {
        var o = document.createElement('option');
        o.value = d;
        o.textContent = d;
        if (d === curDate || (!curDate && d === dates[0])) o.selected = true;
        sel.appendChild(o);
      });

      sel.style.display = 'inline-block';

      // ヘッダー内の適切な場所に挿入（back-link の直前）
      var hd = document.querySelector('.hd');
      var backLink = document.querySelector('.back-link');
      if (hd && backLink) {
        hd.insertBefore(sel, backLink);
      } else if (hd) {
        hd.appendChild(sel);
      }
    })
    .catch(function () {});
})();
