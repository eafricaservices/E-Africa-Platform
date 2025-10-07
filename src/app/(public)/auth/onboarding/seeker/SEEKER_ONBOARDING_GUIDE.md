# Seeker Onboarding Flow - Backend Integration Guide

## Overview

This document provides a detailed walkthrough of the seeker onboarding process, explaining each input field, user interaction, and the expected data structure for backend integration. The seeker flow consists of 4 main steps that guide users through their career development journey setup.

## Complete User Journey

### 1. Role Selection & Redirect

**Page**: `/auth/onboarding/page.tsx`

**User Experience**:

1. User lands on role selection page
2. Sees two options: "Service Provider" and "Service Seeker"
3. User clicks on "Service Seeker" card (becomes selected with green styling)
4. User clicks "Continue" button
5. System redirects to `/auth/onboarding/seeker/personal-information`

**Data Sent**:

```json
{
  "selectedRole": "seeker",
  "userId": "user_12345",
  "redirectedAt": "2025-09-29T10:30:00Z"
}
```

---

## 2. Step 1: Personal Information

**Page**: `personal-information/page.tsx`
**Progress**: Step 1 of 4 (25% Complete)

### User Fills Out Personal Information:

**1. Full Name**:

- User types: "Jane Doe"
- Required field with text input validation

**2. Location Details**:

- **City**: User types "Lagos"
- **State**: User types "Lagos State"
- **Country**: User types "Nigeria"
- All location fields are text inputs with placeholder examples

**3. Years of Experience**:

- Number input field (minimum 0)
- User enters: "2" (representing 2 years)
- Accepts whole numbers only

**4. Career Stage\***:

- **Required field** with dropdown selection
- User clicks dropdown to see options:
  - "Student/Recent Graduate"
  - "Entry Level (0-2 years)"
  - "Mid-Level (3-5 years)"
  - "Senior Level (6-10 years)"
- User selects: "Entry Level (0-2 years)"
- Single-choice selection with chevron-down indicator

**5. Bio**:

- Textarea with 500 character limit
- User types: "I'm a passionate frontend developer looking to advance my career in tech. I have experience with React and JavaScript and am eager to learn more about UI/UX design..."
- Live character counter shows: "147 / 500"
- Placeholder: "Tell us about yourself and your professional journey..."

**6. Navigation**:

- Header shows current step progress
- Footer contains "Continue" button
- Progress bar shows 25% completion

---

## 3. Step 2: Career Goals

**Page**: `career-goals/page.tsx`
**Progress**: Step 2 of 4 (50% Complete)

### User Defines Career Objectives:

**1. Preferred Career Path** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "Product Design"
  - "Software Development"
  - "Data Science & Analytics"
  - "Digital Marketing"
- User can select multiple options
- User selects: ["Software Development", "Product Design"]
- Selected items appear as tags with remove option
- Placeholder: "e.g., Product Design"

**2. Primary Career Goal** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "Find Remote Job"
  - "Get Internship"
  - "Career Transition"
  - "Skill Development"
  - "Networking with Experts"
- User can choose multiple goals
- User selects: ["Find Remote Job", "Skill Development"]
- Selected items displayed as removable tags

**3. Industry Of Interest** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "Education"
  - "Tech"
  - "Health"
  - "Finance"
  - "Marketing"
- User can select multiple industries
- User selects: ["Tech", "Finance"]
- Supports custom value addition via input field

**4. Target Job Role(s)** (Optional):

- Simple text input field
- User types: "Frontend Developer, UI/UX Designer"
- Placeholder: "e.g., UX Designer, Backend Developer, e.t.c."
- Optional field - no validation required

**5. Expected Timeline to Achieve Goal** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "0-3 months"
  - "3-6 months"
  - "6-12 months"
  - "1-2 years"
- User can select multiple timeframes
- User selects: ["3-6 months", "6-12 months"]
- Placeholder: "Select. e.g., 0-3 months, 3-6 months, e.t.c."

**6. Navigation**:

- Progress bar shows 50% completion
- Footer contains navigation buttons

---

## 4. Step 3: Skills & Expertise

**Page**: `skills/page.tsx`
**Progress**: Step 3 of 4 (75% Complete)

### User Documents Technical Abilities:

**1. Core Skills** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "UI/UX Design"
  - "Mobile Development"
  - "Frontend"
  - "Backend"
  - "Python"
- User can select multiple skills
- User selects: ["Frontend", "UI/UX Design", "Python"]
- Supports custom skill addition
- Placeholder: "e.g., UI/UX Design, HTML, Python"

`**2. Current Skill Level** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "Beginner"
  - "Intermediate"
  - "Advanced"
  - "Expert"
- User can select multiple levels (for different skills)
- User selects: ["Beginner", "Intermediate"]
- Placeholder: "Select e.g., Beginner / Intermediate"

**3. Tools and Technologies** (Multi-Select):

- **Multi-choice dropdown** with options:
  - "Figma"
  - "Adobe XD"
  - "VS Code"
  - "Jira"
  - "GitHub"
- User can select multiple tools
- User selects: ["Figma", "VS Code", "GitHub"]
- Supports custom tool addition
- Placeholder: "e.g., Figma, VS Code"

**4. Years of Experience** (Single Select):

- **Single-choice dropdown** with options:
  - "0-3 months"
  - "3-6 months"
  - "6-12 months"
  - "1-2 years"
  - "2+ years"
- User selects: "1-2 years"
- Label: "Select your experience level"

**5. Certifications** (Optional File Upload):

- **File upload area** with drag-and-drop functionality
- User clicks "Choose file(s)" button or drags files
- Accepted formats: JPG, PDF (max 10MB per file)
- Multiple file selection supported
- Uploaded files show with checkmark icon and remove option
- Files display: "Google_UX_Certificate.pdf", "React_Completion.jpg"
- Upload icon with yellow background
- Description: "Provide certification documents relevant to your career"

**6. Navigation**:

- Progress bar shows 75% completion
- Footer contains navigation buttons

---

## 5. Step 4: Final Details (Final Step)

**Page**: `final-details/page.tsx`
**Progress**: Step 4 of 4 (100% Complete)

### User Completes Profile with Links and Additional Certifications:

**1. Certifications** (Optional File Upload - Repeated):

- **Same upload functionality as Step 3**
- File upload area with drag-and-drop
- Accepted formats: DOC, DOCX, PDF (max 10MB per file)
- User uploads: "Advanced_JavaScript_Certificate.pdf"
- Multiple file selection with remove functionality
- Upload icon with yellow background

**2. LinkedIn Profile**:

- URL input field with validation
- User types: "https://linkedin.com/in/janedoe-dev"
- Placeholder: "https://linkedin.com/in/your-profile"
- Real-time URL format validation
- Green border for valid URLs

**3. Portfolio**:

- URL input field
- User types: "https://janedoe-portfolio.netlify.app"
- Placeholder: "https://your-portfolio.com"
- Optional field with URL validation

**4. Additional Links** (Dynamic Field Addition):

- **Dynamic link addition system**
- User clicks "Add another link" button (with Plus icon)
- Each link has two fields:
  - **Label**: Text input "Label (e.g. GitHub, Blog, Behance)"
  - **URL**: URL input "https://example.com"
- User adds multiple links:
  - Label: "GitHub", URL: "https://github.com/janedoe"
  - Label: "Behance", URL: "https://behance.net/janedoe"
  - Label: "Blog", URL: "https://janedoe.dev/blog"
- Each link pair displayed on same row (1/3 width label, 2/3 width URL)
- Supports unlimited link additions

**5. Final Submission**:

- Progress bar shows 100% completion
- Footer contains final submission button
- All form data validated before submission
- Success redirect to dashboard or confirmation page

---

## 6. Complete Final Data Object

### When user completes all 4 steps, here's the complete data object sent to backend:

```json
{
  "userId": "user_12345",
  "userRole": "seeker",
  "onboardingData": {
    "step1_personalInformation": {
      "personalInfo": {
        "fullName": "Jane Doe",
        "location": {
          "city": "Lagos",
          "state": "Lagos State",
          "country": "Nigeria"
        },
        "yearsOfExperience": 2,
        "careerStage": "Entry Level (0-2 years)"
      },
      "bio": {
        "description": "I'm a passionate frontend developer looking to advance my career in tech. I have experience with React and JavaScript and am eager to learn more about UI/UX design...",
        "characterCount": 147
      }
    },
    "step2_careerGoals": {
      "preferredCareerPath": ["Software Development", "Product Design"],
      "primaryCareerGoal": ["Find Remote Job", "Skill Development"],
      "industryOfInterest": ["Tech", "Finance"],
      "targetJobRoles": "Frontend Developer, UI/UX Designer",
      "expectedTimeline": ["3-6 months", "6-12 months"]
    },
    "step3_skillsExpertise": {
      "coreSkills": ["Frontend", "UI/UX Design", "Python"],
      "currentSkillLevel": ["Beginner", "Intermediate"],
      "toolsAndTechnologies": ["Figma", "VS Code", "GitHub"],
      "yearsOfExperience": "1-2 years",
      "certifications": [
        {
          "fileName": "Google_UX_Certificate.pdf",
          "fileSize": 5240000,
          "fileType": "application/pdf",
          "fileUrl": "https://cdn.example.com/uploads/user_12345/google_ux_cert.pdf"
        },
        {
          "fileName": "React_Completion.jpg",
          "fileSize": 3100000,
          "fileType": "image/jpeg",
          "fileUrl": "https://cdn.example.com/uploads/user_12345/react_cert.jpg"
        }
      ]
    },
    "step4_finalDetails": {
      "additionalCertifications": [
        {
          "fileName": "Advanced_JavaScript_Certificate.pdf",
          "fileSize": 4800000,
          "fileType": "application/pdf",
          "fileUrl": "https://cdn.example.com/uploads/user_12345/js_advanced_cert.pdf"
        }
      ],
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/janedoe-dev",
        "portfolio": "https://janedoe-portfolio.netlify.app"
      },
      "additionalLinks": [
        {
          "label": "GitHub",
          "url": "https://github.com/janedoe"
        },
        {
          "label": "Behance",
          "url": "https://behance.net/janedoe"
        },
        {
          "label": "Blog",
          "url": "https://janedoe.dev/blog"
        }
      ]
    }
  },
  "metadata": {
    "completedAt": "2025-09-29T14:30:00Z",
    "totalTimeSpent": 1200,
    "stepCompletionTimes": {
      "step1": 300,
      "step2": 400,
      "step3": 350,
      "step4": 150
    },
    "deviceInfo": {
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
      "screenResolution": "1920x1080",
      "deviceType": "desktop"
    }
  },
  "status": "completed",
  "version": "1.0"
}
```

---

## 7. Multi-Select Dropdown Functionality

### How Multi-Select Components Work:

**1. Selection Behavior**:

- Click dropdown → shows available options
- Click option → adds to selection (shows as tag)
- Click same option again → removes from selection
- Selected items appear as removable tags below dropdown
- Each tag has an 'X' button for individual removal

**2. Custom Value Addition**:

- Some dropdowns support custom value input
- User types custom value in input field
- Press Enter or blur to add custom option
- Custom options treated same as predefined options

**3. Visual States**:

- **Closed**: Shows placeholder or selected count
- **Open**: Shows all options with checkmarks for selected
- **Selected Items**: Display as green tags with remove buttons
- **Empty State**: Shows placeholder text

**4. Search Functionality**:

- Some dropdowns include search/filter capability
- User types to filter visible options
- Maintains selection state during search

---

## 8. API Endpoints Requirements

### Suggested Endpoint Structure:

```
POST /api/onboarding/seeker/initialize
- Initialize onboarding session
- Return onboarding ID

