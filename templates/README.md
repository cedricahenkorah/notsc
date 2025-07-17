# {{ projectName }}

A Node.js TypeScript API built with Express.

## Features

- ✅ TypeScript support
- 🧱 Modular architecture (controllers, routes, services)
- 📦 {% if database %}Database setup (MongoDB){% else %}No database setup{% endif %}
- 🌐 {% if swagger %}Swagger/OpenAPI documentation{% else %}No Swagger setup{% endif %}
- 🔄 {% if redis %}Redis setup{% else %}No Redis setup{% endif %}
- 🧪 {% if jest %}Jest testing setup{% else %}No testing setup{% endif %}
- 🐳 {% if docker %}Docker setup{% else %}No Docker setup{% endif %}
- 🎯 ESLint + Prettier setup
- 🔁 Nodemon for development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
  {% if database %}- MongoDB
  {% endif %}{% if redis %}- Redis
  {% endif %}

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   {{ packageManager }} install
