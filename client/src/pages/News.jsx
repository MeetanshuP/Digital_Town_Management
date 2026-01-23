import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewsCard from '../components/NewsCard';
import { Newspaper, Bell } from 'lucide-react';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get('/api/news');
                setNews(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="space-y-8">
            <div className="bg-green-600 rounded-3xl p-10 text-white flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold mb-2">Village News</h1>
                    <p className="text-green-100 text-lg">Stay updated with the latest happenings in your community.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-full relative z-10">
                    <Newspaper size={48} />
                </div>
                {/* Abstract background shape */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.length > 0 ? (
                        news.map(item => <NewsCard key={item._id} news={item} />)
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">No news updates available yet.</h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default News;