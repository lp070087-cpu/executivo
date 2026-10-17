'use client';
import {useEffect,useState} from 'react';
import {authClient} from '../../../lib/auth/client';
import './style.css';
export default function AuthScreen({path,destination,configured}:{path:string,destination:string,configured:boolean}){
 const [email,setEmail]=useState(''),[name,setName]=useState(''),[otp,setOtp]=useState(''),[sent,setSent]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{if(path==='sign-out'){authClient.signOut().then(({error})=>{if(error)setMessage('Não foi possível sair. Tente novamente.');else window.location.assign('/');});}},[path]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy)return;setBusy(true);setMessage('');
  try{
   if(!sent){const {error}=await authClient.emailOtp.sendVerificationOtp({email,type:'sign-in'});if(error)throw Error('Não foi possível enviar o código. Confira seu e-mail ou tente novamente mais tarde.');setSent(true);setMessage('Enviamos um código para seu e-mail. Confira também a pasta de spam.');}
   else{const {error}=await authClient.signIn.emailOtp({email,otp});if(error)throw Error('Código inválido ou expirado. Confira o e-mail e tente novamente.');if(name.trim())await authClient.updateUser({name:name.trim()});window.location.assign(destination);}
  }catch(error){setMessage(error instanceof Error?error.message:'Não foi possível acessar. Tente novamente.');}finally{setBusy(false);}
 }
 return <main className="access-shell"><a href="/" className="access-brand"><img src="/assets/logo-clean.webp" alt="PTE"/><span>PERNAMBUCO<small>TRANSPORTE EXECUTIVO</small></span></a><section className="access-card"><span className="access-eyebrow">SEU ESPAÇO PTE</span><h1>{path==='sign-out'?'Até o próximo caminho.':'Seus caminhos. Em um só lugar.'}</h1><p>Planeje seu trajeto, acompanhe seus pedidos e converse com a equipe.</p>{!configured?<div role="status" className="access-notice">O acesso às contas está em configuração. Em breve você poderá entrar por aqui.</div>:path==='sign-out'?<p role="status">{message||'Encerrando sua sessão…'}</p>:<form onSubmit={submit}>
 {!sent&&<><label htmlFor="access-name">Como podemos chamar você? <small>(opcional)</small></label><input id="access-name" value={name} onChange={e=>setName(e.target.value)} maxLength={120} autoComplete="name"/><label htmlFor="access-email">Seu e-mail</label><input id="access-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} autoComplete="email" required/></>}
 {sent&&<><p className="access-email">{email}</p><label htmlFor="access-otp">Código recebido por e-mail</label><input id="access-otp" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e=>setOtp(e.target.value)} minLength={6} maxLength={10} required autoFocus/></>}
 <button disabled={busy} type="submit">{busy?'Aguarde…':sent?'Entrar na minha área ↗':'Receber código de acesso ↗'}</button><p className="access-feedback" role="status" aria-live="polite">{message}</p>{sent&&<button type="button" className="access-secondary" disabled={busy} onClick={()=>{setSent(false);setOtp('');setMessage('');}}>Usar outro e-mail ou solicitar novo código</button>}<small className="access-note">Seu primeiro acesso cria sua conta após a confirmação do e-mail. Nenhuma senha é necessária.</small></form>}<a href="/" className="access-back">← Voltar ao site</a></section><footer>Pernambuco Transporte Executivo · O cuidado começa antes do embarque.</footer></main>;
}
