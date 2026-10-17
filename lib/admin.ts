export function isAdmin(request: Request) {
 const email = request.headers.get('oai-authenticated-user-email')?.toLowerCase();
 return email === 'ysmingomes29@gmail.com' || (import.meta.env.DEV && email === 'seedy@sites.test');
}
