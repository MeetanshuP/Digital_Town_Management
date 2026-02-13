import React, { useEffect, useState } from "react";
import { fetchLocationBasedNews } from "../services/newsApi";

const CATEGORIES = [
  "agriculture",
  "finance",
  "health",
  "education",
  "politics"
];

const LocationNews = () => {
  const [category, setCategory] = useState("agriculture");
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      () => {
        setError("Location access denied");
      }
    );
  }, []);

  // Fetch news when location/category changes
  useEffect(() => {
    if (!location) return;

    const loadNews = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetchLocationBasedNews({
          lat: location.lat,
          lon: location.lon,
          category
        });
        console.log("API RESPONSE:", response);

        // 🔐 SAFELY extract array
        const articles = Array.isArray(response?.data)
          ? response.data
          : [];

        setNews(articles);

      } catch (err) {
        console.error(err);
        setError("Failed to load news");
        setNews([]); // prevent undefined crash
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [location, category]);

  return (
  <div className="mt-6">

    <h2 className="text-2xl font-bold mb-4">Nearby News</h2>

    {/* Category Toggle */}
    <div className="flex flex-wrap gap-3 mb-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            category === cat
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {cat.toUpperCase()}
        </button>
      ))}
    </div>

    {/* Status */}
    {loading && (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )}

    {error && (
      <p className="text-red-500 text-center py-4">{error}</p>
    )}

    {/* News Cards */}
    {!loading && !error && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt="news"
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-auto">
                  <p className="text-xs text-gray-500 mb-2">
                    {item.source}
                  </p>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 font-semibold hover:underline text-sm"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No news available for this category.
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default LocationNews;
