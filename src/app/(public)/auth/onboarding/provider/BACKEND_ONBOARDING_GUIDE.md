# Provider Onboarding Flow - Backend Integration Guide

## Overview

This document provides a detailed walkthrough of the provider onboarding process, explaining each input field, user interaction, and the expected data structure for backend integration.

## Complete User Journey

### 1. Role Selection & Redirect

**Page**: `/auth/onboarding/page.tsx`

**User Experience**:

1. User lands on role selection page
2. Sees two options: "Service Provider" and "Service Seeker"
3. User clicks on "Service Provider" card (becomes selected with green styling)
4. User clicks "Continue" button
5. System redirects to `/auth/onboarding/provider/page.tsx`

**Data Sent**:

```json
{
  "selectedRole": "provider",
  "userId": "user_12345",
  "redirectedAt": "2025-09-24T10:30:00Z"
}
```

---

## 2. Step 1: Create Profile

**Page**: `createProfileStep.tsx`
**Progress**: Dot 1 of 5 (green), rest gray

### User Fills Out Profile Information:

**1. Personal Information Form**:

- **Full Name**: User types "John Smith"
- **Professional Title**: User types "Senior Software Engineer"
- **Current Company**: User types "Tech Solutions Inc."
- **Years of Experience**: User types "8 years"
- **Location**: User types "Lagos, Nigeria"

**2. Account Type Selection**:

- User sees 4 cards in 2x2 grid layout with checkboxes:

  - **Consultant**: "Earn while providing expertise and advice to solve specific problems. Work on project-based engagements with clear deliverables"
  - **Mentor**: "Earn while focusing on long-term relationship building and personal development based on experience in similar situations"
  - **Altruist**: "Shares knowledge and experience freely without expectation of reciprocal or financial benefits"
  - **Mentee**: "A mentor can choose to also be a mentee. Provides the opportunity to learn, receive guidance, advice from other mentors"

- User clicks "Consultant" → card turns green with checkmark
- User clicks "Mentor" → card turns green with checkmark (can select multiple)
- User clicks "Mentee" → card turns green with checkmark
- **Special Rule**: If user clicks "Altruist", all other options become disabled and grayed out (user can only be Altruist)
- **Multi-selection**: User can be Consultant + Mentor + Mentee simultaneously, but Altruist is exclusive

**3. Profile Photo Upload**:

- User sees a drag-and-drop upload area with file icon
- User either:
  - Drags and drops an image file → shows preview with file name and size
  - Clicks to browse → file picker opens → selects image → preview appears
- Accepted formats: JPG, PNG, PDF (max 5MB)
- User can delete and re-upload if needed

**4. Bio Section**:

- User clicks in text area labeled "Tell us about yourself and your professional journey..."
- User types: "I'm a senior software engineer with 8 years of experience in full-stack development. I specialize in React, Node.js, and system architecture..."
- Character counter shows "187/500 characters" (updates live)

**5. Navigation**:

- User clicks "Save and Continue" button (green)
- System validates all required fields
- Progresses to Step 2

---

## 3. Step 2: Expert Portfolio

**Page**: `expertPortfolioStep.tsx`
**Progress**: Dots 1-2 green, dots 3-5 gray

### User Fills Out Expert Information:

**1. Area of Expertise**:

- User clicks dropdown "Select your expertise"
- Dropdown opens showing: ["Software Development", "Data Science", "Product Management", "UI/UX Design", "Marketing", "Business Strategy", "Other"]
- User selects "Software Development"
- Dropdown closes and shows selected value

**2. Education Level**:

- User clicks dropdown "Select education level"
- Options: ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Professional Certification", "Self-taught"]
- User selects "Bachelor's Degree"

**3. Resume Upload**:

- User sees upload area with file icon
- User drags PDF file "john_smith_resume.pdf" or clicks to browse
- File uploads with progress bar
- Shows: "john_smith_resume.pdf (2.3 MB)" with green checkmark
- User can delete and re-upload if needed

**4. LinkedIn Profile**:

- User types: "https://linkedin.com/in/johnsmith"
- Real-time validation shows green checkmark for valid URL

**5. Website/Portfolio** (Optional):

- User types: "https://johnsmith.dev"
- Real-time validation shows green checkmark

**6. Navigation**:

- User clicks "Save and Continue"
- System validates required fields and URL formats
- Progresses to Step 3

---

## 4. Step 3: Video Introduction

**Page**: `videoIntroStep.tsx`
**Progress**: Dots 1-3 green, dots 4-5 gray

### User Records Video Introduction:

**1. Video Recording Process**:

- User sees dark video preview area with camera icon
- User clicks "Record Video" button (green)
- Modal opens full-screen (mobile) or centered (desktop)
- Browser requests camera permission → User clicks "Allow"

**2. Recording Controls**:

