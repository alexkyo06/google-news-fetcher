// Vercel serverless function to fetch Google News RSS feed
const Parser = require('rss-parser');

// Create a new parser
const parser = new Parser();

// Google News RSS URLs by category
const rssUrls = {
  '': 'https://news.google.com/rss', // Top Stories
  'WORLD': 'https://news.google.com/rss/headlines/section/topic/WORLD',
  'NATION': 'https://news.google.com/rss/headlines/section/topic/NATION',
  'BUSINESS': 'https://news.google.com/rss/headlines/section/topic/BUSINESS',
  'TECHNOLOGY': 'https://news.google.com/rss/headlines/section/topic/TECHNOLOGY',
  'ENTERTAINMENT': 'https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT',
  'SPORTS': 'https://news.google.com/rss/headlines/section/topic/SPORTS',
  'SCIENCE': 'https://news.google.com/rss/headlines/section/topic/SCIENCE',
  'HEALTH': 'https://news.google.com/rss/headlines/section/topic/HEALTH'
};

// Cache configuration
let cache = {
  data: null,
  timestamp: 0,
  category: ''
};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get category from query parameter
    const category = req.query.category || '';
    const rssUrl = rssUrls[category] || rssUrls[''];
    
    // Check cache
    const now = Date.now();
    if (cache.data && cache.category === category && (now - cache.timestamp) < CACHE_DURATION) {
      console.log('Serving from cache');
      return res.status(200).json({
        ...cache.data,
        cached: true,
        cacheAge: Math.floor((now - cache.timestamp) / 1000)
      });
    }
    
    console.log(`Fetching Google News RSS from: ${rssUrl}`);
    
    // Parse the RSS feed
    const feed = await parser.parseURL(rssUrl);
    
    // Transform the feed data
    const newsData = {
      title: feed.title || 'Google News',
      link: feed.link || 'https://news.google.com',
      description: feed.description || 'Latest news from Google News',
      items: feed.items.slice(0, 20).map(item => ({
        title: item.title || 'No title',
        link: item.link || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        description: item.content || item.contentSnippet || 'No description',
        source: item.creator || 'Google News',
        categories: item.categories || []
      })),
      lastUpdated: new Date().toISOString(),
      category: category || 'top'
    };
    
    // Update cache
    cache = {
      data: newsData,
      timestamp: now,
      category: category
    };
    
    // Return the data
    res.status(200).json(newsData);
    
  } catch (error) {
    console.error('Error fetching Google News RSS:', error);
    
    // Return error response
    res.status(500).json({
      error: 'Failed to fetch news',
      message: error.message,
      items: []
    });
  }
};