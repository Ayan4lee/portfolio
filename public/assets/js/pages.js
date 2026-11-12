(()=>{
const page=document.body.dataset.page;
const list=a=>(a&&a.length)?`<ul class="detail-list">${a.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
const ext=(u,t)=>u?`<a class="btn btn-sm btn-outline-secondary" href="${safeUrl(u)}" target="_blank" rel="noopener">${t} ↗</a>`:'';
const fail=(id,m)=>{const el=document.getElementById(id);if(el)el.innerHTML=`<div class="empty-state">${m}</div>`;};
const R={
async about(){
 try{const [p,edu]=await Promise.all([api('/profile'),api('/education')]);
  document.getElementById('longBio').textContent=p.long_bio||p.short_bio||'';setupCv(p);
  document.getElementById('educationTimeline').innerHTML=edu.length?edu.map(e=>`<div class="timeline-item"><h3>${esc(e.degree)}</h3><div class="fw-semibold">${esc(e.institution)}</div><div class="muted">${esc(e.field_of_study||'')} · ${new Date(e.start_date).getFullYear()} – ${e.end_date?new Date(e.end_date).getFullYear()+' (expected)':'Present'}</div>${e.grade?`<div class="small mt-1 fw-semibold">${esc(e.grade)}</div>`:''}<p class="mt-2 mb-0 small" style="color:var(--muted)">${esc(e.description||'')}</p></div>`).join(''):'<div class="empty-state">Education records will appear here.</div>';
  const h=(edu[0]?.gpa_history)||[];
  if(h.length){const f=h[0],l=h[h.length-1];const card=document.getElementById('gpaCard');card.hidden=false;
   card.innerHTML=`<h3 class="h5">Academic improvement</h3><p class="small" style="color:var(--muted)">Semester GPA rose from ${Number(f.gpa).toFixed(2)} (${esc(f.label)}) to ${Number(l.gpa).toFixed(2)} (${esc(l.label)}).</p>`+h.map(x=>`<div class="gpa-row"><span>${esc(x.label)}</span><div class="gpa-track" role="img" aria-label="${esc(x.label)} GPA ${Number(x.gpa).toFixed(2)} out of 4.00"><div class="gpa-bar" style="width:${Math.min(100,Number(x.gpa)/4*100)}%"></div></div><strong>${Number(x.gpa).toFixed(2)}</strong></div>`).join('')+'<p class="small mb-0 mt-2" style="color:var(--muted)">Only the semesters shown are listed. Scale: 4.00.</p>';}
 }catch{fail('longBio','About information is temporarily unavailable.');fail('educationTimeline','Education is temporarily unavailable.');}
},
async skills(){
 const box=document.getElementById('skillsContainer');
 const slug=c=>'cat-'+c.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
 const slow=setTimeout(()=>{const l=document.getElementById('skillsLoading');if(l)l.textContent='Still loading… this is taking longer than usual.';},4000);
 const load=async()=>{
  box.innerHTML='<div class="empty-state" id="skillsLoading">Loading skills…</div>';
  const [sr,pr]=await Promise.allSettled([api('/skills'),api('/projects')]);
  clearTimeout(slow);
  if(sr.status!=='fulfilled'){box.innerHTML='<div class="empty-state">Skills are temporarily unavailable.<br><button class="btn btn-sm btn-teal mt-2" id="retrySkills">Try again</button></div>';document.getElementById('retrySkills').addEventListener('click',load);return;}
  const skills=sr.value,projects=pr.status==='fulfilled'?pr.value:[];
  if(!skills.length){box.innerHTML='<div class="empty-state">No skills have been added yet.</div>';return;}
  const bySlug=Object.fromEntries(projects.map(x=>[x.slug,x]));
  const groups=skills.reduce((a,x)=>((a[x.category]??=[]).push(x),a),{});
  const jump=document.getElementById('skillJump');jump.hidden=false;
  jump.innerHTML=Object.keys(groups).map(c=>`<a href="#${slug(c)}">${esc(c)}</a>`).join('');
  box.innerHTML=Object.entries(groups).map(([c,items])=>`<section class="skill-section" id="${slug(c)}"><h2 class="h4 skill-section-title">${esc(c)} <span class="count">${items.length}</span></h2><div class="row g-3">${items.map(x=>{
   const lvl=x.level||'Beginner',cls=lvl==='Currently Learning'?'learning':lvl.toLowerCase();
   const used=(x.project_slugs||[]).map(sl=>bySlug[sl]).filter(Boolean);
   return `<div class="col-md-6 col-lg-4"><article class="skill-card ${cls==='learning'?'is-learning':''} reveal"><div class="skill-card-top"><h3>${esc(x.name)}</h3><span class="level level-${cls}">${esc(lvl)}</span></div>${x.description?`<p>${esc(x.description)}</p>`:''}${used.length?`<div class="skill-used"><span>Used in</span>${used.map(u=>`<a href="/projects.html?project=${encodeURIComponent(u.id)}">${esc(u.title)}</a>`).join('')}</div>`:''}</article></div>`;}).join('')}</div></section>`).join('');
  observeReveals();
 };
 await load();
},
async hackathons(){
 try{const a=await api('/achievements');const org=a.filter(x=>x.kind==='organizer'),par=a.filter(x=>x.kind==='participant');
  const stat=(n,l)=>n?`<div class="stat-tile"><strong>${n}</strong><span>${l}</span></div>`:'';
  document.getElementById('organizerList').innerHTML=org.length?org.map(x=>`<article class="content-card feature-card reveal"><div class="d-flex justify-content-between flex-wrap gap-2"><div><span class="status-badge">${esc(x.role||'Organizer')}</span><h3 class="h4 mt-2">${esc(x.title)}</h3><div class="muted">${esc([x.date_label,x.location].filter(Boolean).join(' · '))}</div>${x.organizer?`<div class="muted small">Partner: ${esc(x.organizer)}</div>`:''}</div><div class="stat-row">${stat(x.participants,'participants')}${stat(x.competition_teams,'teams')}${stat(x.team_size,'organizing team')}</div></div>${x.description?`<p class="mt-3">${esc(x.description)}</p>`:''}${(x.highlights||[]).length?`<h4 class="h6 mt-3">Responsibilities &amp; awards</h4>${list(x.highlights)}`:''}<div class="mt-3">${ext(x.website_url,'Event website')}</div></article>`).join(''):'<div class="empty-state">No organizer records yet.</div>';
  document.getElementById('participantList').innerHTML=par.length?par.map(x=>`<article class="project-card reveal"><div class="project-body"><div class="mb-2">${x.result?`<span class="status-badge">${esc(x.result)}</span>`:''}</div><h3>${esc(x.title)}</h3><p class="mb-1"><strong>${esc(x.role||'')}</strong></p><p class="small" style="color:var(--muted)">${esc([x.date_label,x.organizer].filter(Boolean).join(' · '))}</p><p class="small mb-2">${x.team_size?`Team of ${x.team_size}`:''}${x.team_size&&x.competition_teams?' · ':''}${x.competition_teams?`${x.competition_teams} teams competed`:''}</p>${x.description?`<p>${esc(x.description)}</p>`:''}${ext(x.website_url,'Project website')}</div></article>`).join(''):'<div class="empty-state">No competitions yet.</div>';
  observeReveals();
 }catch{fail('organizerList','Achievements are temporarily unavailable.');}
},
async certificates(){
 try{const c=await api('/certificates');const grid=document.getElementById('certGrid');
  grid.innerHTML=c.length?c.map(x=>{const media=!x.file_url?`<div class="cert-media cert-pending"><span>Certificate file<br>to be uploaded</span></div>`:x.file_type==='pdf'?`<div class="cert-media cert-pdf"><span>PDF</span></div>`:`<div class="cert-media"><img src="${safeUrl(x.file_url)}" alt="${esc(x.title)} certificate" loading="lazy"></div>`;
   return `<div class="col-md-6 col-lg-4"><article class="content-card cert-card reveal h-100">${media}<h3 class="h6 mt-3">${esc(x.title)}</h3><div class="muted small">${esc(x.issuer)}${x.issue_date?' · '+new Date(x.issue_date).toLocaleDateString(undefined,{year:'numeric',month:'long'}):''}</div><div class="mt-3 d-flex gap-2 flex-wrap">${x.file_url?`<button class="btn btn-sm btn-teal" data-cert="${x.id}">Preview</button>`:''}${ext(x.verification_url,'Verify')}</div></article></div>`}).join(''):'<div class="empty-state">No certificates yet.</div>';
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-cert]');if(!b)return;const x=c.find(v=>String(v.id)===b.dataset.cert);if(!x)return;document.getElementById('certModalTitle').textContent=x.title;document.getElementById('certModalBody').innerHTML=x.file_type==='pdf'?`<iframe title="${esc(x.title)}" src="${safeUrl(x.file_url)}" style="width:100%;height:70vh;border:0"></iframe>`:`<img class="w-100" src="${safeUrl(x.file_url)}" alt="${esc(x.title)} certificate">`;bootstrap.Modal.getOrCreateInstance(document.getElementById('certModal')).show();});
  observeReveals();
 }catch{fail('certGrid','Certificates are temporarily unavailable.');}
},
async experience(){
 try{const e=await api('/experience');const groups=['Experience','Volunteering'];
  document.getElementById('experienceList').innerHTML=e.length?groups.map(g=>{const items=e.filter(x=>x.category===g);return items.length?`<h2 class="section-title ${g==='Volunteering'?'mt-5':''}">${g}</h2><div class="row g-3">${items.map(x=>`<div class="col-lg-6"><article class="content-card reveal h-100"><h3 class="h5">${esc(x.title)}</h3><div class="muted small">${esc([x.organization,x.period_label].filter(Boolean).join(' · '))}</div>${x.description?`<p class="mt-2">${esc(x.description)}</p>`:''}${list(x.highlights)}</article></div>`).join('')}</div>`:''}).join(''):'<div class="empty-state">No entries yet.</div>';
  observeReveals();
 }catch{fail('experienceList','Experience is temporarily unavailable.');}
}};
document.addEventListener('DOMContentLoaded',()=>{if(R[page])R[page]();});
})();