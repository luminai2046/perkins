# Web App Project

A modern, responsive web application built with React, TailwindCSS, and shadcn/ui components.

## Features

- **Modern Design**: Clean, minimalist interface with a focus on user experience
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Navigation**: Sidebar navigation with mobile-friendly hamburger menu
- **Component-Based**: Built with reusable React components

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development server and build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **shadcn/ui** - High-quality UI components

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build files will be in the `dist` directory.

## Project Structure

```
web-app-project/
  src/
    App.jsx          # Main application component
    main.jsx         # Application entry point
    index.css        # Global styles and TailwindCSS
  index.html         # HTML template
  package.json       # Dependencies and scripts
  tailwind.config.js # TailwindCSS configuration
  vite.config.js     # Vite configuration
  README.md          # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Customization

### Adding New Pages

1. Create a new component in `src/components/`
2. Add a route in `src/App.jsx`
3. Add navigation link in the sidebar

### Styling

The project uses TailwindCSS with a custom design system. You can customize colors and spacing in `tailwind.config.js`.

### Dark Mode

Dark mode is implemented using CSS custom properties. The theme toggle is in the header and persists across page reloads.

## License

MIT License - feel free to use this project for your own applications.
