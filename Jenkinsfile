pipeline {
    agent any

    environment {
        // Variables del frontend que se pasan como build args
        API_HOST = "backend"
        API_PORT = "8000"
        API_BASE = "/api/usuarios"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '=== Etapa 1: Clonando el repositorio GIT ==='
                git branch: 'main', url: 'URL_DE_TU_REPOSITORIO_SGU'
            }
        }

        stage('Clean Previous Containers') {
            steps {
                script {
                    echo '=== Etapa 2: Deteniendo contenedores e imágenes previas ==='
                    sh '''
                        echo "Eliminando contenedores e imágenes viejas..."
                        docker-compose down --rmi all || true
                        docker system prune -f || true
                    '''
                }
            }
        }

        stage('Build and Deploy SGU Stack') {
            steps {
                script {
                    echo '=== Etapa 3: Construyendo y levantando contenedores ==='
                    sh """
                        docker-compose build \
                          --build-arg API_HOST=${API_HOST} \
                          --build-arg API_PORT=${API_PORT} \
                          --build-arg API_BASE=${API_BASE}
                    """
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Verification') {
            steps {
                script {
                    echo '=== Etapa 4: Verificación del despliegue ==='
                    echo 'Esperando 30 segundos para la inicialización de la base de datos y el backend...'
                    sleep 30

                    echo 'Verificando estado de los contenedores:'
                    sh 'docker-compose ps'

                    echo "Probando conexión al backend (http://localhost:8000/api/usuarios)..."
                    sh 'curl --fail http://localhost:8000/api/usuarios || (echo "❌ Backend no responde correctamente" && exit 1)'

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
            sh 'docker-compose logs'
        }
        always {
            echo '🧹 Limpieza final de recursos temporales.'
        }
    }
}
