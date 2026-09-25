(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const c=["Ancient world","AI engineering","Developer tools","Games"],d=document.getElementById("app");function a(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function l(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function u(){const e=l()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const n=document.getElementById("theme-toggle");n&&(n.textContent=e==="dark"?"☀️ Light":"☽ Dark")}function p(e,n){const o=c.indexOf(e),r=c.indexOf(n);return o===-1&&r===-1?e.localeCompare(n):o===-1?1:r===-1?-1:o-r}function m(e){const n="/officina/",o=[`<a href="${a(e.repoUrl)}">Source</a>`];return e.demoUrl&&o.unshift(`<a href="${a(e.demoUrl)}">Live demo</a>`),`
    <li class="card">
      <div class="card-thumb">
        <img src="${n}${e.thumbnail}" alt="${a(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${a(e.group)}</span>
        <h3 class="card-name">${a(e.name)}</h3>
        <p class="card-desc">${a(e.description)}</p>
        <div class="card-links">${o.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function g(e){const n=e.filter(t=>t.status==="published"),o=new Map;for(const t of n){const s=o.get(t.group)??[];s.push(t),o.set(t.group,s)}return[...o.keys()].sort(p).map(t=>`
    <section class="group">
      <div class="group-header">
        <span class="group-title">${a(t)}</span>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid">
        ${o.get(t).map(m).join("")}
      </ul>
    </section>
  `).join("")}async function f(){const e="/officina/";d.innerHTML=`
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">
      ${l()==="dark"?"☀️ Light":"☽ Dark"}
    </button>
    <header class="masthead">
      <div class="wrap">
        <h1 class="wordmark">Officina<span class="dot">&middot;</span></h1>
        <p class="tagline">open-source tools by Anton Soloviev</p>
        <div class="rule"><span class="lozenge"></span></div>
        <p class="intro">
          AI/ML engineer in San Francisco. Small, focused tools, built and documented in the open.
        </p>
        <p class="contact-line">
          <a href="mailto:anton@praviel.com">anton@praviel.com</a>
          <span>&middot;</span>
          <a href="https://github.com/antonsoo">github.com/antonsoo</a>
          <span>&middot;</span>
          <a href="https://praviel.com">praviel.com</a>
        </p>
      </div>
    </header>
    <main class="wrap" id="groups">
      <p class="intro" style="text-align:center">Loading&hellip;</p>
    </main>
    <footer>
      <div class="wrap">MIT-licensed. Source for this page: <a href="https://github.com/antonsoo/officina">github.com/antonsoo/officina</a></div>
    </footer>
  `,document.getElementById("theme-toggle").addEventListener("click",u);const n=document.getElementById("groups");try{const o=await fetch(`${e}projects.json`);if(!o.ok)throw new Error(`${o.status} ${o.statusText}`);const r=await o.json();n.innerHTML=g(r)}catch(o){n.innerHTML=`<p class="intro" style="text-align:center">Couldn't load the project list (${a(String(o instanceof Error?o.message:o))}). Try <a href="https://github.com/antonsoo">github.com/antonsoo</a> directly.</p>`}}f();
//# sourceMappingURL=index-CCVhIYRN.js.map
