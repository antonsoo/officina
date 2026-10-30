import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {createHash} from "node:crypto";
import {mkdir,readFile,writeFile} from "node:fs/promises";
import {resolve} from "node:path";
import {chromium,firefox,expect} from "@playwright/test";
const [base,output]=process.argv.slice(2);assert(base&&output,"Supply catalogue URL and receipt directory");await mkdir(output,{recursive:true});
const hash=b=>createHash("sha256").update(b).digest("hex");
const expectedHtml=JSON.parse(await readFile('../embater/docs/review/plan-audit/local/review.json','utf8')).receipts[0].html.sha256;
const rows=[];
for(const [engine,launcher] of Object.entries({chromium,firefox})){
 const browser=await launcher.launch();
 try{for(const width of [1440,375]){
  const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  const row=page.locator('[data-project="embater"] [data-workshop="plans"]');const terms=['amphiprostyle','ἀμφιπρόστυλος','δίπτερος','xxxiv xxxviii','in postico'];
  for(const term of terms){await page.locator('#tool-search').fill(term);await expect(row).toBeVisible();assert.equal(page.url(),base);}
  await page.locator('#tool-search').fill('δίπτερος');await page.locator('#copy-search-link').click();const shared=await page.locator('#filter-link-url').inputValue();assert.equal(new URL(shared).searchParams.get('q'),'δίπτερος');await page.goto(shared);
  const destination=await row.locator('.workshop-demo').getAttribute('href');const review=await row.locator('.workshop-review').getAttribute('href');const commit=/\/blob\/([a-f0-9]{40})\/docs\/plan-audit.md#try-the-actual-work$/.exec(review)?.[1];assert(commit);
  const expected=execFileSync('git',['-C','../embater','show',`${commit}:docs/plan-audit.md`]);const response=await fetch(`https://raw.githubusercontent.com/antonsoo/embater/${commit}/docs/plan-audit.md`);assert.equal(response.status,200);assert.deepEqual(Buffer.from(await response.arrayBuffer()),expected);
  await row.locator('img').evaluate(img=>img.decode());await page.screenshot({path:resolve(output,`${engine}-${width}-catalogue.png`),fullPage:true});await row.locator('.workshop-review').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(review);await expect(page.locator('article')).toContainText('Try the actual work');
  await page.goto(shared);await row.locator('.workshop-demo').focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(destination);await page.waitForLoadState('load');await expect(page.locator('#plan-measure')).toContainText('38 on the inner ring');await page.locator('#plan-flank').selectOption('15');await expect(page.locator('#plan-measure')).toContainText('34 on the inner ring');await page.locator('#plan-flank').selectOption('17');
  const sourceStarted=Date.now();await page.locator('#plan-source-page').selectOption('66');await expect(page.locator('#plan-source-status')).toContainText('Printed page 66.',{timeout:30000});const sourceLoadMs=Date.now()-sourceStarted;const imageBytes=await page.locator('#plan-source-image').evaluate(async image=>Array.from(new Uint8Array(await(await fetch(image.src)).arrayBuffer())));const sourceHash=hash(Buffer.from(imageBytes));assert.equal(sourceHash,'a7a7abd83e8ad3c98b62a7c843efdfbbef3d88ac8a3110a53999573afc74c060');
  const pending=page.waitForEvent('download');await page.locator('#save-plan').click();const saved=await pending;assert.equal(await saved.failure(),null);const htmlHash=hash(await readFile(await saved.path()));assert.equal(htmlHash,expectedHtml);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);rows.push({engine,version:browser.version(),width,terms,shared,destination,review,reviewSha256:hash(expected),sourceHash,sourceLoadMs,htmlHash,errors});await context.close();await writeFile(resolve(output,'review.json'),`${JSON.stringify({base,rows},null,2)}\n`);console.log(engine,width,'Greek discovery, pinned source, 34/38 operation and actual reading verified');
 }}finally{await browser.close();}
}
