# PsycheAI Frontend

React + Vite frontend application for the psycheAI emotional counseling platform.

## Features

- ✨ Modern React 18 with Vite
- 🎨 Tailwind CSS for styling
- 🎭 Framer Motion for smooth animations
- 🧭 React Router for navigation
- 🔐 JWT authentication
- 📱 Fully responsive design
- ♿ Accessibility-focused

## Prerequisites

- Node.js 18+ and npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation with mobile menu
│   ├── HeroSection.jsx # Landing hero section
│   ├── FeaturesSection.jsx # Features showcase
│   └── PrivateRoute.jsx # Auth guard
├── pages/              # Page components
│   ├── Landing.jsx     # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Chat.jsx        # Chat interface
│   └── Dashboard.jsx   # Analytics dashboard
├── store/              # State management
│   └── authStore.js    # Authentication state
├── lib/                # Utilities
│   └── api.js          # API client
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Key Components

### Navbar
- Sticky top navigation
- Smooth hover animations
- Mobile hamburger menu
- Responsive design

### HeroSection
- Animated text transitions
- Gradient text effects
- Floating background elements
- Call-to-action buttons
- Scroll indicator

### FeaturesSection
- Scroll-triggered animations
- Animated feature cards
- Hover effects
- Gradient backgrounds

## Animations

All animations are built with Framer Motion:
- Page transitions
- Scroll-triggered reveals
- Hover effects
- Mobile menu animations
- Gradient text animations

## Styling

Tailwind CSS with custom configuration:
- Custom color palette (primary, secondary)
- Custom animations
- Responsive breakpoints
- Utility classes

## API Integration

The app communicates with the backend API using Axios:
- Automatic JWT token injection
- 401 error handling
- Request/response interceptors

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables:
   - `VITE_API_URL`: Your backend API URL
4. Deploy!

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:5000/api)

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance

- Code splitting by route
- Lazy loading for heavy components
- Optimized images
- Minified production build

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast compliance

## License

MIT
