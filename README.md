# notsc 🦉

notsc is a highly customizable boilerplate generator for quickly scaffolding Node.js + TypeScript API projects. It supports optional integrations like database setup, Swagger/OpenAPI documentation, Redis, Jest for testing, and Docker—so you can start building with the tools you need, right out of the box.

## 🚀 Features

- ✅ TypeScript support
- 🧱 Modular architecture (controllers, routes, services)
- 📦 Optional features: database, Swagger, Redis, Jest, Docker
- 🎯 ESLint + Prettier setup
- 🔁 Nodemon for development
- 🧪 Jest for testing (optional)
- 🌐 Swagger/OpenAPI setup (optional)
- 🐳 Dockerfile & Dockerignore (optional)
- 📂 Environment variable management

---

## 📦 Installation & Usage

### Using the Published Package

#### Quick Start

```bash
npx notsc my-app
```

#### Global Installation

```bash
npm install -g notsc
notsc my-app
```

#### With Package Managers

```bash
# Using yarn
yarn create notsc my-app

# Using pnpm
pnpm create notsc my-app
```

### Local Development

#### Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd notsc

# Install dependencies
npm install

# Build the project
npm run build

# Link locally for testing
npm link
```

#### Testing Locally

```bash
# Test the CLI tool
notsc test-project
notsc --help
notsc --version

# Test with different options
notsc my-api --no-git
notsc

# Test using npx with local path
npx . test-project
npx . --help

# Test the compiled version directly
node dist/index.js test-project
```

#### Development Commands

```bash
# Run in development mode
npm run dev test-project

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

#### Unlink When Done

```bash
npm unlink -g
```

### Command Line Options

| Flag        | Description               |
| ----------- | ------------------------- |
| `--version` | Show current version      |
| `--no-git`  | Skip Git initialization   |
| `--help`    | Show help and usage guide |

If no app name is provided, you'll be prompted to enter one.

## 📁 Directory Structure

```
my-app/
├── src/
│   ├── app.ts           # Express app configuration
│   ├── server.ts        # HTTP server setup & entry point
│   ├── config/          # Database & Redis configs
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Error handling & logging
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities
├── .env.example         # Environment variables
├── .eslintrc.js         # ESLint config
├── .prettierrc          # Prettier config
├── jest.config.js       # Jest config (if selected)
├── nodemon.json         # Development config
├── tsconfig.json        # TypeScript config
├── Dockerfile           # Docker config (if selected)
├── docker-compose.yml   # Docker compose (if selected)
└── README.md            # Project documentation
```

> Only selected features (e.g., Redis, Swagger, Jest, Docker) will be included in your project.

---

## 🤖 Interactive Prompts

You'll be prompted to choose:

- **Project name** - Name for your new API project
- **Database setup** - Include MongoDB configuration (optional)
- **Swagger support** - Include OpenAPI documentation (optional)
- **Redis setup** - Include Redis configuration (optional)
- **Jest testing** - Include testing setup with Jest (optional)
- **Docker setup** - Include Docker configuration (optional)
- **Package manager** - Choose between npm, yarn, or pnpm

---

## 🛠 Getting Started with Generated Project

Once setup is complete:

```bash
# Navigate to your new project
cd my-app

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests (if Jest is selected)
npm run test:watch   # Run tests in watch mode (if Jest is selected)
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Testing Your API

```bash
# Health check endpoint
curl http://localhost:3000/api/health

# Swagger documentation (if enabled)
open http://localhost:3000/api-docs
```

---

## 🧩 Customization

Feel free to extend the boilerplate with:

- Authentication (JWT/OAuth)
- Request validation (Zod/Yup)
- GraphQL support
- Message queues
- Additional databases (PostgreSQL, MySQL)
- Rate limiting
- CORS configuration

---

## 🔧 Development

### Project Structure

```
notsc/
├── src/
│   ├── index.ts           # CLI entry point
│   ├── generator.ts       # Main generation logic
│   ├── templates.ts       # File templates
│   ├── fileGenerator.ts   # File system operations
│   └── types.ts           # TypeScript interfaces
├── dist/                  # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

