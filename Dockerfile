FROM node:16

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend/ ./backend/

# Copy frontend files
COPY frontend/ ./frontend/

# Expose ports
# Frontend: 5500 (to match Live Server default)
# Backend: 3000 (your current backend port)
EXPOSE 5500 3000

# Start both servers
CMD ["sh", "-c", "cd backend && npm start & cd ../frontend && python3 -m http.server 5500"]