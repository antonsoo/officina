(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const v=["Ancient world","AI engineering","Developer tools","Games"];function w(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function p(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function m(e,r){const o=p(e,r),a=new URL(o);if(a.protocol!=="https:"||a.username||a.password||o!==o.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return o}function E(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((o,a)=>{const t=w(o,`Project ${a+1}`),s=p(t.name,"name"),c=s.trim().toLowerCase();if(r.has(c))throw new Error(`Duplicate project name: ${s}`);r.add(c);const f=p(t.thumbnail,`${s}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(f))throw new Error(`${s}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${s}.status must be published or soon`);const d={name:s,description:p(t.description,`${s}.description`),group:p(t.group,`${s}.group`),repoUrl:m(t.repoUrl,`${s}.repoUrl`),demoUrl:t.demoUrl===null?null:m(t.demoUrl,`${s}.demoUrl`),thumbnail:f,status:t.status};if(t.spaceUrl!==void 0&&(d.spaceUrl=m(t.spaceUrl,`${s}.spaceUrl`)),t.package!==void 0){const u=w(t.package,`${s}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${s}.package.registry must be PyPI, npm, or crates.io`);d.package={registry:u.registry,url:m(u.url,`${s}.package.url`)}}return d})}function S(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,o)=>{const a=v.indexOf(r),t=v.indexOf(o);return a===-1&&t===-1?r.localeCompare(o):a===-1?1:t===-1?-1:a-t})}function $(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function k(e,r="",o=""){const a=$(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||o&&t.group!==o)return!1;const s=$([t.name,t.description,t.group,t.package?.registry??""].join(" "));return a.every(c=>s.includes(c))})}const A=document.getElementById("app");function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function U(){const e=b()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function T(e){const r="/officina/",o=[`<a href="${i(e.repoUrl)}">Source</a>`];return e.package&&o.unshift(`<a href="${i(e.package.url)}">${i(e.package.registry)}</a>`),e.spaceUrl&&o.unshift(`<a href="${i(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&o.unshift(`<a href="${i(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${i(e.name)}">
      <div class="card-thumb">
        <img src="${r}${i(e.thumbnail)}" alt="${i(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${i(e.group)}</span>
        <h3 class="card-name">${i(e.name)}</h3>
        <p class="card-desc">${i(e.description)}</p>
        <div class="card-links">${o.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function q(e){const r=e.filter(a=>a.status==="published"),o=new Map;for(const a of r){const t=o.get(a.group)??[];t.push(a),o.set(a.group,t)}return S(r).map(a=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${i(a)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${o.get(a).map(T).join("")}
      </ul>
    </section>
  `).join("")}function j(e,r){const o=k(e);if(!o.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try traces, calendars, or logs" autocomplete="off" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
      </div>
      <div class="audiences" role="group" aria-label="Filter by audience">
        <button type="button" data-group="" aria-pressed="true">All tools <span>${o.length}</span></button>
        ${S(o).map(n=>`<button type="button" data-group="${i(n)}" aria-pressed="false">${i(n)} <span>${o.filter(l=>l.group===n).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${q(o)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const a=r.querySelector("#tool-search"),t=r.querySelector("form"),s=[...r.querySelectorAll("[data-group]")],c=[...r.querySelectorAll("[data-project]")],f=[...r.querySelectorAll(".group")],d=r.querySelector(".result-count"),u=r.querySelector(".empty-results");let h="";const g=()=>{const n=new Set(k(o,a.value,h).map(l=>l.name));for(const l of c)l.hidden=!n.has(l.dataset.project);for(const l of f)l.hidden=!l.querySelector(".card:not([hidden])");for(const l of s)l.setAttribute("aria-pressed",String(l.dataset.group===h));d.textContent=`Showing ${n.size} of ${o.length} tools`,u.hidden=n.size!==0},y=()=>{a.value="",h="",g(),a.focus()};t.addEventListener("submit",n=>n.preventDefault()),t.addEventListener("reset",n=>{n.preventDefault(),y()}),a.addEventListener("input",g);for(const n of s)n.addEventListener("click",()=>{h=n.dataset.group,g()});r.querySelector("#show-all").addEventListener("click",y),g()}async function L(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const o=await fetch("/officina/projects.json");if(!o.ok)throw new Error(`HTTP ${o.status}`);j(E(await o.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{L(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function P(){A.innerHTML=`
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
  `,document.getElementById("theme-toggle").addEventListener("click",U),await L(document.getElementById("catalogue"))}P();
//# sourceMappingURL=index-nE7kBiv-.js.map
