# Snippet Vault

A compact service for storing useful snippets (links/notes/commands) with tagging and search functionality.

Project is developed according to the technical specifications located in the `docs` folder.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- MongoDB

### Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Environment variables
Use .env.example files as templates

# Start servers
cd backend && npm run start:dev
cd ../frontend && npm run dev
```

## 🧪 API Examples

```bash
# Get snippets
curl "http://localhost:3001/snippets"

# Create snippet
curl -X POST "http://localhost:3001/snippets" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Example","type":"note","tags":["test"]}'

# Update snippet
curl -X PATCH "http://localhost:3001/snippets/{id}" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Delete snippet
curl -X DELETE "http://localhost:3001/snippets/{id}"
```

## 🏗️ Production

```bash
# Build
cd backend && npm run build
cd ../frontend && npm run build

# Run production
cd backend && npm run start:prod
cd ../frontend && npm start
```

## 🌐 Demo

- **Frontend**: https://snippet-vault-insanetim.vercel.app/
- **Backend**: https://snippet-vault-api-jgjw.onrender.com/

## ️ Tech Stack

**Backend**: NestJS, TypeScript, MongoDB, Mongoose  
**Frontend**: Next.js 16, TypeScript, Tailwind CSS, Redux Toolkit