### Adding New Templates

1. Add template functions in `src/templates.ts`
2. Update the `getTemplates()` function
3. Add configuration options in `src/types.ts`
4. Update prompts in `src/generator.ts`

### Testing New Features

```bash
# Build and test locally
npm run build
npm link
notsc test-new-feature
```

---

## 🤝 Contributing

We welcome contributions to notsc! Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated.

### How to Contribute

#### 1. Fork the Repository

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/notsc.git
cd notsc

# Add the original repository as upstream
git remote add upstream https://github.com/cedricahenkorah/notsc.git
```

#### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Link locally for testing
npm link
```

#### 3. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/your-bug-description
```

#### 4. Make Your Changes

- **Follow the existing code style** (ESLint + Prettier)
- **Add tests** for new features
- **Update documentation** if needed
- **Test your changes** thoroughly

#### 5. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm test

# Test the CLI tool
notsc test-project

# Test with different configurations
notsc test-project --no-git
```

#### 6. Commit Your Changes

```bash
# Use conventional commit messages
git commit -m "feat: add new database template"
git commit -m "fix: resolve Redis connection issue"
git commit -m "docs: update README with new features"
```

#### 7. Push and Create a Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

### Development Guidelines

#### Code Style

- **TypeScript**: Use strict TypeScript configuration
- **ESLint**: Follow the existing ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive names for variables, functions, and files

#### Adding New Features

1. **Update Types**: Add new configuration options in `src/types.ts`
2. **Update Generator**: Add prompts in `src/generator.ts`
3. **Add Templates**: Create template functions in `src/templates.ts`
4. **Update Tests**: Add tests for new functionality
5. **Update Docs**: Update README and generated project documentation

#### Template Guidelines

- **Conditional Generation**: Only include files when features are selected
- **Consistent Format**: Follow existing template patterns
- **Environment Variables**: Add new variables to `.env.example`
- **Documentation**: Update Swagger docs and README templates

#### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Test specific features
npm test -- --testNamePattern="database"
```

### Pull Request Guidelines

#### Before Submitting

- [ ] Code follows the existing style
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation is updated
- [ ] CLI tool works correctly
- [ ] Generated projects work as expected

#### Pull Request Template

```markdown
## Description

Brief description of your changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing

- [ ] Tested locally with `npm link`
- [ ] Generated project works correctly
- [ ] All tests pass

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Reporting Issues

#### Bug Reports

When reporting bugs, please include:

- **Environment**: OS, Node.js version, npm version
- **Steps to Reproduce**: Clear, step-by-step instructions
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Screenshots**: If applicable

#### Feature Requests

For feature requests, please include:

- **Description**: What the feature should do
- **Use Case**: Why this feature is needed
- **Implementation Ideas**: How it might be implemented

### Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Code of Conduct**: Please be respectful and inclusive

### Recognition

Contributors will be recognized in:

- **README**: List of contributors
- **Release Notes**: Credit for significant contributions
- **GitHub**: Contributor statistics

---

## 📤 Publishing

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions, changelog entries, and npm publishing.

### Prepare a release

Add a changeset with each user-facing change. Select the package, choose a semantic version bump, and describe the change.

```bash
npx changeset
git add .changeset
git commit -m "docs(changeset): describe the release"
```

Use `patch` for fixes, `minor` for backward-compatible features, and `major` for breaking changes.

### Publish a release

Authenticate with npm and verify the project before publishing from `main`.

```bash
npm login
npm whoami
npm run build
node dist/index.js --help
npm run local-release
git push origin main --follow-tags
```

`npm run local-release` applies pending changesets, updates the package version and changelog, publishes to npm, and creates the Git tag. Do not run `npm version` separately.

---

## 🛡 License

MIT © [Cedric Ahenkorah](https://github.com/cedricahenkorah)
