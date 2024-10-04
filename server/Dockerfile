FROM node:16

# Set the working directory
WORKDIR /app

# Install necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    docker.io \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcurl4 \
    libdbus-glib-1-2 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libxtst6 \
    libxshmfence1 \
    lsb-release \
    x11-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

EXPOSE 8080

COPY . .

CMD ["npx", "nodemon", "index.js"]