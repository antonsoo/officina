import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {chromium,firefox,expect} from '@playwright/test';
const base=process.argv[2],out=process.argv[3];assert(base&&out,'Pass a catalogue URL and output directory.');
const catalogue=JSON.parse(await readFile(new URL('../../public/projects.json',import.meta.url),'utf8'));
const workshop=catalogue.find(p=>p.name==='zygon').workshops.find(w=>w.id==='floating');
const queries=[...workshop.searchTerms,'μη απτεσθαι','NON TANGAT HUMIDUM','ON FLOATING BODIES','  critical   density  '];
const report={checkedAt:new Date().toISOString(),base,queries,configurations:[]};await mkdir(out,{recursive:true});
for(const [name,engine] of [['chromium',chromium],['firefox',firefox]]){
 const browser=await engine.launch();
 try{for(const width of [1280,375]){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  try{
   const page=await context.newPage(),errors=[],dataRequests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(new URL(r.url()).pathname.endsWith('/projects.json'))dataRequests.push(r.url());});
   await page.goto(base);const search=page.getByRole('searchbox',{name:'Find a tool'});await search.waitFor();await page.evaluate(()=>document.fonts.ready);
   const address=page.url();await page.locator('[data-group="Ancient world"]').click();
   for(const query of queries){await search.fill(query);const row=page.locator('[data-project="zygon"] [data-workshop="floating"]');await expect(row).toBeVisible();assert.equal(await row.locator('.workshop-demo').getAttribute('href'),workshop.url);assert.equal(await row.locator('.workshop-review').getAttribute('href'),workshop.reviewUrl);}
   await page.locator('[data-project="zygon"] [data-workshop="floating"] img').evaluate(i=>i.decode());
   const initialRequests=dataRequests.length;assert.equal(initialRequests,1);assert.equal(page.url(),address);
   await context.setOffline(true);
   for(const query of queries){await search.fill(query);await expect(page.locator('[data-project="zygon"] [data-workshop="floating"]')).toBeVisible();}
   assert.equal(dataRequests.length,initialRequests);assert.equal(page.url(),address);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
   report.configurations.push({engine:name,width,onlineQueries:queries.length,offlineRefilterings:queries.length,initialCatalogueFetches:initialRequests,additionalCatalogueFetches:0,addressUnchangedWhileTyping:true,errors});
   console.log(`${name} ${width}: ${queries.length} queries and offline refilterings`);
  }finally{await context.close();}
 }}finally{await browser.close();}
}
await writeFile(`${out}/search.json`,`${JSON.stringify(report,null,2)}\n`);
