document.addEventListener('DOMContentLoaded',async()=>{
 const grid=document.getElementById('featuredProjects'),hl=document.getElementById('homeHighlights');
 try{const [profile,projects]=await Promise.all([api('/profile'),api('/projects')]);
  if(profile.short_bio)document.getElementById('shortBio').textContent=profile.short_bio;
  setupCv(profile);
  if(profile.profile_image_url){document.querySelector('.hero-portrait').innerHTML=`<div class="portrait-orbit"></div><img src="${safeUrl(profile.profile_image_url)}" alt="Portrait of ${esc(profile.full_name||'portfolio owner')}" loading="eager">`;}
  const featured=projects.filter(p=>p.is_featured).slice(0,3);
  grid.innerHTML=featured.length?featured.map(projectCard).join(''):'<div class="empty-state">No featured projects yet.</div>';
  grid.addEventListener('click',e=>{const b=e.target.closest('[data-project-id]');if(b)location.href='/projects.html?project='+encodeURIComponent(b.dataset.projectId);});
  observeReveals();}
 catch{grid.innerHTML='<div class="empty-state">Project information is temporarily unavailable.</div>';}
<<<<<<< HEAD
 try{const sk=await api('/skills');document.querySelectorAll('#homeSkills [data-skills]').forEach(chip=>{const names=chip.dataset.skills.split('|');const found=names.map(n=>sk.find(x=>x.name===n)).filter(Boolean);const small=chip.querySelector('.small');if(!found.length){chip.hidden=true;return;}if(names.length===1)small.textContent=found[0].level;else{const learn=found.filter(x=>x.level==='Currently Learning').length;small.textContent=learn?`${found.length} skills · ${learn} learning`:`${found.length} skills`;}});}catch{}
=======
>>>>>>> f9f711a3e075c773e85e6413580903706b497783
 try{const a=await api('/achievements');const items=a.filter(x=>x.kind==='participant'&&x.result);hl.innerHTML=items.length?items.map(x=>`<div class="skill-chip"><div class="skill-symbol">★</div><strong>${esc(x.result)}</strong><div class="small" style="color:var(--muted)">${esc(x.title)}</div></div>`).join(''):'<div class="empty-state">Results will appear here.</div>';}
 catch{hl.innerHTML='<div class="empty-state">Highlights are temporarily unavailable.</div>';}
});