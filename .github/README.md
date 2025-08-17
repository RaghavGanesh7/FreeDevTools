# GitHub Repository Configuration

This directory contains GitHub-specific configuration files and templates to make the FreeDevTools repository more professional and contributor-friendly.

## Directory Structure

```
.github/
├── ISSUE_TEMPLATE/          # Issue templates for bug reports and feature requests
│   ├── bug_report.md       # Template for reporting bugs
│   └── feature_request.md  # Template for requesting new features
├── workflows/               # GitHub Actions workflows
│   └── ci.yml             # Continuous Integration pipeline
├── FUNDING.yml             # GitHub Sponsors configuration
└── README.md               # This file
```

## What These Files Do

### Issue Templates

- **Bug Report Template**: Helps users report bugs with all necessary information
- **Feature Request Template**: Guides users in suggesting new tools and improvements

### GitHub Actions

- **CI Workflow**: Automatically builds and tests the project on every push and PR
- **Matrix Testing**: Tests against multiple Node.js versions
- **Automated Feedback**: Comments on PRs when builds are successful

### Funding Configuration

- **GitHub Sponsors**: Enables community funding support
- **Multiple Platforms**: Supports various funding platforms

## Benefits

1. **Professional Appearance**: Shows the project is well-maintained
2. **Better Issues**: Structured templates lead to better bug reports
3. **Automated Testing**: CI/CD ensures code quality
4. **Community Support**: Funding options help sustain development
5. **Contributor Experience**: Clear guidelines and automated processes

## Customization

### Issue Templates

Edit the templates in `ISSUE_TEMPLATE/` to match your project's needs:

- Add/remove fields
- Change labels
- Modify the structure

### CI Workflow

The CI workflow in `workflows/ci.yml` can be customized:

- Add more Node.js versions
- Include additional testing steps
- Modify deployment logic

### Funding

Update `FUNDING.yml` with your actual usernames:

- Replace placeholder usernames
- Remove platforms you don't use
- Add custom funding URLs

## Learn More

- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Sponsors](https://docs.github.com/en/sponsors)

---

**These configurations help make FreeDevTools a welcoming and professional open-source project! 🎉**
