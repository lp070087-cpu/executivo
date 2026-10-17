import { env } from 'cloudflare:workers';
import { isAdmin } from './admin';
const statuses=['Novo','Em atendimento','Confirmado','Concluído','Cancelado'];
const categories=['Gostaria de orientação','Sedan','SUV','Blindado','Van','Ônibus ou micro-ônibus'];
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
async function bodyOf(request:Request){const text=await request.text();if(text.length>16000)throw Error('size');return JSON.parse(text)}
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
 const userId=request.headers.get('oai-authenticated-user-id');if(!userId)return json({error:'Entre na sua conta para enviar a solicitação.'},401);
 let body:any;try{body=await bodyOf(request)}catch{return json({error:'Dados inválidos ou muito extensos.'},400)}
 if(!body||typeof body!=='object')return json({error:'Dados inválidos.'},400);
 for(const key of ['nome','contato','categoria','origem','destino','data','detalhes']){if(typeof body[key]!=='string'||body[key].length>1500)return json({error:'Confira os campos da solicitação.'},400);body[key]=body[key].trim()}
 const time=body.hora??'';if(typeof time!=='string'||(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)))return json({error:'Horário inválido.'},400);
 if(!body.nome||!body.contato||!body.origem||!body.destino||!categories.includes(body.categoria)||!/^\d{4}-\d{2}-\d{2}$/.test(body.data)||!Number.isInteger(Number(body.passageiros))||Number(body.passageiros)<1||Number(body.passageiros)>200)return json({error:'Preencha nome, contato, trajeto, data e passageiros.'},400);
 const parsed=new Date(body.data+'T12:00:00Z');if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==body.data)return json({error:'Data inválida.'},400);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});if(body.data<today)return json({error:'Escolha uma data atual ou futura.'},400);
 const recent=await env.DB!.prepare('SELECT COUNT(*) as total FROM requests WHERE user_id = ? AND created_at > ?').bind(userId,new Date(Date.now()-3600000).toISOString()).first<{total:number}>();if((recent?.total||0)>=20)return json({error:'Limite de solicitações atingido. Tente novamente mais tarde.'},429);
 const id=crypto.randomUUID(),now=new Date().toISOString();await env.DB!.batch([
 env.DB!.prepare('INSERT INTO requests (id,user_id,name,contact,category,origin,destination,date,passengers,details,status,created_at,pickup_time,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,userId,body.nome,body.contato,body.categoria,body.origem,body.destino,body.data,Number(body.passageiros),body.detalhes,'Novo',now,time,''),
 env.DB!.prepare('INSERT INTO request_events (id,request_id,description,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),id,'Solicitação recebida pelo site',now)]);
 return json({id,protocol:'PTE-'+id.slice(0,8).toUpperCase()},201)
}
export async function GET(request:Request){if(!isAdmin(request))return json({error:'Acesso restrito à administração.'},403);const rows=await env.DB!.prepare('SELECT * FROM requests ORDER BY created_at DESC LIMIT 500').all();const events=await env.DB!.prepare('SELECT * FROM request_events WHERE request_id IN (SELECT id FROM requests ORDER BY created_at DESC LIMIT 500) ORDER BY created_at DESC').all();const messages=await env.DB!.prepare('SELECT * FROM request_messages WHERE request_id IN (SELECT id FROM requests ORDER BY created_at DESC LIMIT 500) ORDER BY created_at ASC').all();return json({requests:rows.results,events:events.results,messages:messages.results})}
export async function PATCH(request:Request){
 if(!isAdmin(request))return json({error:'Acesso restrito.'},403);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
 let body:any;try{body=await bodyOf(request)}catch{return json({error:'Dados inválidos.'},400)}
 if(!body||typeof body.id!=='string'||!statuses.includes(body.status)||(body.notes!==undefined&&(typeof body.notes!=='string'||body.notes.length>4000)))return json({error:'Status ou observações inválidos.'},400);
 const previous=await env.DB!.prepare('SELECT status,notes FROM requests WHERE id = ?').bind(body.id).first<{status:string,notes:string}>();if(!previous)return json({error:'Pedido não encontrado.'},404);
 const notes=body.notes===undefined?previous.notes:body.notes.trim(),changes=[];if(previous.status!==body.status)changes.push('Status: '+previous.status+' → '+body.status);if(notes!==previous.notes)changes.push('Observações internas atualizadas');
 if(!changes.length)return json({ok:true});
 await env.DB!.batch([env.DB!.prepare('UPDATE requests SET status = ?,notes = ? WHERE id = ?').bind(body.status,notes,body.id),env.DB!.prepare('INSERT INTO request_events (id,request_id,description,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),body.id,changes.join(' · '),new Date().toISOString())]);return json({ok:true})
}
