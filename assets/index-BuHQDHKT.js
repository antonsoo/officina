(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function s(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(t){if(t.ep)return;t.ep=!0;const a=s(t);fetch(t.href,a)}})();const O=["Ancient world","AI engineering","Developer tools","Games"];function $(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function d(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function g(e,r){const s=d(e,r),o=new URL(s);if(o.protocol!=="https:"||o.username||o.password||s!==s.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return s}function j(e,r){if(!Array.isArray(e)||e.length>24)throw new Error(`${r} must be an array of at most 24 terms`);const s=new Set;return e.map(o=>{const t=d(o,r);if(t!==t.trim()||t.length>80||s.has(y(t)))throw new Error(`${r} must contain unique trimmed terms of at most 80 characters`);return s.add(y(t)),t})}function D(e,r){if(!Array.isArray(e)||e.length>12)throw new Error(`${r} must be an array of at most 12 workshops`);const s=new Set;return e.map(o=>{const t=$(o,r),a=d(t.id,`${r}.id`);if(!/^[a-z][a-z0-9-]{0,39}$/.test(a)||s.has(a))throw new Error(`${r}.id must be a unique lowercase identifier of at most 40 characters`);s.add(a);const i=d(t.title,`${r}.title`);if(i!==i.trim()||i.length>90)throw new Error(`${r}.title must be trimmed and at most 90 characters`);const m=j(t.searchTerms,`${r}.searchTerms`);if(!m.length)throw new Error(`${r}.searchTerms must identify the workshop`);return{id:a,title:i,url:g(t.url,`${r}.url`),reviewUrl:g(t.reviewUrl,`${r}.reviewUrl`),searchTerms:m}})}function H(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((s,o)=>{const t=$(s,`Project ${o+1}`),a=d(t.name,"name"),i=a.trim().toLowerCase();if(r.has(i))throw new Error(`Duplicate project name: ${a}`);r.add(i);const m=d(t.thumbnail,`${a}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(m))throw new Error(`${a}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${a}.status must be published or soon`);const h={name:a,description:d(t.description,`${a}.description`),group:d(t.group,`${a}.group`),repoUrl:g(t.repoUrl,`${a}.repoUrl`),demoUrl:t.demoUrl===null?null:g(t.demoUrl,`${a}.demoUrl`),thumbnail:m,status:t.status};if(t.spaceUrl!==void 0&&(h.spaceUrl=g(t.spaceUrl,`${a}.spaceUrl`)),t.package!==void 0){const u=$(t.package,`${a}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${a}.package.registry must be PyPI, npm, or crates.io`);h.package={registry:u.registry,url:g(u.url,`${a}.package.url`)}}if(t.study!==void 0){const u=$(t.study,`${a}.study`),w=d(u.finding,`${a}.study.finding`);if(w.length>160)throw new Error(`${a}.study.finding must be at most 160 characters`);h.study={finding:w,url:g(u.url,`${a}.study.url`)}}return t.searchTerms!==void 0&&(h.searchTerms=j(t.searchTerms,`${a}.searchTerms`)),t.workshops!==void 0&&(h.workshops=D(t.workshops,`${a}.workshops`)),h})}function q(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,s)=>{const o=O.indexOf(r),t=O.indexOf(s);return o===-1&&t===-1?r.localeCompare(s):o===-1?1:t===-1?-1:o-t})}function y(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function R(e,r="",s=""){const o=y(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||s&&t.group!==s)return!1;const a=y([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??"",...t.searchTerms??[],...t.workshops?.flatMap(i=>[i.title,...i.searchTerms])??[]].join(" "));return o.every(i=>a.includes(i))})}function N(e,r){const s=y(r).trim().split(/\s+/).filter(Boolean);if(!s.length||e.status!=="published")return[];const o=y(`${e.name} ${e.group}`);return(e.workshops??[]).filter(t=>{const a=y([t.title,...t.searchTerms].join(" "));return s.some(i=>a.includes(i))&&s.every(i=>o.includes(i)||a.includes(i))})}const B=document.getElementById("app");function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function A(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function F(){const e=A()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"☀ Light":"☽ Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function G(e){const r="/officina/",s=[`<a href="${l(e.repoUrl)}">Source</a>`];return e.package&&s.unshift(`<a href="${l(e.package.url)}">${l(e.package.registry)}</a>`),e.spaceUrl&&s.unshift(`<a href="${l(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&s.unshift(`<a href="${l(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${l(e.name)}">
      <div class="card-thumb">
        <img src="${r}${l(e.thumbnail)}" alt="${l(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">
        <span class="tag">${l(e.group)}</span>
        <h3 class="card-name">${l(e.name)}</h3>
        ${e.workshops?.length?`<section class="card-workshops" aria-label="${l(e.name)} matching workshops" hidden><p class="workshop-label">Matching workshops</p><ul role="list">${e.workshops.map(o=>`<li data-workshop="${l(o.id)}" hidden><a class="workshop-demo" href="${l(o.url)}">${l(o.title)}</a><a class="workshop-review" href="${l(o.reviewUrl)}" aria-label="Recorded review: ${l(o.title)}">Recorded review</a></li>`).join("")}</ul></section>`:""}
        <p class="card-desc">${l(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${l(e.study.url)}"><span class="study-label">Recorded evidence</span> ${l(e.study.finding)}</a></p>`:""}
        <div class="card-links">${s.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function K(e){const r=e.filter(o=>o.status==="published"),s=new Map;for(const o of r){const t=s.get(o.group)??[];t.push(o),s.set(o.group,t)}return q(r).map(o=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${l(o)}</h2>
        <div class="rule"><span class="lozenge"></span></div>
      </div>
      <ul class="grid" role="list">
        ${s.get(o).map(G).join("")}
      </ul>
    </section>
  `).join("")}function W(e,r){const s=R(e);if(!s.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}r.innerHTML=`
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
        ${q(s).map(n=>`<button type="button" data-group="${l(n)}" aria-pressed="false">${l(n)} <span>${s.filter(c=>c.group===n).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Evidence links open the recorded source revision. Demos and registry packages may use a different version.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${K(s)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const o=r.querySelector("#tool-search"),t=r.querySelector("form"),a=[...r.querySelectorAll("[data-group]")],i=[...r.querySelectorAll("[data-project]")],m=new Map(s.map(n=>[n.name,n])),h=[...r.querySelectorAll(".group")],u=r.querySelector(".result-count"),w=r.querySelector(".empty-results"),U=r.querySelector("#copy-search-link"),v=r.querySelector("#shared-filter-link"),S=r.querySelector("#filter-link-url"),P=r.querySelector("#filter-link-status"),f=r.querySelector("#shared-filter-note");let p="";const b=new URLSearchParams(location.search),C=b.get("q")??"",E=b.get("audience")??"";b.getAll("q").length>1||b.getAll("audience").length>1?f.textContent="This link repeats its search or audience. Showing all tools.":C.length>512?f.textContent="This shared search is too long. Showing all tools.":E&&!q(s).includes(E)?f.textContent="This link’s audience is not in the catalogue. Showing all tools.":(o.value=C,p=E),f.hidden=!f.textContent;const T=()=>{const n=new Set(R(s,o.value,p).map(c=>c.name));for(const c of i){c.hidden=!n.has(c.dataset.project);const L=c.querySelector(".card-workshops");if(L){const I=new Set(N(m.get(c.dataset.project),o.value).map(k=>k.id));for(const k of L.querySelectorAll("[data-workshop]"))k.hidden=!I.has(k.dataset.workshop);L.hidden=c.hidden||I.size===0}}for(const c of h)c.hidden=!c.querySelector(".card:not([hidden])");for(const c of a)c.setAttribute("aria-pressed",String(c.dataset.group===p));u.textContent=`Showing ${n.size} of ${s.length} tools`,w.hidden=n.size!==0,U.disabled=!o.value.trim()&&!p},x=()=>{o.value="",p="",f.hidden=!0,v.hidden=!0;const n=new URL(location.href);(n.searchParams.has("q")||n.searchParams.has("audience"))&&(n.searchParams.delete("q"),n.searchParams.delete("audience"),history.replaceState(null,"",n)),T(),o.focus()};t.addEventListener("submit",n=>n.preventDefault()),t.addEventListener("reset",n=>{n.preventDefault(),x()});const M=()=>{f.hidden=!0,v.hidden=!0,T()};o.addEventListener("input",M);for(const n of a)n.addEventListener("click",()=>{p=n.dataset.group,M()});U.addEventListener("click",async()=>{const n=new URL("/officina/",location.origin);o.value.trim()&&n.searchParams.set("q",o.value.trim()),p&&n.searchParams.set("audience",p),n.hash="catalogue",S.value=n.href,v.hidden=!1,S.focus(),S.select();try{await navigator.clipboard.writeText(n.href),P.textContent="Search link copied."}catch{P.textContent="Copy the selected link to share this search and audience."}}),r.querySelector("#show-all").addEventListener("click",x),T()}async function z(e,r=!1){e.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const s=await fetch("/officina/projects.json");if(!s.ok)throw new Error(`HTTP ${s.status}`);W(H(await s.json()),e),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{z(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false")}}async function _(){B.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${A()==="dark"?"light":"dark"} theme">
      ${A()==="dark"?"☀ Light":"☽ Dark"}
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
  `,document.getElementById("theme-toggle").addEventListener("click",F),await z(document.getElementById("catalogue"))}_();
//# sourceMappingURL=index-BuHQDHKT.js.map
