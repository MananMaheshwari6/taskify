pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'taskify-app'
        FRONTEND_PORT = '5500'
        BACKEND_PORT = '3000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'cd backend && npm install'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Deploy Approval') {
            steps {
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Approve deployment?', 
                          ok: 'Deploy'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker stop ${DOCKER_IMAGE} || true'
                    sh 'docker rm ${DOCKER_IMAGE} || true'
                    
                    docker.image("${DOCKER_IMAGE}").run(
                        "-p ${FRONTEND_PORT}:${FRONTEND_PORT} " +
                        "-p ${BACKEND_PORT}:${BACKEND_PORT} " +
                        "--name ${DOCKER_IMAGE}"
                    )
                }
            }
        }
    }
}