# Taskify - Full Stack Todo Application

A modern full-stack todo application built with React, Node.js, Express, and MongoDB, containerized with Docker and ready for CI/CD deployment.

## 🏗️ Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB
- **Containerization**: Docker + Docker Compose
- **CI/CD**: Jenkins Pipeline
- **Deployment**: AWS EC2

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd taskify
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4002
   - Health Check: http://localhost:4002/health

### Manual Setup (Development)

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🐳 Docker Configuration

### Services

- **Frontend**: React app served by Nginx
- **Backend**: Node.js API server
- **MongoDB**: Database with persistent storage
- **Nginx**: Reverse proxy (production only)

### Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET_KEY=your-super-secret-jwt-key
MONGODB_URI=mongodb://admin:password123@mongodb:27017/taskify?authSource=admin
FRONTEND_URL=http://localhost:3000
```

## 🔧 Jenkins CI/CD Setup

### Prerequisites

1. **Jenkins Server** with the following plugins:
   - Docker Pipeline
   - SSH Agent
   - Credentials Binding

2. **EC2 Instance** with:
   - Docker and Docker Compose installed
   - SSH access configured
   - Security groups allowing ports 80, 443, 3000, 4002

### Jenkins Configuration

1. **Add Credentials**
   - Go to Jenkins > Manage Jenkins > Credentials
   - Add SSH private key with ID `ec2-ssh-key`
   - Add Docker registry credentials with ID `docker-registry-credentials`

2. **Update Jenkinsfile**
   - Replace `your-docker-registry.com` with your Docker registry
   - Replace `your-ec2-instance-ip` with your EC2 public IP
   - Update `EC2_USER` if different from `ubuntu`

3. **Create Jenkins Pipeline**
   - Create new Pipeline job
   - Point to your Git repository
   - Use the `Jenkinsfile` from the repository

### Pipeline Stages

1. **Checkout**: Clone repository
2. **Install Dependencies**: Install npm packages for both frontend and backend
3. **Lint & Test**: Run linting and tests
4. **Build Docker Images**: Build frontend and backend images
5. **Push Docker Images**: Push to registry (main branch only)
6. **Deploy to EC2**: Deploy to EC2 instance
7. **Health Check**: Verify deployment

## 🌐 EC2 Deployment

### EC2 Setup

1. **Launch EC2 Instance**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Logout and login again for Docker group to take effect
   ```

2. **Security Groups**
   - Allow SSH (port 22)
   - Allow HTTP (port 80)
   - Allow HTTPS (port 443)
   - Allow custom ports 3000, 4002

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd taskify
   
   # Make deployment script executable
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

## 📁 Project Structure

```
taskify/
├── backend/                 # Node.js API server
│   ├── controller/         # Route controllers
│   ├── middleware/         # Express middleware
│   ├── model/             # MongoDB models
│   ├── routes/            # API routes
│   ├── Dockerfile         # Backend container
│   └── package.json
├── frontend/              # React application
│   ├── src/              # Source code
│   ├── public/           # Static files
│   ├── Dockerfile        # Frontend container
│   ├── nginx.conf        # Nginx configuration
│   └── package.json
├── nginx/                # Reverse proxy configuration
├── docker-compose.yml    # Multi-container setup
├── Jenkinsfile          # CI/CD pipeline
├── deploy.sh            # Deployment script
└── README.md
```

## 🔍 Health Checks

- **Backend**: `GET /health`
- **Frontend**: `GET /health`
- **MongoDB**: Connection status in backend health check

## 🛠️ Development

### Adding New Features

1. Create feature branch
2. Make changes
3. Test locally with Docker
4. Push to repository
5. Jenkins will automatically build and test

### Database Migrations

MongoDB collections are automatically created on first run. For schema changes:

1. Update models in `backend/model/`
2. Test locally
3. Deploy through Jenkins pipeline

## 🔒 Security

- JWT authentication
- CORS configuration
- Rate limiting (nginx)
- Security headers
- Non-root Docker containers
- Environment variable management

## 📊 Monitoring

- Docker health checks
- Application health endpoints
- Container logs: `docker-compose logs -f [service]`

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 3000, 4002, 27017 are available
2. **Database connection**: Verify MongoDB URI in environment variables
3. **Build failures**: Check Docker logs and ensure all dependencies are installed
4. **Deployment issues**: Verify EC2 security groups and SSH access

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache

# Clean up
docker-compose down -v
docker system prune -f
```

## 📝 License

This project is licensed under the ISC License. 