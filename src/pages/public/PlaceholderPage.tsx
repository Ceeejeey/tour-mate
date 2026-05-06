import React from 'react';
import { useLocation } from 'react-router-dom';

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname
    .split('/')
    .pop()
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Page';

  return (
    <div className="min-h-[60vh] bg-forest-50 py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-extrabold text-forest-900 mb-6">{pageName}</h1>
        <div className="w-16 h-1 bg-earth-500 rounded-full mx-auto mb-8"></div>
        <p className="text-xl text-forest-600 mb-8">
          This page is currently under construction.
        </p>
        <p className="text-forest-500">
          We're working hard to bring you more information soon. Please check back later!
        </p>
      </div>
    </div>
  );
}
