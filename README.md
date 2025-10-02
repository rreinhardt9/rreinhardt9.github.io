# Reinhardt.io

Personal blog built with Jekyll.

## Prerequisites

- Ruby (managed via asdf/rbenv)
- Bundler

## Setup

1. **Install Ruby version**
   ```bash
   asdf install
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Start the development server**
   ```bash
   bundle exec jekyll serve
   ```

   The site will be available at http://127.0.0.1:4000/

   **To preview drafts while writing:**
   ```bash
   bundle exec jekyll serve --drafts
   ```

## Project Structure

- `_posts/` - Blog posts in Markdown format
- `_drafts/` - Unpublished drafts
- `_layouts/` - Page templates
- `_includes/` - Reusable page components
- `_sass/` - Sass stylesheets
- `_data/` - Data files (e.g., resume.yml)
- `_config.yml` - Jekyll configuration

## Useful Commands

### Creating a New Post
```bash
bundle exec jekyll post "Post Title"
```

### Creating a Draft
```bash
bundle exec jekyll draft "Draft Title"
```

### Publishing a Draft
```bash
bundle exec jekyll publish _drafts/draft-title.md
```

### Building for Production
```bash
bundle exec jekyll build
```
The built site will be in `_site/`

## Jekyll Plugins

- `jekyll-compose` - Commands for creating posts/drafts
- `jekyll-redirect-from` - URL redirection support
- `jekyll-sitemap` - Automatic sitemap generation