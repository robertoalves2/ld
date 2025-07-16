import { NextResponse } from "next/server"

export async function GET() {
  const htmlContent = `<!DOCTYPE html><html lang=\"pt-BR\"><head><meta charset=\"UTF-8\"><meta name=\"description\" content=\"Lectio Divina do Evangelho do Dia. Ideal para orações diárias e reflexão católica.\"><meta name=\"keywords\" content=\"liturgia diária, liturgia da diária, evangelho do dia, evangelho de hoje, liturgia de hoje, evangelho dia, evangelho, lectio divina, evangelho do dia de hoje, o evangelho de hoje, liturgia diaria hoje, liturgia diária hoje, liturgia diaria de hoje, divina lectio, divino lectio, evangelho de hoje do dia, evangelho dia de hoje, liturgia do dia de hoje, evangelho do dia comentado, liturgia diária comentada de hoje, evangelho no lar, liturgia do ordinário, liturgia diaria comentada, o evangelho do dia, lectio divina de hoje, evangelho hoje, evangelho do lar\"><meta name=\"author\" content=\"Liturgia Diária\"><title>Evangelho do Dia e Lectio Divina - Liturgia Diária</title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"canonical\" href=\"https://liturgiadiaria.top/\" /><link rel=\"sitemap\" type=\"application/xml\" title=\"Sitemap\" href=\"/sitemap.xml\" /><script defer data-domain=\"liturgiadiaria.top\" src=\"https://plausible.io/js/plausible.js\"></script><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin><link href=\"https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Roboto:wght@400;500;700&display=swap\" rel=\"stylesheet\"><style>
:root {
  --primary: #6a1b9a;
  --background-light: #f4f4f4;
  --text-dark: #333333;
  --text-light-gray: #888888;
  --card-background: #ffffff;
  --shadow-light: rgba(0,0,0,0.05);
  --shadow-medium: rgba(0,0,0,0.1);
}
body {
  font-family: 'Open Sans', sans-serif;
  background-color: var(--background-light);
  color: var(--text-dark);
  max-width: 800px;
  margin: auto;
  padding: 2em;
  line-height: 1.6;
}
h1, h2, h3, h4, h5, h6 {
  font-family: 'Roboto', sans-serif;
  color: var(--text-dark);
}
h1 {
  text-align: center;
  margin-top: 0;
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
a {
  color: var(--primary);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.625rem 0.9375rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease-in-out;
}
button:hover {
  background-color: #4a126b;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
#evangelho {
  background: var(--card-background);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px var(--shadow-light), 0 2px 4px -2px var(--shadow-light);
}
#evangelho h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
#evangelho h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary);
}
#evangelho p {
  margin-bottom: 1rem;
  line-height: 1.75;
}
#evangelho strong {
  font-weight: 600;
}
footer {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.875em;
  color: var(--text-light-gray);
}
#nav-botoes {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}
.social-links {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-dark);
}
.social-links p {
  margin-bottom: 0.5rem;
}
.social-links a {
  margin: 0 0.5rem;
}
.banner-container {
  margin-top: 2rem;
  text-align: center;
}
.banner-container img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 var(--shadow-light), 0 1px 1px -1px var(--shadow-light);
  margin: auto;
}  </style></head><body>  <main>    <h1 id=\"titulo\">Carregando...</h1>    <div id=\"nav-botoes\">      <button onclick=\"navegar(-1)\" id=\"anterior\">&larr; Dia anterior</button>    </div>    <div id=\"evangelho\">Carregando...</div>    <div style=\"margin-top: 1.5rem; text-align: center\">      <button onclick=\"compartilhar()\">Compartilhar</button>    </div>    <div class=\"social-links\">      <p>Siga nossas redes sociais:</p>      <p>        <a href=\"https://link.liturgiadiaria.top/telegram-liturgiadiariachatbot\" target=\"_blank\" rel=\"noopener noreferrer\">Telegram</a> |        <a href=\"https://link.liturgiadiaria.top/youtube-liturgiadadiaria\" target=\"_blank\" rel=\"noopener noreferrer\">YouTube</a> |        <a href=\"https://link.liturgiadiaria.top/instagram-liturgiadadiaria\" target=\"_blank\" rel=\"noopener noreferrer\">Instagram</a> |        <a href=\"https://link.liturgiadiaria.top/whatsapp-canal-liturgia\" target=\"_blank\" rel=\"noopener noreferrer\">WhatsApp</a> |        <a href=\"https://link.liturgiadiaria.top/facebook-liturgiadiaria\" target=\"_blank\" rel=\"noopener noreferrer\">Facebook</a>      </p>    </div>    <div class=\"banner-container\">      <a href=\"https://link.liturgiadiaria.top/ofertas-exclusivas-tecinova\" target=\"_blank\" rel=\"noopener noreferrer\">        <img src=\"https://liturgiadiaria.top/banner-ofertas-exclusivas.webp\" alt=\"Confira ofertas exclusivas\" />      </a>    </div>    <footer>      Fonte: aliturgia.com<br>      <a href=\"https://liturgiadiaria.top/\" target=\"_blank\" rel=\"noopener noreferrer\">&copy; 2025 Liturgia Diária - Todos os direitos reservados</a>    </footer>  </main>  <script>    let indexAtual = 0;    let postsSummary = [];    let currentPostContent = null;    let loadingSummary = true;    let loadingContent = false;    let error = null;    const PROXY_URL = \"https://api.allorigins.win/get?url=\";    const FEED_URL = \"https://aliturgia.com/feed/\";    const CACHE_KEY_SUMMARY = \"lectio_rss_summary\";    const CACHE_KEY_PREFIX_CONTENT = \"lectio_post_content_\";    const CACHE_EXPIRATION_SUMMARY_MS = 60 * 60 * 1000;    const CACHE_EXPIRATION_CONTENT_MS = 24 * 60 * 60 * 1000;    const tituloEl = document.getElementById(\"titulo\");    const evangelhoEl = document.getElementById(\"evangelho\");
    const anteriorBtn = document.getElementById(\"anterior\");
    const compartilharBtn = document.querySelector(\"button[onclick=\\\"compartilhar()\\\"]\");    function updateUI() {
      console.log(\"updateUI called.\");
      const titulo = loadingSummary || !currentPostContent
        ? \"Carregando...\"
        : currentPostContent.title || \"Evangelho do Dia e Lectio Divina\";
      tituloEl.textContent = titulo;
      if (loadingSummary || loadingContent) {
        evangelhoEl.innerHTML = \"<p>Carregando conteúdo...</p>\";
      } else if (error) {
        evangelhoEl.innerHTML = \"<p style=\\\"color: red;\\\">\" + error + \"</p>\";
      } else if (currentPostContent) {
        evangelhoEl.innerHTML = currentPostContent.content;
      } else {
        evangelhoEl.innerHTML = \"<p>Nenhum conteúdo disponível.</p>\";
      }
      anteriorBtn.disabled = indexAtual === 0 || loadingSummary || loadingContent;
      compartilharBtn.disabled = !currentPostContent;
    }    async function fetchPostsSummary() {
      loadingSummary = true;
      error = null;
      updateUI();
      try {
        const cachedData = localStorage.getItem(CACHE_KEY_SUMMARY);
        if (cachedData) {
          const { timestamp, data } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_EXPIRATION_SUMMARY_MS) {
            postsSummary = data;
            console.log(\"Lista de posts carregada do cache.\");
            loadingSummary = false;
            updateUI();
            if (postsSummary.length > 0) {
              fetchAndDisplayPostContent(postsSummary[indexAtual]);
            }
            return;
          }
        }
      } catch (e) {
        console.warn(\"Erro ao ler cache da lista de posts:\", e);
        localStorage.removeItem(CACHE_KEY_SUMMARY);
      }
      try {
        const feedRes = await Promise.race([
          fetch(PROXY_URL + encodeURIComponent(FEED_URL)),
          new Promise((_, reject) => setTimeout(() => reject(new Error(\"Timeout fetching feed summary\")), 15000))
        ]);

        if (!feedRes.ok) {
          throw new Error(\"Falha ao carregar a lista de posts: \" + feedRes.statusText);
        }
        const feedData = await feedRes.json();
        const xmlContent = feedData.contents;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, \"application/xml\");

        postsSummary = [...xmlDoc.querySelectorAll(\"item\")].map(item => ({
          title: item.querySelector(\"title\")?.textContent || \"\",
          link: item.querySelector(\"link\")?.textContent || \"\"
        }));

        try {
          localStorage.setItem(CACHE_KEY_SUMMARY, JSON.stringify({ timestamp: Date.now(), data: postsSummary }));
          console.log(\"Lista de posts armazenada no cache.\");
        } catch (e) {
          console.warn(\"Erro ao armazenar lista de posts no cache:\", e);
        }
        indexAtual = 0;
      } catch (err) {
        console.error(\"Erro ao buscar posts:\", err);
        error =
          \"Erro ao carregar a lista de posts. Tente novamente mais tarde. Detalhes: \" +
          (err instanceof Error ? err.message : String(err));
      } finally {
        loadingSummary = false;
        updateUI();
        if (postsSummary.length > 0) {
          fetchAndDisplayPostContent(postsSummary[indexAtual]);
        } else {
          if (!error) {
            error = \"Nenhum post encontrado ou carregado.\";
          }
          updateUI();
        }
      }
    }
    async function fetchAndDisplayPostContent(post) {
      loadingContent = true;
      error = null;
      currentPostContent = null;
      updateUI();
      const contentCacheKey = CACHE_KEY_PREFIX_CONTENT + btoa(post.link);
      try {
        const cachedData = localStorage.getItem(contentCacheKey);
        if (cachedData) {
          const { timestamp, content } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_EXPIRATION_CONTENT_MS) {
            currentPostContent = { ...post, content };
            console.log(\"Conteúdo do post \\\"\" + post.title + \"\\\" carregado do cache.\");
            loadingContent = false;
            updateUI();
            return;
          }
        }
      } catch (e) {
        console.warn(\"Erro ao ler cache do post \\\"\" + post.title + \"\\\":\", e);
        localStorage.removeItem(contentCacheKey);
      }
      try {
        const proxiedUrl = PROXY_URL + encodeURIComponent(post.link);
        const res = await Promise.race([
          fetch(proxiedUrl),
          new Promise((_, reject) => setTimeout(() => reject(new Error(\"Timeout fetching post content\")), 15000)),
        ]);
        const data = await res.json();
        const postDoc = new DOMParser().parseFromString(data.contents, \"text/html\");
        const article = postDoc.querySelector(\"article\");
        let content = \"Conteúdo não encontrado.\";
        if (article) {
          const nodes = [...article.querySelectorAll(\"h2, h3, strong, p\")];
          const startIndex = nodes.findIndex((n) => /^Evangelho/i.test(n.textContent?.trim() || \"\"));
          if (startIndex !== -1) {
            let recorteHTML = \"\";
            const textoUsado = new Set();
            for (let i = startIndex; i < nodes.length; i++) {
              const texto = nodes[i].textContent?.trim() || \"\";
              if (!texto || textoUsado.has(texto)) continue;
              if (/Share:|Partilhar:/i.test(texto)) break;
              if (
                /^compreender a palavra$|^meditar a palavra$|^rezar a palavra$|^compromisso$|^compromisso semanal$/i.test(
                  texto,
                )
              )
                continue;
              recorteHTML += nodes[i].outerHTML;
              textoUsado.add(texto);
            }
            content = recorteHTML
              .replace(/(<[^>]*>\\s*)?(compreender a palavra)(\\s*<[^>]*>)?/gi, \"<h3> Compreender a Palavra</h3>\")
              .replace(/(<[^>]*>\\s*)?(meditar a palavra)(\\s*<[^>]*>)?/gi, \"<h3> Meditar a Palavra</h3>\")
              .replace(/(<[^>]*>\\s*)?(rezar a palavra)(\\s*<[^>]*>)?/gi, \"<h3> Rezar a Palavra</h3>\")
              .replace(/(<[^>]*>\\s*)?(compromisso)(\\s*<[^>]*>)?/gi, \"<h3> Compromisso</h3>\")
              .replace(/(<[^>]*>\\s*)?(compromisso semanal)(\\s*<[^>]*>)?/gi, \"<h3> Compromisso Semanal</h3>\");
          }
        }
        currentPostContent = { ...post, content };
        try {
          localStorage.setItem(contentCacheKey, JSON.stringify({ timestamp: Date.now(), content: content }));
          console.log(\"Conteúdo do post \\\"\" + post.title + \"\\\" armazenado no cache.\");
        } catch (e) {
          console.warn(\"Erro ao armazenar conteúdo do post \\\"\" + post.title + \"\\\" no cache:\", e);
        }
      } catch (e) {
        console.error(\"Erro ao carregar o conteúdo do post:\", e);
        error = \"Erro ao carregar o conteúdo do post. Detalhes: \" + (e instanceof Error ? e.message : String(e));
        currentPostContent = null;
      } finally {
        loadingContent = false;
        updateUI();
      }
    }
    function navegar(delta) {
      const novoIndex = indexAtual + delta;
      if (novoIndex >= 0 && novoIndex < postsSummary.length) {
        indexAtual = novoIndex;
        updateUI();
        fetchAndDisplayPostContent(postsSummary[indexAtual]);
      }
    }
    function compartilhar() {
      if (!currentPostContent) return;
      const titulo = currentPostContent.title;
      const tempDiv = document.createElement(\"div\");
      tempDiv.innerHTML = currentPostContent.content;
      const conteudo = tempDiv.innerText;
      const texto = \"📖 *\" + titulo + \"*\\n\\n\" + conteudo
        .replace(/Compreender a Palavra/gi, \"💡 Compreender a Palavra\")
        .replace(/Meditar a Palavra/gi, \"🧠 Meditar a Palavra\")
        .replace(/Rezar a Palavra/gi, \"🙏 Rezar a Palavra\")
        .replace(/Compromisso/gi, \"📌 Compromisso\")
        .replace(/Compromisso Semanal/gi, \"📌 Compromisso Semanal\");
      const fallback = () => {
        navigator.clipboard
          .writeText(texto)
          .then(() => alert(\"📋 Conteúdo copiado para a área de transferência!\"))
          .catch(() => alert(\"Não foi possível copiar. Copie manualmente.\"));
      };
      if (window.isSecureContext && navigator.canShare && navigator.canShare({ text: texto })) {
        navigator
          .share({
            title: titulo,
            text: texto,
            url: location.href,
          })
          .catch(fallback);
      } else {
        fallback();
      }
    }
    window.addEventListener(\"DOMContentLoaded\", fetchPostsSummary);
  </script></body></html>`

  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
