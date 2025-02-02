# FAQ Management System

This is a Node.js based FAQ management system API. It supports multilingual FAQs and stores them in MongoDB. The system also includes caching for API responses and automatic translation for FAQs in multiple languages.

## Features

- **Create FAQs**: Add questions and answers in multiple languages.
- **Automatic Translations**: Missing translations for FAQ fields are generated automatically.
- **Caching**: API responses are cached to improve performance.
- **Language Support**: Supports multiple languages (e.g., Hindi, Bengali) via query parameters


## Getting Started - Local

### 1. Clone the Repository and Run the project

```bash
git clone https://github.com/yourusername/faq-management-system.git
cd faq-management-system
npm install
npm start
```

### Other Requirements:
- Create a .env file with these fields:
```bash
DB_URI = ""
DB_USERNAME = ""
DB_PASSWORD = ""
PORT = 4000
REDIS_URI = "redis://127.0.0.1:6379"
```

- To run redis in windows machine (Make sure redis-server is installed): 
```bash
redis-server --port 6379
sudo service redis start
```

- Created dockerFile and docker-compose.yml
```bash
docker build -t faq-app .
docker images
docker run -p 4000:4000 --name faq-app-container faq-app
```

- To Use docker.compose.yml:
```bash
docker-compose build
docker-compose up
http://localhost:4000
```

### Implementations:
- Model Design - Mongoose and MongoDB
- API Development
-  Caching Mechanism - redis
- Multi-language Translation Support - https://api.mymemory.translated.net
- Admin Panel - Admin Panel (static pages)
- Unit Tests & Code Quality - Jest
- Git & Version Control - Followed the conventions
- Deployment & Docker Support - provided Dockerfile and docker-compose.yml

### APIs
- GET Request:
  - http://localhost:4000/api/faqs/?lang=hi
  - http://localhost:4000/api/faqs/?lang=bn

- POST Request:
  - http://localhost:4000/api/faq

