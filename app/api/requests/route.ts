import { env } from 'cloudflare:workers';
import { isAdmin } from '../../../lib/admin';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const origin=request.headers.get('origin'); if(origin && origin!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);
 const userId=request.headers.get('oai-authenticated-user-id'); if(!userId)return json({error:'Entre na sua conta para enviar a solicitação.'},401);
 if(Number(request.headers.get('content-length')||0)>16000)return json({error:'Solicitação muito extensa.'},413);
 let body:any;try{body=await request.json()}catch{return json({error:'Dados inválidos.'},400)}
 const fields=['nome','contato','categoria','origem','destino','data','detalhes'];for(const key of fields){if(typeof body[key]!=='string'||body[key].length>1500)return json({error:'Confira os campos da solicitação.'},400);body[key]=body[key].trim()}
 if(!body.nome||!body.contato||!body.origem||!body.destino||!/^\d{4}-\d{2}-\d{2}$/.test(body.data)||!Number.isInteger(Number(body.passageiros))||Number(body.passageiros)<1||Number(body.passageiros)>200)return json({error:'Preencha nome, contato, trajeto, data e passageiros.'},400);
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});if(body.data<today)return json({error:'Escolha uma data atual ou futura.'},400);
 const recent=await env.DB.prepare('SELECT COUNT(*) as total FROM requests WHERE user_id = ? AND created_at > ?').bind(userId,new Date(Date.now()-3600000).toISOString()).first<{total:number}>();if((recent?.total||0)>=20)return json({error:'Limite de solicitações atingido. Tente novamente mais tarde.'},429);
 const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO requests (id,user_id,name,contact,category,origin,destination,date,passengers,details,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,userId,body.nome,body.contato,body.categoria,body.origem,body.destino,body.data,Number(body.passageiros),body.detalhes,'Novo',new Date().toISOString()).run();return json({id,protocol:'PTE-'+id.slice(0,8).toUpperCase()},201)
}
export async function GET(request:Request){if(!isAdmin(request))return json({error:'Acesso restrito à administração.'},403);const rows=await env.DB.prepare('SELECT * FROM requests ORDER BY created_at DESC LIMIT 500').all();return json({requests:rows.results})}
export async function PATCH(request:Request){if(!isAdmin(request))return json({error:'Acesso restrito.'},403);if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origem inválida.'},403);let body:any;try{body=await request.json()}catch{return json({error:'Dados inválidos.'},400)}if(!['Novo','Em atendimento','Concluído','Cancelado'].includes(body.status)||typeof body.id!=='string')return json({error:'Status inválido.'},400);const r=await env.DB.prepare('UPDATE requests SET status = ? WHERE id = ?').bind(body.status,body.id).run();return r.meta.changes?json({ok:true}):json({error:'Pedido não encontrado.'},404)}
