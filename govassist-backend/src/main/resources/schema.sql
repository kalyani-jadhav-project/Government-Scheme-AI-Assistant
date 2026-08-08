-- GovAssist AI Database Schema
-- MySQL 8.x

CREATE DATABASE IF NOT EXISTS govassist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE govassist_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    age INT,
    gender VARCHAR(10),
    state VARCHAR(100),
    district VARCHAR(100),
    occupation VARCHAR(100),
    education VARCHAR(100),
    annual_income DECIMAL(12,2),
    category VARCHAR(50),
    has_aadhaar TINYINT(1) DEFAULT 0,
    has_pan TINYINT(1) DEFAULT 0,
    has_income_certificate TINYINT(1) DEFAULT 0,
    has_caste_certificate TINYINT(1) DEFAULT 0,
    has_domicile TINYINT(1) DEFAULT 0,
    has_ration_card TINYINT(1) DEFAULT 0,
    has_bank_passbook TINYINT(1) DEFAULT 0,
    profile_completed TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Schemes Table
CREATE TABLE IF NOT EXISTS schemes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    ministry VARCHAR(150),
    scheme_type VARCHAR(50),
    state VARCHAR(100),
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 150,
    gender VARCHAR(10) DEFAULT 'ALL',
    max_income DECIMAL(12,2),
    eligible_occupations TEXT,
    eligible_categories TEXT,
    eligible_education VARCHAR(100),
    required_documents TEXT,
    benefits TEXT,
    official_link VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    scheme_id BIGINT NOT NULL,
    eligibility_score INT,
    is_eligible TINYINT(1) DEFAULT 0,
    ineligibility_reasons TEXT,
    missing_documents TEXT,
    ai_explanation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_scheme (user_id, scheme_id),
    CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes (IF NOT EXISTS requires MySQL 8.0.1+)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_eligible ON recommendations(user_id, is_eligible);

-- Seed: Government Schemes
INSERT INTO schemes (name, description, category, ministry, scheme_type, min_age, max_age, gender, max_income, eligible_occupations, eligible_categories, required_documents, benefits, official_link) VALUES

