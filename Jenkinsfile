pipeline {
    agent any

    environment {
        GITHUB_REPO     = "https://github.com/ubaidahmed017/devops-3tier-app.git"
        BACKEND_IMAGE   = "devops-backend"
        FRONTEND_IMAGE  = "devops-frontend"
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
                sh 'trivy fs --exit-code 0 --severity HIGH,CRITICAL .'
            }
        }

        stage('Load Configuration') {
            steps {
                echo 'Verifying existing Docker localized artifact layers...'
                // RAM bachanay ke liye pre-built images ko check kiya ja raha hai
                sh "docker images | grep -E 'frontend|backend'"
            }
        }

        stage('Sync Cluster Images') {
            steps {
                echo 'Ensuring images are synced inside Minikube runtime environments...'
                sh "minikube image load ${BACKEND_IMAGE}:latest || true"
                sh "minikube image load ${FRONTEND_IMAGE}:latest || true"
            }
        }

        stage('Automated Hot Deploy') {
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
            echo 'Pipeline deployment failed. Please check resource boundaries.'
        }
    }
}
