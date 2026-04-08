FROM python:3.11-slim
LABEL maintainer="roberto@example.com"
LABEL description="Consulta ONPE con Python y Selenium"

RUN apt-get update && apt-get install -y \
    wget gnupg unzip google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "consulta_onpe.py"]