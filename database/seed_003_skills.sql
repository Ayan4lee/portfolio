-- Replaces ALL skill rows with the confirmed list. Run after migration_003_skills.sql.
delete from public.skills;
insert into public.skills(name,category,level,proficiency,description,project_slugs,display_order) values
-- Programming Languages
('Python','Programming Languages','Intermediate',0,'Main language for projects and data-analysis learning. I can work with it independently.',array['civic-smart-ai','mini-operating-system-python'],10),
('JavaScript','Programming Languages','Intermediate',0,'Front-end interactivity and server code. I can work with it independently.',array['civic-smart-ai','personal-portfolio-website'],11),
('Java','Programming Languages','Beginner',0,null,'{}',12),
('C++','Programming Languages','Beginner',0,null,'{}',13),
-- Web Development
('HTML5','Web Development','Intermediate',0,'Page structure for my web projects.',array['personal-portfolio-website','civic-smart-ai'],20),
('CSS3','Web Development','Intermediate',0,'Layout and styling for my web projects.',array['personal-portfolio-website','civic-smart-ai'],21),
('Bootstrap 5','Web Development','Intermediate',0,'Responsive layout for this portfolio.',array['personal-portfolio-website'],22),
('Node.js','Web Development','Intermediate',0,'Server-side JavaScript; runs the backend of this portfolio (built with AI assistance). I can work with it independently.',array['personal-portfolio-website'],23),
('Express.js','Web Development','Beginner',0,'API routes and admin backend of this portfolio (built with AI assistance).',array['personal-portfolio-website'],24),
-- Data Science and Machine Learning
('NumPy','Data Science and Machine Learning','Beginner',0,'Practicing numerical computing.','{}',30),
('Pandas','Data Science and Machine Learning','Beginner',0,'Practicing data analysis.','{}',31),
('Matplotlib','Data Science and Machine Learning','Beginner',0,'Practicing data visualization.','{}',32),
('Seaborn','Data Science and Machine Learning','Beginner',0,'Practicing statistical visualization.','{}',33),
('OpenCV','Data Science and Machine Learning','Currently Learning',0,'Learning computer vision basics.','{}',34),
('Scikit-learn','Data Science and Machine Learning','Currently Learning',0,'Learning classical machine learning.','{}',35),
('Machine Learning','Data Science and Machine Learning','Currently Learning',0,'Currently learning through in-person classes and practice.','{}',36),
('Deep Learning','Data Science and Machine Learning','Currently Learning',0,'Currently learning.','{}',37),
-- Databases
('MySQL','Databases','Intermediate',0,null,'{}',40),
-- Hardware and Embedded Systems
('Arduino','Hardware and Embedded Systems','Intermediate',0,'Sensors, modules and microcontroller programming in team projects.',array['lumen-smart-lighting-system','arduino-snake-game-led-matrix'],50),
-- Development Tools
('Git','Development Tools','Intermediate',0,'Version control for my projects.',array['personal-portfolio-website','civic-smart-ai'],60),
('GitHub','Development Tools','Intermediate',0,'Hosting and publishing project repositories.',array['personal-portfolio-website','civic-smart-ai'],61),
('Jupyter Notebook','Development Tools','Beginner',0,null,'{}',62),
-- Design Tools
('Figma','Design Tools','Intermediate',0,'UI/UX design work.',array['graphic-design-portfolio'],70),
('Adobe Photoshop','Design Tools','Intermediate',0,'Graphic design for client and personal projects.',array['graphic-design-portfolio'],71);
