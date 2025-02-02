FROM node:18-slim
RUN useradd -m appuser
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN chown -R appuser:appuser /usr/src/app
USER appuser
EXPOSE 4000
CMD ["npm", "start"]
