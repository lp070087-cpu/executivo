import {authenticated} from '../../lib/auth/handler';
export const dynamic='force-dynamic';
import { clientHtml } from '../../lib/client-html';
async function handleGET(request:Request){if(!request.headers.get('pte-user-id'))return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Área do cliente — PTE</title><link rel="stylesheet" href="/client.css"><body><main class="login-card"><img src="/assets/logo-clean.webp" alt="PTE"><span class="eyebrow">SEU ESPAÇO PTE</span><h1>Seus caminhos.<br>Em um só lugar.</h1><p>Entre para acompanhar suas solicitações e conversar com a equipe.</p><a class="button primary" href="/auth/sign-in?return_to=/cliente" target="_top">Entrar com sua conta <span>↗</span></a><a href="/" class="back-link">Voltar ao site</a></main></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});return new Response(clientHtml,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}

export const GET=authenticated(handleGET);
