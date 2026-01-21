import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTICLES, ARTICLE_LABELS } from '../constants';
import { Language, Article } from '../types';
import { ArrowUpRight, BookOpen } from 'lucide-react';

interface FeaturedArticlesProps {
  language: Language;
}

export const FeaturedArticles: React.FC<FeaturedArticlesProps> = ({ language }) => {
  const navigate = useNavigate();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Filter articles with star: true and sort by date descending
    const articles = ARTICLES[language]
      .filter(article => article.star)
      .sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return dateB - dateA;
      });
    setFeaturedArticles(articles);
  }, [language]);

  const handleArticleClick = (article: Article) => {
    if (article.isLocal && article.date) {
      navigate(`/${article.date}/${article.id}`);
    } else {
      window.open(article.link, '_blank');
    }
  };

  if (featuredArticles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {featuredArticles.map((article) => (
        <div
          key={article.id}
          className="group cursor-pointer flex flex-col h-full transform-gpu"
          onClick={() => handleArticleClick(article)}
        >
          {/* Image container */}
          <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden rounded-2xl relative shadow-none border border-transparent transition-all duration-500 group-hover:shadow-2xl dark:group-hover:shadow-none dark:group-hover:border-white/20 transform-gpu">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-8 text-center">
                <BookOpen size={48} className="text-gray-400 dark:text-gray-600" />
              </div>
            )}

            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white dark:bg-black dark:text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg shadow-sm border border-transparent dark:border-white/10">
              {ARTICLE_LABELS[language][article.category].split('|')[0].trim()}
            </div>
          </div>

          {/* Content */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 dark:border-gray-800 pb-6 group-hover:border-black dark:group-hover:border-white transition-colors duration-300 mt-auto">
            <div className="pr-4 md:pr-8">
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 md:mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-200 leading-tight transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-gray-400 dark:text-gray-500">
                <span>{article.date || 'No Date'}</span>
                {article.tags && article.tags.length > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                    <span className="truncate max-w-[150px]">{article.tags[0]}</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shrink-0">
              <ArrowUpRight size={24} className="md:w-7 md:h-7" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
