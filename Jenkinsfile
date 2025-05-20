pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "taskify-frontend"
        BACKEND_IMAGE = "taskify-backend"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/MananMaheshwari6/taskify.git'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${FRONTEND_IMAGE}")
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${BACKEND_IMAGE}")
                    }
                }
            }
        }

        stage('Approval to Deploy') {
            steps {
                input message: "Deploy updated frontend and backend?"
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Stop running containers if any
                    sh "docker stop frontend || true"
                    sh "docker rm frontend || true"
                    sh "docker stop backend || true"
                    sh "docker rm backend || true"

                    // Run new containers
                    sh "docker run -d --name frontend -p 80:80 ${FRONTEND_IMAGE}"
                    sh "docker run -d --name backend -p 3000:3000 --env-file backend/.env ${BACKEND_IMAGE}"
                }
            }
        }
    }
}
