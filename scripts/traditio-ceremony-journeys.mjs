import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {chromium,firefox,expect} from "@playwright/test";
const [base,output]=process.argv.slice(2);assert(base&&output,"Supply catalogue URL and receipt directory");await mkdir(output,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const expectedHtml=JSON.parse(await readFile('../traditio/docs/ceremony-review/local/review.json','utf8')).journeys[0].html.sha256;
const expectedRecord=JSON.parse(await readFile('../traditio/docs/ceremony-review/local/rehearsal.json','utf8'));
const rows=[];
for(const [engine,launcher] of Object.entries({chromium,firefox})){
 const browser=await launcher.launch();
 try{for(const width of [1440,375]){
  const context=await browser.newContext({viewport:{width,height:1000}});await context.addInitScript(()=>{const create=URL.createObjectURL.bind(URL);window.reviewBlobs=new Map();URL.createObjectURL=blob=>{const url=create(blob);window.reviewBlobs.set(url,blob);return url;};});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  const row=page.locator('[data-project="traditio"] [data-workshop="ceremony"]');const terms=['libripens','praeterea alio','negante aut tacente','in iure cessio','bronze and balance'];
  for(const term of terms){await page.locator('#tool-search').fill(term);await expect(row).toBeVisible();assert.equal(page.url(),base);}
  await page.locator('#tool-search').fill('praeterea alio');await page.locator('#copy-search-link').click();const shared=await page.locator('#filter-link-url').inputValue();assert.equal(new URL(shared).searchParams.get('q'),'praeterea alio');await page.goto(shared);
  const destination=await row.locator('.workshop-demo').getAttribute('href');const review=await row.locator('.workshop-review').getAttribute('href');const commit=/\/blob\/([a-f0-9]{40})\/docs\/ceremony-audit.md#try-the-actual-work$/.exec(review)?.[1];assert(commit);
  const expected=execFileSync('git',['-C','../traditio','show',`${commit}:docs/ceremony-audit.md`]);const response=await fetch(`https://raw.githubusercontent.com/antonsoo/traditio/${commit}/docs/ceremony-audit.md`);assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),expected);
  await row.locator('img').evaluate(img=>img.decode());await page.screenshot({path:resolve(output,`${engine}-${width}-catalogue.png`),fullPage:true});await row.locator('.workshop-review').focus();await expect(row.locator('.workshop-review')).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(review);await expect(page.locator('article')).toContainText('Try the actual work');
  await page.goto(shared);await page.waitForLoadState('load');await row.locator('.workshop-demo').focus();await expect(row.locator('.workshop-demo')).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(destination);await page.waitForLoadState('load');
  await page.locator('[data-act="buyer-claim"]').click();await expect(page.locator('#act-status')).toContainText('Four witnesses');await page.locator('#witnesses').selectOption('6');await page.locator('[name="route"][value="magistrate"]').check();
  for(const act of ['buyer-claim','ask','disclaim']){await page.locator(`[data-act="${act}"]`).focus();await page.keyboard.press('Enter');}
  await expect(page.locator('#ceremony-title-holder')).toHaveText('Lucius');await page.locator('[data-act="award"]').click();await expect(page.locator('#ceremony-title-holder')).toHaveText('Aulus');await page.locator('#ceremony-note').fill(expectedRecord.note);
  await page.locator('#ceremony-passage').selectOption('magistrate');await expect(page.locator('#ceremony-scan-status')).toContainText('Printed page 134.',{timeout:30000});const sourceHash=await page.locator('#ceremony-scan').evaluate(async img=>{const b=await window.reviewBlobs.get(img.src).arrayBuffer();return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b)),n=>n.toString(16).padStart(2,'0')).join('');});assert.equal(sourceHash,'56dcb4c7a8c036c7c6d4c7e22885918d529e33eca4bc8edbb1ed13ede0621c39');
  const pending=page.waitForEvent('download',{timeout:60000});await page.locator('#save-dossier').click();const saved=await pending;assert.equal(await saved.failure(),null);const htmlHash=hash(await readFile(await saved.path()));assert.equal(htmlHash,expectedHtml);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);
  rows.push({engine,version:browser.version(),width,terms,shared,destination,review,reviewSha256:hash(expected),sourceHash,htmlHash,errors});await context.close();await writeFile(resolve(output,'review.json'),`${JSON.stringify({base,rows},null,2)}\n`);console.log(engine,width,'Latin discovery, pinned review, formal acts and actual dossier verified');
 }}finally{await browser.close();}
}
