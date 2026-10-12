export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wmtwmefqerdtmodifwtb.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_fNrZg-o4wwvHo_TZbwFWxw_VJ8Awduw";
const STORAGE_KEY = "family_planner_auth_v1";
export type AuthSession = { access_token:string; refresh_token:string; expires_at:number; user:{id:string; email?:string} };
export function getStoredSession():AuthSession|null {
 if(typeof window==="undefined")return null;
 try {return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null") as AuthSession|null;}catch{return null;}
}
function store(s:AuthSession|null){if(typeof window!=="undefined"){if(s)localStorage.setItem(STORAGE_KEY,JSON.stringify(s));else localStorage.removeItem(STORAGE_KEY);}}
async function authRequest(path:string,body:unknown){
 const response=await fetch(SUPABASE_URL+"/auth/v1/"+path,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify(body)});
 const data=await response.json();if(!response.ok)throw new Error(data.msg||data.error_description||data.message||data.error||"Falha na autenticação");
 return data;
}
function normalized(d:Record<string,unknown>):AuthSession{
 const user=d.user as {id:string;email?:string};return {access_token:String(d.access_token),refresh_token:String(d.refresh_token),expires_at:Math.floor(Date.now()/1000)+Number(d.expires_in||3600),user};
}
export async function login(email:string,password:string){const d=await authRequest("token?grant_type=password",{email,password});const s=normalized(d);store(s);return s;}
export async function signUp(email:string,password:string){const d=await authRequest("signup",{email,password});if(d.access_token){const s=normalized(d);store(s);return s;}return null;}
export async function validSession(){
 const s=getStoredSession();if(!s)return null;
 if(s.expires_at>Date.now()/1000+60)return s;
 try{const d=await authRequest("token?grant_type=refresh_token",{refresh_token:s.refresh_token});const next=normalized(d);store(next);return next;}catch{store(null);return null;}
}
export async function logout(){const s=getStoredSession();store(null);if(s)await fetch(SUPABASE_URL+"/auth/v1/logout",{method:"POST",headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+s.access_token}}).catch(()=>{});}
export async function database<T>(table:"family_planner_events"|"family_planner_tasks",method:"GET"|"POST"|"PATCH"|"DELETE",token:string,options?:{filter?:string;body?:unknown}):Promise<T>{
 const uri=SUPABASE_URL+"/rest/v1/"+table+(options?.filter||"");
 const response=await fetch(uri,{method,headers:{"apikey":SUPABASE_KEY,Authorization:"Bearer "+token,"Content-Type":"application/json",Prefer:"return=representation"},body:options?.body?JSON.stringify(options.body):undefined,cache:"no-store"});
 if(!response.ok){const d=await response.json().catch(()=>({message:"Erro ao salvar dados"}));throw new Error(d.message||"Erro no banco");}
 if(method==="DELETE")return [] as T;return await response.json() as T;
}
