# 🗳️ Sistema RPA de Consulta Masiva - ONPE 2026

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Selenium](https://img.shields.io/badge/Selenium-Automation-green?logo=selenium)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![Status](https://img.shields.io/badge/Status-Activo-success)
![License](https://img.shields.io/badge/License-Uso%20Académico-orange)

---

Este proyecto es una solución de **Automatización de Procesos Robóticos (RPA)** desarrollada en Python. El sistema automatiza la consulta de datos en el portal oficial de la ONPE, procesando DNIs desde un archivo Excel y devolviendo resultados validados (Miembros de mesa y locales de votación) de forma masiva en tiempo récord.

---

## 🛠️ 1. Stack Tecnológico (Librerías Clave)

El núcleo del programa utiliza cuatro pilares tecnológicos para garantizar velocidad y saltar bloqueos:

- **Python 3.11**: Lenguaje principal de lógica y control.
- **Selenium**: Motor de automatización que controla un navegador Chrome real. Es vital para simular el comportamiento humano y evitar que la ONPE bloquee nuestra IP.
- **Requests**: Maneja la comunicación HTTP veloz para gestionar tokens de sesión de la API oficial.
- **OpenPyXL**: Encargada de la lectura y escritura del archivo Excel, permitiendo aplicar formatos, colores y auto-ajuste de columnas.

---

## 📊 2. Especificación del Excel (`onpe.xlsx`)

El archivo Excel actúa como base de datos de entrada y salida. Para que el programa funcione, debe estar en la raíz con estas condiciones:

- **Columna DNI**: Debe contener los 8 dígitos del documento.
- **Cabeceras**: El script busca y completa automáticamente:
  - DNI  
  - Nombres  
  - Miembro de Mesa  
  - Ubicación  
  - Dirección  

- **Rendimiento**: El programa procesa los 7 documentos en menos de 30 segundos sin errores.

---

Te lo corrijo TODO listo para copiar y pegar (bien formateado) 👇

## 🐳 3. Despliegue con Docker (3 Niveles)

### 🔹 A. Estándar (`Dockerfile`)
Instalación lineal básica. Ideal para desarrollo rápido y pruebas iniciales.

```bash
docker build -t onpe:standard -f Dockerfile .
docker run -it --name ejecucion-std onpe:standard

🔹 B. Multistage (Dockerfile.multistage)

Separa la construcción de la ejecución. Genera una imagen limpia y ligera al no incluir herramientas de compilación en el resultado final.

docker build -t onpe:multistage -f Dockerfile.multistage .
docker run -it --name ejecucion-multi onpe:multistage

🔹 C. Optimizado (Dockerfile.optimizado)

Nivel producción. Incluye usuario de seguridad (no-root), limpieza de caché y Healthcheck para monitorear la salud del proceso.

docker build -t onpe:optimized -f Dockerfile.optimizado .
docker run -it --name ejecucion-opt onpe:optimized


💻 4. DESPLIEGUE MANUAL (SIN DOCKER)

⚠️ Modo alternativo de ejecución sin contenedores

📌 Requisitos
✔ Python 3.11+
✔ Google Chrome instalado
✔ Conexión a internet activa
⚙️ Procedimiento
🔹 1. Instalar dependencias
pip install requests openpyxl selenium pandas
🔹 2. Cerrar el archivo

⚠️ Asegúrese de que onpe.xlsx no esté abierto.

🔹 3. Ejecutar el script
python consulta_onpe.py
⚙️ 5. FLUJO DE FUNCIONAMIENTO (PASO A PASO)

🔄 Proceso automatizado del sistema RPA

🚀 Flujo del Sistema
📥 1. Ingesta

El script lee los DNIs desde el archivo onpe.xlsx.

🤖 2. Automatización

Selenium levanta una instancia de Google Chrome en modo Headless (invisible) y navega a la ruta oficial de la ONPE.

🔍 3. Extracción

Se capturan los datos de cada ciudadano, superando los mecanismos de validación del portal.

💾 4. Persistencia

Los datos obtenidos (nombres y direcciones) se escriben en el Excel con formato de colores:

🟡 Amarillo → Miembros de mesa
🟢 Verde → Ciudadanos
✅ 5. Cierre

Se libera la memoria del sistema y se genera el reporte final actualizado.

👨‍💻 AUTOR

Roberto López

🎓 Curso: Desarrollo de Aplicaciones
⚡ Tecnología: Python + Selenium + Docker (RPA)