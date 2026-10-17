import type { Metadata } from "next";
export const metadata: Metadata = {title:"PTE — Pernambuco Transporte Executivo",description:"Transporte executivo e logística em Pernambuco."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
