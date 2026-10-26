(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const T=["Ancient world","AI engineering","Developer tools","Games"];function $(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function d(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function m(e,r){const s=d(e,r),a=new URL(s);if(a.protocol!=="https:"||a.username||a.password||s!==s.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return s}function A(e,r){if(!Array.isArray(e)||e.length>24)throw new Error(`${r} must be an array of at most 24 terms`);const s=new Set;return e.map(a=>{const t=d(a,r);if(t!==t.trim()||t.length>80||s.has(f(t)))throw new Error(`${r} must contain unique trimmed terms of at most 80 characters`);return s.add(f(t)),t})}function M(e,r){if(!Array.isArray(e)||e.length>12)throw new Error(`${r} must be an array of at most 12 workshops`);const s=new Set;return e.map(a=>{const t=$(a,r),o=d(t.id,`${r}.id`);if(!/^[a-z][a-z0-9-]{0,39}$/.test(o)||s.has(o))throw new Error(`${r}.id must be a unique lowercase identifier of at most 40 characters`);s.add(o);const n=d(t.title,`${r}.title`);if(n!==n.trim()||n.length>90)throw new Error(`${r}.title must be trimmed and at most 90 characters`);const p=A(t.searchTerms,`${r}.searchTerms`);if(!p.length)throw new Error(`${r}.searchTerms must identify the workshop`);return{id:o,title:n,url:m(t.url,`${r}.url`),reviewUrl:m(t.reviewUrl,`${r}.reviewUrl`),searchTerms:p}})}function P(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((s,a)=>{const t=$(s,`Project ${a+1}`),o=d(t.name,"name"),n=o.trim().toLowerCase();if(r.has(n))throw new Error(`Duplicate project name: ${o}`);r.add(n);const p=d(t.thumbnail,`${o}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(p))throw new Error(`${o}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${o}.status must be published or soon`);const h={name:o,description:d(t.description,`${o}.description`),group:d(t.group,`${o}.group`),repoUrl:m(t.repoUrl,`${o}.repoUrl`),demoUrl:t.demoUrl===null?null:m(t.demoUrl,`${o}.demoUrl`),thumbnail:p,status:t.status};if(t.spaceUrl!==void 0&&(h.spaceUrl=m(t.spaceUrl,`${o}.spaceUrl`)),t.package!==void 0){const u=$(t.package,`${o}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${o}.package.registry must be PyPI, npm, or crates.io`);h.package={registry:u.registry,url:m(u.url,`${o}.package.url`)}}if(t.study!==void 0){const u=$(t.study,`${o}.study`),g=d(u.finding,`${o}.study.finding`);if(g.length>160)throw new Error(`${o}.study.finding must be at most 160 characters`);h.study={finding:g,url:m(u.url,`${o}.study.url`)}}return t.searchTerms!==void 0&&(h.searchTerms=A(t.searchTerms,`${o}.searchTerms`)),t.workshops!==void 0&&(h.workshops=M(t.workshops,`${o}.workshops`)),h})}function U(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,s)=>{const a=T.indexOf(r),t=T.indexOf(s);return a===-1&&t===-1?r.localeCompare(s):a===-1?1:t===-1?-1:a-t})}function f(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function L(e,r="",s=""){const a=f(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||s&&t.group!==s)return!1;const o=f([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??"",...t.searchTerms??[],...t.workshops?.flatMap(n=>[n.title,...n.searchTerms])??[]].join(" "));return a.every(n=>o.includes(n))})}function I(e,r){const s=f(r).trim().split(/\s+/).filter(Boolean);if(!s.length||e.status!=="published")return[];const a=f(`${e.name} ${e.group}`);return(e.workshops??[]).filter(t=>{const o=f([t.title,...t.searchTerms].join(" "));return s.some(n=>o.includes(n))&&s.every(n=>a.includes(n)||o.includes(n))})}const O=document.getElementById("app");function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function k(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function j(){const e=k()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function C(e){const r="/officina/",s=[`<a href="${i(e.repoUrl)}">Source</a>`];return e.package&&s.unshift(`<a href="${i(e.package.url)}">${i(e.package.registry)}</a>`),e.spaceUrl&&s.unshift(`<a href="${i(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&s.unshift(`<a href="${i(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${i(e.name)}">
      <div class="card-thumb">
        <img src="${r}${i(e.thumbnail)}" alt="${i(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${i(e.group)}</span>
        <h3 class="card-name">${i(e.name)}</h3>
        ${e.workshops?.length?`<section class="card-workshops" aria-label="${i(e.name)} matching workshops" hidden><p class="workshop-label">Matching workshops</p><ul role="list">${e.workshops.map(a=>`<li data-workshop="${i(a.id)}" hidden><a class="workshop-demo" href="${i(a.url)}">${i(a.title)}</a><a class="workshop-review" href="${i(a.reviewUrl)}" aria-label="Recorded review: ${i(a.title)}">Recorded review</a></li>`).join("")}</ul></section>`:""}
        <p class="card-desc">${i(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${i(e.study.url)}"><span class="study-label">Recorded evidence</span> ${i(e.study.finding)}</a></p>`:""}
        <div class="card-links">${s.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function z(e){const r=e.filter(a=>a.status==="published"),s=new Map;for(const a of r){const t=s.get(a.group)??[];t.push(a),s.set(a.group,t)}return U(r).map(a=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${i(a)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${s.get(a).map(C).join("")}
      </ul>
    </section>
  `).join("")}function D(e,r){const s=L(e);if(!s.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try Greek, music, traces, or logs" autocomplete="off" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
      </div>
      <div class="audiences" role="group" aria-label="Filter by audience">
        <button type="button" data-group="" aria-pressed="true">All tools <span>${s.length}</span></button>
        ${U(s).map(c=>`<button type="button" data-group="${i(c)}" aria-pressed="false">${i(c)} <span>${s.filter(l=>l.group===c).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Evidence links open the recorded source revision. Demos and registry packages may use a different version.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${z(s)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const a=r.querySelector("#tool-search"),t=r.querySelector("form"),o=[...r.querySelectorAll("[data-group]")],n=[...r.querySelectorAll("[data-project]")],p=new Map(s.map(c=>[c.name,c])),h=[...r.querySelectorAll(".group")],u=r.querySelector(".result-count"),g=r.querySelector(".empty-results");let y="";const w=()=>{const c=new Set(L(s,a.value,y).map(l=>l.name));for(const l of n){l.hidden=!c.has(l.dataset.project);const v=l.querySelector(".card-workshops");if(v){const E=new Set(I(p.get(l.dataset.project),a.value).map(b=>b.id));for(const b of v.querySelectorAll("[data-workshop]"))b.hidden=!E.has(b.dataset.workshop);v.hidden=l.hidden||E.size===0}}for(const l of h)l.hidden=!l.querySelector(".card:not([hidden])");for(const l of o)l.setAttribute("aria-pressed",String(l.dataset.group===y));u.textContent=`Showing ${c.size} of ${s.length} tools`,g.hidden=c.size!==0},S=()=>{a.value="",y="",w(),a.focus()};t.addEventListener("submit",c=>c.preventDefault()),t.addEventListener("reset",c=>{c.preventDefault(),S()}),a.addEventListener("input",w);for(const c of o)c.addEventListener("click",()=>{y=c.dataset.group,w()});r.querySelector("#show-all").addEventListener("click",S),w()}async function q(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const s=await fetch("/officina/projects.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);D(P(await s.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{q(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function H(){O.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${k()==="dark"?"light":"dark"} theme">
      ${k()==="dark"?"☀ Light":"☽ Dark"}
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
  `,document.getElementById("theme-toggle").addEventListener("click",j),await q(document.getElementById("catalogue"))}H();
//# sourceMappingURL=index-_PucSryY.js.map
