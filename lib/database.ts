import 'server-only';
import postgres from 'postgres';

let connection: ReturnType<typeof postgres> | undefined;
function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_NOT_CONFIGURED');
  return connection ??= postgres(process.env.DATABASE_URL, {prepare:false,max:3,idle_timeout:20,connect_timeout:10,ssl:'require'});
}
type Result = {results: Record<string, unknown>[];meta:{changes:number}};
class Statement {
  values: unknown[] = [];
  constructor(public query:string){}
  bind(...values:unknown[]) {const statement=new Statement(this.query);statement.values=values;return statement;}
  async execute(sql:ReturnType<typeof database>, previousChanges=0):Promise<Result>{
    let index=0;
    const query=this.query.replace(/changes\(\)/g,String(previousChanges)).replace(/\?/g,()=>`$${++index}`);
    const rows=await sql.unsafe(query,this.values as never[]);
    return {results:[...rows] as Record<string,unknown>[],meta:{changes:rows.count}};
  }
  async all(){return this.execute(database());}
  async first<T=Record<string,unknown>>():Promise<T|null>{const result=await this.all();return result.results[0] as T??null;}
  async run(){return this.all();}
}
export const db={
  prepare(query:string){return new Statement(query);},
  async batch(statements:Statement[]):Promise<Result[]>{
    return database().begin(async transaction=>{
      const results:Result[]=[];
      for(const statement of statements)results.push(await statement.execute(transaction as unknown as ReturnType<typeof database>,results.at(-1)?.meta.changes||0));
      return results;
    }) as Promise<Result[]>;
  }
};
