import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Compass, TreePine, Mountain, Binoculars, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Guide } from '../../types';
import GuideCard from '../../components/shared/GuideCard';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredGuides, setFeaturedGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const token = localStorage.getItem('tourmate_token');
        const response = await fetch('http://localhost:5066/api/users/guides', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFeaturedGuides(data.slice(0, 4));
          // Stagger card animations
          data.slice(0, 4).forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 150);
          });
        }
      } catch (err) {
        console.error('Error fetching featured guides:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuides();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tourist/search?q=${searchQuery}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=1"
            alt="Sri Lanka Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/50 to-forest-900/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/30 to-transparent opacity-50" />
        </div>
        
        {/* Decorative animated elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-earth-400/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-sky-400/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-950/80 via-forest-900/40 to-transparent" />
        
        <div className="relative z-10 max-w-4xl w-full px-4 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-4 animate-fade-in-down">
            <Sparkles className="h-5 w-5 text-earth-300 animate-pulse" />
            <span className="text-earth-300 font-medium tracking-widest uppercase text-sm drop-shadow-lg">Explore Sri Lanka</span>
            <Sparkles className="h-5 w-5 text-earth-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-xl leading-tight animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
            Discover Sri Lanka with
            <span className="block bg-gradient-to-r from-earth-400 via-earth-300 to-sky-400 bg-clip-text text-transparent">
              Local Experts
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-10 font-light drop-shadow-md text-forest-100 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Find and book the best tour guides for your next authentic adventure
          </p>

          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto border border-white/20 animate-fade-in-up hover:shadow-sky-500/20 transition-shadow duration-300" style={{ animationDelay: '0.3s' }}>
            <div className="flex-1 flex items-center px-4 py-2">
              <MapPin className="text-forest-500 mr-3 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="w-full outline-none text-forest-800 placeholder-forest-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-forest-600 to-forest-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-forest-700 hover:to-forest-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-forest-600/50 hover:scale-105 active:scale-95"
            >
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Featured Guides Section with Enhanced Styling */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-forest-500" />
              <span className="text-forest-500 font-semibold text-sm uppercase tracking-widest">Featured Collection</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-forest-800 to-forest-600 bg-clip-text text-transparent mb-3">
              Featured Guides
            </h2>
            <p className="text-forest-400 text-lg">Top-rated local experts ready to show you around</p>
          </div>
          <Link to="/tourist/search" className="text-forest-600 font-semibold hover:text-forest-700 hover:underline hidden md:flex items-center gap-2 transition-all duration-300 hover:gap-3 group">
            View all guides <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center w-full">
            <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
          </div>
        ) : featuredGuides.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGuides.map((guide, index) => (
              <div
                key={guide.id}
                className={`transition-all duration-500 ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-forest-50 to-sand-50 rounded-xl border border-gray-200 w-full animate-fade-in-up">
            <p className="text-gray-500 text-lg">No guides available at the moment.</p>
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden animate-fade-in-up">
          <Link to="/tourist/search" className="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
            View all guides <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="bg-gradient-to-br from-forest-50 via-sand-50 to-sky-50 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-20 w-48 h-48 bg-earth-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-sky-200/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-3">
              <TreePine className="text-forest-500 w-5 h-5" />
              <span className="text-forest-600 font-semibold text-sm uppercase tracking-widest">Why TourMate</span>
              <TreePine className="text-forest-500 w-5 h-5" />
            </div>
            <h2 className="text-4xl font-bold text-forest-800 mb-4">
              Your Gateway to Authentic Adventures
            </h2>
            <p className="text-forest-500 max-w-2xl mx-auto text-lg">
              We make it easy to find reliable, knowledgeable, and friendly guides for your Sri Lankan journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Verified Guides',
                desc: 'Every guide on our platform is vetted and verified to ensure your safety and satisfaction.',
                color: 'forest',
                delay: '0s'
              },
              {
                icon: Mountain,
                title: 'Unique Experiences',
                desc: 'Explore hidden trails, ancient ruins, and breathtaking landscapes with insider knowledge.',
                color: 'earth',
                delay: '0.1s'
              },
              {
                icon: Binoculars,
                title: 'Local Discovery',
                desc: 'Discover hidden gems and authentic local experiences that you won\'t find in guidebooks.',
                color: 'sky',
                delay: '0.2s'
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses: Record<string, string> = {
                forest: 'from-forest-500 to-forest-600 shadow-forest-200',
                earth: 'from-earth-500 to-earth-600 shadow-earth-200',
                sky: 'from-sky-500 to-sky-600 shadow-sky-200'
              };
              const bgClasses: Record<string, string> = {
                forest: 'bg-forest-50',
                earth: 'bg-earth-50',
                sky: 'bg-sky-50'
              };

              return (
                <div
                  key={idx}
                  className="group bg-white p-8 rounded-2xl shadow-sm border border-forest-100/50 text-center hover:shadow-xl transition-all duration-500 hover:border-forest-200 hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`${bgClasses[feature.color]} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`bg-gradient-to-br ${colorClasses[feature.color]} p-3 rounded-xl text-white`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-forest-800 mb-3">{feature.title}</h3>
                  <p className="text-forest-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
