# Nginx Deployment Guide

This guide covers deploying the DLLM App using nginx for production.

## Table of Contents

- [Docker Deployment](#docker-deployment)
- [Manual Nginx Setup](#manual-nginx-setup)
- [Production Considerations](#production-considerations)

## Docker Deployment

### Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

### Quick Start with Docker Compose

1. **Build and run the container:**

```bash
docker-compose up -d
```

2. **Access the application:**

Open your browser and navigate to `http://localhost`

3. **Stop the container:**

```bash
docker-compose down
```

### Manual Docker Commands

1. **Build the Docker image:**

```bash
docker build -t dllm-app .
```

2. **Run the container:**

```bash
docker run -d -p 80:80 --name dllm-app dllm-app
```

3. **View logs:**

```bash
docker logs -f dllm-app
```

4. **Stop and remove the container:**

```bash
docker stop dllm-app
docker rm dllm-app
```

## Manual Nginx Setup

If you prefer to set up nginx manually without Docker:

### Prerequisites

- Node.js and npm/bun installed
- Nginx installed on your system

### Build the Application

```bash
npm run build
# or
bun run build
```

This creates a production build in the `dist/` directory.

### Nginx Configuration

1. **Copy the nginx configuration:**

```bash
sudo cp nginx.conf /etc/nginx/sites-available/dllm-app
```

2. **Update the configuration:**

Edit `/etc/nginx/sites-available/dllm-app` and update:
- `server_name` to your domain
- `root` path to point to your `dist/` directory (e.g., `/var/www/dllm-app/dist`)

3. **Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/dllm-app /etc/nginx/sites-enabled/
```

4. **Test the configuration:**

```bash
sudo nginx -t
```

5. **Reload nginx:**

```bash
sudo systemctl reload nginx
```

### Deploy Built Files

Copy your built files to the web server:

```bash
sudo mkdir -p /var/www/dllm-app
sudo cp -r dist/* /var/www/dllm-app/
sudo cp -r public/* /var/www/dllm-app/
```

## Production Considerations

### HTTPS/SSL

For production, you should enable HTTPS. Here's an example nginx configuration with SSL:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of your nginx configuration
}
```

#### Using Let's Encrypt (Certbot)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Environment Variables

If your application uses environment variables, create a `.env.production` file:

```bash
VITE_API_URL=https://api.yourdomain.com
```

Rebuild the application:

```bash
npm run build
```

### Performance Optimization

The nginx configuration includes:

- **Gzip compression** for faster loading
- **Cache headers** for static assets
- **Service Worker** cache control for PWA functionality
- **Security headers** for enhanced security

### Monitoring

#### Health Checks

The nginx configuration includes a `/health` endpoint:

```bash
curl http://localhost/health
```

#### Logs

View nginx access and error logs:

```bash
# Docker
docker logs dllm-app

# Manual installation
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Scaling with Docker

For production scaling, consider:

1. **Using Docker Swarm:**

```bash
docker swarm init
docker stack deploy -c docker-compose.yml dllm-stack
```

2. **Using Kubernetes:**

Create deployment and service manifests for Kubernetes.

3. **Load Balancing:**

Add a reverse proxy like Traefik or HAProxy in front of multiple nginx containers.

### API Backend

If your application needs to communicate with a backend API, uncomment and configure the API proxy section in `nginx.conf`:

```nginx
location /api/ {
    proxy_pass http://backend:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Update `docker-compose.yml` to include your backend service.

## Troubleshooting

### Issue: Service Worker not updating

**Solution:** The nginx configuration sets proper cache headers for service workers. Clear your browser cache and hard reload (Ctrl+Shift+R).

### Issue: 404 errors on page refresh

**Solution:** Ensure the `try_files $uri $uri/ /index.html;` directive is present in your nginx configuration for SPA routing.

### Issue: Docker build fails

**Solution:** 
- Check if port 80 is already in use: `sudo lsof -i :80`
- Ensure Docker has enough resources allocated
- Check build logs: `docker-compose logs`

### Issue: Assets not loading

**Solution:**
- Verify the `base` setting in `vite.config.ts` matches your deployment path
- Check nginx error logs for permission issues
- Ensure the `dist/` directory contains all built assets

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Service Worker Best Practices](https://web.dev/service-worker-lifecycle/)

