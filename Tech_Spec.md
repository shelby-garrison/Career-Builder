# Tech Spec - Careers Page Builder

## Project Overview
A Next.js 14 application that lets recruiters create branded career pages and candidates browse job openings. Built with MongoDB, JWT auth, and a custom page builder.

## Core Assumptions

### Business Logic
- Each company gets a unique slug for their career page URL
- Recruiters can only edit their own company's pages
- Job postings are company-specific
- Pages can be published/unpublished
- Brand theming is per-company (primary, accent, text colors)

### Technical Constraints
- Next.js 14 App Router for file-based routing
- MongoDB for data persistence with Mongoose ORM
- JWT tokens stored in httpOnly cookies for security
- Edge Runtime compatibility for middleware
- Server-side rendering for SEO

## System Architecture

### Database Schema
```typescript
// Company Model
{
  slug: string (unique, URL-friendly)
  name: string
  theme: {
    primary: string
    accent: string  
    textOnPrimary: string
  }
  sections: Array<{
    id: string
    title: string
    body: string
    titleAlign: 'left' | 'center' | 'right'
  }>
  published: boolean
}

// User Model  
{
  email: string (unique)
  passwordHash: string
  companySlug: string
  role: 'recruiter' | 'candidate'
  profile?: {
    firstName?: string
    lastName?: string
    phone?: string
    resumeUrl?: string
  }
}

// Job Model
{
  title: string
  description: string
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  department: string
  companySlug: string
  published: boolean
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login with email/password
- `POST /api/auth/register` - New recruiter registration
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get current user info

#### Company Management
- `GET /api/companies/[slug]/settings` - Get company data
- `PUT /api/companies/[slug]/settings` - Update company settings
- `GET /api/companies` - List all published companies

#### Job Management
- `GET /api/companies/[slug]/jobs` - List company jobs
- `POST /api/companies/[slug]/jobs` - Create/import jobs
- `PUT /api/companies/[slug]/jobs/[jobId]` - Update specific job
- `DELETE /api/companies/[slug]/jobs/[jobId]` - Delete specific job

### Route Structure
```
/ - Redirects to /companies
/companies - Public company discovery
/login - Recruiter login
/register - New recruiter signup
/[companySlug]/careers - Public career page
/[companySlug]/edit - Protected edit page
/[companySlug]/preview - Protected preview page
```

### Security Model

#### Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Server validates password hash
3. JWT token created with user ID, company slug, email
4. Token stored in httpOnly cookie
5. Middleware validates token on protected routes

#### Authorization Rules
- Only authenticated users can access edit/preview pages
- Users can only edit their own company's pages
- Company slug in JWT must match URL slug
- Public career pages are accessible to everyone

#### Data Protection
- Passwords hashed with SHA-256 
- JWT tokens expire in 7 days
- HttpOnly cookies prevent XSS attacks
- CSRF protection via SameSite cookie policy

## Component Architecture

### Page Components
- `CareersHeader` - Company branding and navigation
- `JobFilters` - Search and filter jobs
- `JobList` - Display job postings
- `SEO` - Meta tags and structured data

### Builder Components
- `SectionsEditor` - Manage page sections
- `ThemeForm` - Brand color customization
- `JobManager` - CRUD operations for jobs
- `JobsImporter` - Bulk job import from JSON

### UI Components
- `Button`, `Input`, `Select`, `TextArea` - Form controls
- `Modal`, `Badge` - Interactive elements
- `ColorPicker` - Theme color selection
