import React from 'react';
import { Language } from '../types';
import { FRIENDS_DATA, FriendLink } from '../src/data/friends';
import { ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

interface FriendsLinksProps {
  language: Language;
}

const LinkCard: React.FC<{ link: FriendLink }> = ({ link }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block h-full"
  >
    <div className="h-full bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-black dark:hover:border-white flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          {link.avatar === '/logo.svg' ? (
            <Logo className="w-full h-full p-2 text-black dark:text-white transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <img
              src={link.avatar}
              alt={link.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback to initial if image fails
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(link.title)}&background=random`;
              }}
            />
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold text-black dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {link.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 truncate">
            <ExternalLink size={12} />
            <span className="truncate">
              {(() => {
                try {
                  return new URL(link.url).hostname;
                } catch {
                  return link.url;
                }
              })()}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
        {link.description}
      </p>
    </div>
  </a>
);

export const FriendsLinks: React.FC<FriendsLinksProps> = ({ language }) => {
  const data = FRIENDS_DATA[language];

  return (
    <div className="w-full max-w-[96vw] mx-auto pb-20 animate-fade-in">
      <div className="mb-16 flex flex-col items-center text-center">
        <h1 className="text-[8vw] leading-none font-black mb-8 text-black dark:text-white transition-colors duration-300">
          {data.title}
        </h1>
        <p className="text-2xl text-gray-500 dark:text-gray-400 max-w-2xl font-medium transition-colors duration-300">
          {data.description}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* My Projects Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-black dark:text-white">
            <span className="w-2 h-8 bg-black dark:bg-white rounded-full"></span>
            {data.myProjectsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.myProjects.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>

        {/* Friendly Links Section */}
        <section>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-black dark:text-white">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            {data.friendlyLinksTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.friendlyLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
