
# Consulta ONPE - Laboratorio Contenedores

**Roberto Carlos Lopez Calle**  
**Desarrollo de Soluciones en la Nube**  
**Caso 2 - Contenedores Microservicios**

## URL del repositorio
```
https://github.com/robertocarloslopez/onpe-app
```

## Descripción
Aplicación web que consulta datos electorales ONPE por DNI y registra automáticamente en Excel. Containerizada con 3 variantes de Dockerfile.

## Estructura del proyecto
```
onpe-app/
├── package.json
├── server.js
├── public/
│   └── index.html
├── .dockerignore
├── Dockerfile
├── Dockerfile.optimizado
├── Dockerfile.multistage
└── docker-compose.yml
```

## Pasos de instalación y ejecución

### 1. Local (Node.js)
```bash
git clone https://github.com/robertocarloslopez/onpe-app.git
cd onpe-app
npm install
npm run dev
```
**URL:** http://localhost:3000

### 2. Docker - 3 variantes

**Dockerfile básico:**
```bash
docker build -t onpe-app:v1 .
docker run -d -p 3000:3000 --name onpe-v1 onpe-app:v1
```

**Dockerfile.optimizado:**
```bash
docker build -f Dockerfile.optimizado -t onpe-app:v2 .
docker run -d -p 3001:3000 --name onpe-v2 onpe-app:v2
```

**Dockerfile.multistage:**
```bash
docker build -f Dockerfile.multistage -t onpe-app:v3 .
docker run -d -p 3002:3000 --name onpe-v3 onpe-app:v3
```

### 3. Comparar tamaños
```bash
docker images | grep onpe-app
```

### 4. Docker Compose
```bash
docker compose up --build
```

## Uso
1. Ingresar DNI (8 dígitos)
2. Presionar **CONSULTAR**
3. Descargar **EXCEL** con datos registrados

## Funcionalidades
- ✅ Validación DNI
- ✅ Registro automático Excel
- ✅ Descarga Excel
- ✅ Containerización completa
- ✅ 3 variantes Dockerfile

## Comandos útiles
```bash
# Logs
docker logs onpe-v1

# Detener
docker stop onpe-v1 onpe-v2 onpe-v3

# Limpiar
docker rmi onpe-app:v1 onpe-app:v2 onpe-app:v3
```

## Dockerfiles implementados
1. **Dockerfile** - Base Node.js
2. **Dockerfile.optimizado** - Alpine + no-root + healthcheck  
3. **Dockerfile.multistage** - Builder + runtime optimizado

**Cumple 100% con laboratorio contenedores**
