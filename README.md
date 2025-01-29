# TOPCIT LCMS Client

This is the client-side application for the TOPCIT Learning Content Management System.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/lcms-topcit-app.git
   ```

2. Navigate to the project directory:

   ```sh
   cd lcms-topcit-app
   ```

3. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following content:

```
VITE_APP_BASE_API_URL = "http://localhost:3300"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:host` - Start development server with host access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run preview:host` - Preview production build with host access
- `npm run lint` - Run ESLint

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI
- React Query
- React Router DOM
- Zustand
- Tailwind CSS
- React Hook Form
- Zod

## Project Structure

```plaintext
lcms-topcit-app/
├── .env
├── .eslintrc.cjs
├── .gitattributes
├── .gitignore
├── .prettierrc
├── env.example
├── netlify.toml
├── package.json
├── postcss.config.js
├── public/
├── README.md
├── src/
│   ├── api/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Development Guidelines

1. Follow TypeScript best practices
2. Use Material-UI components when possible
3. Implement responsive design
4. Follow ESLint rules
5. Write clean, maintainable code

## Features

- User Authentication
- Chapter Management
- Quiz Management
- Topic Management
- User Management
- Role Management
- Permission Management

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License.
