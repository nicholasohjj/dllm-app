# DLLM App

A Progressive Web App (PWA) built with React, TypeScript, and Vite for laundry machine monitoring.

## Features

- 🚀 Fast development with Vite
- ⚛️ React 18 with TypeScript
- 📱 Progressive Web App (PWA) support
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 🔔 Web Push Notifications
- 🌙 Dark mode support
- 📊 Real-time laundry machine monitoring

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build locally
npm run preview
```

## Deployment with Nginx

This project includes full nginx support for production deployment. See the [Nginx Deployment Guide](docs/nginx-deployment.md) for detailed instructions.

### Quick Deploy with Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access the app at http://localhost
```

### Manual Nginx Setup

```bash
# Build the app
npm run build

# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/dllm-app
sudo ln -s /etc/nginx/sites-available/dllm-app /etc/nginx/sites-enabled/

# Deploy files
sudo mkdir -p /var/www/dllm-app
sudo cp -r dist/* /var/www/dllm-app/
sudo cp -r public/* /var/www/dllm-app/

# Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

For more details, see [docs/nginx-deployment.md](docs/nginx-deployment.md)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run check` - Run linting and format checks

## Project Structure

```
dllm-app/
├── api/                  # API endpoints
├── docs/                 # Documentation
├── public/               # Static assets
│   ├── icons/           # PWA icons
│   └── service-worker.js
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   └── types/           # TypeScript types
├── nginx.conf           # Nginx configuration
├── Dockerfile           # Docker configuration
└── docker-compose.yml   # Docker Compose configuration
```

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Routing:** React Router
- **Animations:** Framer Motion
- **Web Server:** Nginx (production)

## Additional Documentation

- [Web Push Setup Guide](docs/web-push-setup.md)
- [Nginx Deployment Guide](docs/nginx-deployment.md)

## License

MIT
