# Careers Page Builder

### Core Features
- **Company Registration**: Recruiters can create accounts and set up their company's careers page
- **Brand Customization**: Full theme control (primary/accent colors, logos, banners, videos)
- **Content Management**: Custom sections with title alignment options
- **Job Management**: Complete CRUD operations for job postings with search and filtering
- **Public Discovery**: Candidates can browse all published company pages
- **Real-time Preview**: Changes reflect immediately without manual refresh
- **SEO Optimization**: Structured data, meta tags and crawlable content

### User Flows
1. **Recruiter**: Register → Customize Brand → Add Content → Manage Jobs → Publish
2. **Candidate**: Browse Companies → Filter Jobs → Apply to Positions

## How to Run

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- npm or yarn

### Installation
```bash
# Clone the repository and navigate to root directory
git clone <repo-url>
cd <repo-name>

# Install dependencies
npm install

# Set up environment variables
Setup a .env file as instructed below

# Run the development server
npm run dev
```

### Environment Setup
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/careers-builder
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Database Setup
The application will automatically create the necessary collections and indexes on first run.

## Step-by-Step User Guide

### For Recruiters

#### 1. Create Account
- Visit `/register`
- Enter email, password, and company name
- System creates unique company slug (e.g., "acme", "techcorp-1")
- Automatically redirected to edit page

#### 2. Customize Brand
- **Primary Color**: Main brand color (used for primary background)
- **Accent Color**: Secondary color (used for accents, borders)
- **Text on Primary**: Text color for readability on primary backgrounds
- **Logo**: Upload company logo 
- **Banner**: Upload hero banner image
- **Video**: Add culture video URL

#### 3. Add Content Sections
- Click "Add Section" to create new content blocks
- Set title, body text, and alignment (left/center/right)
- Reorder sections with up/down arrows
- Remove sections as needed

#### 4. Manage Jobs
- **Import Jobs**: Use JSON import for bulk job creation
- **Add Individual Jobs**: Use the job manager for detailed job creation
- **Edit Jobs**: Update job details, requirements, and application URLs
- **Delete Jobs**: Remove outdated positions

#### 5. Preview and Publish
- Click "Preview" to see how the page looks to candidates
- Toggle "Published" to make the page public
- Share the public URL: `/{company-slug}/careers`

### For Candidates

#### 1. Discover Companies
- Visit `/companies` to see all published companies
- Browse company cards with their branding
- Click to view their careers page

#### 2. Browse Jobs
- Use search bar to find jobs by title or keywords
- Filter by location and job type
- View job details and requirements
- Click "Apply" to go to external application

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: CSS custom properties for theme inheritance

### Key Components
- **Multi-tenant**: Each company isolated by unique slug
- **Real-time**: Immediate preview updates without refresh
- **SEO-ready**: Structured data and meta tags
- **Accessible**: WCAG compliant with screen reader support

## Improvement Plan

### Phase 1: Enhanced Features
- [ ] **Advanced Job Management**: Job categories, salary ranges, application tracking
- [ ] **Analytics Dashboard**: Page views, job applications, candidate engagement
- [ ] **Email Notifications**: New job alerts, application confirmations
- [ ] **Company Profiles**: Detailed company information, team photos, culture videos

### Phase 2: Candidate Experience
- [ ] **Candidate Accounts**: Save job searches, application history
- [ ] **Job Recommendations**: AI-powered job matching
- [ ] **Application Tracking**: Status updates, interview scheduling
- [ ] **Resume Builder**: Integrated resume creation and management

### Phase 3: Enterprise Features
- [ ] **Role-based Permissions**: Admin, editor, viewer roles
- [ ] **API Access**: RESTful API for third-party integrations
- [ ] **White-label Options**: Custom domains, advanced branding

### Phase 4: Advanced Analytics
- [ ] **Conversion Tracking**: Job application funnel analysis
- [ ] **A/B Testing**: Page layout and content optimization
- [ ] **Candidate Insights**: Demographics, behavior patterns
- [ ] **ROI Reporting**: Cost per hire, time to fill metrics
