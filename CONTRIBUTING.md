# Contributing to FreeDevTools

Thank you for your interest in contributing to FreeDevTools! This document provides guidelines and information for contributors.

## What We're Looking For

We welcome contributions in many forms:

- 🛠️ **New Tools**: Add useful developer utilities
- 🐛 **Bug Fixes**: Fix issues and improve reliability
- ✨ **Enhancements**: Improve existing tools
- 📚 **Documentation**: Better guides and examples
- 🎨 **UI/UX**: Improve the user interface
- 🧪 **Tests**: Add test coverage
- 🌐 **Translations**: Make tools accessible worldwide

## Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/freedevtools.git
   cd freedevtools
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-tool
   ```
4. **Make your changes**
5. **Test your changes**
6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing new tool"
   git push origin feature/amazing-new-tool
   ```
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
cd frontend
npm install

# Start development server
make run

# Deploy
make deploy
```

## Project Structure

```
freedevtools/
├── frontend/                 # Astro frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Tool pages
│   │   ├── config/         # Configuration files
│   │   └── styles/         # CSS and styling
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                 # Backend services (coming soon)
├── .github/                # GitHub templates and workflows
├── LICENSE                 # MIT License
└── README.md              # Project documentation
```

## Adding a New Tool

### 1. Create Tool Component

```
cd frontend
make gen tool=url-encoder
```

### 2. Update README

Add your tool to the available tools list in the main README.

## Code Style Guidelines

### TypeScript/React

- Use functional components with hooks
- Prefer TypeScript over JavaScript
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic HTML elements

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new tool for data conversion
fix: resolve issue with base64 encoding
docs: update contributing guidelines
style: improve button hover states
refactor: simplify tool configuration
test: add unit tests for json prettifier
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Include usage examples
- Document complex logic and algorithms

### User Documentation

- Write clear tool descriptions
- Include step-by-step usage instructions
- Add screenshots for complex tools
- Provide common use cases

## Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and builds
2. **Code Review**: Maintainers review your changes
3. **Feedback**: Address any review comments
4. **Merge**: Once approved, your changes are merged

## Reporting Issues

Before reporting an issue:

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Try to reproduce** the issue consistently
4. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Pull Requests**: For code contributions

## Recognition

Contributors are recognized in several ways:

- **Contributors list** on GitHub
- **Release notes** for significant contributions
- **Special thanks** in documentation
- **Contributor badges** for active participants

## License

By contributing to FreeDevTools, you agree that your contributions will be licensed under the MIT License.

## Thank You

Thank you for contributing to FreeDevTools! Every contribution, no matter how small, helps make developer tools more accessible and useful for everyone.
