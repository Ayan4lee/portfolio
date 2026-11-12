(()=>{
const entity=document.body.dataset.entity;if(!entity)return;
const yes=v=>v?'<span class="badge text-bg-success">Yes</span>':'<span class="badge text-bg-secondary">No</span>';
const F=(k,label,type='text',o={})=>({k,label,type,...o});
const CFG={
achievements:{singular:'achievement',cols:x=>[`<strong>${esc(x.title)}</strong><div class="small" style="color:var(--muted)">${esc(x.date_label||'')}</div>`,esc(x.kind),esc(x.result||'—'),yes(x.is_published)],
 fields:[F('kind','Type *','select',{opts:['participant','organizer'],col:4}),F('title','Title *','text',{col:8,max:160}),F('role','Role','text',{col:6}),F('date_label','Date (display text)','text',{col:6,ph:'22–23 October 2026'}),F('location','Location'),F('organizer','Organizer / partner'),F('result','Result','text',{col:4,ph:'2nd position'}),F('team_size','Team size','number',{col:4}),F('competition_teams','Teams competing','number',{col:4}),F('participants','Participants (organizer)','number',{col:4}),F('display_order','Display order','number',{col:4,def:0}),F('description','Description','textarea',{col:12}),F('highlights','Highlights (one per line)','textarea',{col:12}),F('website_url','Website URL','url',{col:12}),F('image_url','Image URL','url',{col:12,upload:'achievements'}),F('is_published','Published','checkbox',{col:12,def:true})]},
certificates:{singular:'certificate',cols:x=>[`<strong>${esc(x.title)}</strong>`,esc(x.issuer),x.file_url?`<a href="${safeUrl(x.file_url)}" target="_blank" rel="noopener">${esc(x.file_type||'file')} ↗</a>`:'<span style="color:var(--muted)">Pending</span>',yes(x.is_published)],
 fields:[F('title','Title *','text',{col:12,max:160}),F('issuer','Issuing organization *','text',{col:8,max:160}),F('issue_date','Issue date','date',{col:4}),F('file_url','Certificate file URL (image or PDF)','url',{col:12,upload:'certificates',pdf:true}),F('verification_url','Verification link (optional)','url',{col:12}),F('achievement_id','Linked achievement ID (optional)','number',{col:6}),F('display_order','Display order','number',{col:6,def:0}),F('is_published','Published','checkbox',{col:12,def:true})]},
experience:{singular:'entry',cols:x=>[`<strong>${esc(x.title)}</strong><div class="small" style="color:var(--muted)">${esc(x.organization||'')}</div>`,esc(x.category),yes(x.is_published)],
 fields:[F('category','Category *','select',{opts:['Experience','Volunteering'],col:4}),F('title','Title *','text',{col:8,max:160}),F('organization','Organization','text',{col:6}),F('period_label','Period (display text)','text',{col:6}),F('description','Description','textarea',{col:12}),F('highlights','Highlights (one per line)','textarea',{col:12}),F('display_order','Display order','number',{col:6,def:0}),F('is_published','Published','checkbox',{col:6,def:true})]}
};
const table=document.getElementById('crudTable');
document.addEventListener('DOMContentLoaded',async()=>{
 if(!(await requireAdmin()))return;
 if(entity==='messages')return messages();
 const cfg=CFG[entity];let rows=[];const modal=bootstrap.Modal.getOrCreateInstance(document.getElementById('crudModal'));
 const box=document.getElementById('crudFields');
 box.innerHTML=cfg.fields.map(f=>{const id='f_'+f.k,col=f.col||12;let input;
  if(f.type==='textarea')input=`<textarea class="form-control" id="${id}" rows="3"></textarea>`;
  else if(f.type==='select')input=`<select class="form-select" id="${id}">${f.opts.map(o=>`<option>${esc(o)}</option>`).join('')}</select>`;
  else if(f.type==='checkbox')return `<div class="col-md-${col}"><label class="form-check"><input class="form-check-input" id="${id}" type="checkbox"><span class="form-check-label">${esc(f.label)}</span></label></div>`;
  else input=`<input class="form-control" id="${id}" type="${f.type}" ${f.ph?`placeholder="${esc(f.ph)}"`:''} ${f.max?`maxlength="${f.max}"`:''}>`;
  const up=f.upload?`<input class="form-control mt-2" id="${id}_file" type="file" accept="${f.pdf?'application/pdf,':''}image/png,image/jpeg,image/webp"><div class="form-text">Upload a file (max 3 MB) or paste a URL.</div>`:'';
  return `<div class="col-md-${col}"><label class="form-label" for="${id}">${esc(f.label)}</label>${input}${up}</div>`;}).join('');
 const val=f=>{const el=document.getElementById('f_'+f.k);return f.type==='checkbox'?el.checked:el.value;};
 const fill=x=>{x=x||{};cfg.fields.forEach(f=>{const el=document.getElementById('f_'+f.k);let v=x[f.k];if(f.type==='checkbox')el.checked=x.id?!!v:f.def!==false;else{if(Array.isArray(v))v=v.join('\n');el.value=v??(f.def??'');}const fi=document.getElementById('f_'+f.k+'_file');if(fi)fi.value='';});document.getElementById('crudFormAlert').innerHTML='';};
 let editing=null;
 const draw=()=>{table.innerHTML=rows.map(x=>`<tr>${cfg.cols(x).map(c=>`<td>${c}</td>`).join('')}<td><button class="btn btn-sm btn-outline-secondary me-1" data-edit="${x.id}">Edit</button><button class="btn btn-sm btn-outline-danger" data-del="${x.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="9">No records yet.</td></tr>';};
 const load=async()=>{try{rows=await api('/admin/'+entity);draw();}catch(e){adminAlert(e.message);}};
 document.getElementById('newButton').addEventListener('click',()=>{editing=null;fill(null);document.getElementById('crudTitle').textContent='New '+cfg.singular;modal.show();});
 table.addEventListener('click',async e=>{const ed=e.target.closest('[data-edit]'),dl=e.target.closest('[data-del]');
  if(ed){editing=rows.find(r=>String(r.id)===ed.dataset.edit);fill(editing);document.getElementById('crudTitle').textContent='Edit '+cfg.singular;modal.show();}
  if(dl){const x=rows.find(r=>String(r.id)===dl.dataset.del);if(!x||!confirm(`Delete “${x.title}”? This cannot be undone.`))return;try{await api(`/admin/${entity}/${x.id}`,{method:'DELETE',headers:{'X-CSRF-Token':await getToken()}});adminAlert('Deleted.','success');await load();}catch(err){adminAlert(err.message);}}});
 document.getElementById('crudForm').addEventListener('submit',async e=>{e.preventDefault();const btn=document.getElementById('crudSave');btn.disabled=true;
  try{for(const f of cfg.fields.filter(f=>f.upload)){const fi=document.getElementById('f_'+f.k+'_file');if(fi&&fi.files[0]){const up=await uploadFile(fi.files[0],f.upload);document.getElementById('f_'+f.k).value=up.url;}}
   const body={};cfg.fields.forEach(f=>body[f.k]=val(f));
   await api('/admin/'+entity+(editing?'/'+editing.id:''),{method:editing?'PUT':'POST',headers:{'X-CSRF-Token':await getToken()},body:JSON.stringify(body)});
   modal.hide();adminAlert(editing?'Saved changes.':'Created.','success');await load();}
  catch(err){const m=err.fields?Object.values(err.fields).join(' '):err.message;adminAlert(m,'danger','crudFormAlert');}
  finally{btn.disabled=false;}});
 await load();
});
async function messages(){
 let rows=[];
 const draw=()=>{table.innerHTML=rows.map(m=>`<tr class="${m.is_read?'':'fw-semibold'}"><td>${esc(m.name)}<div class="small" style="color:var(--muted)"><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></div></td><td>${esc(m.subject)}<div class="small fw-normal" style="color:var(--muted);white-space:pre-wrap">${esc(m.message)}</div></td><td class="small">${new Date(m.created_at).toLocaleString()}</td><td>${m.is_read?'<span class="badge text-bg-secondary">Read</span>':'<span class="badge text-bg-warning">New</span>'}</td><td><button class="btn btn-sm btn-outline-secondary me-1" data-read="${m.id}">${m.is_read?'Mark unread':'Mark read'}</button><button class="btn btn-sm btn-outline-danger" data-del="${m.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="5">No messages yet.</td></tr>';};
 const load=async()=>{try{rows=await api('/admin/messages');draw();}catch(e){adminAlert(e.message);}};
 table.addEventListener('click',async e=>{const r=e.target.closest('[data-read]'),d=e.target.closest('[data-del]');
  try{if(r){const m=rows.find(x=>String(x.id)===r.dataset.read);await api('/admin/messages/'+m.id,{method:'PATCH',headers:{'X-CSRF-Token':await getToken()},body:JSON.stringify({is_read:!m.is_read})});await load();}
   if(d){if(!confirm('Delete this message? This cannot be undone.'))return;await api('/admin/messages/'+d.dataset.del,{method:'DELETE',headers:{'X-CSRF-Token':await getToken()}});adminAlert('Message deleted.','success');await load();}}
  catch(err){adminAlert(err.message);}});
 await load();
}
})();