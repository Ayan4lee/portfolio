-- Real content only. Run AFTER migration_002. WARNING: replaces the old demo skills, education and demo projects.
update public.site_profile set
  full_name='Mushtaque Ali',
  headline='Computer Systems Engineering Student | Aspiring Data Scientist | AI/ML Enthusiast',
  tagline='Building practical solutions through code, creativity and continuous learning.',
  short_bio='Third-year Computer Systems Engineering student at MUET with a strong interest in Data Science, AI and Machine Learning.',
  long_bio='I am a third-year Computer Systems Engineering student with a strong interest in Data Science, Artificial Intelligence and Machine Learning. I enjoy exploring how data and intelligent systems can solve real-world problems. Currently, I am strengthening my skills in Python, data analysis and machine learning while building practical projects. My long-term goal is to pursue a career in Data Science and Machine Learning, where I can combine technical knowledge, creativity and problem-solving.',
  location='Hyderabad, Sindh, Pakistan',
  public_email='ayanalishaikh31@gmail.com',
  github_url='https://github.com/Ayan4lee',
  linkedin_url='https://www.linkedin.com/in/ayan-ali-shaikh-55753933b/',
  behance_url='https://www.behance.net/ayanalishaikh31',
  updated_at=now()
where id=1;
insert into public.site_profile (id,full_name,headline,location,public_email,github_url,linkedin_url,behance_url)
select 1,'Mushtaque Ali','Computer Systems Engineering Student | Aspiring Data Scientist | AI/ML Enthusiast','Hyderabad, Sindh, Pakistan','ayanalishaikh31@gmail.com','https://github.com/Ayan4lee','https://www.linkedin.com/in/ayan-ali-shaikh-55753933b/','https://www.behance.net/ayanalishaikh31'
where not exists (select 1 from public.site_profile where id=1);

delete from public.education;
insert into public.education(institution,degree,field_of_study,start_date,end_date,grade,description,gpa_history,display_order) values
('Mehran University of Engineering and Technology (MUET)','Bachelor of Engineering','Computer Systems Engineering','2024-01-01','2028-12-31','Current CGPA: 3.45','Third year. Expected graduation: 2028.',
 '[{"label":"Semester 1","gpa":3.00},{"label":"Semester 3","gpa":3.70},{"label":"Semester 4","gpa":3.80}]'::jsonb,1);

delete from public.skills;
insert into public.skills(name,category,level,proficiency,display_order) values
('Python','Programming','Intermediate',0,10),('JavaScript','Programming','Beginner',0,11),('Node.js','Programming','Beginner',0,12),
('HTML','Web Development','Intermediate',0,20),('CSS','Web Development','Intermediate',0,21),('Bootstrap','Web Development','Intermediate',0,22),('Node.js','Web Development','Beginner',0,23),('Express.js','Web Development','Beginner',0,24),
('NumPy','Data Science and AI','Beginner',0,30),('Pandas','Data Science and AI','Beginner',0,31),('Matplotlib','Data Science and AI','Beginner',0,32),('Seaborn','Data Science and AI','Beginner',0,33),('OpenCV','Data Science and AI','Beginner',0,34),('Scikit-learn','Data Science and AI','Beginner',0,35),
('Arduino','Other','Intermediate',0,40),('MySQL','Other','Intermediate',0,41),('Git','Other','Intermediate',0,42),('GitHub','Other','Intermediate',0,43),('Figma','Other','Intermediate',0,44),('Adobe Photoshop','Other','Intermediate',0,45);
-- NOTE: skill levels above are starting values (you gave "beginner to intermediate" overall). Adjust per skill if you like.

insert into public.categories(name,slug) values ('Web Development','web-development'),('Graphic Design','graphic-design'),('Software Development','software-development'),('Embedded Systems','embedded-systems') on conflict (slug) do nothing;
delete from public.projects where slug in ('medical-health-analysis','blood-bank-management','arduino-snake-game');
delete from public.projects where slug in ('lumen-smart-lighting-system','civic-smart-ai','personal-portfolio-website','graphic-design-portfolio','arduino-snake-game-led-matrix','mini-operating-system-python');

insert into public.projects(title,slug,summary,description,category_id,tech_stack,status,role,features,repo_url,live_url,is_featured,is_published,display_order) values
('Lumen — Smart Lighting System','lumen-smart-lighting-system','Arduino-based smart lighting that reduces the manual effort of controlling indoor lights.',
 'An Arduino-based smart lighting system designed to reduce the manual effort required to control indoor lighting. The project received encouraging feedback during its presentation. Repository and project media will be added later.',
 (select id from public.categories where slug='embedded-systems'),array['Arduino UNO R3','HC-05 Bluetooth module','Ultrasonic sensor','Relay','LED','Buzzer'],
 'Completed prototype','Team project — Team Lead',array['Automatic light control using an ultrasonic sensor','Bluetooth voice commands','Manual ON/OFF control'],null,null,true,true,1),
('Civic Smart AI','civic-smart-ai','A civic problem-reporting platform for potholes, damaged roads, roadside garbage and other local issues.',
 'A civic problem-reporting platform designed to help citizens report local issues such as potholes, damaged roads, roadside garbage and other neighborhood problems. Keyword-based matching helps process and categorize reported issues. Participated in a competition.',
 (select id from public.categories where slug='software-development'),array['HTML','CSS','JavaScript','Python','FastAPI'],
 'Completed','Team project — Team Lead (full project development and team leadership)',array['Citizen issue reporting','Keyword-based matching to process and categorize reports'],'https://github.com/Ayan4lee/Civic-Smart-AI',null,true,true,2),
