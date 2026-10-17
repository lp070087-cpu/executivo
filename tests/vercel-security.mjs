import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.PTE_TEST_ORIGIN||'http://127.0.0.1:5174';
const spoof={'pte-user-id':'attacker','pte-user-email-verified':'true','oai-authenticated-user-id':'attacker','oai-authenticated-user-email':'attacker@example.com','Content-Type':'application/json',Origin:base};
const request=(path,method='GET',body,headers={})=>fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),redirect:'manual'});
assert.equal((await request('/')).status,200);
assert.ok(JSON.parse(await fs.readFile('.next/routes-manifest.json','utf8')).version);
assert.equal((await request('/api/client')).status,401);
assert.equal((await request('/api/client','GET',undefined,spoof)).status,401);
assert.equal((await request('/api/requests','GET',undefined,spoof)).status,403);
assert.equal((await request('/api/requests','POST',{},spoof)).status,401);
assert.equal((await request('/api/client','POST',{action:'cancel',id:'fake'},spoof)).status,401);
assert.equal((await request('/api/requests/messages','POST',{id:'fake',message:'fake'},spoof)).status,403);
assert.equal((await request('/admin','GET',undefined,spoof)).status,403);
assert.equal((await request('/api/auth/email-otp/send-verification-otp','POST',{}, {...spoof,Origin:'https://invalid.example'})).status,403);
console.log('PASSOU: manifest Next.js, página inicial, proteção do painel e APIs, bloqueio de identidade forjada e origem inválida. Banco e sessão Neon reais exigem configuração externa.');

