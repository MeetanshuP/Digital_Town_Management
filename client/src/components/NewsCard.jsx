import React, { useState } from "react";
import { Calendar } from "lucide-react";

const NewsCard = ({ news }) => {

    const [expanded, setExpanded] = useState(false);

    const toggleReadMore = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">

            {/* Image */}
            {news.image && (
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                />
            )}

            <div className="p-6">

                {/* Date */}
                <div className="flex items-center text-gray-400 text-xs mb-3">
                    <Calendar size={14} className="mr-1" />
                    {new Date(news.createdAt).toLocaleDateString()}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {news.title}
                </h3>

                {/* Description */}
                <p className={`text-gray-600 mb-4 ${expanded ? "" : "line-clamp-3"}`}>
                    {news.description}
                </p>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">

                    <span className="text-sm font-medium text-gray-500">
                        By {news.postedBy?.firstName || "Admin"}
                    </span>

                    <button
                        onClick={toggleReadMore}
                        className="text-green-600 font-bold text-sm hover:underline"
                    >
                        {expanded ? "Read Less" : "Read More"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default NewsCard;