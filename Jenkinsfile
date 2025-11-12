pipeline {
    agent any 
    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio GIT...'
                git branch: 'main', url: 'URL_DE_TU_REPOSITORIO_SGU' 
            }
        }
        
        stage('Build and Deploy SGU Stack') {
            steps {
                script {
                    echo '1. Deteniendo y eliminando contenedores previos...'
                    sh 'docker-compose down --rmi all'
                    
                    echo '2. Construyendo nuevas imágenes y levantando servicios...'
                    
                    // Definición de las variables para el frontend (Build-Args)
                    // Las pasamos como variables de entorno al comando Docker Compose
                    def buildArgs = [
                        'API_HOST=backend',
                        'API_PORT=8000',
                        'API_BASE=/api/usuarios'
                    ]
                    
                    // Ejecutamos docker-compose build con los build arguments para el frontend
                    sh "docker-compose build --build-arg API_HOST=${buildArgs.API_HOST} --build-arg API_PORT=${buildArgs.API_PORT} --build-arg API_BASE=${buildArgs.API_BASE}"
                    
                    // Levantamos los servicios (el backend toma las variables del docker-compose.yml)
                    sh 'docker-compose up -d'
                    
                    echo '3. Verificando el estado de los contenedores...'
                    sh 'docker-compose ps'
                }
            }
        }
        
        stage('Verification') {
            steps {
                echo "Esperando 30 segundos para el inicio de la aplicación y la DB..."
                sleep 30 
                
                // Prueba de acceso al Backend (que ahora está en el puerto 8000)
                echo "Verificando el Backend (http://localhost:8000/api/usuarios)..."
                sh 'curl --fail http://localhost:8000/api/usuarios'
                
                echo "Despliegue finalizado. Accede al frontend en http://localhost:5173"
            }
        }
    }
}