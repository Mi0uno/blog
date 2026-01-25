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
      {featuredArticles.map((article, index) => (
        <div
          key={article.id}
          className="group cursor-pointer flex flex-col h-full transform-gpu reveal-on-scroll ios-project-card ios-arrow-float"
          style={{ transitionDelay: `${index * 100}ms` }}
          onClick={() => handleArticleClick(article)}
        >
          {/* Image container */}
          <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden rounded-3xl relative ios-image-container">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover ios-image"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 p-8 text-center">
                <BookOpen size={48} className="text-gray-400 dark:text-gray-600" />
              </div>
            )}

            <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 dark:bg-black/95 backdrop-blur-sm dark:text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg shadow-sm border border-transparent dark:border-white/10 ios-tag">
              {ARTICLE_LABELS[language][article.category].split('|')[0].trim()}
            </div>
          </div>

          {/* Content */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 dark:border-gray-800 pb-6 mt-auto">
            <div className="pr-4 md:pr-8">
              <h3 className="text-xl md:text-2xl font-black text-black dark:text-white mb-2 md:mb-3 ios-title leading-tight line-clamp-2">
                {article.title}
              </h3>
              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                {article.tags && article.tags.length > 0
                  ? article.tags.slice(0, 2).join(' · ')
                  : (article.date || '')}
              </p>
            </div>
            <div className="bg-black dark:bg-white text-white dark:text-black p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 ios-arrow shrink-0">
              <ArrowUpRight size={24} className="md:w-7 md:h-7" />
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] md:text-xs font-bold font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-lg ios-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
