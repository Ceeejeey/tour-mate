import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#1E6B4A] p-1.5 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[#1E6B4A]">TourMate</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting tourists with the best local guides in Sri Lanka for unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#1E6B4A]">About Us</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Careers</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Blog</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-[#1E6B4A]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Safety Information</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-[#1E6B4A]">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail size={16} /> info@tourmate.lk
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +94 11 234 5678
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Colombo, Sri Lanka
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-[#1E6B4A]"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#1E6B4A]"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-[#1E6B4A]"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2024 TourMate. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
