
# FitVerse Avatar Lab

A virtual try-on application that creates personalized avatars based on user measurements and body shape.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)
- Git (optional, for cloning)

## Getting Started

### 1. Download the Code

Either clone this repository using Git:

```bash
git clone <repository-url>
cd fit-verse-avatar-lab
```

Or download it as a ZIP file and extract it to your preferred location.

### 2. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages listed in package.json.

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

This will launch the application on [http://localhost:8080](http://localhost:8080).

### 4. Using the Application

The application allows users to:
- Enter their height, weight, and body shape information
- See a personalized avatar with clothing items
- Rotate the avatar for a 360° view
- Try different sizes to find the best fit

## Firebase Integration

This application uses Firebase for storing avatar data. When running locally, it will use the same Firebase instance as the online version.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The compiled files will be in the `dist` folder, which can be deployed to any static web hosting service.

## Project Structure

- `src/components` - React components
- `src/data` - Data fetching utilities
- `src/utils` - Helper functions for avatar matching
- `src/pages` - Page components

## Technology Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Firebase for avatar data storage
