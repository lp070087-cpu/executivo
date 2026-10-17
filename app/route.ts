import { homeHtml } from '../lib/home-html';
export async function GET(){return new Response(homeHtml,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})}
