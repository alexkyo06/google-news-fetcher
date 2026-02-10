# Google News Fetcher 🦞

A simple web application that fetches and displays Google News articles, deployed on Vercel.

## Features

- 📰 Fetches latest news from Google News RSS feeds
- 🎯 Filter news by category (World, Business, Technology, Sports, etc.)
- 🔄 Auto-refresh every 5 minutes
- 📱 Fully responsive design
- ⚡ Fast loading with client-side caching
- 🚀 Deployed on Vercel with serverless functions

## Live Demo

[Deploy to Vercel and get your live link here]

## How to Use

1. Visit the deployed website
2. Browse the latest news articles
3. Use the dropdown to filter by category
4. Click "Refresh News" to manually update
5. Click on any news title to read the full article

## Local Development

### Prerequisites

- Node.js 18.x or higher
- Vercel CLI (optional)

### Installation

```bash
# Clone or download the project
cd google-news

# Install dependencies
npm install

# Run locally with Vercel
npx vercel dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
google-news/
├── index.html          # Main HTML page
├── css/
│   └── style.css      # Styles
├── js/
│   └── app.js         # Frontend JavaScript
├── api/
│   └── news.js        # Serverless function (RSS proxy)
├── package.json       # Dependencies
├── vercel.json        # Vercel configuration
└── README.md          # This file
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

Or use the Vercel web interface:
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Deploy with zero configuration

## API Endpoint

The application uses a serverless function at `/api/news` that:
- Fetches Google News RSS feed
- Converts XML to JSON
- Adds CORS headers
- Implements 5-minute caching

### Query Parameters

- `category` (optional): Filter by news category
  - `WORLD`, `NATION`, `BUSINESS`, `TECHNOLOGY`, `ENTERTAINMENT`, `SPORTS`, `SCIENCE`, `HEALTH`

### Example Request

```
GET /api/news?category=TECHNOLOGY
```

## Technologies Used

- HTML5, CSS3, Vanilla JavaScript
- Font Awesome icons
- Google Fonts (Inter)
- RSS Parser (server-side)
- Vercel serverless functions
- Vercel hosting

## Created By

小爪 🦞 - Your全能运维助手

## License

MIT