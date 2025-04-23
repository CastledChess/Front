# Étape 1 : Construction avec Vite
FROM node:22.8.0-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Utiliser nginx pour servir le contenu en production
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copier la configuration par défaut de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Démarrage de Nginx en mode "daemon off"
CMD ["nginx", "-g", "daemon off;"]