- **Camera View**: User sees themselves (front camera by default)
- **Flash Button**: User clicks flash icon → toggles on/off (yellow when active)
- **Camera Flip**: User clicks flip icon → switches front/back camera
- **Timer**: Shows "00:00" at start

**3. Recording Session**:

- User clicks large circular record button (red center)
- Timer starts: "00:01", "00:02"... up to "01:00" max
- Progress ring around button fills up (60-second limit)
- User speaks: "Hi, I'm John Smith, a senior software engineer..."
- User clicks stop button or recording auto-stops at 60 seconds

**4. Video Preview**:

- Recorded video plays automatically (with audio)
- User sees play/pause button above accept/retake buttons
- User clicks pause → video pauses, play button appears
- User clicks play → video resumes
- User decides: clicks green checkmark (Accept) or red X (Retake)

**5. Video Title**:

- User types title: "Hi, I'm John - Your software development mentor"
- Character limit shown

**6. Navigation**:

- User clicks "Save and Continue"
- Video processes and uploads
- Progresses to Step 4

---

## 5. Step 4: Pricing Setup

**Page**: `pricingStep.tsx`
**Progress**: Dots 1-4 green, dot 5 gray

### User Sets Session Pricing:

**User sees 4 pricing cards in 2x2 layout:**

**1. Discovery Call [30 min]\***:

- Title: "Discovery Call [30 min]\*"
- Description: "Initial consultation"
- Input field shows: "Free" (grayed out, non-editable)
- Label: "Free session"

**2. Deep Dive [90 min]\***:

- Title: "Deep Dive [90 min]\*" (green text)
- Description: "Comprehensive mentoring"
- User clicks input field and types: "45"
- Placeholder was: "e.g 30 coins"
- Label: "Coins per session"

**3. Portfolio review [60 min]\***:

- Title: "Portfolio review [60 min]\*" (green text)
- Description: "Review and feedback"
- User types: "30"
- Label: "Coins per session"

**4. Mock Interview [45 min]\***:

- Title: "Mock Interview [45 min]\*" (green text)
- Description: "Interview preparation"
- User types: "35"
- Label: "Coins per session"

**5. Validation**:

- System validates all pricing inputs are positive numbers
- Discovery Call remains free (cannot be changed)

**6. Navigation**:

- User clicks "Save and Continue"
- System saves pricing structure
- Progresses to Step 5 (final step)

---

## 6. Step 5: Availability Setup (Final Step)

**Page**: `availabilityStep.tsx`
**Progress**: All 5 dots green

### User Sets Weekly Availability:

**1. Weekly Availability\***:

- User sees 7 day buttons in a row: [Mon] [Tue] [Wed] [Thu] [Fri] [Sat] [Sun]
- All buttons start unselected (white background, gray border)
- User clicks "Mon" → button turns green with white text
- User clicks "Wed" → button turns green
- User clicks "Thu" → button turns green
- User clicks "Fri" → button turns green
- User clicks "Sat" → button turns green
- Final selection: Mon, Wed, Thu, Fri, Sat (5 days selected)

**2. Time Slots\***:

- User sees 7 time buttons: [9:00 am] [11:00 am] [2:00 pm] [4:00 pm] [5:00 pm] [6:00 pm] [7:00 pm]
- All start unselected (white background)
- User clicks "9:00 am" → turns green
- User clicks "2:00 pm" → turns green
- User clicks "5:00 pm" → turns green
- User clicks "7:00 pm" → turns green
- Final selection: 9:00 am, 2:00 pm, 5:00 pm, 7:00 pm (4 time slots)

**3. Timezone\***:

- User clicks dropdown "Select timezone"
- Search box appears at top: "Search timezone (e.g. GMT, WAT, Pacific)..."
- User types "WAT"
- Dropdown filters to show: "UTC+01:00 - West Africa Time (WAT) - Nigeria, Ghana, Cameroon"
- User clicks that option
- Dropdown closes and shows selected timezone

**4. Final Submission**:

- User clicks "Save and Continue"
- System validates all required fields
- Shows success message: "Profile created successfully!"
- Redirects to dashboard or profile page

---

## 7. Complete Final Data Object

### When user completes all 5 steps, here's the complete data object sent to backend:

