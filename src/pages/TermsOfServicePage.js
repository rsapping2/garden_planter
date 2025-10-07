import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using Garden Planner ("the Service"), you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-6">
                Garden Planner is a web-based application that provides garden planning tools, plant 
                databases, scheduling features, and related gardening resources. The service is provided 
                "as is" and we reserve the right to modify or discontinue the service at any time.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Provide accurate and complete registration information</li>
                <li>Keep your account information updated</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or spam</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Content and Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                You retain ownership of any content you submit to the Service. By submitting content, 
                you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and 
                display your content in connection with the Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-6">
                The Service is provided "as is" without any warranties, expressed or implied. We do not 
                guarantee that the Service will be uninterrupted, secure, or error-free. Gardening advice 
                and information provided through the Service is for educational purposes only.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                To the maximum extent permitted by law, we shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from your use of the Service, 
                including but not limited to loss of data, profits, or other intangible losses.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice, for any reason, including breach of these Terms. You may terminate your 
                account at any time by contacting us.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 mb-6">
                You agree to indemnify and hold harmless Garden Planner, its officers, directors, 
                employees, and agents from any claims, damages, or expenses arising from your use of 
                the Service or violation of these Terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], 
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any 
                material changes by posting the new Terms on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: legal@gardenplanner.com
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

export default TermsOfServicePage;


