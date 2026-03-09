import React from 'react';
import { Compass, Phone, Mail, Facebook, Instagram, Twitter, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-forest-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-earth-400 p-1.5 rounded-lg">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">TourMate</span>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed">
              Connecting tourists with the best local guides in Sri Lanka for unforgettable experiences.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-forest-300">
              <li><a href="#" className="hover:text-earth-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-forest-300">
              <li><a href="#" className="hover:text-earth-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Safety Information</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-earth-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-forest-300">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-earth-400" /> info@tourmate.lk
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-earth-400" /> +94 11 234 5678
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-earth-400" /> Colombo, Sri Lanka
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-forest-400 hover:text-earth-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-forest-400 hover:text-earth-400 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-forest-400 hover:text-earth-400 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-forest-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-forest-400">&copy; 2024 TourMate. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-forest-400">
            <a href="#" className="hover:text-forest-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-forest-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-forest-200 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
