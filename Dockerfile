# Production Dockerfile for Headless Remotion Video Rendering on standard Linux VPS
FROM node:20-bookworm-slim

# Install Chromium, FFmpeg and core fonts for headless rendering
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-freefont-ttf \
    fonts-liberation \
    fonts-noto-color-emoji \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Tell Remotion / Puppeteer to use the system-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV REMOTION_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and configuration
COPY . .

# Precompile TypeScript to ensure zero build errors
RUN npm run typecheck

# Output directory volume for rendered MP4s
VOLUME [ "/app/out" ]

# Default command renders vertical news video
ENTRYPOINT ["node", "node_modules/@remotion/cli/dist/index.js", "render"]
CMD ["NewsVertical", "out/news-vertical.mp4"]
