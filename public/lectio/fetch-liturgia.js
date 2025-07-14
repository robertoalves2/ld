const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const res = await fetch("https://aliturgia.com/feed/");
  const rss = await res.text();
  // Aqui você faria o parse, scraping do artigo e salvaria como HTML
  const fakeContent = `<h1>Evangelho carregado</h1><div>Conteúdo real virá aqui.</div>`;
  fs.writeFileSync("evangelho.html", fakeContent);
})();
