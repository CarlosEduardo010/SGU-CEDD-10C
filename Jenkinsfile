pipeline {
    agent any

    environment {
        API_HOST = "backend"
        API_PORT = "8000"
        API_BASE = "/api/usuarios"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '=== Etapa 1: Clonando el repositorio GIT ==='
                git branch: 'main', url: 'https://github.com/CarlosEduardo010/SGU-CEDD-10C.git'
            }
        }

        stage('Clean Previous Containers') {
            steps {
                script {
                    echo '=== Etapa 2: Deteniendo contenedores e imágenes previas ==='
                    bat '''
                    echo Eliminando contenedores e imágenes viejas...
                    docker-compose down --rmi all || exit 0
                    docker system prune -f || exit 0
                    '''
                }
            }
        }

        stage('Build and Deploy SGU Stack') {
            steps {
                script {
                    echo '=== Etapa 3: Construyendo y levantando contenedores ==='
                    bat """
                    docker-compose build ^
                      --build-arg API_HOST=${API_HOST} ^
                      --build-arg API_PORT=${API_PORT} ^
                      --build-arg API_BASE=${API_BASE}
                    docker-compose up -d
                    """
                }
            }
        }

        stage('Verification') {
            steps {
                script {
                    echo '=== Etapa 4: Verificación del despliegue ==='
                    echo 'Esperando 30 segundos para la inicialización...'
                    sleep 30

                    echo 'Verificando estado de los contenedores:'
                    bat 'docker-compose ps'

                    echo "Probando conexión al backend (http://localhost:8000/api/usuarios)..."
                    bat 'curl -f http://localhost:8000/api/usuarios || exit /b 1'

                    echo '✅ Despliegue exitoso. Accede al frontend en: http://localhost:5173'
                }
            }
        }
    }

    post {
        success {
            echo '🎉 Despliegue completado exitosamente.'
        }
        failure {
            echo '💥 Error durante el pipeline. Revisar logs en Jenkins.'
            bat 'docker-compose logs'
        }
        always {
            echo '🧹 Limpieza final de recursos temporales.'
        }
    }
}
