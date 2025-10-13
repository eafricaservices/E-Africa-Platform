# Provider Onboarding Field Reference

This document lists every data input collected during the provider onboarding flow. Use it to validate payloads server-side and to understand any business rules enforced in the UI.

## Step 1 – Create Your Profile

- **fullName** (string, required)
- **professionalTitle** (string, required)
- **currentCompany** (string, required)
- **yearsOfExperience** (number, required) – positive whole numbers only.
- **location** (string, required) – free-form "City, Country" text.
- **accountTypes** (string[], required)
  - Allowed values: `consultant`, `mentor`, `mentee`, `altruist`.
  - `altruist` is mutually exclusive. If it is selected, no other value may be submitted. Frontend already disables the other options, but the API should still enforce the rule.
- **profilePhoto** (file upload, optional but encouraged)
  - Accepts: JPG, JPEG, PNG, PDF, WEBP, GIF.
  - Max size: 5 MB.
- **bio** (string, required) – up to 500 characters.

## Step 2 – Expert Portfolio

- **primaryExpertise** (string, required)
  - Prefers one value. Built-in list includes: Technology/Software, Healthcare/Medical, Finance/Banking, Marketing/Advertising, Education, Retail/E-commerce, Manufacturing, Consulting, Real Estate, Government, Non-profit.
  - Selecting "Other (please specify)" lets the user submit a free-form string; expect custom values.
- **educationLevel** (string, required)
  - Allowed values: `OND`, `HND`, `Bachelors`, `Masters`, `Doctorate [PhD]`.
- **portfolioOrResume** (file upload, required)
  - Accepts: PDF, DOC, DOCX.
  - Max size: 10 MB.
- **linkedinProfileUrl** (URL, required).
- **websiteUrl** (URL, required) – personal site or portfolio.

## Step 3 – Video Introduction

- **videoTitle** (string, required).
- **introVideo** (file/blob, required)
  - Recorded in-app or uploaded by the user.
  - Accepts standard browser MediaRecorder outputs (WebM/VP8/VP9) and user uploads (MP4, etc.).
  - Runtime must not exceed 60 seconds. The modal shows warnings at 30 and 10 seconds remaining and stops automatically at 60 seconds.
- **videoDurationSeconds** (number) – include when known to guard the 60-second rule server-side.

## Step 4 – Pricing Setup

All prices are entered in "coins" except the Discovery Call, which is locked to free in the UI. Treat blanks as `null` or reject them depending on business rules.

- **discoveryCall** (object)
  - `durationMinutes`: 30 (fixed).
  - `priceCoins`: 0 (free session).
- **deepDiveSession** (object)
  - `durationMinutes`: 90 (fixed).
  - `priceCoins` (number, required).
- **portfolioReviewSession** (object)
  - `durationMinutes`: 60 (fixed).
  - `priceCoins` (number, required).
- **mockInterviewSession** (object)
  - `durationMinutes`: 45 (fixed).
  - `priceCoins` (number, required).

## Step 5 – Availability

- **availableDays** (string[], required)
  - Values chosen from `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`, `Sun`.
- **preferredTimeSlots** (string[], required)
  - Values chosen from `9:00 am`, `11:00 am`, `2:00 pm`, `4:00 pm`, `5:00 pm`, `6:00 pm`, `7:00 pm` (UI currently uses this list; treat as configurable).
- **timezone** (string, required)
  - Human-readable label returned by the dropdown (e.g., `UTC+01:00 - West Africa Time (WAT) - Nigeria, Ghana, Cameroon`). Consider normalising to an IANA identifier server-side if needed.

## Completion Step

- **optInToJobs** (boolean, optional) – defaults to `false`. Indicates whether the provider wants to post job opportunities to the community.

---

## Example Payloads

```json
{
  "createProfile": {
    "fullName": "Ada Lovelace",
    "professionalTitle": "Senior Data Scientist",
    "currentCompany": "Analytica Labs",
    "yearsOfExperience": 8,
    "location": "Lagos, Nigeria",
    "accountTypes": ["consultant", "mentor"],
    "profilePhoto": {
      "fileName": "ada-lovelace.png",
      "contentType": "image/png",
      "storageKey": "uploads/profile/ada-lovelace.png"
    },
    "bio": "I help data teams build responsible AI products."
  }
}
```

```json
{
  "expertPortfolio": {
    "primaryExpertise": "Technology/Software",
    "educationLevel": "Masters",
    "portfolioOrResume": {
      "fileName": "ada-resume.pdf",
      "contentType": "application/pdf",
      "storageKey": "uploads/resume/ada-resume.pdf"
    },
    "linkedinProfileUrl": "https://www.linkedin.com/in/adalovelace",
    "websiteUrl": "https://adalovelace.dev"
  }
}
```

```json
{
  "videoIntroduction": {
    "videoTitle": "Meet Ada – Your AI Mentor",
    "introVideo": {
      "fileName": "ada-intro.webm",
      "contentType": "video/webm",
      "storageKey": "uploads/video/ada-intro.webm"
    },
    "videoDurationSeconds": 58
  }
}
```

```json
{
  "pricingSetup": {
    "discoveryCall": { "durationMinutes": 30, "priceCoins": 0 },
    "deepDiveSession": { "durationMinutes": 90, "priceCoins": 45 },
    "portfolioReviewSession": { "durationMinutes": 60, "priceCoins": 35 },
    "mockInterviewSession": { "durationMinutes": 45, "priceCoins": 30 }
  }
}
```

```json
{
  "availability": {
    "availableDays": ["Tue", "Thu", "Sat"],
    "preferredTimeSlots": ["11:00 am", "2:00 pm", "6:00 pm"],
    "timezone": "UTC+01:00 - West Africa Time (WAT) - Nigeria, Ghana, Cameroon",
    "optInToJobs": true
  }
}
```
