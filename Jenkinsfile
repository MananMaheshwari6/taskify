pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry.com'
        IMAGE_NAME = 'taskify'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        EC2_HOST = 'your-ec2-instance-ip'
        EC2_USER = 'ubuntu'
        SSH_KEY = credentials('ec2-ssh-key')
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Lint & Test') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            sh 'npm run lint || echo "No lint script found"'
                        }
                    }
                }
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    // Build backend image
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}", "./backend")
                    
                    // Build frontend image
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}", "./frontend")
                }
            }
        }
        
        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Push backend image
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}").push('latest')
                    }
                    
                    // Push frontend image
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Create deployment script
                    writeFile file: 'deploy.sh', text: '''
                        #!/bin/bash
                        set -e
                        
                        echo "Starting deployment..."
                        
                        # Pull latest images
                        docker-compose pull
                        
                        # Stop existing containers
                        docker-compose down
                        
                        # Remove old images
                        docker image prune -f
                        
                        # Start services
                        docker-compose up -d
                        
                        # Wait for services to be healthy
                        echo "Waiting for services to be healthy..."
                        timeout 300 bash -c 'until docker-compose ps | grep -q "healthy"; do sleep 10; done'
                        
                        echo "Deployment completed successfully!"
                    '''
                    
                    // Copy files to EC2
                    sh """
                        scp -i ${SSH_KEY} -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                        scp -i ${SSH_KEY} -o StrictHostKeyChecking=no deploy.sh ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                        scp -i ${SSH_KEY} -o StrictHostKeyChecking=no mongo-init.js ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                    """
                    
                    // Execute deployment on EC2
                    sh """
                        ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd /home/${EC2_USER}/taskify
                            chmod +x deploy.sh
                            ./deploy.sh
                        '
                    """
                }
            }
        }
        
        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Wait for services to be ready
                    sleep 30
                    
                    // Check backend health
                    sh """
                        curl -f http://${EC2_HOST}:4002/health || exit 1
                    """
                    
                    // Check frontend health
                    sh """
                        curl -f http://${EC2_HOST}:3000/health || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
            // Send notification (email, Slack, etc.)
        }
    }
}
