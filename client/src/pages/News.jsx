import React, { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";
import LocationNews from "../components/LocationNews";
import { Newspaper, Bell, MapPin } from "lucide-react";
import axios from "../utils/axiosInstance";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle state
  const [view, setView] = useState("local"); // local | nearby

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch News with Pagination
  const fetchNews = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(`/news?page=${pageNumber}&limit=6`);

      const { data, page, totalPages } = res.data;

      setNews(data); // backend already sorted
      setPage(page);
      setTotalPages(totalPages);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on page/view change
  useEffect(() => {
    if (view !== "local") return;
    fetchNews(page);
  }, [view, page]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-green-600 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Village News</h1>
          <p className="text-green-100 text-lg">
            Stay updated with the latest happenings in your community.
          </p>

          {/* Toggle Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                setView("local");
                setPage(1); // reset pagination
              }}
              className={`px-5 py-2 rounded-full font-semibold ${view === "local"
                ? "bg-white text-green-700"
                : "bg-white/20 text-white"
                }`}
            >
              Local News
            </button>

            <button
              onClick={() => setView("nearby")}
              className={`px-5 py-2 rounded-full font-semibold flex items-center gap-2 ${view === "nearby"
                ? "bg-white text-green-700"
                : "bg-white/20 text-white"
                }`}
            >
              <MapPin size={16} />
              Nearby News
            </button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-full relative z-10">
          <Newspaper size={48} />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* ================= CONTENT ================= */}

      {/* Nearby News */}
      {view === "nearby" && <LocationNews />}

      {/* Local News */}
      {view === "local" && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200"></div>

                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.length > 0 ? (
                  news.map((item) => (
                    <NewsCard key={item._id} news={item} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">
                      No news updates available yet.
                    </h3>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default News;