(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function s(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=s(t);fetch(t.href,o)}})();const R=["Ancient world","AI engineering","Developer tools","Games"];function v(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function h(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function g(e,r){const s=h(e,r),a=new URL(s);if(a.protocol!=="https:"||a.username||a.password||s!==s.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return s}function H(e,r){if(!Array.isArray(e)||e.length>24)throw new Error(`${r} must be an array of at most 24 terms`);const s=new Set;return e.map(a=>{const t=h(a,r);if(t!==t.trim()||t.length>80||s.has(y(t)))throw new Error(`${r} must contain unique trimmed terms of at most 80 characters`);return s.add(y(t)),t})}function B(e,r){if(!Array.isArray(e)||e.length>12)throw new Error(`${r} must be an array of at most 12 workshops`);const s=new Set;return e.map(a=>{const t=v(a,r),o=h(t.id,`${r}.id`);if(!/^[a-z][a-z0-9-]{0,39}$/.test(o)||s.has(o))throw new Error(`${r}.id must be a unique lowercase identifier of at most 40 characters`);s.add(o);const l=h(t.title,`${r}.title`);if(l!==l.trim()||l.length>90)throw new Error(`${r}.title must be trimmed and at most 90 characters`);const p=H(t.searchTerms,`${r}.searchTerms`);if(!p.length)throw new Error(`${r}.searchTerms must identify the workshop`);const d={id:o,title:l,url:g(t.url,`${r}.url`),reviewUrl:g(t.reviewUrl,`${r}.reviewUrl`),searchTerms:p};if(t.summary!==void 0){const u=h(t.summary,`${r}.summary`);if(u!==u.trim()||u.length>320)throw new Error(`${r}.summary must be trimmed and at most 320 characters`);d.summary=u}if(t.thumbnail!==void 0){const u=h(t.thumbnail,`${r}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(u))throw new Error(`${r}.thumbnail must be an image path under thumbs/`);d.thumbnail=u}return d})}function F(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((s,a)=>{const t=v(s,`Project ${a+1}`),o=h(t.name,"name"),l=o.trim().toLowerCase();if(r.has(l))throw new Error(`Duplicate project name: ${o}`);r.add(l);const p=h(t.thumbnail,`${o}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(p))throw new Error(`${o}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${o}.status must be published or soon`);const d={name:o,description:h(t.description,`${o}.description`),group:h(t.group,`${o}.group`),repoUrl:g(t.repoUrl,`${o}.repoUrl`),demoUrl:t.demoUrl===null?null:g(t.demoUrl,`${o}.demoUrl`),thumbnail:p,status:t.status};if(t.spaceUrl!==void 0&&(d.spaceUrl=g(t.spaceUrl,`${o}.spaceUrl`)),t.package!==void 0){const u=v(t.package,`${o}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${o}.package.registry must be PyPI, npm, or crates.io`);d.package={registry:u.registry,url:g(u.url,`${o}.package.url`)}}if(t.study!==void 0){const u=v(t.study,`${o}.study`),$=h(u.finding,`${o}.study.finding`);if($.length>160)throw new Error(`${o}.study.finding must be at most 160 characters`);d.study={finding:$,url:g(u.url,`${o}.study.url`)}}return t.searchTerms!==void 0&&(d.searchTerms=H(t.searchTerms,`${o}.searchTerms`)),t.workshops!==void 0&&(d.workshops=B(t.workshops,`${o}.workshops`)),d})}function A(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,s)=>{const a=R.indexOf(r),t=R.indexOf(s);return a===-1&&t===-1?r.localeCompare(s):a===-1?1:t===-1?-1:a-t})}function y(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function z(e,r="",s=""){const a=y(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||s&&t.group!==s)return!1;const o=y([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??"",...t.searchTerms??[],...t.workshops?.flatMap(l=>[l.title,l.summary??"",...l.searchTerms])??[]].join(" "));return a.every(l=>o.includes(l))})}function G(e,r){const s=y(r).trim().split(/\s+/).filter(Boolean);if(!s.length||e.status!=="published")return[];const a=y(`${e.name} ${e.group}`);return(e.workshops??[]).filter(t=>{const o=y([t.title,t.summary??"",...t.searchTerms].join(" "));return s.some(l=>o.includes(l))&&s.every(l=>a.includes(l)||o.includes(l))})}const W=document.getElementById("app");function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function K(){const e=U()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function _(e){return`<li data-workshop="${i(e.id)}" hidden>
    ${e.thumbnail?`<img class="workshop-thumb" src="/officina/${i(e.thumbnail)}" alt="${i(e.title)}: actual workshop view" loading="lazy" width="1440" height="1000" />`:""}
    <div class="workshop-text"><a class="workshop-demo" href="${i(e.url)}">${i(e.title)}</a>
    ${e.summary?`<p class="workshop-summary">${i(e.summary)}</p>`:""}
    <a class="workshop-review" href="${i(e.reviewUrl)}" aria-label="Recorded review: ${i(e.title)}">Recorded review</a></div>
  </li>`}function J(e){const r="/officina/",s=[`<a data-project-source href="${i(e.repoUrl)}">Source</a>`];return e.package&&s.unshift(`<a href="${i(e.package.url)}">${i(e.package.registry)}</a>`),e.spaceUrl&&s.unshift(`<a href="${i(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&s.unshift(`<a data-project-demo href="${i(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${i(e.name)}">
      <div class="card-thumb">
        <img src="${r}${i(e.thumbnail)}" alt="${i(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${i(e.group)}</span>
        <h3 class="card-name">${i(e.name)}</h3>
        ${e.workshops?.length?`<section class="card-workshops" aria-label="${i(e.name)} matching workshops" hidden><p class="workshop-label">Matching workshops</p><ul role="list">${e.workshops.map(_).join("")}</ul></section>`:""}
        <p class="card-desc">${i(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${i(e.study.url)}"><span class="study-label">Recorded evidence</span> ${i(e.study.finding)}</a></p>`:""}
        <div class="card-links">${s.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function Q(e){const r=e.filter(a=>a.status==="published"),s=new Map;for(const a of r){const t=s.get(a.group)??[];t.push(a),s.set(a.group,t)}return A(r).map(a=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${i(a)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${s.get(a).map(J).join("")}
      </ul>
    </section>
  `).join("")}function V(e,r){const s=z(e);if(!s.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
    <form class="catalogue-controls" role="search" aria-label="Find a tool">
      <div class="search-row">
        <div class="search-field">
          <label for="tool-search">Find a tool</label>
          <input id="tool-search" type="search" placeholder="Try Greek, music, traces, or logs" autocomplete="off" maxlength="512" aria-controls="groups" />
        </div>
        <button class="clear-filters" type="reset">Clear filters</button>
        <button class="clear-filters" id="copy-search-link" type="button">Copy search link</button>
      </div>
      <p id="shared-filter-note" class="filter-link-note" role="alert" hidden></p>
      <div id="shared-filter-link" class="shared-filter-link" hidden>
        <label for="filter-link-url">Search and audience link</label>
        <input id="filter-link-url" readonly type="url" />
        <p id="filter-link-status" role="status"></p>
      </div>
      <div class="audiences" role="group" aria-label="Filter by audience">
        <button type="button" data-group="" aria-pressed="true">All tools <span>${s.length}</span></button>
        ${A(s).map(n=>`<button type="button" data-group="${i(n)}" aria-pressed="false">${i(n)} <span>${s.filter(c=>c.group===n).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Evidence links open the recorded source revision. Demos and registry packages may use a different version.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${Q(s)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const a=r.querySelector("#tool-search"),t=r.querySelector("form"),o=[...r.querySelectorAll("[data-group]")],l=[...r.querySelectorAll("[data-project]")],p=new Map(s.map(n=>[n.name,n])),d=[...r.querySelectorAll(".group")],u=r.querySelector(".result-count"),$=r.querySelector(".empty-results"),P=r.querySelector("#copy-search-link"),S=r.querySelector("#shared-filter-link"),E=r.querySelector("#filter-link-url"),x=r.querySelector("#filter-link-status"),f=r.querySelector("#shared-filter-note");let m="";const k=new URLSearchParams(location.search),C=k.get("q")??"",T=k.get("audience")??"";k.getAll("q").length>1||k.getAll("audience").length>1?f.textContent="This link repeats its search or audience. Showing all tools.":C.length>512?f.textContent="This shared search is too long. Showing all tools.":T&&!A(s).includes(T)?f.textContent="This link’s audience is not in the catalogue. Showing all tools.":(a.value=C,m=T),f.hidden=!f.textContent;const q=()=>{const n=new Set(z(s,a.value,m).map(c=>c.name));for(const c of l){c.hidden=!n.has(c.dataset.project);const L=c.querySelector(".card-workshops");if(L){const D=new Set(G(p.get(c.dataset.project),a.value).map(b=>b.id)),w=!c.hidden&&D.size>0;for(const b of L.querySelectorAll("[data-workshop]"))b.hidden=!D.has(b.dataset.workshop);L.hidden=!w,c.dataset.matchesWorkshops=String(w);const I=c.querySelector("[data-project-demo]");I&&(I.textContent=w?"Project demo":"Live demo");const O=c.querySelector("[data-project-source]");O&&(O.textContent=w?"Project source":"Source");for(const b of c.querySelectorAll(".card-thumb, .card-desc, .card-study"))b.hidden=w}}for(const c of d)c.hidden=!c.querySelector(".card:not([hidden])");for(const c of o)c.setAttribute("aria-pressed",String(c.dataset.group===m));u.textContent=`Showing ${n.size} of ${s.length} tools`,$.hidden=n.size!==0,P.disabled=!a.value.trim()&&!m},j=()=>{a.value="",m="",f.hidden=!0,S.hidden=!0;const n=new URL(location.href);(n.searchParams.has("q")||n.searchParams.has("audience"))&&(n.searchParams.delete("q"),n.searchParams.delete("audience"),history.replaceState(null,"",n)),q(),a.focus()};t.addEventListener("submit",n=>n.preventDefault()),t.addEventListener("reset",n=>{n.preventDefault(),j()});const M=()=>{f.hidden=!0,S.hidden=!0,q()};a.addEventListener("input",M);for(const n of o)n.addEventListener("click",()=>{m=n.dataset.group,M()});P.addEventListener("click",async()=>{const n=new URL("/officina/",location.origin);a.value.trim()&&n.searchParams.set("q",a.value.trim()),m&&n.searchParams.set("audience",m),n.hash="catalogue",E.value=n.href,S.hidden=!1,E.focus(),E.select();try{await navigator.clipboard.writeText(n.href),x.textContent="Search link copied."}catch{x.textContent="Copy the selected link to share this search and audience."}}),r.querySelector("#show-all").addEventListener("click",j),q()}async function N(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const s=await fetch("/officina/projects.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);V(F(await s.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{N(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function X(){W.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${U()==="dark"?"light":"dark"} theme">
      ${U()==="dark"?"☀ Light":"☽ Dark"}
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
  `,document.getElementById("theme-toggle").addEventListener("click",K),await N(document.getElementById("catalogue"))}X();
//# sourceMappingURL=index-CMLlNeyq.js.map
