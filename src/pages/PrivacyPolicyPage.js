import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                use our garden planning tools, or contact us for support.
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (location, USDA hardiness zone)</li>
                <li>Garden data (plant selections, planting schedules, notes)</li>
                <li>Usage information (how you interact with our service)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Provide, maintain, and improve our garden planning services</li>
                <li>Send you personalized planting reminders and notifications</li>
                <li>Provide customer support and respond to your requests</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in operating our service</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-6">
                We use cookies and similar technologies to improve your experience, analyze usage, 
                and provide personalized content. You can control cookie settings through your browser.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our service is not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@gardenplanner.com
                <br />
                Address: [Your Company Address]
              </p>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;


