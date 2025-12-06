pipeline {
    agent any

    environment {
        IMAGE_NAME = 'react-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Check Files') {
            steps {
                // Option 1: Just list repo files
                sh 'ls -al'
                // Option 2: Run tests or lint (uncomment if needed)
                // sh 'npm install'
                // sh 'npm run lint'
                // sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Make sure you have a Dockerfile in your repo's root directory
                    sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
                }
            }
        }
        stage('Stop Existing Container') {
            steps {
                script {
                    sh '''
                    if [ $(docker ps -aq -f name=react-app) ]; then
                        echo "Stopping old container..."
                        docker stop react-app || true
                        docker rm react-app || true
                    fi
                    '''
                }
            }
        }
        

        stage('Run Docker Container') {
            steps {
                script {
                    // Run the container, map ports as needed
                    sh "docker run -d -p 3000:3000 --name react-a $IMAGE_NAME:$IMAGE_TAG"
                }
            }
        }
    }
}
