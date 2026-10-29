(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();function G(e){const r=s=>e.some(i=>i.name===s),o=r("embater")?`<article class="feature feature-lead">
        <div class="feature-copy">
          <p class="eyebrow">01 / Architecture · Embater</p>
          <h2>Six across.<br>How many<br><i>down the side?</i></h2>
          <p>Vitruvius doubles the spaces between columns. The temples tell a less orderly story. Count them, compare the plans, and read the evidence.</p>
          <a class="feature-link" href="https://antonsoo.github.io/embater/compare.html">Count the columns <span aria-hidden="true">↗</span></a>
        </div>
        <a class="feature-image" href="https://antonsoo.github.io/embater/compare.html" tabindex="-1" aria-hidden="true"><img src="/officina/thumbs/embater-count.png" width="1200" height="900" alt="" fetchpriority="high"></a>
      </article>`:"",t=[r("harmoniai")?`<article class="feature feature-small">
      <p class="eyebrow">02 / Music · Harmoniai</p>
      <h2>Dorian, in Greek.<br><i>Phrygian, today.</i></h2>
      <p>One white-key pattern, two names. Compare Cleonides’ octave species with modern modes, pluck the strings, and read the Greek.</p>
      <a class="feature-link" href="https://antonsoo.github.io/harmoniai/#names">Play the octave species <span aria-hidden="true">↗</span></a>
    </article>`:"",r("stoicheia")?`<article class="feature feature-small">
      <p class="eyebrow">03 / Geometry · Stoicheia</p>
      <h2>A circle bound.<br><i>A proof you can break.</i></h2>
      <p>Double a polygon’s sides. Change one root estimate. Find the point where Archimedes’ argument stops working.</p>
      <a class="feature-link" href="https://antonsoo.github.io/stoicheia/circle.html">Try the argument <span aria-hidden="true">↗</span></a>
    </article>`:"",r("tracelens")?`<article class="feature feature-small">
      <p class="eyebrow">04 / Software · TraceLens</p>
      <h2>A trace is a record.<br><i>Read what it contains.</i></h2>
      <p>Open an OTLP or Jaeger trace, follow the spans, and inspect recorded token costs. Your files stay in your browser.</p>
      <a class="feature-link" href="https://antonsoo.github.io/tracelens/">Open the trace reader <span aria-hidden="true">↗</span></a>
    </article>`:""].filter(Boolean).join("");return o||t?`<div class="selection-label"><span>Selected work</span><a href="#catalogue">Browse the full index ↓</a></div>${o}<div class="selected-rest">${t}</div>`:""}const H=["Ancient world","AI engineering","Developer tools","Games"];function v(e,r){if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${r} must be an object`);return e}function h(e,r){if(typeof e!="string"||!e.trim())throw new Error(`${r} must be a nonempty string`);return e}function g(e,r){const a=h(e,r),o=new URL(a);if(o.protocol!=="https:"||o.username||o.password||a!==a.trim())throw new Error(`${r} must be an HTTPS URL without credentials`);return a}function B(e,r){if(!Array.isArray(e)||e.length>24)throw new Error(`${r} must be an array of at most 24 terms`);const a=new Set;return e.map(o=>{const t=h(o,r);if(t!==t.trim()||t.length>80||a.has(y(t)))throw new Error(`${r} must contain unique trimmed terms of at most 80 characters`);return a.add(y(t)),t})}function N(e,r){if(!Array.isArray(e)||e.length>12)throw new Error(`${r} must be an array of at most 12 workshops`);const a=new Set;return e.map(o=>{const t=v(o,r),s=h(t.id,`${r}.id`);if(!/^[a-z][a-z0-9-]{0,39}$/.test(s)||a.has(s))throw new Error(`${r}.id must be a unique lowercase identifier of at most 40 characters`);a.add(s);const i=h(t.title,`${r}.title`);if(i!==i.trim()||i.length>90)throw new Error(`${r}.title must be trimmed and at most 90 characters`);const m=B(t.searchTerms,`${r}.searchTerms`);if(!m.length)throw new Error(`${r}.searchTerms must identify the workshop`);const d={id:s,title:i,url:g(t.url,`${r}.url`),reviewUrl:g(t.reviewUrl,`${r}.reviewUrl`),searchTerms:m};if(t.summary!==void 0){const u=h(t.summary,`${r}.summary`);if(u!==u.trim()||u.length>320)throw new Error(`${r}.summary must be trimmed and at most 320 characters`);d.summary=u}if(t.thumbnail!==void 0){const u=h(t.thumbnail,`${r}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(u))throw new Error(`${r}.thumbnail must be an image path under thumbs/`);d.thumbnail=u}return d})}function z(e){if(!Array.isArray(e))throw new Error("The catalogue must be an array");const r=new Set;return e.map((a,o)=>{const t=v(a,`Project ${o+1}`),s=h(t.name,"name"),i=s.trim().toLowerCase();if(r.has(i))throw new Error(`Duplicate project name: ${s}`);r.add(i);const m=h(t.thumbnail,`${s}.thumbnail`);if(!/^thumbs\/(?:[\w-]+\/)*[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(m))throw new Error(`${s}.thumbnail must be an image path under thumbs/`);if(t.status!=="published"&&t.status!=="soon")throw new Error(`${s}.status must be published or soon`);const d={name:s,description:h(t.description,`${s}.description`),group:h(t.group,`${s}.group`),repoUrl:g(t.repoUrl,`${s}.repoUrl`),demoUrl:t.demoUrl===null?null:g(t.demoUrl,`${s}.demoUrl`),thumbnail:m,status:t.status};if(t.spaceUrl!==void 0&&(d.spaceUrl=g(t.spaceUrl,`${s}.spaceUrl`)),t.package!==void 0){const u=v(t.package,`${s}.package`);if(u.registry!=="PyPI"&&u.registry!=="npm"&&u.registry!=="crates.io")throw new Error(`${s}.package.registry must be PyPI, npm, or crates.io`);d.package={registry:u.registry,url:g(u.url,`${s}.package.url`)}}if(t.study!==void 0){const u=v(t.study,`${s}.study`),k=h(u.finding,`${s}.study.finding`);if(k.length>160)throw new Error(`${s}.study.finding must be at most 160 characters`);d.study={finding:k,url:g(u.url,`${s}.study.url`)}}return t.searchTerms!==void 0&&(d.searchTerms=B(t.searchTerms,`${s}.searchTerms`)),t.workshops!==void 0&&(d.workshops=N(t.workshops,`${s}.workshops`)),d})}function L(e){return[...new Set(e.filter(r=>r.status==="published").map(r=>r.group))].sort((r,a)=>{const o=H.indexOf(r),t=H.indexOf(a);return o===-1&&t===-1?r.localeCompare(a):o===-1?1:t===-1?-1:o-t})}function y(e){return e.normalize("NFKD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase()}function D(e,r="",a=""){const o=y(r).trim().split(/\s+/).filter(Boolean);return e.filter(t=>{if(t.status!=="published"||a&&t.group!==a)return!1;const s=y([t.name,t.description,t.group,t.package?.registry??"",t.study?.finding??"",...t.searchTerms??[],...t.workshops?.flatMap(i=>[i.title,i.summary??"",...i.searchTerms])??[]].join(" "));return o.every(i=>s.includes(i))})}function V(e,r){const a=y(r).trim().split(/\s+/).filter(Boolean);if(!a.length||e.status!=="published")return[];const o=y(`${e.name} ${e.group}`);return(e.workshops??[]).filter(t=>{const s=y([t.title,t.summary??"",...t.searchTerms].join(" "));return a.some(i=>s.includes(i))&&a.every(i=>o.includes(i)||s.includes(i))})}const W=document.getElementById("app");function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(){const e=document.documentElement.getAttribute("data-theme");return e==="light"||e==="dark"?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function K(){const e=P()==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",e);try{localStorage.setItem("officina-theme",e)}catch{}const r=document.getElementById("theme-toggle");r&&(r.textContent=e==="dark"?"Light":"Dark",r.setAttribute("aria-label",`Switch to ${e==="dark"?"light":"dark"} theme`))}function J(e){return`<li data-workshop="${l(e.id)}" hidden>
    ${e.thumbnail?`<img class="workshop-thumb" src="/officina/${l(e.thumbnail)}" alt="${l(e.title)}: actual workshop view" loading="lazy" width="1440" height="1000" />`:""}
    <div class="workshop-text"><a class="workshop-demo" href="${l(e.url)}">${l(e.title)}</a>
    ${e.summary?`<p class="workshop-summary">${l(e.summary)}</p>`:""}
    <a class="workshop-review" href="${l(e.reviewUrl)}" aria-label="Recorded review: ${l(e.title)}">Recorded review</a></div>
  </li>`}function Y(e){const r="/officina/",a=[`<a data-project-source href="${l(e.repoUrl)}">Source</a>`];return e.package&&a.unshift(`<a href="${l(e.package.url)}">${l(e.package.registry)}</a>`),e.spaceUrl&&a.unshift(`<a href="${l(e.spaceUrl)}">Hugging Face</a>`),e.demoUrl&&a.unshift(`<a data-project-demo href="${l(e.demoUrl)}">Live demo</a>`),`
    <li class="card" data-project="${l(e.name)}">
      <div class="card-thumb">
        <img src="${r}${l(e.thumbnail)}" alt="${l(e.name)} screenshot" loading="lazy" width="1200" height="750" />
      </div>
      <div class="card-body">

        <h3 class="card-name">${l(e.name)}</h3>
        ${e.workshops?.length?`<section class="card-workshops" aria-label="${l(e.name)} matching workshops" hidden><p class="workshop-label">Matching workshops</p><ul role="list">${e.workshops.map(J).join("")}</ul></section>`:""}
        <p class="card-desc">${l(e.description)}</p>
        ${e.study?`<p class="card-study"><a href="${l(e.study.url)}"><span class="study-label">Recorded evidence</span> ${l(e.study.finding)}</a></p>`:""}
        <div class="card-links">${a.join('<span class="sep">&middot;</span>')}</div>
      </div>
    </li>
  `}function _(e){const r=e.filter(o=>o.status==="published"),a=new Map;for(const o of r){const t=a.get(o.group)??[];t.push(o),a.set(o.group,t)}return L(r).map(o=>`
    <section class="group">
      <div class="group-header">
        <h2 class="group-title">${l(o)}</h2>
        <span class="group-size">${a.get(o).length} projects</span>
      </div>
      <ul class="grid" role="list">
        ${a.get(o).map(Y).join("")}
      </ul>
    </section>
  `).join("")}function Q(e,r){const a=D(e);if(!a.length){r.innerHTML='<p class="catalogue-message" role="status">No tools are listed yet.</p>';return}document.getElementById("selected").innerHTML=G(a),r.innerHTML=`
    <div class="index-heading"><h2>All projects</h2><p>Search the work, the sources, or a question.</p></div>
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
        <button type="button" data-group="" aria-pressed="true">All tools <span>${a.length}</span></button>
        ${L(a).map(n=>`<button type="button" data-group="${l(n)}" aria-pressed="false">${l(n)} <span>${a.filter(c=>c.group===n).length}</span></button>`).join("")}
      </div>
    </form>
    <p class="evidence-note">Recorded evidence links to the version reviewed; live demos and packages can differ.</p>
    <p class="result-count" role="status" aria-live="polite" aria-atomic="true"></p>
    <div id="groups">${_(a)}</div>
    <div class="empty-results" hidden>
      <h2>No matching tools</h2>
      <p>Try a different search or audience.</p>
      <button type="button" class="clear-filters" id="show-all">Show all tools</button>
    </div>
  `;const o=r.querySelector("#tool-search"),t=r.querySelector("form"),s=[...r.querySelectorAll("[data-group]")],i=[...r.querySelectorAll("[data-project]")],m=new Map(a.map(n=>[n.name,n])),d=[...r.querySelectorAll(".group")],u=r.querySelector(".result-count"),k=r.querySelector(".empty-results"),x=r.querySelector("#copy-search-link"),S=r.querySelector("#shared-filter-link"),E=r.querySelector("#filter-link-url"),C=r.querySelector("#filter-link-status"),f=r.querySelector("#shared-filter-note");let p="";const $=new URLSearchParams(location.search),U=$.get("q")??"",T=$.get("audience")??"";$.getAll("q").length>1||$.getAll("audience").length>1?f.textContent="This link repeats its search or audience. Showing all tools.":U.length>512?f.textContent="This shared search is too long. Showing all tools.":T&&!L(a).includes(T)?f.textContent="This link’s audience is not in the catalogue. Showing all tools.":(o.value=U,p=T),f.hidden=!f.textContent;const A=()=>{const n=new Set(D(a,o.value,p).map(c=>c.name));for(const c of i){c.hidden=!n.has(c.dataset.project);const q=c.querySelector(".card-workshops");if(q){const O=new Set(V(m.get(c.dataset.project),o.value).map(b=>b.id)),w=!c.hidden&&O.size>0;for(const b of q.querySelectorAll("[data-workshop]"))b.hidden=!O.has(b.dataset.workshop);q.hidden=!w,c.dataset.matchesWorkshops=String(w);const I=c.querySelector("[data-project-demo]");I&&(I.textContent=w?"Project demo":"Live demo");const R=c.querySelector("[data-project-source]");R&&(R.textContent=w?"Project source":"Source");for(const b of c.querySelectorAll(".card-thumb, .card-desc, .card-study"))b.hidden=w}}for(const c of d)c.hidden=!c.querySelector(".card:not([hidden])");for(const c of s)c.setAttribute("aria-pressed",String(c.dataset.group===p));u.textContent=`Showing ${n.size} of ${a.length} tools`,k.hidden=n.size!==0,x.disabled=!o.value.trim()&&!p},j=()=>{o.value="",p="",f.hidden=!0,S.hidden=!0;const n=new URL(location.href);(n.searchParams.has("q")||n.searchParams.has("audience"))&&(n.searchParams.delete("q"),n.searchParams.delete("audience"),history.replaceState(null,"",n)),A(),o.focus()};t.addEventListener("submit",n=>n.preventDefault()),t.addEventListener("reset",n=>{n.preventDefault(),j()});const M=()=>{f.hidden=!0,S.hidden=!0,A()};o.addEventListener("input",M);for(const n of s)n.addEventListener("click",()=>{p=n.dataset.group,M()});x.addEventListener("click",async()=>{const n=new URL("/officina/",location.origin);o.value.trim()&&n.searchParams.set("q",o.value.trim()),p&&n.searchParams.set("audience",p),n.hash="catalogue",E.value=n.href,S.hidden=!1,E.focus(),E.select();try{await navigator.clipboard.writeText(n.href),C.textContent="Search link copied."}catch{C.textContent="Copy the selected link to share this search and audience."}}),r.querySelector("#show-all").addEventListener("click",j),A()}async function F(e,r=!1){e.setAttribute("aria-busy","true"),document.querySelector("main")?.setAttribute("aria-busy","true"),e.innerHTML='<p class="catalogue-message" role="status">Loading tools&hellip;</p>';try{const a=await fetch("/officina/projects.json");if(!a.ok)throw new Error(`HTTP ${a.status}`);Q(z(await a.json()),e),location.hash==="#catalogue"&&e.scrollIntoView(),r&&e.querySelector("#tool-search")?.focus()}catch{e.innerHTML=`
      <div class="catalogue-message">
        <p role="alert">The tool list couldn't be loaded. Try again, or browse <a href="https://github.com/antonsoo">GitHub</a> directly.</p>
        <button class="clear-filters" id="retry" type="button">Try again</button>
      </div>`,e.querySelector("#retry").addEventListener("click",()=>{F(e,!0)}),r&&e.querySelector("#retry").focus()}finally{e.setAttribute("aria-busy","false"),document.querySelector("main")?.setAttribute("aria-busy","false")}}async function X(){W.innerHTML=`
    <a class="skip-link" href="#catalogue">Skip to tools</a>
    <header class="masthead wrap">
      <a class="owner" href="https://github.com/antonsoo">Anthony Mercer</a>
      <nav aria-label="Main navigation">
        <a href="#catalogue">Project index</a>
        <a href="https://github.com/antonsoo">GitHub ↗</a>
        <a href="https://praviel.com">PRAVIEL ↗</a>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to ${P()==="dark"?"light":"dark"} theme">${P()==="dark"?"Light":"Dark"}</button>
      </nav>
    </header>
    <main class="wrap">
      <div class="title-block">
        <h1>Officina<span aria-hidden="true">.</span></h1>
        <p>Open-source work<br> by <a href="https://github.com/antonsoo">Anthony Mercer</a></p>
      </div>
      <section id="selected" aria-label="Selected work"></section>
      <div id="catalogue" tabindex="-1"></div>
    </main>
    <footer class="wrap">
      <p>Officina <span lang="la">/ workshop</span></p>
      <nav aria-label="Footer"><a href="https://github.com/antonsoo/officina">Page source</a><a href="mailto:anthony@praviel.com">Get in touch</a><a href="/officina/FONT-LICENSE.txt">Font licenses</a><span>MIT licensed</span></nav>
    </footer>
  `,document.getElementById("theme-toggle").addEventListener("click",K),await F(document.getElementById("catalogue"))}X();
//# sourceMappingURL=index-CMix8iC9.js.map
