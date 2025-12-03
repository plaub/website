---
title: "Astro Production Deployment: Zero-Downtime CI/CD mit GitHub Actions und Docker"
description: "Ein umfassender Leitfaden zur Implementierung einer Zero-Downtime CI/CD-Pipeline für Astro-Projekte mit Docker und GitHub Actions."
date: 2025-12-04
categories: ["Astro", "CI/CD", "Docker", "GitHub Actions"]
author: "Pierre"
pubDate: 2025-12-04
---

## I. Zielsetzung und Architektur 🎯

Dieser Leitfaden beschreibt die Implementierung einer robusten Zero-Downtime CI/CD-Pipeline für eine statisch generierte Astro-Anwendung, bereitgestellt auf einem Linux-Host mittels Docker und GitHub Actions. Die Strategie basiert auf einem Blue/Green-ähnlichen Ansatz inklusive Health Check, um maximale Verfügbarkeit zu gewährleisten.

## II. Phase 0: Vorbereitung der Infrastruktur 🔑

### 1. Host- und User-Setup (Linux Server)

Für maximale Sicherheit wird ein dedizierter Deployment-User (`deploy`) benötigt, der Zugriff auf Docker-Befehle hat.

```bash
# 1. Create a dedicated user
sudo adduser deploy

# 2. Grant Docker permissions
sudo usermod -aG docker deploy

# 3. Apply permissions (needs relog/reboot)

# 4. Generate SSH Key Pair (locally or on a secure client)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github_actions_rsa -N ""

# 5. Place the public key on the server:
sudo su - deploy
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "<INHALT DES github_actions_rsa.pub>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 2. Projekt- und Registry-Setup

Alle sensiblen Daten werden als GitHub Secrets hinterlegt.

| Secret Name                         | Wert                           | Zweck                            |
| ----------------------------------- | ------------------------------ | -------------------------------- |
| SSH_HOST, SSH_USER, SSH_KEY         | Server-IP, deploy, Private Key | SSH-Zugriff für CD               |
| DOCKERHUB_USERNAME, DOCKERHUB_TOKEN | Registry-Credentials           | Authentifizierung für Build/Push |

## III. Phase 1: Continuous Integration (CI)

Die CI-Phase ist verantwortlich für den isolierten Build-Prozess und das Tagging des Images.

### 1. Dockerfile (Multi-Stage Build)

Das finale Image wird mit NGINX als Webserver und nur den statischen Assets gebaut.

```dockerfile
# Stage 1: Build Phase
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Phase (Final Image)
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. GitHub Actions Job: build-and-push

Der Workflow wird manuell über `workflow_dispatch` gestartet und taggt das Image mit dem `latest` Tag und dem Commit SHA (`${{ github.sha }}`) zur Auditierbarkeit.

```yaml
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 🐳 Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: 🏗️ Build and Push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/astro-app:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/astro-app:${{ github.sha }}
```

## IV. Phase 2: Continuous Deployment (CD)

Der Deployment-Job führt die Blue/Green-Strategie über SSH aus. Der Live-Port ist **4321**, der Staging-Port **4322**.

### 1. GitHub Actions Job: deploy

```yaml
deploy:
  needs: build-and-push
  runs-on: ubuntu-latest
  steps:
    - name: 💻 Deploy new Docker image via SSH
      uses: appleboy/ssh-action@v1.0.1
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          IMAGE_TAG=${{ secrets.DOCKERHUB_USERNAME }}/astro-app:latest
          LIVE_CONTAINER_NAME=astro_website_live
          NEW_CONTAINER_NAME=astro_website_staging
          LIVE_PORT=4321
          STAGING_PORT=4322

          echo "1. Pulling image and starting on $STAGING_PORT..."
          docker pull $IMAGE_TAG
          docker run -d \
            --name $NEW_CONTAINER_NAME \
            -p $STAGING_PORT:80 \
            --restart on-failure \
            $IMAGE_TAG

          echo "2. Health check (via $STAGING_PORT)..."
          sleep 10
          if ! wget --spider -q http://localhost:$STAGING_PORT; then
            echo "❌ Health check failed! Rolling back..."
            docker stop $NEW_CONTAINER_NAME || true
            docker rm $NEW_CONTAINER_NAME || true
            exit 1
          fi

          echo "3. Stopping old container ($LIVE_PORT) and switching traffic..."
          docker stop $LIVE_CONTAINER_NAME || true
          docker rm $LIVE_CONTAINER_NAME || true

          # Rename/Rerun the proven healthy image on the LIVE_PORT
          docker stop $NEW_CONTAINER_NAME
          docker rm $NEW_CONTAINER_NAME
          docker run -d \
            --name $LIVE_CONTAINER_NAME \
            -p $LIVE_PORT:80 \
            --restart always \
            $IMAGE_TAG

          echo "4. Cleanup..."
          docker image prune -f
```

## V. Lokale Entwicklung (Dev Environment) 🧑‍💻

Für die lokale Entwicklung wird eine separate `docker-compose.yml` ohne CI/CD-Logik verwendet, die den Code live mountet (volumes) und den Astro Development Server startet.

```yaml
services:
  astro-dev:
    image: node:20-alpine
    container_name: astro_local_dev
    ports:
      - "4321:4321"
    volumes:
      - .:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
```

## VI. Fazit und Vorteile 📈

Dieses Setup gewährleistet ein hohes Maß an Betriebssicherheit:

- **Zero Downtime**: Die Umschaltung erfolgt erst, nachdem der neue Container als gesund validiert wurde.
- **Immutability**: Jeder Deployment-Vorgang basiert auf einem unveränderlichen Docker Image.
- **Security**: Trennung von Deployment-User und SSH-Keys von der Root-Umgebung.

Die Architektur ist somit hochgradig skalierbar und wartungsarm.
