import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const res = await fetch("https://aliturgia.com/feed/");
const rss = await res.text();

// Aqui virá o conteúdo real extraído do post do dia
const fakeContent = `
<h1 id="titulo">📖 Evangelho do Dia</h1>
<div id="evangelho">
  <h3>Evangelho Mt 10, 24-33</h3>
  <p>Naquele tempo, disse Jesus aos seus apóstolos: ...</p>
  <h3>💡 Compreender a Palavra</h3>
  <p>...</p>
  <h3>🪔 Meditar a Palavra</h3>
  <p>...</p>
  <h3>🙏 Rezar a Palavra</h3>
  <p>...</p>
  <h3>📌 Compromisso</h3>
  <p>...</p>
</div>
`;

fs.writeFileSync(path.join("public", "lectio", "evangelho.html"), fakeContent);
