import React from 'react';

export default function Privacy() {
  return (
    <div className="bg-forest-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-forest-900 mb-8">Privacy Policy</h1>
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. This includes basic information like your name, email address, and phone number, as well as more complex information like your location data when using specific features of the app.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Information</h2>
            <p>
              The information we collect is used to provide, maintain, protect and improve our services. We use your contact information to communicate with you about your bookings and account status. Your location data is used to match you with nearby guides or tourists.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
            <p>
              We do not share personal information with companies, organizations, and individuals outside of TourMate unless we have your explicit consent, or to comply with applicable laws and regulations. Necessary information is shared between tourists and confirmed guides to facilitate the tour.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p>
              We work hard to protect TourMate and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We encrypt many of our services using SSL and restrict access to personal information to employees who need to know that information.
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
