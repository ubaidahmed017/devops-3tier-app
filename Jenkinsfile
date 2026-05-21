pipeline {
    agent any

    environment {
        GITHUB_REPO     = "https://github.com/ubaidahmed017/devops-3tier-app.git"
        BACKEND_IMAGE   = "devops-backend"
        FRONTEND_IMAGE  = "devops-frontend"
        TAG             = "${BUILD_NUMBER}"
    }

    stages {
        stage('Code Checkout') {
            steps {
                echo 'Pulling application code from GitHub...'
                checkout scm
            }
        }

        stage('Security Scan: Source Files') {
            steps {
                echo 'Running Trivy vulnerability scan on repository source...'
                // Codebase ka standard inspection security test
                sh 'trivy fs --exit-code 0 --severity HIGH,CRITICAL .'
            }
        }

        stage('Build Local Docker Images') {
            steps {
                echo 'Compiling backend and frontend Docker images dynamically...'
                sh "docker build -t ${BACKEND_IMAGE}:${TAG} ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${TAG} ./frontend"
                
                // Tags ko latest par mapping taake Kubernetes naya version uthaye
                sh "docker tag ${BACKEND_IMAGE}:${TAG} ${BACKEND_IMAGE}:latest"
                sh "docker tag ${FRONTEND_IMAGE}:${TAG} ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Load Images to Minikube') {
            steps {
                echo 'Loading newly compiled images directly inside Minikube cluster...'
                sh "minikube image load ${BACKEND_IMAGE}:latest"
                sh "minikube image load ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Hot Deploy to Kubernetes') {
            steps {
                echo 'Executing rolling update rollout on active cluster pods...'
                sh "kubectl rollout restart deployment/backend"
                sh "kubectl rollout restart deployment/frontend"
            }
        }
    }

    post {
        success {
            echo 'DevOps Pipeline execution completed successfully! System is fully automated.'
        }
        failure {
            echo 'Pipeline deployment failed. Please check build logs or validation steps.'
        }
    }
}
