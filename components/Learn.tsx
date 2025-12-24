'use client';
import { useState, useEffect } from 'react';
import { ChevronDownIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon, ArrowTopRightOnSquareIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import parse from 'html-react-parser';
import { FaFacebook, FaXTwitter, FaLinkedin, FaInstagram, FaMedium, FaPatreon, FaDiscord } from 'react-icons/fa6';

const MEDIUM_RSS_URL = 'https://medium.com/feed/@theutilityco';
const PLACEHOLDER_IMAGE = '/LearnBanner.png';

const extractFirstImage = (htmlString: string) => {
  const imgTag = htmlString.match(/<img[^>]+src="([^">]+)"/);
  return imgTag ? imgTag[1] : null;
};

const removeFirstImageOrFigure = (htmlString: string) => {
  return htmlString.replace(/<figure[^>]*>.*?<\/figure>|<img[^>]+>/, '');
};

const decodeHtml = (html: string) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default function LearnForm() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [brokenImages, setBrokenImages] = useState<{ [key: string]: boolean }>({});
  const [readerHeroBroken, setReaderHeroBroken] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`);
        const feedData = response.data.items;
        setArticles(feedData);
      } catch (error) {
        console.error('Error fetching Medium feed:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleTileClick = (article: any) => {
    setSelectedArticle(article);
    setReaderHeroBroken(false);
  };

  const handleImageError = (index: number) => {
    setBrokenImages(prev => ({ ...prev, [index]: true }));
  };

  const socialLinks = [
    { icon: FaFacebook, url: 'https://www.facebook.com/people/The-Utility-Company/100083624105531/', color: 'hover:text-blue-500' },
    { icon: FaXTwitter, url: 'https://x.com/The_Utility_Co', color: 'hover:text-gray-400' },
    { icon: FaLinkedin, url: 'https://www.linkedin.com/company/the-utility-company/', color: 'hover:text-blue-600' },
    { icon: FaInstagram, url: 'https://www.instagram.com/theutilityco/', color: 'hover:text-pink-500' },
    { icon: FaMedium, url: 'https://medium.com/@theutilityco', color: 'hover:text-green-600' },
    { icon: FaPatreon, url: 'https://www.patreon.com/TheUtilityCompany', color: 'hover:text-orange-600' },
    { icon: FaDiscord, url: 'https://discord.gg/q4tFymyAnx', color: 'hover:text-blue-500' },
  ];

  return (
    <div
      className="h-full w-full rounded-2xl shadow-2xl p-6 font-mono overflow-auto"
      style={{
        background: 'rgba(5, 10, 20, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 64, 41, 0.2)',
        boxShadow: '0 0 40px rgba(245, 64, 41, 0.1)',
      }}
    >
      {/* Custom scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(245, 64, 41, 0.05);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(245, 64, 41, 0.3);
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 64, 41, 0.5);
        }

        /* Spectacular Reader Styles */
        :global(.spectacular-prose) {
          color: rgba(255, 255, 255, 0.9);
          font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        :global(.spectacular-prose p) {
          margin-bottom: 1.75rem;
        }
        :global(.spectacular-prose h1), :global(.spectacular-prose h2), :global(.spectacular-prose h3) {
          color: #F54029;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }
        :global(.spectacular-prose h2) { font-size: 1.875rem; }
        :global(.spectacular-prose h3) { font-size: 1.5rem; }
        :global(.spectacular-prose a) {
          color: #F54029;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
          transition: opacity 0.2s;
        }
        :global(.spectacular-prose a:hover) { opacity: 0.8; }
        :global(.spectacular-prose blockquote) {
          border-left: 4px solid #F54029;
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
          margin: 2rem 0;
        }
        :global(.spectacular-prose strong) { color: #fff; font-weight: 700; }
        :global(.spectacular-prose ul) {
          margin-bottom: 1.75rem;
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        :global(.spectacular-prose li) {
          margin-bottom: 0.5rem;
        }
        :global(.spectacular-prose img) {
          border-radius: 0.75rem;
          margin: 2.5rem 0;
          border: 1px solid rgba(245, 64, 41, 0.1);
        }
        :global(.spectacular-prose code) {
          background: rgba(245, 64, 41, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: #F54029;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 gap-4">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-widest mb-1" style={{ color: '#F54029' }}>
            LEARN.HUB
          </h2>
          <div className="h-px w-32 mx-auto md:mx-0" style={{ background: 'linear-gradient(90deg, #F54029, transparent)' }} />
        </div>

        {/* View Toggle */}
        <div className="flex bg-black/40 p-1 rounded-lg border border-[#F54029]/20 backdrop-blur-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#F54029] text-white' : 'text-[#F54029] hover:bg-[#F54029]/10'}`}
            title="Grid View"
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list' ? 'bg-[#F54029] text-white' : 'text-[#F54029] hover:bg-[#F54029]/10'}`}
            title="List View"
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {socialLinks.map((social, idx) => (
          <a
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[#F54029] ${social.color} transition-all duration-300 hover:scale-125`}
          >
            <social.icon size={28} />
          </a>
        ))}
      </div>

      {/* Articles Feed */}
      <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {articles
          .filter(article => extractFirstImage(article.description))
          .map((article, index) => {
            const firstImage = extractFirstImage(article.description);

            return (
              <div
                key={index}
                onClick={() => handleTileClick(article)}
                className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${viewMode === 'list' ? 'p-4' : 'flex flex-col'}`}
                style={{
                  background: 'rgba(245, 64, 41, 0.05)',
                  border: '1px solid rgba(245, 64, 41, 0.2)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div className={viewMode === 'list' ? "flex items-center gap-4" : "flex flex-col"}>
                  {/* Thumbnail Container */}
                  <div className={`flex-shrink-0 bg-black/20 ${viewMode === 'list' ? 'w-24 md:w-32 rounded-lg' : 'w-full'} border border-[#F54029]/10 overflow-hidden`}>
                    <img
                      src={brokenImages[index] ? PLACEHOLDER_IMAGE : firstImage || undefined}
                      alt={article.title}
                      onError={() => handleImageError(index)}
                      className="w-full h-auto block"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className={viewMode === 'list' ? "flex-1 min-w-0" : "p-4 flex-1 flex flex-col justify-between"}>
                    <div>
                      <h3 className={`font-semibold text-[#F54029] mb-2 leading-snug line-clamp-2 ${viewMode === 'list' ? 'text-lg' : 'text-base'}`}>
                        {decodeHtml(article.title)}
                      </h3>
                      <div className="text-white/40 text-[10px] mb-2 flex items-center gap-4">
                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {new Date(article.pubDate).toLocaleDateString()}</span>
                        {article.author && <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {article.author}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#F54029] opacity-70">
                      <span>Read article</span>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* SPECTACULAR READER OVERLAY */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedArticle(null)}
          />

          <div
            className="relative w-full max-w-4xl h-full bg-[#050A14] rounded-2xl border border-[#F54029]/30 shadow-2xl shadow-[#F54029]/10 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
          >
            {/* Reader Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#F54029]/20 bg-black/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex-1 min-w-0">
                <h2 className="text-[#F54029] font-bold text-lg md:text-xl truncate leading-tight pr-4">
                  {decodeHtml(selectedArticle.title)}
                </h2>
                <div className="flex items-center gap-3 text-xs text-white/40 mt-1 font-mono uppercase tracking-widest">
                  <span>{new Date(selectedArticle.pubDate).toLocaleDateString()}</span>
                  <span className="w-1 h-1 rounded-full bg-[#F54029]/40" />
                  <span>{selectedArticle.author || 'THE UTILITY CO'}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-[#F54029]/10 rounded-full transition-colors text-[#F54029]"
              >
                <XMarkIcon className="w-7 h-7" />
              </button>
            </div>

            {/* Reader Content */}
            <div className="flex-1 overflow-auto custom-scrollbar bg-gradient-to-b from-black/20 to-transparent">
              {/* Hero Image Section */}
              <div className="w-full bg-black/40 border-b border-[#F54029]/10 p-4 md:p-8 flex justify-center">
                <img
                  src={(extractFirstImage(selectedArticle.description) && !readerHeroBroken)
                    ? (extractFirstImage(selectedArticle.description) as string)
                    : PLACEHOLDER_IMAGE}
                  className="max-h-[60vh] w-auto rounded-xl shadow-2xl border border-white/5 object-contain"
                  alt="Hero"
                  onError={() => setReaderHeroBroken(true)}
                />
              </div>

              <div className="max-w-3xl mx-auto p-6 md:p-12">
                <div className="spectacular-prose">
                  {parse(removeFirstImageOrFigure(selectedArticle.description))}
                </div>

                {/* Footer Link */}
                <div className="mt-12 pt-8 border-t border-[#F54029]/20 flex flex-col items-center gap-4 text-center">
                  <p className="text-white/40 text-sm italic font-serif">Original article published on Medium</p>
                  <a
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm tracking-widest transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #F54029, #c0392b)',
                      color: '#fff',
                      boxShadow: '0 0 20px rgba(245, 64, 41, 0.4)',
                    }}
                  >
                    CONTINUE READING ON MEDIUM <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {articles.length === 0 && (
        <div className="text-center py-12 text-cyan-500/50">
          <div className="text-sm tracking-wider">LOADING.ARTICLES...</div>
        </div>
      )}
    </div>
  );
}
