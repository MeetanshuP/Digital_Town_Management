const axios = require("axios");

const NEWS_API_BASE_URL = "https://newsapi.org/v2/everything";
const API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch news based on location and category
 *
 * @param {Object} params
 * @param {string} params.state
 * @param {string} params.city
 * @param {string} params.category
 */
const fetchNewsByLocationAndCategory = async ({
    state,
    city,
    category
}) => {
    if (!API_KEY) {
        throw new Error("News API key is missing");
    }

    if (!state || !category) {
        throw new Error("State and category are required");
    }

    // Build keyword query (location-aware)
    const keywords = city
        ? `${state} ${city}`
        : `${state}`;

    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                apiKey: API_KEY,
                q: `${category} India`,
                language: "en",
                pageSize: 20
            }
        });

        const articles = response.data.articles || [];

        // Normalize response
        return articles.map(article => ({
            title: article.title,
            description: article.description,
            url: article.url,
            imageUrl: article.urlToImage,
            source: article.source.name,
            publishedAt: article.publishedAt
        }));

    } catch (error) {
        console.error("News Service Error:", error.message);
        throw new Error("Failed to fetch news");
    }
};

/**
 * Maps UI category → NewsAPI category
 */
const mapCategory = (category) => {
    const categoryMap = {
        finance: "business",
        agriculture: "general",
        health: "health",
        education: "general",
        politics: "general"
    };

    return categoryMap[category.toLowerCase()] || "general";
};

module.exports = {
    fetchNewsByLocationAndCategory
};
