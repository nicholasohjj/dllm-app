# GitHub Actions Workflows

This document describes all the GitHub Actions workflows configured for this project.

## 📋 Workflows Overview

### 1. CI Workflow (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**Purpose:** Continuous Integration checks to ensure code quality

**Jobs:**

- **Quality Check**: Runs type checking, linting, and format checking
- **Build**: Builds the project and uploads artifacts

**What it does:**

- ✅ Type checks with TypeScript
- ✅ Lints code with ESLint
- ✅ Checks code formatting with Prettier
- ✅ Builds the application
- ✅ Uploads build artifacts (retained for 7 days)

---

### 2. Deploy Workflow (`deploy.yml`)

**Triggers:** Push to `main`, Manual dispatch

**Purpose:** Automatically deploys the app to GitHub Pages

**Setup Required:**

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow will deploy on every push to `main`

**What it does:**

- 🚀 Builds the production version
- 🌐 Deploys to GitHub Pages
- 📦 Serves your PWA application

---

### 3. CodeQL Security Analysis (`codeql.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests, Weekly schedule (Monday 2 AM UTC)

**Purpose:** Automated security vulnerability scanning

**What it does:**

- 🔒 Scans for security vulnerabilities
- 🔍 Analyzes code quality issues
- 📊 Provides security reports in Security tab
- ⚠️ Alerts on potential security issues

---

### 4. Lighthouse CI (`lighthouse.yml`)

**Triggers:** Pull Requests

**Purpose:** PWA performance, accessibility, and SEO testing

**What it does:**

- ⚡ Performance testing
- ♿ Accessibility audits
- 🎯 Best practices checks
- 🔍 SEO analysis
- 📱 PWA compliance testing

**Configuration:** See `.github/lighthouse/lighthouse-config.json`

**Optional:** Set up `LHCI_GITHUB_APP_TOKEN` secret for persistent storage

---

### 5. PR Labeler (`pr-labeler.yml`)

**Triggers:** Pull Request opened/updated

**Purpose:** Automatically labels PRs based on changed files

**Labels Applied:**

- `documentation` - Changes to .md files or docs/
- `dependencies` - Changes to package.json or lock files
- `ci/cd` - Changes to .github/
- `frontend` - Changes to src/ TypeScript/React files
- `components` - Changes to components/
- `ui` - Changes to UI components
- `laundry` - Changes to laundry feature
- `api` - Changes to api/
- `config` - Changes to config files
- `pwa` - Changes to PWA files (manifest, service worker)
- `styles` - Changes to CSS/Tailwind

---

### 6. Stale Issues/PRs (`stale.yml`)

**Triggers:** Daily at midnight UTC, Manual dispatch

**Purpose:** Automatically manages inactive issues and PRs

**What it does:**

- Issues: Marked stale after 60 days, closed after 7 more days
- PRs: Marked stale after 30 days, closed after 7 more days
- Exempts issues/PRs labeled: `pinned`, `security`, `enhancement` (issues only)

---

### 7. Dependabot (`dependabot.yml`)

**Triggers:** Weekly (Monday 2 AM)

**Purpose:** Automated dependency updates

**What it does:**

- 📦 Weekly npm dependency updates
- 🔄 Monthly GitHub Actions updates
- 👥 Auto-assigns reviewer
- 🏷️ Auto-labels with `dependencies` and `automated`
- 📋 Groups related updates (React, Radix UI, dev dependencies)

**Note:** Review and merge Dependabot PRs regularly

---

## 🚀 Getting Started

### Prerequisites

1. Enable GitHub Actions in your repository settings
2. For deployment: Enable GitHub Pages with "GitHub Actions" source
3. (Optional) Add secrets for Lighthouse CI persistent storage

### First-Time Setup

1. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Your app will be available at `https://[username].github.io/[repo-name]`

2. **Enable Dependabot Alerts:**
   - Go to Settings → Security & analysis
   - Enable Dependabot alerts and security updates

3. **Review Workflow Permissions:**
   - Go to Settings → Actions → General
   - Set "Workflow permissions" to "Read and write permissions"

### Usage

Most workflows run automatically. You can also:

- **Manually trigger deploy:** Actions tab → Deploy to GitHub Pages → Run workflow
- **Manually check stale items:** Actions tab → Mark stale issues and PRs → Run workflow

---

## 🔧 Customization

### Adjusting Lighthouse Thresholds

Edit `.github/lighthouse/lighthouse-config.json` to adjust performance thresholds.

### Changing Stale Timeouts

Edit `.github/workflows/stale.yml` to adjust days before marking stale or closing.

### Adding More Labels

Edit `.github/labeler.yml` to add custom label rules.

### Dependabot Schedule

Edit `.github/dependabot.yml` to change update frequency or grouping.

---

## 📊 Monitoring

- **CI/CD Status:** Check the Actions tab for workflow runs
- **Security:** Check the Security tab for CodeQL findings
- **Dependencies:** Check Pull Requests for Dependabot updates
- **Deployment:** Check Environments tab for deployment history

---

## ⚠️ Troubleshooting

### Deploy Fails

- Ensure GitHub Pages is enabled with "GitHub Actions" source
- Check workflow permissions are set to "Read and write"

### Lighthouse Fails

- Check that the preview server starts correctly
- Adjust `startServerReadyTimeout` if build is slow

### Dependabot PRs Not Appearing

- Check Security → Dependabot is enabled
- Ensure dependabot.yml is valid
- Check repository insights for Dependabot activity

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