PUT /api/onboarding/seeker/{onboardingId}/step/{stepNumber}
- Save individual step data
- Allow partial saves

POST /api/onboarding/seeker/{onboardingId}/complete
- Final submission
- Trigger profile activation

GET /api/onboarding/seeker/{onboardingId}/progress
- Get current progress
- Resume incomplete onboarding

POST /api/uploads/certifications
POST /api/uploads/documents
- File upload endpoints for certifications
- Return secure URLs

GET /api/onboarding/options/{category}
- Get dropdown options (skills, industries, tools, etc.)
- Support for dynamic option loading
```

---

## 9. Validation Rules

### Frontend Validation:

**Step 1 Requirements**:

- Full Name: Required, minimum 2 characters
- Career Stage: Required selection from dropdown
- Bio: Optional, maximum 500 characters
- Location fields: Optional text inputs

**Step 2 Requirements**:

- At least one Preferred Career Path selection required
- At least one Primary Career Goal selection required
- At least one Industry of Interest selection required
- Target Job Roles: Optional text input
- Expected Timeline: At least one selection required

**Step 3 Requirements**:

- At least one Core Skill selection required
- At least one Skill Level selection required
- Years of Experience: Required single selection
- Tools and Certifications: Optional

**Step 4 Requirements**:

- All fields optional
- URL validation for LinkedIn, Portfolio, and Additional Links
- File format validation for certifications

### Backend Validation:

- Data sanitization for all text inputs
- URL format validation for all link fields
- File security scanning for uploads
- Multi-select array validation
- Character limits enforcement
- Required field validation

### Security Considerations:

- File upload security (size, type, content scanning)
- Data encryption in transit
- Input sanitization to prevent XSS
- Rate limiting on form submissions
- CSRF protection for file uploads

---

## 10. State Management

### Progress Tracking:

- 4-step linear progression (25%, 50%, 75%, 100%)
- Step validation before progression
- Data persistence between steps
- Resume functionality for incomplete flows

### Multi-Select State:

- Array-based selection storage
- Tag-based visual representation
- Add/remove functionality for individual items
- Custom value addition support

### File Upload State:

- Multiple file handling per upload area
- File validation and preview
- Remove functionality for uploaded files
- Progress indication during upload

### Error Handling:

- Real-time validation feedback
- Network error recovery for submissions
- File upload failure handling
- Form state preservation on errors

---

## 11. Integration Points

### Authentication:

- User must be authenticated before starting onboarding
- Session management throughout 4-step flow
- Auto-logout handling during long forms

### File Storage:

- Certifications → Secure document storage
- Multiple file format support (PDF, DOC, DOCX, JPG)
- CDN integration for fast file access

### Dynamic Data:

- Dropdown options loaded from API
- Support for custom value additions
- Industry/skill/tool catalogs maintained server-side

### Notifications:

- Onboarding completion emails
- Progress reminder emails for incomplete flows
- Profile review notifications

This guide provides the complete data structure and flow requirements for backend integration of the seeker onboarding system, emphasizing the multi-select functionality and comprehensive form handling across all 4 steps.
