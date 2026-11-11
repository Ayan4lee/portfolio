require('dotenv').config();
const bcrypt=require('bcryptjs');
const {createClient}=require('@supabase/supabase-js');
(async()=>{
 const {SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,ADMIN_USERNAME,ADMIN_PASSWORD}=process.env;
 if(!SUPABASE_URL||!SUPABASE_SERVICE_ROLE_KEY||!ADMIN_USERNAME||!ADMIN_PASSWORD){console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_USERNAME and ADMIN_PASSWORD in .env first.');process.exit(1);}
 if(ADMIN_PASSWORD.length<12){console.error('ADMIN_PASSWORD must be at least 12 characters.');process.exit(1);}
 const db=createClient(SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
 const password_hash=await bcrypt.hash(ADMIN_PASSWORD,12);
 const {error}=await db.from('admin_users').upsert({username:ADMIN_USERNAME,password_hash},{onConflict:'username'});
 if(error){console.error(error.message);process.exit(1);} console.log(`Admin account '${ADMIN_USERNAME}' created/updated. Remove ADMIN_PASSWORD from your environment after setup.`);
})();
