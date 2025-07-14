import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const FEED_URL = "https://aliturgia.com/feed/";

async function buscarPostDoDia() {
  const res = await fetch("https://api.allorigins.win/get?url=" + encodeURIComponent(FEED_URL));
  const data = await res.json();
  const dom = new JSDOM(data.contents, { contentType: "text/xml" });
  const items = [...dom.window.document.querySelectorAll("item")];

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (const item of items) {
    const pubDate = new Date(item.querySelector("pubDate").textContent);
    pubDate.setHours(0, 0, 0, 0);

    if (pubDate <= hoje) {
      const title = item.querySelector("title").textContent;
      const link = item.querySelector("link").textContent;
      return { title, link };
    }
  }

  throw new Error("Nenhum post correspondente ao dia encontrado.");
}

async function extrairConteudo(link) {
  const proxied = "https://api.allorigins.win/get?url=" + encodeURIComponent(link);
  const res = await fetch(proxied);
  const data = await res.json();
  const dom = new JSDOM(data.contents);
  const article = dom.window.document.querySelector("article");

  if (!article) throw new Error("Artigo não encontrado.");

  const nodes = [...article.querySelectorAll("h2, h3, strong, p")];
  const startIndex = nodes.findIndex(n => /^Evangelho/i.test(n.textContent.trim()));
  if (startIndex === -1) throw new Error("'Evangelho' não encontrado");

  let html = "";
  const textoUsado = new Set();

  for (let i = startIndex; i < nodes.length; i++) {
    const texto = nodes[i].textContent.trim();
    if (!texto || textoUsado.has(texto)) continue;
    if (/Share:|Partilhar:/i.test(texto)) break;
    if (/^compreender a palavra$/i.test(texto)) {
      html += "<h3>💡 Compreender a Palavra</h3>"; continue;
    }
    if (/^meditar a palavra$/i.test(texto)) {
      html += "<h3>🪔 Meditar a Palavra</h3>"; continue;
    }
    if (/^rezar a palavra$/i.test(texto)) {
      html += "<h3>🙏 Rezar a Palavra</h3>"; continue;
    }
    if (/^compromisso$/i.test(texto)) {
      html += "<h3>📌 Compromisso</h3>"; continue;
    }

    html += nodes[i].outerHTML;
    textoUsado.add(texto);
  }

  return html;
}

(async () => {
  try {
    const post = await buscarPostDoDia();
    const conteudo = await extrairConteudo(post.link);

    const finalHtml = `
<h1 id="titulo">${post.title}</h1>
<div id="nav-botoes">
  <button onclick="void(0)" disabled>&larr; Dia anterior</button>
</div>
<div id="evangelho">
  ${conteudo}
</div>`;

    fs.writeFileSync(path.join("public", "lectio", "evangelho.html"), finalHtml);
    console.log("✅ evangelho.html atualizado com sucesso");
  } catch (e) {
    console.error("❌ Erro:", e.message);
  }
})();