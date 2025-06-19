# ---------- Build Stage ----------
  FROM node:18-alpine AS builder

  WORKDIR /app
  
  # Copy package files and install dependencies
  COPY package*.json ./
  RUN npm ci
  
  # Copy source files and build
  COPY . .
  RUN npm run build
  
  
  # ---------- Production Stage ----------
  FROM nginx:alpine
  
  # Copy build output to Nginx web directory
  COPY --from=builder /app/dist /usr/share/nginx/html
  
  # Copy custom nginx config
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  # Fix permissions (optional but good practice)
  RUN chown -R nginx:nginx /usr/share/nginx/html
  
  # Expose HTTP port
  EXPOSE 80
  
  # Add healthcheck
  HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
  
  # Run Nginx in foreground
  CMD ["nginx", "-g", "daemon off;"]
  