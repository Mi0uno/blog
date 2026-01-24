
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ARTICLES, ARTICLE_LABELS } from '../constants';
import { ArticleCategory, Language, Article } from '../types';
import { ArrowUpRight, ArrowDown, ArrowUp, Calendar, Filter, ArrowLeft, Search, Tag, X, Loader2 } from 'lucide-react';
import matter from 'gray-matter';
import MarkdownRenderer from './MarkdownRenderer';
import { ArticleCoverImage } from './ArticleCoverImage';

interface ArticleSectionProps {
  language: Language;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ language }) => {
  const navigate = useNavigate();
  const { date, md5 } = useParams();
  const [filter, setFilter] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [showArticleDetail, setShowArticleDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const articleContainerRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Object.values(ArticleCategory)];
  const currentArticles = ARTICLES[language];

  // Handle URL parameters for direct article access
  useEffect(() => {
    if (date && md5) {
      const article = currentArticles.find(a => a.date === date && a.id === md5);
      if (article) {
        handleArticleClick(article, false); // false to prevent navigation loop
      }
    } else {
      // If no params, ensure we're in list view
      setShowArticleDetail(false);
      setSelectedArticle(null);
    }
  }, [date, md5, currentArticles]);

  // Extract all unique tags from articles
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    currentArticles.forEach(article => {
      if (article.tags) {
        article.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [currentArticles]);

  const filteredAndSortedArticles = useMemo(() => {
    return currentArticles
      .filter(a => filter === 'All' || a.category === filter)
      .filter(a => !selectedTag || (a.tags && a.tags.includes(selectedTag)))
      .filter(a => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(query) ||
          (a.tags && a.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [currentArticles, filter, selectedTag, searchQuery, sortOrder]);

  const handleArticleClick = async (article: Article, shouldNavigate = true) => {
    if (article.isLocal) {
      // Load local markdown article
      setSelectedArticle(article);
      setIsLoading(true);
      setShowArticleDetail(true);
      setMarkdownContent('');
      
      if (shouldNavigate && article.date) {
        navigate(`/${article.date}/${article.id}`);
      }

      try {
        // Restrict file processing to 'articles' directory
        const linkPath = article.link.startsWith('/') ? article.link : `/${article.link}`;
        if (!linkPath.startsWith('/articles/')) {
           throw new Error('Access denied: Only files in the articles directory can be loaded.');
        }

        const response = await fetch(article.link);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const { content } = matter(text);
        setMarkdownContent(content);
      } catch (error) {
        console.error('Failed to load markdown:', error);
        setMarkdownContent(`Failed to load article content. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Open external link
      window.open(article.link, '_blank');
    }
  };

  const handleBack = () => {
    setShowArticleDetail(false);
    setSelectedArticle(null);
    setMarkdownContent('');
    setIsLoading(false);
    navigate('/articles');
  };

  // 滚动位置控制：确保文章加载时滚动到顶部
  useEffect(() => {
    if (showArticleDetail) {
      window.scrollTo(0, 0);
    }
  }, [showArticleDetail, isLoading]);

  const clearFilters = () => {
    setFilter('All');
    setSelectedTag('');
    setSearchQuery('');
  };

  const hasActiveFilters = filter !== 'All' || selectedTag !== '' || searchQuery !== '';


  return (
    <div className="w-full max-w-[96vw] mx-auto pb-20">
      
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 justify-center ${showArticleDetail ? 'hidden' : ''}`}>
        
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-32">
            {/* Search Box */}
            <div className="mb-8 px-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'zh' ? '搜索文章...' : 'Search articles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white text-sm font-bold focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <h3 className="text-xl font-black mb-8 px-4 flex items-center gap-2">
              <Filter size={20} />
              {language === 'zh' ? '分类' : 'Categories'}
            </h3>
            <div className="flex flex-col space-y-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`
                    text-left px-4 py-3 rounded-xl transition-all duration-300 text-lg font-bold
                    ${filter === cat 
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg transform scale-105' 
                      : 'text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                >
                  {ARTICLE_LABELS[language][cat] || cat}
                </button>
              ))}
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="px-4">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  {language === 'zh' ? '标签' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-300
                        ${selectedTag === tag 
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                          : 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-600'}
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-6 mx-4 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-bold text-gray-600 dark:text-gray-300"
              >
                <X size={16} />
                <span>{language === 'zh' ? '清除筛选' : 'Clear Filters'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Bar (Horizontal) */}
        <div className="lg:hidden flex flex-col gap-4 mb-8 sticky top-20 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-30 pt-4 px-4">
          {/* Mobile Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'zh' ? '搜索文章...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-black dark:text-white text-sm font-bold focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          {/* Mobile Category Filter */}
          <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
             {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-300
                  ${filter === cat 
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                    : 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500'}
                `}
              >
                {ARTICLE_LABELS[language][cat] || cat}
              </button>
            ))}
          </div>

          {/* Mobile Tags Filter */}
          {allTags.length > 0 && (
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`
                    whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all duration-300
                    ${selectedTag === tag 
                      ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                      : 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500'}
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-bold text-gray-600 dark:text-gray-300"
            >
              <X size={16} />
              <span>{language === 'zh' ? '清除筛选' : 'Clear Filters'}</span>
            </button>
          )}
        </div>

        {/* Right Content Area */}
        <div className="flex-grow max-w-4xl">
          
          {/* Sort Controls Panel */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
             <div className="text-sm font-mono text-gray-400">
                {filteredAndSortedArticles.length} {language === 'zh' ? '篇文章' : 'Articles'}
             </div>
             
             <button 
               onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
               className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-bold text-gray-600 dark:text-gray-300"
             >
                <Calendar size={16} />
                <span>{language === 'zh' ? '时间排序' : 'Date'}</span>
                {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
             </button>
          </div>

          {/* Article List - One per line */}
          <div className="flex flex-col gap-6">
            {filteredAndSortedArticles.map((article, index) => (
              <div
                key={article.id}
                className="group cursor-pointer reveal-on-scroll"
                style={{ transitionDelay: `${(index % 5) * 100}ms` }}
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex flex-col md:flex-row bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden p-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 items-stretch h-auto">
                    
                    {/* Cover Image Container - Responsive aspect ratio 900:383 */}
                    <div className="w-full md:w-[45%] aspect-[900/383] shrink-0 rounded-xl overflow-hidden relative bg-gray-100 dark:bg-gray-900 transform-gpu">
                        <ArticleCoverImage
                          src={article.coverImage}
                          alt={article.title}
                        />
                       
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/90 text-black dark:text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                          {ARTICLE_LABELS[language][article.category].split('|')[0].trim()}
                        </div>
                    </div>

                    {/* Content - Right Side */}
                    <div className="flex-grow flex flex-col p-4 md:p-6 justify-between min-w-0">
                        <div>
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="text-lg md:text-2xl font-black text-black dark:text-white leading-snug group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 line-clamp-3">
                                    {article.title}
                                </h3>
                                <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0">
                                    <ArrowUpRight size={16} />
                                </div>
                            </div>
                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {article.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs md:text-sm font-mono text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3 mt-2">
                             <span>{article.date || 'No Date'}</span>
                             <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                             <span className="truncate hidden md:inline">{article.isLocal ? (language === 'zh' ? '本地文章' : 'Local Article') : (language === 'zh' ? '微信公众号' : 'Read on WeChat')}</span>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedArticles.length === 0 && (
             <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl mt-8">
                <p className="text-xl font-medium">{language === 'zh' ? '暂无文章' : 'No articles found'}</p>
             </div>
          )}
        </div>

      </div>

      {/* Article Detail View */}
      {showArticleDetail && selectedArticle && (
        <div
          ref={articleContainerRef}
          className="min-h-screen bg-white dark:bg-black z-50"
        >
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 mb-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-bold text-gray-600 dark:text-gray-300"
            >
              <ArrowLeft size={16} />
              <span>{language === 'zh' ? '返回文章列表' : 'Back to Articles'}</span>
            </button>

            {/* Article Header */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white mb-4">
                {selectedArticle.title}
              </h1>
              <div className="flex items-center gap-3 text-sm font-mono text-gray-400 dark:text-gray-500 mb-4">
                <span>{selectedArticle.date || 'No Date'}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                <span>{ARTICLE_LABELS[language][selectedArticle.category].split('|')[0].trim()}</span>
              </div>
              {/* Tags */}
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="text-lg font-medium">{language === 'zh' ? '正在加载文章...' : 'Loading article...'}</p>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MarkdownRenderer markdown={markdownContent} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
