const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

(async () => {
  const res = await fetch("https://aliturgia.com/feed/");
  const rss = await res.text();

  // Aqui você colocaria o scraping real
  const fakeContent = `<h1>Evangelho carregado</h1><div>Conteúdo real virá aqui.</div>`;

  fs.writeFileSync(path.join("public", "lectio", "evangelho.html"), fakeContent);
})();
