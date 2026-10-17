export function isAdmin(request:Request){
 const ids=(process.env.ADMIN_USER_IDS||'').split(',').map(s=>s.trim()).filter(Boolean);
 const id=request.headers.get('pte-user-id');
 return !!id&&ids.includes(id)&&request.headers.get('pte-user-email-verified')==='true';
}
