require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
if (isProd && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || !process.env.CSRF_SECRET || process.env.CSRF_SECRET.length < 32 || !process.env.SITE_ORIGIN || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) { throw new Error('Production configuration is incomplete: set Supabase credentials, SITE_ORIGIN, JWT_SECRET and CSRF_SECRET.'); }
const AUTH_COOKIE = 'portfolio_admin';
const CSRF_COOKIE = 'portfolio_csrf';
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }) : null;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
// Media upload (admin only). Declared before the global 30kb JSON parser so it can accept a larger body.
app.post('/api/admin/upload',express.json({limit:'5mb'}),auth,csrf,async(req,res)=>{
  try{if(!supabase)return apiError(res,503,'Storage is not configured.');
    const b64=String(req.body?.data||'');const buf=Buffer.from(b64,'base64');
    if(!buf.length||buf.length>3*1024*1024)return apiError(res,400,'File must be between 1 byte and 3 MB.');
    const sig=buf.subarray(0,12);let ext=null,type=null;
    if(sig[0]===0x89&&sig[1]===0x50&&sig[2]===0x4e&&sig[3]===0x47){ext='png';type='image/png';}
    else if(sig[0]===0xff&&sig[1]===0xd8&&sig[2]===0xff){ext='jpg';type='image/jpeg';}
    else if(sig.toString('ascii',0,4)==='RIFF'&&sig.toString('ascii',8,12)==='WEBP'){ext='webp';type='image/webp';}
    else if(sig.toString('ascii',0,4)==='%PDF'){ext='pdf';type='application/pdf';}
    if(!ext)return apiError(res,400,'Only PNG, JPG, WEBP or PDF files are allowed.');
    const folder=['certificates','projects','achievements','profile'].includes(req.body?.folder)?req.body.folder:'misc';
    const key=`${folder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const {error}=await supabase.storage.from('portfolio-media').upload(key,buf,{contentType:type,upsert:false});
    if(error)throw error;
    const {data}=supabase.storage.from('portfolio-media').getPublicUrl(key);
    res.status(201).json({data:{url:data.publicUrl,file_type:ext==='pdf'?'pdf':'image'}});
  }catch(e){console.error('UPLOAD ERROR:',e.message);apiError(res,500,'Upload failed. Check that the portfolio-media bucket exists.');}
});
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: false, limit: '30kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Demo records make the interface previewable before Supabase is configured.
// They are process-local and are NOT persistent; configure Supabase for real storage.
const demo = {
  profile: { full_name:'Mushtaque Ali', headline:'Computer Systems Engineering Student', tagline:'Building practical solutions through code, creativity and continuous learning.', short_bio:'I’m a Computer Systems Engineering student at Mehran University, Jamshoro. I love coding, problem solving and building things that make an impact.', long_bio:'I am currently pursuing Computer Systems Engineering at Mehran University of Engineering and Technology, Jamshoro. I enjoy learning by building practical projects, exploring software development and collaborating with others.', location:'Jamshoro, Pakistan', public_email:'[Add your public email]', github_url:'https://github.com/', linkedin_url:'https://www.linkedin.com/', resume_url:'', profile_image_url:'', career_start_date:null },
  categories:[{id:1,name:'Software Development',slug:'software-development'},{id:2,name:'Database',slug:'database'},{id:3,name:'Embedded Systems',slug:'embedded-systems'}],
  projects:[
    {id:1,title:'Medical Health Analysis',slug:'medical-health-analysis',summary:'A C++ project focused on analysing health-related information.',description:'A university project built in C++ to practise structured programming, data handling and problem solving. Replace this description with the exact features and screenshots of your implementation.',category_id:1,category:{name:'Software Development'},tech_stack:['C++','Data Analysis'],image_url:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85',live_url:'',repo_url:'',project_date:'2025-05-01',is_featured:true,is_published:true,display_order:1},
    {id:2,title:'Blood Bank Management',slug:'blood-bank-management',summary:'A MySQL database project for managing blood bank records.',description:'A database management project using MySQL. Add your real schema, workflows, role handling and screenshots before publishing.',category_id:2,category:{name:'Database'},tech_stack:['MySQL','Database Design'],image_url:'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=85',live_url:'',repo_url:'',project_date:'2025-06-01',is_featured:true,is_published:true,display_order:2},
    {id:3,title:'Arduino Snake Game',slug:'arduino-snake-game',summary:'A classic Snake Game implemented as a microprocessor project.',description:'An Arduino-based Snake Game created to explore microprocessor concepts, input/output and embedded programming. Replace this text with the actual hardware and implementation details.',category_id:3,category:{name:'Embedded Systems'},tech_stack:['Arduino','C++'],image_url:'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',live_url:'',repo_url:'',project_date:'2025-04-01',is_featured:true,is_published:true,display_order:3}
  ],
  skills:[
    {id:1,name:'C++',category:'Programming',proficiency:75,started_on:'2024-09-01',icon_name:'code',display_order:1},{id:2,name:'Python',category:'Programming',proficiency:55,started_on:'2025-01-01',icon_name:'terminal',display_order:2},{id:3,name:'Java',category:'Programming',proficiency:50,started_on:'2025-02-01',icon_name:'coffee',display_order:3},{id:4,name:'HTML',category:'Web Development',proficiency:70,started_on:'2025-06-01',icon_name:'code',display_order:1},{id:5,name:'CSS',category:'Web Development',proficiency:65,started_on:'2025-06-01',icon_name:'palette',display_order:2},{id:6,name:'JavaScript',category:'Web Development',proficiency:45,started_on:'2025-08-01',icon_name:'braces',display_order:3},{id:7,name:'MySQL',category:'Database',proficiency:65,started_on:'2025-02-01',icon_name:'database',display_order:1},{id:8,name:'Networking',category:'Core Concepts',proficiency:60,started_on:'2025-01-01',icon_name:'network',display_order:1}
  ],
  education:[{id:1,institution:'Mehran University of Engineering and Technology',degree:'Bachelor of Engineering',field_of_study:'Computer Systems Engineering',start_date:'2023-10-01',end_date:null,grade:'',description:'Currently studying in the third year.',display_order:1}]
};

function apiError(res,status,message,fields){ return res.status(status).json({error:{message, ...(fields?{fields}:{})}}); }
function csrfSign(value){ return crypto.createHmac('sha256',process.env.CSRF_SECRET||'local-demo-csrf-secret-change-this').update(value).digest('hex'); }
function issueCsrf(req,res){ const value=crypto.randomBytes(24).toString('hex'); const signed=`${value}.${csrfSign(value)}`; res.cookie(CSRF_COOKIE,signed,{httpOnly:false,secure:isProd,sameSite:'lax',path:'/',maxAge:2*60*60*1000}); return value; }
function validCsrf(req){ const header=req.get('X-CSRF-Token'); const signed=req.cookies[CSRF_COOKIE]; if(!header||!signed)return false; const [value,mac]=signed.split('.'); if(!value||!mac||value!==header)return false; const expected=csrfSign(value); const supplied=Buffer.from(mac); const known=Buffer.from(expected); return supplied.length===known.length && crypto.timingSafeEqual(supplied,known); }
function csrf(req,res,next){ const origin=req.get('Origin'); const expected=process.env.SITE_ORIGIN; if(origin&&expected&&origin!==expected)return apiError(res,403,'Request origin not allowed.'); if(!validCsrf(req))return apiError(res,403,'Your form security token expired. Refresh the page and try again.'); next(); }
function auth(req,res,next){ const token=req.cookies[AUTH_COOKIE]; if(!token)return apiError(res,401,'Please sign in to continue.'); try{req.admin=jwt.verify(token,process.env.JWT_SECRET||'local-demo-jwt-secret-change-this-please'); next();}catch{return apiError(res,401,'Your session has expired. Please sign in again.');} }
const loginLimiter=rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Too many login attempts. Please try again later.'}}});
const contactLimiter=rateLimit({windowMs:60*60*1000,limit:5,standardHeaders:true,legacyHeaders:false,message:{error:{message:'Please wait before sending another message.'}}});
const hasDb=()=>!!supabase;
async function dbQuery(query, fallback){ if(!supabase)return fallback; const {data,error}=await query; if(error)throw error; return data; }
function clean(v){return typeof v==='string'?v.trim():'';}
function validateProject(body){ const fields={}; const title=clean(body.title),summary=clean(body.summary),description=clean(body.description),image_url=clean(body.image_url),live_url=clean(body.live_url),repo_url=clean(body.repo_url),project_date=clean(body.project_date); if(title.length<3||title.length>120)fields.title='Title must be 3–120 characters.'; if(summary.length<10||summary.length>220)fields.summary='Summary must be 10–220 characters.'; if(description.length<20||description.length>5000)fields.description='Description must be 20–5000 characters.'; for(const [k,v] of Object.entries({image_url,live_url,repo_url})){if(v){try{const u=new URL(v);if(!['http:','https:'].includes(u.protocol))throw 0;}catch{fields[k]='Enter a valid http or https URL.';}}} if(project_date&&Number.isNaN(Date.parse(project_date)))fields.project_date='Enter a valid date.'; if(body.tech_stack&&!Array.isArray(body.tech_stack)&&typeof body.tech_stack!=='string')fields.tech_stack='Enter technologies as a comma-separated list.'; const categoryId=body.category_id?Number(body.category_id):null; if(categoryId!==null&&(!Number.isInteger(categoryId)||categoryId<1))fields.category_id='Choose a valid category ID.'; return {fields,value:{title,summary,description,image_url,live_url,repo_url,project_date:project_date||null,category_id:categoryId,tech_stack:Array.isArray(body.tech_stack)?body.tech_stack:clean(body.tech_stack).split(',').map(x=>x.trim()).filter(Boolean),status:clean(body.status).slice(0,60)||null,role:clean(body.role).slice(0,120)||null,features:toList(body.features,12,200),is_featured:!!body.is_featured,is_published:!!body.is_published,display_order:Number(body.display_order)||0}}; }

app.get('/api/health',(req,res)=>res.json({data:{status:'ok',database:hasDb()?'connected':'demo-mode'}}));
app.get('/api/csrf',(req,res)=>res.json({data:{csrfToken:issueCsrf(req,res)}}));
app.get('/api/profile',async(req,res)=>{try{const data=await dbQuery(supabase?.from('site_profile').select('*').eq('id',1).single(),demo.profile);res.json({data});}catch{apiError(res,500,'Profile information is temporarily unavailable.');}});
app.get('/api/projects',async(req,res)=>{try{let data;if(supabase){const q=await supabase.from('projects').select('*, categories(name)').eq('is_published',true).order('display_order').order('project_date',{ascending:false});if(q.error)throw q.error;data=q.data.map(p=>({...p,category:p.categories}));}else data=demo.projects.filter(p=>p.is_published);res.json({data});}catch{apiError(res,500,'Projects are temporarily unavailable.');}});
app.get('/api/skills',async(req,res)=>{try{const data=await dbQuery(supabase?.from('skills').select('*').order('display_order'),demo.skills);res.json({data});}catch{apiError(res,500,'Skills are temporarily unavailable.');}});
app.get('/api/education',async(req,res)=>{try{const data=await dbQuery(supabase?.from('education').select('*').order('display_order'),demo.education);res.json({data});}catch{apiError(res,500,'Education records are temporarily unavailable.');}});
app.post('/api/contact',contactLimiter,csrf,async(req,res)=>{const {name,email,subject,message,website}=req.body||{}; if(website)return res.status(200).json({data:{message:'Thank you. Your message has been received.'}}); const fields={}; const n=clean(name),e=clean(email),s=clean(subject),m=clean(message); if(n.length<2||n.length>100||!/^[\p{L} .'-]+$/u.test(n))fields.name='Enter a name between 2 and 100 characters.'; if(e.length>254||!/^\S+@\S+\.\S+$/.test(e))fields.email='Enter a valid email address.'; if(s.length<3||s.length>150)fields.subject='Subject must be 3–150 characters.'; if(m.length<10||m.length>2000)fields.message='Message must be 10–2000 characters.'; if(Object.keys(fields).length)return apiError(res,400,'Please correct the highlighted fields.',fields); try{if(!supabase)return apiError(res,503,'Contact storage is not configured yet. Connect Supabase to receive messages.'); const {error}=await supabase.from('contact_messages').insert({name:n,email:e,subject:s,message:m});if(error)throw error;res.status(201).json({data:{message:'Thank you, your message has been sent.'}});}catch{apiError(res,500,'We could not send your message right now. Please try again later.');}});
app.post('/api/auth/login',loginLimiter,csrf,async(req,res)=>{const username=clean(req.body?.username),password=String(req.body?.password||'');if(!username||!password)return apiError(res,400,'Enter your username and password.');try{if(!supabase)return apiError(res,503,'Admin login is disabled until Supabase and an admin account are configured.');const {data,error}=await supabase.from('admin_users').select('id,username,password_hash').eq('username',username).maybeSingle();if(error)throw error;if(!data||!(await bcrypt.compare(password,data.password_hash)))return apiError(res,401,'Invalid username or password.');const secret=process.env.JWT_SECRET;if(!secret||secret.length<32)return apiError(res,500,'Admin authentication is not configured securely.');const token=jwt.sign({sub:String(data.id),username:data.username},secret,{expiresIn:'30m'});res.cookie(AUTH_COOKIE,token,{httpOnly:true,secure:isProd,sameSite:'lax',path:'/',maxAge:30*60*1000});res.json({data:{username:data.username}});}catch(error){console.error('ADMIN LOGIN ERROR:', error); apiError(res,500,'Unable to sign in right now.');}});
app.post('/api/auth/logout',csrf,(req,res)=>{res.clearCookie(AUTH_COOKIE,{httpOnly:true,secure:isProd,sameSite:'lax',path:'/'});res.json({data:{message:'Signed out.'}});});
app.get('/api/auth/me',auth,(req,res)=>res.json({data:{username:req.admin.username}}));
app.get('/api/admin/projects',auth,async(req,res)=>{try{const data=await dbQuery(supabase.from('projects').select('*, categories(name)').order('created_at',{ascending:false}),[]);res.json({data:data.map(p=>({...p,category:p.categories}))});}catch{apiError(res,500,'Could not load projects.');}});
app.post('/api/admin/projects',auth,csrf,async(req,res)=>{const {fields,value}=validateProject(req.body||{});if(Object.keys(fields).length)return apiError(res,400,'Please correct the highlighted fields.',fields);try{if(!supabase)return apiError(res,503,'Database is not configured.');const slug=value.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')+'-'+crypto.randomBytes(3).toString('hex');const {data,error}=await supabase.from('projects').insert({...value,slug}).select().single();if(error)throw error;res.status(201).json({data,message:'Project created.'});}catch{apiError(res,500,'Could not create the project. Check that the slug is unique and try again.');}});
app.put('/api/admin/projects/:id',auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid project ID.');const {fields,value}=validateProject(req.body||{});if(Object.keys(fields).length)return apiError(res,400,'Please correct the highlighted fields.',fields);try{const {data,error}=await supabase.from('projects').update(value).eq('id',id).select().maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Project not found.');res.json({data,message:'Project updated.'});}catch{apiError(res,500,'Could not update the project.');}});
app.delete('/api/admin/projects/:id',auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid project ID.');try{const {data,error}=await supabase.from('projects').delete().eq('id',id).select('id').maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Project not found.');res.status(204).end();}catch{apiError(res,500,'Could not delete the project.');}});
// ---- Enhancement block: lists, generic CRUD, messages, media ----
function toList(v,max=20,len=200){const a=Array.isArray(v)?v:(typeof v==='string'?v.split(/\r?\n/):[]);return a.map(x=>String(x).trim().slice(0,len)).filter(Boolean).slice(0,max);}
function buildValidator(spec){return body=>{const fields={},value={};for(const [k,r] of Object.entries(spec)){let v=body?.[k];const label=r.label||k;
  if(r.t==='bool'){value[k]=!!v;continue;}
  if(r.t==='list'){value[k]=toList(v,r.max||20,r.len||200);continue;}
  if(r.t==='int'){if(v===''||v==null){if(r.req)fields[k]=`${label} is required.`;value[k]=r.def??null;continue;}const n=Number(v);if(!Number.isInteger(n)||n<(r.min??0)||n>(r.max??100000)){fields[k]=`${label} must be a whole number.`;continue;}value[k]=n;continue;}
  v=clean(v);if(!v){if(r.req)fields[k]=`${label} is required.`;value[k]=null;continue;}
  if(v.length>(r.max||200)){fields[k]=`${label} must be at most ${r.max||200} characters.`;continue;}
  if(r.t==='url'){try{const u=new URL(v);if(!['http:','https:'].includes(u.protocol))throw 0;}catch{fields[k]=`${label} must be a valid http or https URL.`;continue;}}
  if(r.t==='date'&&Number.isNaN(Date.parse(v))){fields[k]=`${label} must be a valid date.`;continue;}
  if(r.t==='enum'&&!r.opts.includes(v)){fields[k]=`Choose a valid ${label}.`;continue;}
  value[k]=v;}
  return {fields,value};};}
const MEDIA_BUCKET='portfolio-media';
async function removeMedia(url){try{if(!supabase||!url)return;const m=String(url).match(new RegExp('/storage/v1/object/public/'+MEDIA_BUCKET+'/(.+)$'));if(m)await supabase.storage.from(MEDIA_BUCKET).remove([decodeURIComponent(m[1])]);}catch(e){console.error('MEDIA REMOVE ERROR:',e.message);}}
<<<<<<< HEAD
function crud(name,spec,post,noPublic){const validate=buildValidator(spec);const base=`/api/${name}`,admin=`/api/admin/${name}`;
  if(!noPublic)app.get(base,async(req,res)=>{try{if(!supabase)return res.json({data:[]});const {data,error}=await supabase.from(name).select('*').eq('is_published',true).order('display_order').order('id');if(error)throw error;res.json({data});}catch{apiError(res,500,'Content is temporarily unavailable.');}});
=======
function crud(name,spec,post){const validate=buildValidator(spec);const base=`/api/${name}`,admin=`/api/admin/${name}`;
  app.get(base,async(req,res)=>{try{if(!supabase)return res.json({data:[]});const {data,error}=await supabase.from(name).select('*').eq('is_published',true).order('display_order').order('id');if(error)throw error;res.json({data});}catch{apiError(res,500,'Content is temporarily unavailable.');}});
>>>>>>> f9f711a3e075c773e85e6413580903706b497783
  app.get(admin,auth,async(req,res)=>{try{if(!supabase)return apiError(res,503,'Database is not configured.');const {data,error}=await supabase.from(name).select('*').order('display_order').order('id');if(error)throw error;res.json({data});}catch{apiError(res,500,'Could not load records.');}});
  app.post(admin,auth,csrf,async(req,res)=>{const {fields,value}=validate(req.body||{});if(post)post(value);if(Object.keys(fields).length)return apiError(res,400,'Please correct the highlighted fields.',fields);try{if(!supabase)return apiError(res,503,'Database is not configured.');const {data,error}=await supabase.from(name).insert(value).select().single();if(error)throw error;res.status(201).json({data,message:'Created.'});}catch{apiError(res,500,'Could not create the record.');}});
  app.put(`${admin}/:id`,auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid ID.');const {fields,value}=validate(req.body||{});if(post)post(value);if(Object.keys(fields).length)return apiError(res,400,'Please correct the highlighted fields.',fields);try{const {data,error}=await supabase.from(name).update({...value,updated_at:new Date().toISOString()}).eq('id',id).select().maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Record not found.');res.json({data,message:'Updated.'});}catch{apiError(res,500,'Could not update the record.');}});
  app.delete(`${admin}/:id`,auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid ID.');try{const {data,error}=await supabase.from(name).delete().eq('id',id).select().maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Record not found.');await removeMedia(data.file_url);await removeMedia(data.image_url);res.status(204).end();}catch{apiError(res,500,'Could not delete the record.');}});
}
const ST={t:'str'};
crud('achievements',{kind:{t:'enum',opts:['organizer','participant'],req:true,label:'type'},title:{t:'str',req:true,max:160,label:'Title'},role:{t:'str',max:120},date_label:{t:'str',max:80},location:{t:'str',max:160},organizer:{t:'str',max:160},result:{t:'str',max:80},team_size:{t:'int',min:1,max:1000},competition_teams:{t:'int',min:1,max:100000},participants:{t:'int',min:1,max:100000},description:{t:'str',max:3000},highlights:{t:'list',max:15,len:240},website_url:{t:'url',max:500,label:'Website'},image_url:{t:'url',max:600,label:'Image URL'},is_published:{t:'bool'},display_order:{t:'int',min:-1000,max:1000,def:0}});
crud('certificates',{title:{t:'str',req:true,max:160,label:'Title'},issuer:{t:'str',req:true,max:160,label:'Issuer'},issue_date:{t:'date',max:20,label:'Issue date'},file_url:{t:'url',max:600,label:'File URL'},file_type:{t:'enum',opts:['image','pdf'],label:'file type'},verification_url:{t:'url',max:500,label:'Verification URL'},achievement_id:{t:'int',min:1,max:1e12},is_published:{t:'bool'},display_order:{t:'int',min:-1000,max:1000,def:0}},v=>{if(v.file_url&&!v.file_type)v.file_type=/\.pdf(\?|$)/i.test(v.file_url)?'pdf':'image';if(!v.file_url)v.file_type=null;});
crud('experience',{category:{t:'enum',opts:['Experience','Volunteering'],req:true,label:'category'},title:{t:'str',req:true,max:160,label:'Title'},organization:{t:'str',max:160},period_label:{t:'str',max:80},description:{t:'str',max:3000},highlights:{t:'list',max:15,len:240},is_published:{t:'bool'},display_order:{t:'int',min:-1000,max:1000,def:0}});

<<<<<<< HEAD
crud('skills',{name:{t:'str',req:true,max:100,label:'Name'},category:{t:'enum',opts:['Programming Languages','Web Development','Data Science and Machine Learning','Databases','Hardware and Embedded Systems','Development Tools','Design Tools'],req:true,label:'category'},level:{t:'enum',opts:['Beginner','Intermediate','Currently Learning'],req:true,label:'level'},description:{t:'str',max:240},project_slugs:{t:'list',max:10,len:150},display_order:{t:'int',min:-1000,max:1000,def:0}},null,true);
=======
>>>>>>> f9f711a3e075c773e85e6413580903706b497783
app.get('/api/admin/messages',auth,async(req,res)=>{try{if(!supabase)return apiError(res,503,'Database is not configured.');const {data,error}=await supabase.from('contact_messages').select('id,name,email,subject,message,created_at,is_read').order('created_at',{ascending:false}).limit(500);if(error)throw error;res.json({data});}catch{apiError(res,500,'Could not load messages.');}});
app.patch('/api/admin/messages/:id',auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid message ID.');try{const {data,error}=await supabase.from('contact_messages').update({is_read:!!req.body?.is_read}).eq('id',id).select('id,is_read').maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Message not found.');res.json({data});}catch{apiError(res,500,'Could not update the message.');}});
app.delete('/api/admin/messages/:id',auth,csrf,async(req,res)=>{const id=Number(req.params.id);if(!Number.isInteger(id)||id<1)return apiError(res,400,'Invalid message ID.');try{const {data,error}=await supabase.from('contact_messages').delete().eq('id',id).select('id').maybeSingle();if(error)throw error;if(!data)return apiError(res,404,'Message not found.');res.status(204).end();}catch{apiError(res,500,'Could not delete the message.');}});
app.get('/api/*path',(req,res)=>apiError(res,404,'API endpoint not found.'));
app.use((req,res)=>res.status(404).sendFile(path.join(__dirname,'..','public','404.html')));
app.use((err,req,res,next)=>{console.error(err);if(res.headersSent)return next(err);apiError(res,500,'Something went wrong. Please try again.');});
module.exports=app;
