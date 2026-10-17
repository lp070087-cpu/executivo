import {getAuth} from '../../../../lib/auth/server';
import type {NextRequest} from 'next/server';
import {isSameOrigin} from '../../../../lib/http';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest,context:{params:Promise<{path:string[]}>}){
 if(!process.env.NEON_AUTH_BASE_URL||!process.env.NEON_AUTH_COOKIE_SECRET)return Response.json({error:{message:'O acesso às contas está em configuração. Tente novamente mais tarde.'}},{status:503});
 return getAuth().handler().GET(request,context);
}
export async function POST(request:NextRequest,context:{params:Promise<{path:string[]}>}){
 if(!isSameOrigin(request))return Response.json({error:{message:'Origem inválida.'}},{status:403});
 if(!process.env.NEON_AUTH_BASE_URL||!process.env.NEON_AUTH_COOKIE_SECRET)return Response.json({error:{message:'O acesso às contas está em configuração. Tente novamente mais tarde.'}},{status:503});
 return getAuth().handler().POST(request,context);
}
