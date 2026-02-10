// Google News Fetcher Application
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newsContainer = document.getElementById('news-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const refreshBtn = document.getElementById('refresh-btn');
    const categorySelect = document.getElementById('category');
    const timestampElement = document.getElementById('timestamp');
    
    // Base URL for our API
    const apiBaseUrl = '/api/news';
    
    // Initialize the app
    function init() {
        // Set current timestamp
        updateTimestamp();
        
        // Load initial news
        loadNews();
        
        // Set up event listeners
        refreshBtn.addEventListener('click', loadNews);
        categorySelect.addEventListener('change', loadNews);
        
        // Auto-refresh every 5 minutes
        setInterval(loadNews, 5 * 60 * 1000);
    }
    
    // Update timestamp display
    function updateTimestamp() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        timestampElement.textContent = `Last updated: ${now.toLocaleString('en-US', options)}`;
    }
    
    // Load news from API
    async function loadNews() {
        // Show loading, hide error and news container
        showLoading();
        hideError();
        
        // Get selected category
        const category = categorySelect.value;
        
        try {
            // Build API URL
            let apiUrl = apiBaseUrl;
            if (category) {
                apiUrl += `?category=${category}`;
            }
            
            // Fetch news from our API
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const newsData = await response.json();
            
            // Hide loading
            hideLoading();
            
            // Display news
            displayNews(newsData);
            
            // Update timestamp
            updateTimestamp();
            
        } catch (error) {
            console.error('Error fetching news:', error);
            hideLoading();
            showError();
        }
    }
    
    // Display news items
    function displayNews(newsData) {
        // Clear previous news
        newsContainer.innerHTML = '';
        
        // Check if we have news
        if (!newsData || !newsData.items || newsData.items.length === 0) {
            newsContainer.innerHTML = `
                <div class="no-news" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #5f6368;">
                    <i class="fas fa-newspaper" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <h3>No news available</h3>
                    <p>Try refreshing or selecting a different category.</p>
                </div>
            `;
            return;
        }
        
        // Create news items
        newsData.items.forEach(item => {
            const newsItem = createNewsItem(item);
            newsContainer.appendChild(newsItem);
        });
    }
    
    // Create a single news item element
    function createNewsItem(item) {
        const article = document.createElement('article');
        article.className = 'news-item';
        
        // Create a placeholder image (in a real app, you might get actual images from the RSS feed)
        const placeholderColors = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335'];
        const randomColor = placeholderColors[Math.floor(Math.random() * placeholderColors.length)];
        
        // Format date
        let dateText = 'Recent';
        if (item.pubDate) {
            const pubDate = new Date(item.pubDate);
            const now = new Date();
            const diffHours = Math.floor((now - pubDate) / (1000 * 60 * 60));
            
            if (diffHours < 1) {
                dateText = 'Just now';
            } else if (diffHours < 24) {
                dateText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else {
                dateText = pubDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }
        
        // Extract source from description or use default
        let source = 'Google News';
        if (item.source && item.source.text) {
            source = item.source.text;
        } else if (item.description) {
            // Try to extract source from description (common pattern in Google News RSS)
            const sourceMatch = item.description.match(/<font color="#6f6f6f">([^<]+)<\/font>/);
            if (sourceMatch && sourceMatch[1]) {
                source = sourceMatch[1].trim();
            }
        }
        
        // Clean description (remove HTML tags and source info)
        let cleanDescription = item.description || '';
        cleanDescription = cleanDescription.replace(/<[^>]*>/g, '');
        cleanDescription = cleanDescription.replace(/^[^•]*•\s*/, ''); // Remove source prefix
        cleanDescription = cleanDescription.trim();
        
        // Truncate description if too long
        if (cleanDescription.length > 200) {
            cleanDescription = cleanDescription.substring(0, 200) + '...';
        }
        
        // Truncate title if too long
        let title = item.title || 'No title';
        if (title.length > 100) {
            title = title.substring(0, 100) + '...';
        }
        
        article.innerHTML = `
            <div class="news-image" style="background-color: ${randomColor};">
                <i class="fas fa-newspaper" style="color: white; opacity: 0.7;"></i>
            </div>
            <div class="news-content">
                <h3 class="news-title">
                    <a href="${item.link || '#'}" target="_blank" rel="noopener noreferrer">
                        ${title}
                    </a>
                </h3>
                <p class="news-description">${cleanDescription || 'No description available.'}</p>
                <div class="news-meta">
                    <span class="news-source">${source}</span>
                    <span class="news-date">${dateText}</span>
                </div>
            </div>
        `;
        
        return article;
    }
    
    // UI helper functions
    function showLoading() {
        loadingElement.style.display = 'flex';
        newsContainer.style.display = 'none';
    }
    
    function hideLoading() {
        loadingElement.style.display = 'none';
        newsContainer.style.display = 'grid';
    }
    
    function showError() {
        errorElement.style.display = 'block';
        newsContainer.style.display = 'none';
    }
    
    function hideError() {
        errorElement.style.display = 'none';
    }
    
    // Initialize the app
    init();
});