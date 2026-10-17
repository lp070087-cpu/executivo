import { env } from 'cloudflare:workers';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
async function readBody(request:Request){const text=await request.text();if(text.length>8000)throw Error();return JSON.parse(text)}
export async function GET(request:Request){
 const userId=request.headers.get('oai-authenticated-user-id');if(!userId)return json({error:'Entre na sua conta para acessar seus pedidos.'},401);
 let fullName=request.headers.get('oai-authenticated-user-full-name')||'';try{if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8')fullName=decodeURIComponent(fullName)}catch{fullName=''}
 const saved=await env.DB!.prepare('SELECT name,contact FROM client_profiles WHERE user_id = ?').bind(userId).first();
 const rows=await env.DB!.prepare('SELECT id,name,contact,category,origin,destination,date,passengers,details,status,created_at,pickup_time FROM requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 500').bind(userId).all();
 const history=await env.DB!.prepare('SELECT id,request_id,description,created_at FROM request_events WHERE request_id IN (SELECT id FROM requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 500) ORDER BY created_at DESC').bind(userId).all();
 const events=history.results.flatMap((event:any)=>{if(event.description.startsWith('Status:'))return [{...event,description:event.description.split(' · ')[0]}];if(['Solicitação recebida pelo site','Solicitação cancelada pelo cliente','Mensagem do cliente recebida','Mensagem enviada pela equipe'].includes(event.description))return [event];return []});
 const messages=await env.DB!.prepare('SELECT id,request_id,sender,body,created_at FROM request_messages WHERE request_id IN (SELECT id FROM requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 500) ORDER BY created_at ASC').bind(userId).all();
 return json({profile:saved||{name:fullName,contact:request.headers.get('oai-authenticated-user-email')||''},email:request.headers.get('oai-authenticated-user-email')||'',requests:rows.results,events,messages:messages.results})
}
export async function PATCH(request:Request){
 const userId=request.headers.get('oai-authenticated-user-id');if(!userId)return json({error:'Entre na sua conta.'},401);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
 let body:any;try{body=await readBody(request)}catch{return json({error:'Dados inválidos.'},400)}if(!body||typeof body.name!=='string'||typeof body.contact!=='string'||!body.name.trim()||!body.contact.trim()||body.name.length>120||body.contact.length>160)return json({error:'Informe seu nome e um contato válido.'},400);
 await env.DB!.prepare('INSERT INTO client_profiles (user_id,name,contact) VALUES (?,?,?) ON CONFLICT(user_id) DO UPDATE SET name = excluded.name,contact = excluded.contact').bind(userId,body.name.trim(),body.contact.trim()).run();return json({ok:true})
}
export async function POST(request:Request){
 const userId=request.headers.get('oai-authenticated-user-id');if(!userId)return json({error:'Entre na sua conta.'},401);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
 let body:any;try{body=await readBody(request)}catch{return json({error:'Dados inválidos.'},400)}if(!body||typeof body.id!=='string'||!['cancel','message'].includes(body.action))return json({error:'Ação inválida.'},400);
 const owned=await env.DB!.prepare('SELECT status FROM requests WHERE id = ? AND user_id = ?').bind(body.id,userId).first<{status:string}>();if(!owned)return json({error:'Solicitação não encontrada.'},404);
 const now=new Date().toISOString();if(body.action==='cancel'){
 if(['Concluído','Cancelado'].includes(owned.status))return json({error:'Esta solicitação já foi encerrada.'},409);
 const result=await env.DB!.batch([env.DB!.prepare("UPDATE requests SET status = 'Cancelado' WHERE id = ? AND user_id = ? AND status NOT IN ('Concluído','Cancelado')").bind(body.id,userId),env.DB!.prepare('INSERT INTO request_events (id,request_id,description,created_at) SELECT ?,?,?,? WHERE changes() > 0').bind(crypto.randomUUID(),body.id,'Solicitação cancelada pelo cliente',now)]);if(!result[0].meta.changes)return json({error:'O atendimento foi atualizado. Atualize a página.'},409);return json({ok:true})}
 if(typeof body.message!=='string'||!body.message.trim()||body.message.length>2000)return json({error:'Escreva uma mensagem de até 2.000 caracteres.'},400);
 const count=await env.DB!.prepare("SELECT COUNT(*) as total FROM request_messages WHERE request_id IN (SELECT id FROM requests WHERE user_id = ?) AND sender = 'cliente' AND created_at > ?").bind(userId,new Date(Date.now()-3600000).toISOString()).first<{total:number}>();if((count?.total||0)>=40)return json({error:'Limite de mensagens atingido. Tente novamente mais tarde.'},429);
 await env.DB!.batch([env.DB!.prepare('INSERT INTO request_messages (id,request_id,sender,body,created_at) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),body.id,'cliente',body.message.trim(),now),env.DB!.prepare('INSERT INTO request_events (id,request_id,description,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),body.id,'Mensagem do cliente recebida',now)]);return json({ok:true})
}
