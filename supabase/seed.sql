-- =====================================================
-- SEED DATA — run AFTER schema.sql
-- Contains exactly the data specified in the prompt.
-- =====================================================

-- Profile
insert into profile (
  name, title, hero_intro, about_text, location, email, linkedin, github,
  phone, phone_visible, open_to_work
) values (
  'Dhinesh Shanmugam',
  'AI Developer | LLM & Machine Learning Engineer | Full-Stack (FastAPI + React)',
  'B.Tech graduate in Artificial Intelligence and Data Science. I build LLM-powered applications with Python, LangChain, and FastAPI, and I''m currently an AI Developer Intern at Skandax Nexus.',
  E'I''m a B.Tech graduate (2026) in Artificial Intelligence and Data Science from Jeppiaar Engineering College, Chennai. I build LLM applications in Python using LangChain, prompt engineering, and FastAPI REST APIs, and connect them to React front ends.\n\nI have an ML foundation from a Machine Learning internship at Trios Technologies (Scikit-Learn, PyTorch) and I''m currently an AI Developer Intern at Skandax Nexus, where I build LLM-based workflows for an AI pre-production platform.\n\nI''m looking for a Junior AI Developer role building LLM features, and I''m open to related ML and full-stack positions.',
  'Chennai, India',
  'dhinesh280105@gmail.com',
  'https://linkedin.com/in/dhinesh-shanmugam-711531264',
  'https://github.com/DHINESH0123',
  null, false, true
);

-- Statistics
insert into statistics (label, value, suffix, display_order, is_published) values
  ('Internships Completed',                  '2',      '',     1, true),
  ('CGPA',                                   '8.07',   '/10',  2, true),
  ('Languages in Multilingual Chatbot',      '6',      '',     3, true),
  ('Records Processed (EDA)',                '10,000', '+',    4, true),
  ('Best F1-Score (Structured Datasets)',    '89',     '%',    5, true);

-- Skills (published)
insert into skills (name, category, is_published, display_order) values
  ('Python',                       'Languages',                          true,  1),
  ('SQL',                          'Languages',                          true,  2),
  ('LangChain',                    'Generative AI & NLP',               true,  1),
  ('LLM Application Development',  'Generative AI & NLP',               true,  2),
  ('Prompt Engineering',           'Generative AI & NLP',               true,  3),
  ('Prompt Templates',             'Generative AI & NLP',               true,  4),
  ('Conversational Memory',        'Generative AI & NLP',               true,  5),
  ('Generative AI APIs',           'Generative AI & NLP',               true,  6),
  ('Groq-hosted LLMs',             'Generative AI & NLP',               true,  7),
  ('Scikit-Learn',                 'Machine Learning & Deep Learning',  true,  1),
  ('PyTorch',                      'Machine Learning & Deep Learning',  true,  2),
  ('Vision Transformer (ViT)',     'Machine Learning & Deep Learning',  true,  3),
  ('OpenCV',                       'Machine Learning & Deep Learning',  true,  4),
  ('NumPy',                        'Machine Learning & Deep Learning',  true,  5),
  ('Pandas',                       'Machine Learning & Deep Learning',  true,  6),
  ('Model Evaluation',             'Machine Learning & Deep Learning',  true,  7),
  ('Hyperparameter Tuning',        'Machine Learning & Deep Learning',  true,  8),
  ('Feature Engineering',          'Machine Learning & Deep Learning',  true,  9),
  ('FastAPI',                      'Backend & APIs',                    true,  1),
  ('REST APIs',                    'Backend & APIs',                    true,  2),
  ('Streamlit',                    'Backend & APIs',                    true,  3),
  ('React',                        'Backend & APIs',                    true,  4),
  ('Oracle SQL',                   'Databases',                         true,  1),
  ('MySQL',                        'Databases',                         true,  2),
  ('Git',                          'Tools',                             true,  1),
  ('GitHub',                       'Tools',                             true,  2),
  ('Jupyter Notebook',             'Tools',                             true,  3),
  ('VS Code',                      'Tools',                             true,  4);

-- Skills (draft)
insert into skills (name, category, is_published, display_order) values
  ('JavaScript',               'Languages',                          false, 3),
  ('HTML',                     'Languages',                          false, 4),
  ('CSS',                      'Languages',                          false, 5),
  ('Hugging Face Transformers','Machine Learning & Deep Learning',  false, 10),
  ('MediaPipe',                'Machine Learning & Deep Learning',  false, 11),
  ('Excel',                    'Tools',                             false, 5),
  ('Power BI',                 'Tools',                             false, 6),
  ('Power Query',              'Tools',                             false, 7),
  ('DAX',                      'Tools',                             false, 8);