('PM Kisan Samman Nidhi', 'Direct income support of ₹6000/year to small and marginal farmers.', 'Agriculture', 'Ministry of Agriculture', 'CENTRAL', 18, 70, 'ALL', 200000, 'Farmer', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK', '₹6,000 per year in 3 installments of ₹2,000', 'https://pmkisan.gov.in'),

('PM Awas Yojana (Gramin)', 'Affordable housing for rural poor.', 'Housing', 'Ministry of Rural Development', 'CENTRAL', 18, 60, 'ALL', 150000, 'Farmer,Labourer,Unemployed', 'OBC,SC,ST', 'AADHAAR,INCOME_CERTIFICATE,RATION_CARD', '₹1.2 lakh financial assistance for house construction', 'https://pmayg.nic.in'),

('PM Awas Yojana (Urban)', 'Affordable housing scheme for urban poor.', 'Housing', 'Ministry of Housing', 'CENTRAL', 18, 65, 'ALL', 300000, 'ALL', 'GEN,OBC,SC,ST', 'AADHAAR,INCOME_CERTIFICATE,PAN', 'Interest subsidy on home loans up to ₹2.67 lakh', 'https://pmaymis.gov.in'),

('Pradhan Mantri Ujjwala Yojana', 'Free LPG connection to women from BPL households.', 'Energy', 'Ministry of Petroleum', 'CENTRAL', 18, 70, 'FEMALE', 100000, 'ALL', 'OBC,SC,ST', 'AADHAAR,RATION_CARD,BANK_PASSBOOK', 'Free LPG connection + ₹1,600 financial assistance', 'https://pmuy.gov.in'),

('Sukanya Samriddhi Yojana', 'Savings scheme for girl child education and marriage.', 'Education', 'Ministry of Finance', 'CENTRAL', 0, 10, 'FEMALE', 999999999, 'ALL', 'GEN,OBC,SC,ST', 'AADHAAR,PAN', 'Tax-free savings with 8.2% interest rate', 'https://www.india.gov.in/sukanya-samriddhi-yojna'),

('Ayushman Bharat - PMJAY', 'Health insurance cover of ₹5 lakh per family per year.', 'Health', 'Ministry of Health', 'CENTRAL', 0, 150, 'ALL', 150000, 'ALL', 'OBC,SC,ST', 'AADHAAR,RATION_CARD', '₹5 lakh health insurance cover', 'https://pmjay.gov.in'),

('PM Mudra Yojana', 'Loans for micro and small enterprises.', 'Business', 'Ministry of Finance', 'CENTRAL', 18, 65, 'ALL', 999999999, 'Entrepreneur,Self-Employed', 'GEN,OBC,SC,ST', 'AADHAAR,PAN,BANK_PASSBOOK', 'Loans from ₹50,000 to ₹10 lakh without collateral', 'https://mudra.org.in'),

('National Scholarship Portal', 'Scholarships for meritorious students from economically weaker sections.', 'Education', 'Ministry of Education', 'CENTRAL', 14, 30, 'ALL', 250000, 'Student', 'OBC,SC,ST', 'AADHAAR,INCOME_CERTIFICATE,BANK_PASSBOOK', 'Scholarships from ₹5,000 to ₹20,000 per year', 'https://scholarships.gov.in'),

('Atal Pension Yojana', 'Pension scheme for unorganised sector workers.', 'Pension', 'Ministry of Finance', 'CENTRAL', 18, 40, 'ALL', 999999999, 'Labourer,Farmer,Self-Employed', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK', 'Guaranteed pension of ₹1,000-₹5,000/month', 'https://npscra.nsdl.co.in'),

('PM Jeevan Jyoti Bima Yojana', 'Life insurance cover of ₹2 lakh at just ₹436/year.', 'Insurance', 'Ministry of Finance', 'CENTRAL', 18, 50, 'ALL', 999999999, 'ALL', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK', '₹2 lakh life insurance at ₹436/year premium', 'https://jansuraksha.gov.in'),

('PM Suraksha Bima Yojana', 'Accident insurance cover of ₹2 lakh at just ₹20/year.', 'Insurance', 'Ministry of Finance', 'CENTRAL', 18, 70, 'ALL', 999999999, 'ALL', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK', '₹2 lakh accident insurance at ₹20/year', 'https://jansuraksha.gov.in'),

('Kisan Credit Card', 'Easy credit access for farmers for agricultural needs.', 'Agriculture', 'Ministry of Agriculture', 'CENTRAL', 18, 75, 'ALL', 300000, 'Farmer', 'GEN,OBC,SC,ST', 'AADHAAR,PAN,BANK_PASSBOOK', 'Credit up to ₹3 lakh at subsidized interest rates', 'https://www.nabard.org'),

('Beti Bachao Beti Padhao', 'Scheme for welfare and education of girl child.', 'Education', 'Ministry of Women & Child Development', 'CENTRAL', 0, 25, 'FEMALE', 999999999, 'ALL', 'GEN,OBC,SC,ST', 'AADHAAR', 'Educational support, scholarships and awareness', 'https://wcd.nic.in/bbbp-schemes'),

('MGNREGA', 'Guaranteed 100 days of employment to rural households.', 'Employment', 'Ministry of Rural Development', 'CENTRAL', 18, 70, 'ALL', 100000, 'Labourer,Unemployed,Farmer', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK,RATION_CARD', '100 days guaranteed employment at minimum wages', 'https://nrega.nic.in'),

('Startup India', 'Support for eligible startups with tax benefits and funding.', 'Business', 'Ministry of Commerce', 'CENTRAL', 21, 45, 'ALL', 999999999, 'Entrepreneur', 'GEN,OBC,SC,ST', 'AADHAAR,PAN,BANK_PASSBOOK', 'Tax exemptions, funding support up to ₹10 crore', 'https://startupindia.gov.in'),

('Stand Up India', 'Bank loans for SC/ST/Women entrepreneurs.', 'Business', 'Ministry of Finance', 'CENTRAL', 18, 65, 'ALL', 999999999, 'Entrepreneur,Self-Employed', 'SC,ST', 'AADHAAR,PAN,BANK_PASSBOOK,CASTE_CERTIFICATE', 'Loans from ₹10 lakh to ₹1 crore', 'https://standupmitra.in'),

('Post Matric Scholarship (SC)', 'Scholarship for SC students pursuing post-matric education.', 'Education', 'Ministry of Social Justice', 'CENTRAL', 15, 35, 'ALL', 250000, 'Student', 'SC', 'AADHAAR,INCOME_CERTIFICATE,CASTE_CERTIFICATE,BANK_PASSBOOK', 'Full scholarship covering tuition and maintenance', 'https://scholarships.gov.in'),

('Pre Matric Scholarship (ST)', 'Scholarship for ST students in classes 9 and 10.', 'Education', 'Ministry of Tribal Affairs', 'CENTRAL', 12, 18, 'ALL', 200000, 'Student', 'ST', 'AADHAAR,INCOME_CERTIFICATE,CASTE_CERTIFICATE,BANK_PASSBOOK', 'Scholarship for school education', 'https://scholarships.gov.in'),

('Vishwakarma Yojana', 'Support for traditional artisans and craftsmen.', 'Skill Development', 'Ministry of MSME', 'CENTRAL', 18, 60, 'ALL', 200000, 'Artisan,Self-Employed', 'GEN,OBC,SC,ST', 'AADHAAR,BANK_PASSBOOK', 'Free skill training + ₹15,000 toolkit + credit up to ₹3 lakh', 'https://pmvishwakarma.gov.in'),

('Skill India Mission', 'Free skill development training for youth.', 'Skill Development', 'Ministry of Skill Development', 'CENTRAL', 15, 35, 'ALL', 300000, 'Student,Unemployed,Labourer', 'GEN,OBC,SC,ST', 'AADHAAR', 'Free vocational training with certificate', 'https://skillindia.gov.in');
