# LCMS TOPCIT App

This project is a Learning Content Management System (LCMS) application designed for the TOPCIT program. It includes various modules such as user authentication, chapter management, quizzes, and topics.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

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
   ```

### Running the Application

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open the application in your browser:

   ```sh
   http://127.0.0.1:5173
   ```

### Building for Production

To build the application for production, run:

```sh
npm run build
```

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
