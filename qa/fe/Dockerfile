FROM mcr.microsoft.com/playwright:v1.55.0-jammy
WORKDIR /workspace
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .


