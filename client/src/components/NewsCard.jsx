import React from 'react';
import { Calendar, Tag } from 'lucide-react';

const NewsCard = ({ news }) => {
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Emergency': return 'bg-red-100 text-red-600';
            case 'Administration': return 'bg-blue-100 text-blue-600';
            case 'Event': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(news.category)}`}>
                    {news.category}
                </span>
                <div className="flex items-center text-gray-400 text-xs">
                    <Calendar size={14} className="mr-1" />
                    {new Date(news.date).toLocaleDateString()}
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">{news.title}</h3>
            <p className="text-gray-600 line-clamp-3 mb-4">{news.content}</p>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">By {news.author?.name || 'Admin'}</span>
                <button className="text-green-600 font-bold text-sm hover:underline">Read More</button>
            </div>
        </div>
    );
};

export default NewsCard;