('Personal Portfolio Website','personal-portfolio-website','This website: a dynamic portfolio with a protected admin dashboard, built with AI assistance.',
 'A personal portfolio website to showcase identity, education, skills, projects, certificates and professional experience. Built with AI assistance.',
 (select id from public.categories where slug='web-development'),array['HTML','CSS','Bootstrap 5','JavaScript','Node.js','Express.js','Supabase','Vercel'],
 'Completed','Individual project',array['Home and About sections','Skills and Education','Projects showcase','Contact form','Admin dashboard','Dynamic project management (Add, Edit, Delete)','Certificates section'],'https://github.com/Ayan4lee/portfolio','https://ayanali-shaikh.vercel.app/',true,true,3),
('Graphic Design Portfolio','graphic-design-portfolio','More than a year of client and personal design work, currently inactive.',
 'A collection of graphic design work created for clients and personal projects. Independently handled the complete design process. Earned approximately PKR 20,000 per month through local-market design work for around 6–7 months.',
 (select id from public.categories where slug='graphic-design'),array['Adobe Photoshop','Figma'],
 'Currently inactive','Independent designer (complete design process)',array['Social media posts','Flyers and posters','Restaurant menus','YouTube thumbnails','Product manipulation','Logos and branding','UI/UX design'],null,'https://www.behance.net/ayanalishaikh31',false,true,4),
('Arduino Snake Game','arduino-snake-game-led-matrix','Interactive Snake Game on an Arduino UNO, an 8×8 LED matrix and a joystick.',
 'An interactive Snake Game developed using Arduino UNO, an 8×8 LED Matrix and a joystick in the Arduino IDE. Showcased at the university Digital Logic Design (DLD) expo. No repository is available. The image shown is a concept illustration, not a photograph of the build.',
 (select id from public.categories where slug='embedded-systems'),array['Arduino UNO','8×8 LED matrix','Joystick','Arduino IDE'],
 'Completed','Team project — Team Lead',array['Snake movement','Food generation','Score tracking','Collision detection','Game-over system','Restart functionality'],null,null,false,true,5),
('Mini Operating System in Python','mini-operating-system-python','A command-line Mini Operating System with basic system operations and file management.',
 'A command-line-based Mini Operating System developed in Python. It provides commands for basic system operations and file management. No repository is available.',
 (select id from public.categories where slug='software-development'),array['Python'],
 'Completed','Individual project',array['Command-line interface','Help command listing available commands','File and folder creation, renaming, relocation and deletion','File management','System information','User login system','Task/process management','Basic command execution','Calculator'],null,null,false,true,6);
update public.projects set image_url='/assets/img/snake-concept.svg' where slug='arduino-snake-game-led-matrix';

delete from public.certificates; delete from public.achievements; delete from public.experience;
insert into public.achievements(kind,title,role,date_label,location,organizer,result,team_size,competition_teams,participants,description,highlights,website_url,display_order) values
('organizer','System X Hackathon 1.0','Founder and Organizer','1–5 October 2026','Mehran University of Engineering and Technology (MUET)','Department of Computer Systems Engineering, MUET (partner)',null,5,55,220,
 'Create. Collaborate. Conquer. The event attracted attention within the university and from outside the university. I received an organizer certificate.',
 array['Planning and organizing the event','Coordinating with the university and department','Managing participants and teams','Managing problem statements','Event operations and logistics','Awards: 1st PKR 10,000 · 2nd PKR 6,000 · 3rd PKR 4,000 · 4th–8th shields','Certificates for all participants and honored guests (dean, chairperson, judges, teachers)'],'https://systemhackathon.netlify.app',1),
('participant','Open Hack','UI/Frontend Developer','Early October 2026',null,null,'2nd position',3,75,null,null,'{}',null,2),
('participant','AWS Hackathon','UI/Frontend Developer','22–23 October 2026',null,'AWS Society, Software Department','5th position',3,50,null,null,'{}',null,3),
('participant','Denning University Hackathon','UI/Frontend Developer','24–25 October 2026',null,null,'Runner-up',3,160,null,null,'{}','https://karwann-frontend.vercel.app',4);

insert into public.certificates(title,issuer,achievement_id,display_order) values
('System X Hackathon 1.0 — Organizer Certificate','System X Hackathon 1.0, MUET',(select id from public.achievements where title='System X Hackathon 1.0'),1),
('Open Hack — 2nd Position','Open Hack',(select id from public.achievements where title='Open Hack'),2),
('AWS Hackathon — 5th Position','AWS Society, Software Department',(select id from public.achievements where title='AWS Hackathon'),3),
('Denning University Hackathon — Runner-up','Denning University Hackathon',(select id from public.achievements where title='Denning University Hackathon'),4);

insert into public.experience(category,title,organization,period_label,description,highlights,display_order) values
('Experience','Graphic Design','Client and personal projects','More than one year','Independently handled the complete design process. Currently inactive.',array['Local-market earnings of approximately PKR 20,000 per month for 6–7 months','Social media posts, flyers, menus, thumbnails, logos and branding, UI/UX'],1),
('Experience','Founder and Lead Organizer — System X Hackathon 1.0','MUET','October 2026','Led the organizing team of five for a hackathon with 220 participants and 55 teams.',array['Planning, university coordination, participant and problem-statement management, logistics'],2),
('Volunteering','Team Member — Logistics','Pakuraan — Social Work Society',null,'Community support activities.',array['Drives at orphanages','Drives at old-age homes','Helping organize daily Iftar drives during the last 25 days of Ramadan'],3);
