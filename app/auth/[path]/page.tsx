import AuthScreen from './screen';
export const dynamic='force-dynamic';
export default async function AuthPage({params,searchParams}:{params:Promise<{path:string}>,searchParams:Promise<{return_to?:string}>}){
 const {path}=await params;const query=await searchParams;
 const destination=['/admin','/#contato'].includes(query.return_to||'')?query.return_to!:'/cliente';
 return <AuthScreen path={path} destination={destination} configured={!!(process.env.NEON_AUTH_BASE_URL&&(process.env.NEON_AUTH_COOKIE_SECRET?.length||0)>=32)}/>;
}
