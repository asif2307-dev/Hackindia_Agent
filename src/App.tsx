import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { InvestigationProvider } from './context/InvestigationContext';
import { TravelBookingProvider } from './context/TravelBookingContext';
import { BookingSummaryModal } from './components/travel/BookingSummaryModal';
import { ScrollToTop } from './components/common/ScrollToTop';

// Traveller Pages (Mockup Pages 1-10, 13-21)
import { LandingPage } from './pages/LandingPage';
import { FlightsPage } from './pages/FlightsPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { OffersPage } from './pages/OffersPage';
import { BookingsPage } from './pages/BookingsPage';
import { RefundCenterPage } from './pages/RefundCenterPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { HotelsPage } from './pages/HotelsPage';
import { TrainsPage } from './pages/TrainsPage';
import { BusesPage } from './pages/BusesPage';
import { CabsPage } from './pages/CabsPage';
import { HolidaysPage } from './pages/HolidaysPage';
import { HelpPage } from './pages/HelpPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Internal Reviewer Console Pages (Mockup Pages 11 & 12)
import { HumanReviewPage } from './pages/HumanReviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { RefundInvestigationsPage } from './pages/RefundInvestigationsPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <InvestigationProvider>
        <TravelBookingProvider>
          <BrowserRouter>
            <ScrollToTop />
            <BookingSummaryModal />
            <Routes>
              {/* Traveller Public Flow (PDF Mockups: Pages 1-10, 13-21) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/refunds" element={<RefundCenterPage />} />
              <Route path="/refunds/:id" element={<CaseDetailPage />} />
              <Route path="/refund-investigations/:id" element={<CaseDetailPage />} />
              <Route path="/hotels" element={<HotelsPage />} />
              <Route path="/trains" element={<TrainsPage />} />
              <Route path="/buses" element={<BusesPage />} />
              <Route path="/cabs" element={<CabsPage />} />
              <Route path="/holidays" element={<HolidaysPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/account" element={<SettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              {/* Internal Reviewer Console (PDF Mockups: Pages 11 & 12) */}
              <Route path="/reviewer" element={<HumanReviewPage />} />
              <Route path="/reviewer/queue" element={<HumanReviewPage />} />
              <Route path="/reviewer/cases" element={<RefundInvestigationsPage />} />
              <Route path="/reviewer/analytics" element={<AnalyticsPage />} />
              <Route path="/reviewer/audit" element={<DashboardPage />} />
              <Route path="/reviewer/settings" element={<SettingsPage />} />

              {/* Backwards-compatible routes for internal operations */}
              <Route path="/reviews" element={<HumanReviewPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/refund-investigations" element={<RefundInvestigationsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/overview" element={<DashboardPage />} />

              {/* 404 Fallback Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </TravelBookingProvider>
      </InvestigationProvider>
    </LanguageProvider>
  );
};

export default App;
