# Tangled - Psychological Assessment

A modern psychological test application built with Next.js that presents visual preference questions to assess cognitive patterns and psychological tendencies.

## Features

- **Clean, minimal design** with modern UI/UX
- **Two-part assessment**:
  - Part 1: 15 questions with 4 image options each
  - Part 2: 14 questions with 2 image options each
- **Interactive confirmation dialog** before starting the test
- **Real-time progress tracking** with question counter
- **Card-based interface** for image selection
- **Responsive design** for all screen sizes

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

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

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Landing page
│   ├── test/
│   │   └── page.tsx       # Test interface
│   └── globals.css        # Global styles
├── components/
│   └── ConfirmationDialog.tsx  # Confirmation modal
└── .github/
    └── copilot-instructions.md # AI coding guidelines
```

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management and side effects

## How It Works

1. **Landing Page**: Users see test information and click "Proceed to Test"
2. **Confirmation Dialog**: A modal asks "Are you sure you want to proceed?"
3. **Test Interface**: 29 questions with image selection, progress tracking
4. **Question Flow**:
   - Questions 1-15: 4 image options each
   - Questions 16-29: 2 image options each

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
