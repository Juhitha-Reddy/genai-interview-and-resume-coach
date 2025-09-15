# 📝 Commit Guide for GenAI Interview Coach

## 🎯 Commit Strategy

This project follows a **feature-based commit strategy** with clear milestones. Each commit should represent a **working state** that can be demoed or deployed.

## 📋 Commit Types

```
feat:     New feature or functionality
fix:      Bug fixes
docs:     Documentation changes
style:    Code formatting, no logic changes
refactor: Code restructuring without behavior changes
test:     Adding or updating tests
chore:    Build process, dependencies, tools
```

## 🚀 Milestone Commits

### Phase 1: Foundation

- `feat: initial project structure and documentation`
- `feat: backend API setup with Express and OpenAI integration`
- `feat: frontend React app with Tailwind CSS`
- `feat: resume upload and parsing functionality`

### Phase 2: Core Features

- `feat: interview question generation from resume`
- `feat: chat interface for Q&A sessions`
- `feat: vector database integration for knowledge storage`

### Phase 3: AI Features

- `feat: STAR method feedback analysis`
- `feat: multi-dimensional scoring system`
- `feat: improvement suggestions engine`

### Phase 4: Production

- `feat: deployment configuration and environment setup`
- `feat: security middleware and rate limiting`
- `docs: comprehensive API documentation`

## 💡 Commit Best Practices

1. **Make atomic commits** - Each commit should do ONE thing well
2. **Test before committing** - Ensure the app runs without errors
3. **Write clear messages** - Explain WHAT and WHY, not just how
4. **Commit frequently** - Don't let commits get too large

## 📝 Commit Message Format

```
type: brief description (50 chars max)

Optional longer explanation of what changed and why.
Include any breaking changes or migration notes.

- Bullet points for multiple changes
- Reference issue numbers if applicable
```

## 🔄 Example Workflow

```bash
# After completing a feature
git add .
git commit -m "feat: resume upload with PDF parsing

- Added multer middleware for file uploads
- Integrated pdf-parse for text extraction
- Created ResumeUpload component with drag-drop
- Added basic error handling and validation"

# Push to remote
git push origin main
```

## 🎯 Current Milestone: Foundation Setup

You're about to make your first commit! This should include:

- ✅ Project structure and documentation
- ✅ Package.json configurations
- ✅ Basic Express server
- ✅ React TypeScript app foundation
- ✅ Environment setup and gitignore

**Suggested commit message:**

```
feat: initial project structure and foundation

- Added comprehensive 6-week development plan
- Set up monorepo with frontend/backend workspaces
- Created React TypeScript app with modern tooling
- Configured Express server with security middleware
- Added documentation and development guidelines
```
