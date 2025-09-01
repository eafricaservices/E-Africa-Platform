This is a The Frontend for the E-Africa Platform

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure Overview

- `.gitignore`  
  Specifies files and folders to exclude from git version control.

- `eslint.config.mjs`  
  ESLint configuration for code linting and style enforcement.

- `next-env.d.ts`  
  TypeScript definitions for Next.js environment.

- `next.config.ts`  
  Next.js configuration file for customizing build and runtime behavior.

- `package.json`  
  Project metadata, dependencies, and scripts.

- `postcss.config.mjs`  
  Configuration for PostCSS, used for processing CSS (with Tailwind).

- `README.md`  
  Project documentation and instructions.

- `tsconfig.json`  
  TypeScript compiler configuration.

- `.next/`  
  Next.js build output and cache directory (auto-generated).

- `public/`  
  Static assets (SVG files) served directly by Next.js.

- `src/`  
  Main source code folder.
  - `middleware.ts`  
    Next.js middleware for handling requests and routing.
  - `app/`  
    Next.js App Router directory.
    - `globals.css`  
      Global CSS styles (includes Tailwind).
    - `layout.tsx`  
      Root layout component for the app.
    - `page.tsx`  
      Home page component.
    - `(public)/auth/`  
      Public authentication pages:
      - `signin/page.tsx`  
        Sign-in page.
      - `signup/page.tsx`  
        Sign-up page.
      - `forget-password/page.tsx`  
        Forgot password page.
      - `reset-password/page.tsx`  
        Reset password page.
    - `(protected)/dashboard/page.tsx`  
      Protected dashboard page (requires authentication).
    - `hooks/`  
      (Reserved for custom React hooks.)
    - `modules/auth/`  
      Authentication module:
      - `types.ts`  
        TypeScript types for authentication.
      - `utils.ts`  
        Helper functions for authentication.

## Notes

- All authentication-related logic and types are in `src/app/modules/auth/`.
- Public and protected pages are organized under `src/app/(public)` and `src/app/(protected)`.
- Static assets are in `public/`.
- Build and cache files are auto-generated in `.next/` and should not be edited directly.