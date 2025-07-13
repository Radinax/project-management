# React, TypeScript, Tailwind CSS Project Template with Vite & Bun

This my template for building modern web applications using React, TypeScript, and Tailwind CSS, powered by the Vite build tool and the Bun runtime.

## ✨ Features

- **React 19**: A declarative, efficient, and flexible JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and developer experience.
- **Tailwind CSS 4**: A utility-first CSS framework for rapidly building custom designs.
- **Vite**: A next-generation frontend tooling that provides an incredibly fast development experience.
- **Bun**: An all-in-one JavaScript runtime & toolkit, providing a fast package manager, bundler, and test runner.

## 🚀 Getting Started

Follow these steps to get your development environment set up.

### Prerequisites

Make sure you have Bun installed on your system.

```bash
curl -fsSL https://bun.sh/install | bash
```

### 📦 Installation

1. Clone the repository (or create a new project from this template):

If you're creating a new project from scratch, you can use Vite directly:

```bash
bun create vite@latest vite-react -- --template react-ts
cd vite-react
```

Then, install Tailwind CSS:

```bash
bun add tailwindcss @tailwindcss/vite
```

Add the @tailwindcss/vite plugin to your Vite configuration.

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

Add an @import to your CSS file that imports Tailwind CSS (main.css).

```css
@import "tailwindcss";
```

2. If you cloned this repository, simply navigate into the project directory:

```bash
git clone <repository-url>
cd <repository-name>
```

3. Install dependencies:

Bun will install all the necessary project dependencies:

```bash
bun install
```

## 🏃 Running the Development Server

Start the development server with Vite:

```bash
bun dev
```

This will typically open your application at http://localhost:5173. The development server supports hot module replacement (HMR) for a fast development loop.

## 📂 Project Structure

```bash
.
├── public/ # Static assets
├── src/ # Source code
│ ├── assets/ # Images, icons, etc.
│ ├── components/ # Reusable React components
│ ├── app.tsx # Main App component
│ ├── index.css # Global styles (Tailwind directives here)
│ ├── main.tsx # Entry point for React app
│ └── vite-env.d.ts # Vite environment types
├── .gitignore # Files/directories to ignore in Git
├── index.html # Main HTML file
├── package.json # Project dependencies and scripts
├── postcss.config.js # PostCSS configuration for Tailwind
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
├── tsconfig.node.json # TypeScript configuration for Node.js environment
└── vite.config.ts # Vite configuration
```

## 📜 Available Scripts

In the project directory, you can run the following Bun commands:

- `bun dev`: Starts the development server with hot module replacement.

```bash
bun dev
```

- `bun build`: Builds the app for production to the dist folder. It correctly bundles React in production mode and optimizes the build for the best performance.

```bash
bun build
```

- `bun preview`: Locally serves the production build. Useful for verifying the build output before deployment.

```bash
bun preview
```

- `bun lint`: Runs ESLint to check for code quality issues and potential errors.

```bash
bun lint
```

## ⚙️ Vite Configuration

The vite.config.ts file allows you to customize Vite's behavior, such as adding plugins, configuring the development server proxy, or setting up build options.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## 📦 Deployment

After running bun build, the optimized production assets will be located in the dist/ directory. You can deploy this directory to any static site hosting service (e.g., Netlify, Vercel, GitHub Pages, Firebase Hosting).

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is open-sourced under the MIT License.

---

**Built with ❤️ by [Adrian Beria](https://github.com/Radinax)**
