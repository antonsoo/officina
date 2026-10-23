(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const w=["Ancient world","AI engineering","Developer tools","Games"];function y(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function f(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function g(e,r){const s=f(e,r),a=new URL(s);if(a.protocol!=="https:"||a.username||a.password||s!==s.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return s}function L(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((s,a)=>{const t=y(s,`Project ${a+1}`),o=f(t.name,"name"),c=o.trim().toLowerCase();if(r.has(c))throw new Error(`Duplicate project name: ${o}`);r.add(c);const h=f(t.thumbnail,`${o}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(h))throw new Error(`${o}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${o}.status must be published or soon`);const p={name:o,description:f(t.description,`${o}.description`),group:f(t.group,`${o}.group`),repoUrl:g(t.repoUrl,`${o}.repoUrl`),demoUrl:t.demoUrl===null?null:g(t.demoUrl,`${o}.demoUrl`),thumbnail:h,status:t.status};if(t.spaceUrl!==void 0&&(p.spaceUrl=g(t.spaceUrl,`${o}.spaceUrl`)),t.package!==void 0){const u=y(t.package,`${o}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${o}.package.registry must be PyPI, npm, or crates.io`);p.package={registry:u.registry,url:g(u.url,`${o}.package.url`)}}if(t.study!==void 0){const u=y(t.study,`${o}.study`),d=f(u.finding,`${o}.study.finding`);if(d.length>160)throw new Error(`${o}.study.finding must be at most 160 characters`);p.study={finding:d,url:g(u.url,`${o}.study.url`)}}return p})}function S(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,s)=>{const a=w.indexOf(r),t=w.indexOf(s);return a===-1&&t===-1?r.localeCompare(s):a===-1?1:t===-1?-1:a-t})}function $(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function k(e,r="",s=""){const a=$(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||s&&t.group!==s)return!1;const o=$([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??""].join(" "));return a.every(c=>o.includes(c))})}const A=document.getElementById("app");function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function U(){const e=b()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function T(e){const r="/officina/",s=[`<a href="${n(e.repoUrl)}">Source</a>`];return e.package&&s.unshift(`<a href="${n(e.package.url)}">${n(e.package.registry)}</a>`),e.spaceUrl&&s.unshift(`<a href="${n(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&s.unshift(`<a href="${n(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${n(e.name)}">
      <div class="card-thumb">
        <img src="${r}${n(e.thumbnail)}" alt="${n(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${n(e.group)}</span>
        <h3 class="card-name">${n(e.name)}</h3>
        <p class="card-desc">${n(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${n(e.study.url)}"><span class="study-label">Recorded evidence</span> ${n(e.study.finding)}</a></p>`:""}
        <div class="card-links">${s.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function q(e){const r=e.filter(a=>a.status==="published"),s=new Map;for(const a of r){const t=s.get(a.group)??[];t.push(a),s.set(a.group,t)}return S(r).map(a=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${n(a)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${s.get(a).map(T).join("")}
      </ul>
    </section>
  `).join("")}function P(e,r){const s=k(e);if(!s.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try traces, calendars, or logs" autocomplete="off" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
      </div>
      <div class="audiences" role="group" aria-label="Filter by audience">
        <button type="button" data-group="" aria-pressed="true">All tools <span>${s.length}</span></button>
        ${S(s).map(i=>`<button type="button" data-group="${n(i)}" aria-pressed="false">${n(i)} <span>${s.filter(l=>l.group===i).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Evidence links open the recorded source revision. Demos and registry packages may use a different version.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${q(s)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const a=r.querySelector("#tool-search"),t=r.querySelector("form"),o=[...r.querySelectorAll("[data-group]")],c=[...r.querySelectorAll("[data-project]")],h=[...r.querySelectorAll(".group")],p=r.querySelector(".result-count"),u=r.querySelector(".empty-results");let d="";const m=()=>{const i=new Set(k(s,a.value,d).map(l=>l.name));for(const l of c)l.hidden=!i.has(l.dataset.project);for(const l of h)l.hidden=!l.querySelector(".card:not([hidden])");for(const l of o)l.setAttribute("aria-pressed",String(l.dataset.group===d));p.textContent=`Showing ${i.size} of ${s.length} tools`,u.hidden=i.size!==0},v=()=>{a.value="",d="",m(),a.focus()};t.addEventListener("submit",i=>i.preventDefault()),t.addEventListener("reset",i=>{i.preventDefault(),v()}),a.addEventListener("input",m);for(const i of o)i.addEventListener("click",()=>{d=i.dataset.group,m()});r.querySelector("#show-all").addEventListener("click",v),m()}async function E(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const s=await fetch("/officina/projects.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);P(L(await s.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{E(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function j(){A.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${b()==="dark"?"light":"dark"} theme">
      ${b()==="dark"?"☀ Light":"☽ Dark"}
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
    <main class="wrap" id="catalogue" tabindex="-1"></main>
    <footer>
      <div class="wrap">MIT-licensed. Source for this page: <a href="https://github.com/antonsoo/officina">github.com/antonsoo/officina</a></div>
    </footer>
  `,document.getElementById("theme-toggle").addEventListener("click",U),await E(document.getElementById("catalogue"))}j();
//# sourceMappingURL=index-DfXOQABC.js.map