-- Projects (published)
insert into projects (title, year, description, tech_tags, result_metric, result_note, is_featured, is_published, display_order) values
(
  'Deepfake Image and Video Detection System', 2026,
  'Trained a Vision Transformer in PyTorch to detect manipulated images and videos. Built an OpenCV pipeline for frame extraction, normalization, and augmentation, and exposed the model through a FastAPI REST API for real-time inference.',
  array['PyTorch','Vision Transformer (ViT)','FastAPI','OpenCV'],
  '90% detection accuracy',
  'Validation metric on a development dataset, not a guarantee of real-world accuracy. Final evaluation details (e.g. 94% on 600-sample validation set) to be confirmed before publishing.',
  true, true, 1
),
(
  'FinSight AI: Financial Analysis Platform', 2026,
  'A stock and IPO analysis platform covering fundamentals, trends, and comparisons, with an LLM-powered chatbot that answers natural-language queries. Includes IPO and stock dashboards with subscription data, GMP, issue details, and company insights on a FastAPI backend with a React frontend.',
  array['Python','FastAPI','React','SQL','LLM','Pandas'],
  null, null, false, true, 2
),
(
  'Multilingual AI Chatbot', 2025,
  'Supports English, Tamil, Hindi, French, German, and Japanese. Uses structured prompt templates with system instructions and session-based conversational memory (up to 100 turns). Powered by Groq-hosted LLMs including Gemma 2 9B and Llama 3.3 70B.',
  array['Python','LangChain','Groq-hosted LLMs','Prompt Engineering','Streamlit'],
  null, null, false, true, 3
),
(
  'Notepad LLM – PDF Analyzer', 2025,
  'An LLM-powered PDF analysis tool built with Streamlit, LangChain, and Google Generative AI.',
  array['Streamlit','LangChain','Google Generative AI'],
  null, null, false, true, 4
),
(
  'Spotify Analytics Dashboard', 2025,
  'ETL pipeline with data cleaning and analysis of 765+ tracks. Explores trends in audio features, popularity, and artist analytics.',
  array['Excel','ETL','Data Cleaning','Data Analysis'],
  null, null, false, true, 5
),
(
  'EV Charging Demand Prediction', 2025,
  'Time-series feature engineering with a model progression from Linear Regression to XGBoost to LSTM. Uses time-based train/test splitting and Streamlit deployment.',
  array['Python','XGBoost','LSTM','Streamlit','Feature Engineering'],
  null, null, false, true, 6
);

-- Projects (draft)
insert into projects (title, year, tech_tags, is_featured, is_published, display_order) values
  ('ML Model Recommendation System', 2025, array['LightGBM','Meta-learning','Streamlit'], false, false, 7),
  ('Healthcare SQL Analysis',        2025, array['SQL'],                                   false, false, 8),
  ('MONK ENTERTAINMENT',             2025, array['React','Admin Upload','Music'],           false, false, 9);

-- Internships
insert into internships (role, company, location, start_date, end_date, is_ongoing, bullets, is_published, display_order) values
(
  'AI Developer Intern', 'Skandax Nexus', null, '2026-07', null, true,
  array[
    'Built LLM-based story, script, and character generation workflows for an AI pre-production platform using Python, LangChain, and Generative AI APIs.',
    'Developed FastAPI backend services and connected them to React applications to serve LLM-generated outputs to users.',
    'Built a location-based trend module that pulls data from external APIs, including YouTube and news sources, and processes it into insights.'
  ],
  true, 1
),
(
  'Machine Learning Engineer Intern', 'Trios Technologies Pvt. Ltd.', 'Chennai', '2024-06', '2024-07', false,
  array[
    'Developed and evaluated 5+ regression and classification models in Python with Scikit-Learn, reaching up to 89% F1-score on structured datasets.',
    'Performed EDA and feature engineering on 10,000+ records, removing 95% of null and duplicate values, and improved model accuracy by about 12% with GridSearchCV tuning.'
  ],
  true, 2
);

-- Education
insert into education (degree, institution, location, start_year, end_year, grade, is_published, display_order) values
  ('B.Tech, Artificial Intelligence and Data Science', 'Jeppiaar Engineering College', 'Chennai', 2022, 2026, 'CGPA 8.07/10', true, 1),
  ('Higher Secondary Education (HSC)', 'Little Flower Matric Hr. Sec. School', 'Chennai', 2020, 2022, '86.5%', true, 2);

-- Certificates (NPTEL — credential IDs and files to be added later)
insert into certificates (title, issuer, issue_year, is_published, display_order) values
  ('Data Analytics with Python',           'NPTEL', 2025, true, 1),
  ('Database Management System (DBMS)',    'NPTEL', 2026, true, 2),
  ('Cloud Computing',                      'NPTEL', 2026, true, 3);
