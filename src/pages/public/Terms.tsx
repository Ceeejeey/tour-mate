import React from 'react';

export default function Terms() {
  return (
    <div className="bg-forest-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-forest-900 mb-8">Terms of Service</h1>
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TourMate, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              TourMate provides a platform connecting tourists with local guides in Sri Lanka. We facilitate the booking and communication between parties but are not responsible for the actual tours or actions of the guides or tourists.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
            <p>
              Users agree to use the platform only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, defamatory, obscene, or profane material that could constitute or encourage conduct that would be considered a criminal offense.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Bookings and Payments</h2>
            <p>
              All bookings made through the platform are subject to availability and confirmation by the guide. Payments are processed securely, and standard cancellation policies apply as detailed during the booking process.
            </p>
          </section>
          
          <p className="text-sm text-gray-400 mt-12 pt-8 border-t border-gray-100">
            Last updated: October 2023
          </p>
        </div>
      </div>
    </div>
  );
}