```json
{
  "userId": "user_12345",
  "userRole": "provider",
  "onboardingData": {
    "step1_profile": {
      "personalInfo": {
        "fullName": "John Smith",
        "professionalTitle": "Senior Software Engineer",
        "currentCompany": "Tech Solutions Inc.",
        "yearsOfExperience": "8 years",
        "location": "Lagos, Nigeria"
      },
      "accountTypes": {
        "selected": ["consultant", "mentor", "mentee"],
        "isAltruistExclusive": false,
        "selectionRules": {
          "canSelectMultiple": true,
          "altruistDisablesOthers": true
        }
      },
      "profilePhoto": {
        "fileName": "profile_photo.jpg",
        "fileSize": 2048000,
        "fileType": "image/jpeg",
        "fileUrl": "https://cdn.example.com/uploads/user_12345/profile_photo.jpg"
      },
      "bio": {
        "description": "I'm a senior software engineer with 8 years of experience in full-stack development. I specialize in React, Node.js, and system architecture...",
        "characterCount": 187
      }
    },
    "step2_expertise": {
      "expertise": {
        "selected": "Software Development"
      },
      "education": {
        "level": "Bachelor's Degree"
      },
      "resume": {
        "fileName": "john_smith_resume.pdf",
        "fileSize": 2400000,
        "fileType": "application/pdf",
        "fileUrl": "https://cdn.example.com/uploads/user_12345/resume.pdf"
      },
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/johnsmith",
        "website": "https://johnsmith.dev"
      }
    },
    "step3_video": {
      "videoFile": {
        "fileName": "intro_video.webm",
        "fileSize": 15600000,
        "duration": 45,
        "format": "video/webm",
        "resolution": "1280x720",
        "fileUrl": "https://cdn.example.com/uploads/user_12345/intro_video.webm"
      },
      "videoTitle": "Hi, I'm John - Your software development mentor",
      "recordingMethod": "camera",
      "recordingMetadata": {
        "deviceType": "desktop",
        "cameraUsed": "user",
        "recordedAt": "2025-09-24T11:15:00Z",
        "retakeCount": 1
      }
    },
    "step4_pricing": {
      "sessionTypes": {
        "discoveryCall": {
          "duration": 30,
          "price": 0,
          "currency": "coins",
          "description": "Initial consultation"
        },
        "deepDive": {
          "duration": 90,
          "price": 45,
          "currency": "coins",
          "description": "Comprehensive mentoring"
        },
        "portfolioReview": {
          "duration": 60,
          "price": 30,
          "currency": "coins",
          "description": "Review and feedback"
        },
        "mockInterview": {
          "duration": 45,
          "price": 35,
          "currency": "coins",
          "description": "Interview preparation"
        }
      },
      "priceRange": {
        "minimum": 30,
        "maximum": 45,
        "average": 36.67
      }
    },
    "step5_availability": {
      "weeklySchedule": {
        "monday": true,
        "tuesday": false,
        "wednesday": true,
        "thursday": true,
        "friday": true,
        "saturday": true,
        "sunday": false
      },
      "selectedDays": ["Mon", "Wed", "Thu", "Fri", "Sat"],
      "timeSlots": ["09:00", "14:00", "17:00", "19:00"],
      "selectedTimeLabels": ["9:00 am", "2:00 pm", "5:00 pm", "7:00 pm"],
      "timezone": {
        "value": "UTC+01:00 - West Africa Time (WAT) - Nigeria, Ghana, Cameroon",
        "offset": "UTC+01:00",
        "abbreviation": "WAT",
        "location": "West Africa Time"
      },
      "availability": {
        "isActive": true,
        "lastUpdated": "2025-09-24T11:45:00Z"
      }
    }
  },
  "metadata": {
    "completedAt": "2025-09-24T11:45:00Z",
    "totalTimeSpent": 1800,
    "stepCompletionTimes": {
      "step1": 300,
      "step2": 240,
      "step3": 600,
      "step4": 180,
      "step5": 480
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

## 4. API Endpoints Requirements

### Suggested Endpoint Structure:

```
POST /api/onboarding/provider/initialize
- Initialize onboarding session
- Return onboarding ID

PUT /api/onboarding/provider/{onboardingId}/step/{stepNumber}
- Save individual step data
- Allow partial saves

POST /api/onboarding/provider/{onboardingId}/complete
- Final submission
- Trigger profile activation

GET /api/onboarding/provider/{onboardingId}/progress
- Get current progress
- Resume incomplete onboarding

POST /api/uploads/profile-photo
POST /api/uploads/resume
POST /api/uploads/video
- File upload endpoints
- Return secure URLs
```

---

## 5. Validation Rules

### Frontend Validation:

- Real-time form validation
- File type/size restrictions
- Required field indicators
- Character/word count limits

### Backend Validation:

- Data sanitization
- File security scanning
- Duplicate detection
- Business rule enforcement

### Security Considerations:

- File upload security
- Data encryption in transit
- Rate limiting on submissions
- CSRF protection
- Input sanitization

---

## 6. State Management

### Navigation Flow:

- Step progression validation
- Previous step data persistence
- "Go back" functionality
- Progress indicators (5 dots system)

### Error Handling:

- Network error recovery
- File upload failures
- Validation error display
- Auto-save functionality

---

## 7. Integration Points

### Authentication:

- User must be authenticated before onboarding
- Session management throughout flow
- Auto-logout handling

### File Storage:

- Profile photos → CDN/Image service
- Resumes → Secure document storage
- Videos → Media streaming service

### Notifications:

- Onboarding completion emails
- Progress reminder emails
- Profile approval notifications

This guide provides the complete data structure and flow requirements for backend integration of the provider onboarding system.
