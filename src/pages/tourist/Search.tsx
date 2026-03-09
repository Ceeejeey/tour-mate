import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_GUIDES } from '../../data/mockData';
import GuideCard from '../../components/shared/GuideCard';
import { Filter, X } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique languages
  const allLanguages = Array.from(new Set(MOCK_GUIDES.flatMap(g => g.languages)));

  const filteredGuides = MOCK_GUIDES.filter(guide => {
    const matchesQuery = guide.name.toLowerCase().includes(query.toLowerCase()) || 
                         guide.serviceArea.toLowerCase().includes(query.toLowerCase());
    const matchesLanguage = selectedLanguages.length === 0 || 
                            selectedLanguages.some(lang => guide.languages.includes(lang));
    const matchesPrice = guide.pricePerSession >= priceRange[0] && guide.pricePerSession <= priceRange[1];
    const matchesRating = guide.rating >= minRating;

    return matchesQuery && matchesLanguage && matchesPrice && matchesRating;
  });

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-900 mb-3">Price per Session</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>${priceRange[0]}</span>
                <span>-</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
              />
            </div>

            {/* Languages */}
            <div className="mb-6">
              <h3 className="font-medium text-sm text-gray-900 mb-3">Languages</h3>
              <div className="space-y-2">
                {allLanguages.map(lang => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => setMinRating(rating)}
                      className="border-gray-300 text-forest-600 focus:ring-forest-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{rating}+ Stars</span>
                  </label>
                ))}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === 0}
                    onChange={() => setMinRating(0)}
                    className="border-gray-300 text-forest-600 focus:ring-forest-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Any</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {filteredGuides.length} Guides Found
            </h1>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-forest-500 focus:border-forest-600"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map(guide => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-lg">No guides found matching your criteria.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedLanguages([]);
                  setPriceRange([0, 200]);
                  setMinRating(0);
                }}
                className="mt-4 text-forest-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
