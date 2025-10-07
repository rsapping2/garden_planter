import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Import pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import GardenPlanner from './pages/GardenPlanner';
import PlantLibrary from './pages/PlantLibrary';
import SchedulePage from './pages/SchedulePage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import ComingSoonPage from './pages/ComingSoonPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import { GardenProvider } from './contexts/GardenContext';

function App() {
  return (
    <AuthProvider>
      <GardenProvider>
        <DndProvider backend={HTML5Backend}>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/garden-planner" element={<GardenPlanner />} />
                <Route path="/plant-library" element={<PlantLibrary />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Footer Links */}
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                
                {/* Coming Soon Pages */}
                <Route path="/community-forum" element={
                  <ComingSoonPage 
                    title="Community Forum" 
                    description="Connect with fellow gardeners, share tips, and get advice from experienced growers."
                    icon="🌱"
                  />
                } />
                <Route path="/newsletter" element={
                  <ComingSoonPage 
                    title="Newsletter" 
                    description="Get the latest gardening tips, seasonal advice, and app updates delivered to your inbox."
                    icon="📧"
                  />
                } />
                <Route path="/social-media" element={
                  <ComingSoonPage 
                    title="Social Media" 
                    description="Follow us on social media for daily gardening inspiration and community highlights."
                    icon="📱"
                  />
                } />
                <Route path="/blog" element={
                  <ComingSoonPage 
                    title="Garden Blog" 
                    description="Discover expert gardening articles, seasonal guides, and success stories from our community."
                    icon="📝"
                  />
                } />
                <Route path="/help-center" element={
                  <ComingSoonPage 
                    title="Help Center" 
                    description="Find answers to common questions and get step-by-step guides for using Garden Planner."
                    icon="❓"
                  />
                } />
                <Route path="/contact-us" element={
                  <ComingSoonPage 
                    title="Contact Us" 
                    description="Need help or have feedback? We'd love to hear from you!"
                    icon="💬"
                  />
                } />
              </Routes>
            </div>
          </Router>
        </DndProvider>
      </GardenProvider>
    </AuthProvider>
  );
}

export default App;
