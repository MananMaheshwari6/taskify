pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry.com'
        IMAGE_NAME = 'taskify'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        EC2_HOST = 'your-ec2-instance-ip'
        EC2_USER = 'ec2-user'
        SSH_KEY_CRED = 'ec2-ssh-key'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        
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
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}", "./backend")
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}", "./frontend")
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-backend:${IMAGE_TAG}").push('latest')
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}-frontend:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                sshagent([env.SSH_KEY_CRED]) {
                    sh """
                        scp -o StrictHostKeyChecking=no docker-compose.yml ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                        scp -o StrictHostKeyChecking=no deploy.sh ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                        scp -o StrictHostKeyChecking=no mongo-init.js ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/taskify/
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                            cd /home/${EC2_USER}/taskify
                            chmod +x deploy.sh
                            ./deploy.sh
                        '
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sleep 30
                    sh """
                        curl -f http://${EC2_HOST}:4002/health || exit 1
                        curl -f http://${EC2_HOST}:3000/health || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
