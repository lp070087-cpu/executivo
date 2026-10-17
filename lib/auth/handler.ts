import 'server-only';
import {getAuth} from './server';
import {canonicalUrl} from '../http';
export function authenticated(handler:(request:Request)=>Promise<Response>){
 return async function(request:Request){
  const headers=new Headers(request.headers);
  for(const key of [...headers.keys()])if(key.startsWith('pte-user-')||key.startsWith('oai-authenticated-user-'))headers.delete(key);
  try{
   if(process.env.NEON_AUTH_BASE_URL&&process.env.NEON_AUTH_COOKIE_SECRET){
    const {data,error}=await getAuth().getSession();
    if(error)return Response.json({error:'Não foi possível validar seu acesso. Entre novamente.'},{status:401,headers:{'Cache-Control':'no-store'}});
    if(data?.user){headers.set('pte-user-id',data.user.id);headers.set('pte-user-email',data.user.email);headers.set('pte-user-full-name',encodeURIComponent(data.user.name||''));headers.set('pte-user-full-name-encoding','percent-encoded-utf-8');headers.set('pte-user-email-verified',String(data.user.emailVerified));}
   }
   const body=['GET','HEAD'].includes(request.method)?undefined:await request.arrayBuffer();
   return await handler(new Request(canonicalUrl(request),{method:request.method,headers,body}));
  }catch(error){
   console.error('PTE request failed',error instanceof Error?error.name:'UnknownError',error instanceof Error?error.stack?.split('\n').slice(1,4).join('\n'):'');
   return Response.json({error:'O atendimento está temporariamente indisponível. Tente novamente em instantes.'},{status:503,headers:{'Cache-Control':'no-store'}});
  }
 };
}
