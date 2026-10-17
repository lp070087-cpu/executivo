export function canonicalUrl(request:Request){
 const url=new URL(request.url),host=request.headers.get('host');
 if(host)url.host=host;
 return url;
}
export function isSameOrigin(request:Request){return request.headers.get('origin')===canonicalUrl(request).origin;}
