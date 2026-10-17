import fs from 'node:fs/promises';
import postgres from 'postgres';
if(!process.env.DATABASE_URL)throw new Error('Configure DATABASE_URL antes de executar a migração.');
const sql=postgres(process.env.DATABASE_URL,{ssl:'require',prepare:false,max:1});
try{await sql.unsafe(await fs.readFile(new URL('../neon/001_schema.sql',import.meta.url),'utf8'));console.log('Estrutura PTE criada no Neon.');}finally{await sql.end();}
