(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function o(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=o(t);fetch(t.href,s)}})();const $=["Ancient world","AI engineering","Developer tools","Games"];function b(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function m(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function h(e,r){const o=m(e,r),a=new URL(o);if(a.protocol!=="https:"||a.username||a.password||o!==o.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return o}function T(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((o,a)=>{const t=b(o,`Project ${a+1}`),s=m(t.name,"name"),d=s.trim().toLowerCase();if(r.has(d))throw new Error(`Duplicate project name: ${s}`);r.add(d);const g=m(t.thumbnail,`${s}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(g))throw new Error(`${s}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${s}.status must be published or soon`);const f={name:s,description:m(t.description,`${s}.description`),group:m(t.group,`${s}.group`),repoUrl:h(t.repoUrl,`${s}.repoUrl`),demoUrl:t.demoUrl===null?null:h(t.demoUrl,`${s}.demoUrl`),thumbnail:g,status:t.status};if(t.spaceUrl!==void 0&&(f.spaceUrl=h(t.spaceUrl,`${s}.spaceUrl`)),t.package!==void 0){const c=b(t.package,`${s}.package`);if(c.registry!=="PyPI"&&c.registry!=="npm"&&c.registry!=="crates.io")throw new Error(`${s}.package.registry must be PyPI, npm, or crates.io`);f.package={registry:c.registry,url:h(c.url,`${s}.package.url`)}}if(t.study!==void 0){const c=b(t.study,`${s}.study`),p=m(c.finding,`${s}.study.finding`);if(p.length>160)throw new Error(`${s}.study.finding must be at most 160 characters`);f.study={finding:p,url:h(c.url,`${s}.study.url`)}}if(t.searchTerms!==void 0){if(!Array.isArray(t.searchTerms)||t.searchTerms.length>24)throw new Error(`${s}.searchTerms must be an array of at most 24 terms`);const c=new Set;f.searchTerms=t.searchTerms.map(p=>{const u=m(p,`${s}.searchTerms`);if(u!==u.trim()||u.length>80||c.has(y(u)))throw new Error(`${s}.searchTerms must contain unique trimmed terms of at most 80 characters`);return c.add(y(u)),u})}return f})}function S(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,o)=>{const a=$.indexOf(r),t=$.indexOf(o);return a===-1&&t===-1?r.localeCompare(o):a===-1?1:t===-1?-1:a-t})}function y(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function k(e,r="",o=""){const a=y(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||o&&t.group!==o)return!1;const s=y([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??"",...t.searchTerms??[]].join(" "));return a.every(d=>s.includes(d))})}const L=document.getElementById("app");function n(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function v(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function A(){const e=v()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function U(e){const r="/officina/",o=[`<a href="${n(e.repoUrl)}">Source</a>`];return e.package&&o.unshift(`<a href="${n(e.package.url)}">${n(e.package.registry)}</a>`),e.spaceUrl&&o.unshift(`<a href="${n(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&o.unshift(`<a href="${n(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${n(e.name)}">
      <div class="card-thumb">
        <img src="${r}${n(e.thumbnail)}" alt="${n(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${n(e.group)}</span>
        <h3 class="card-name">${n(e.name)}</h3>
        <p class="card-desc">${n(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${n(e.study.url)}"><span class="study-label">Recorded evidence</span> ${n(e.study.finding)}</a></p>`:""}
        <div class="card-links">${o.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function q(e){const r=e.filter(a=>a.status==="published"),o=new Map;for(const a of r){const t=o.get(a.group)??[];t.push(a),o.set(a.group,t)}return S(r).map(a=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${n(a)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${o.get(a).map(U).join("")}
      </ul>
    </section>
  `).join("")}function P(e,r){const o=k(e);if(!o.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
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
        ${S(o).map(i=>`<button type="button" data-group="${n(i)}" aria-pressed="false">${n(i)} <span>${o.filter(l=>l.group===i).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Evidence links open the recorded source revision. Demos and registry packages may use a different version.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${q(o)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const a=r.querySelector("#tool-search"),t=r.querySelector("form"),s=[...r.querySelectorAll("[data-group]")],d=[...r.querySelectorAll("[data-project]")],g=[...r.querySelectorAll(".group")],f=r.querySelector(".result-count"),c=r.querySelector(".empty-results");let p="";const u=()=>{const i=new Set(k(o,a.value,p).map(l=>l.name));for(const l of d)l.hidden=!i.has(l.dataset.project);for(const l of g)l.hidden=!l.querySelector(".card:not([hidden])");for(const l of s)l.setAttribute("aria-pressed",String(l.dataset.group===p));f.textContent=`Showing ${i.size} of ${o.length} tools`,c.hidden=i.size!==0},w=()=>{a.value="",p="",u(),a.focus()};t.addEventListener("submit",i=>i.preventDefault()),t.addEventListener("reset",i=>{i.preventDefault(),w()}),a.addEventListener("input",u);for(const i of s)i.addEventListener("click",()=>{p=i.dataset.group,u()});r.querySelector("#show-all").addEventListener("click",w),u()}async function E(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const o=await fetch("/officina/projects.json");if(!o.ok)throw new Error(`HTTP ${o.status}`);P(T(await o.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{E(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function j(){L.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${v()==="dark"?"light":"dark"} theme">
      ${v()==="dark"?"☀ Light":"☽ Dark"}
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
  `,document.getElementById("theme-toggle").addEventListener("click",A),await E(document.getElementById("catalogue"))}j();
//# sourceMappingURL=index-BeLErYx9.js.map
