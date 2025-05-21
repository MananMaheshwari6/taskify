FROM node:16

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install concurrently for managing multiple processes
RUN npm install -g concurrently

# Copy all source files
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Copy start script
COPY start.sh /app/
RUN chmod +x /app/start.sh

# Expose frontend and backend ports
EXPOSE 5500 3000

# Start both frontend and backend servers
CMD ["/app/start.sh"]
