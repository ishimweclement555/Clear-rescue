import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import { HardwareSimulatorModal } from './components/HardwareSimulatorModal';
import { IoTDocsModal } from './components/IoTDocsModal';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { SolutionsPage } from './pages/public/SolutionsPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Customer pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { CustomerDevicesPage } from './pages/customer/CustomerDevicesPage';
import { DeviceDetailPage } from './pages/customer/DeviceDetailPage';
import { LiveSensorDataPage } from './pages/customer/LiveSensorDataPage';
import { EmergencyAlertsPage } from './pages/customer/EmergencyAlertsPage';
import { IncidentHistoryPage } from './pages/customer/IncidentHistoryPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { ReportsPage } from './pages/customer/ReportsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { SettingsPage } from './pages/customer/SettingsPage';

// Technician pages
import { TechnicianDashboard } from './pages/technician/TechnicianDashboard';
import { AssignedDevicesPage } from './pages/technician/AssignedDevicesPage';
import { MaintenanceTicketsPage } from './pages/technician/MaintenanceTicketsPage';
import { DeviceDiagnosticsPage } from './pages/technician/DeviceDiagnosticsPage';
import { SensorStatusPage } from './pages/technician/SensorStatusPage';
import { MaintenanceHistoryPage } from './pages/technician/MaintenanceHistoryPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isIoTDocsOpen, setIsIoTDocsOpen] = useState<boolean>(false);
  const [selectedDetailDeviceId, setSelectedDetailDeviceId] = useState<string>('dev-cra-001');

  const openSimulator = () => setIsSimulatorOpen(true);
  const closeSimulator = () => setIsSimulatorOpen(false);

  const openIoTDocs = () => setIsIoTDocsOpen(true);
  const closeIoTDocs = () => setIsIoTDocsOpen(false);

  const renderCurrentPage = () => {
    switch (currentTab) {
      // Public
      case 'landing':
        return (
          <LandingPage
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            openIoTDocs={openIoTDocs}
          />
        );
      case 'about':
        return <AboutPage setCurrentTab={setCurrentTab} />;
      case 'how-it-works':
        return (
          <HowItWorksPage
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            openIoTDocs={openIoTDocs}
          />
        );
      case 'features':
        return <FeaturesPage setCurrentTab={setCurrentTab} openSimulator={openSimulator} />;
      case 'solutions':
        return <SolutionsPage setCurrentTab={setCurrentTab} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentTab={setCurrentTab} />;
      case 'register':
        return <RegisterPage setCurrentTab={setCurrentTab} />;
      case 'forgot-password':
        return <ForgotPasswordPage setCurrentTab={setCurrentTab} />;

      // Customer
      case 'customer-dashboard':
        return <CustomerDashboard setCurrentTab={setCurrentTab} openSimulator={openSimulator} />;
      case 'customer-devices':
        return (
          <CustomerDevicesPage
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            onSelectDeviceForDetails={id => setSelectedDetailDeviceId(id)}
          />
        );
      case 'customer-device-detail':
        return (
          <DeviceDetailPage
            deviceId={selectedDetailDeviceId}
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
          />
        );
      case 'customer-live-sensors':
        return <LiveSensorDataPage openSimulator={openSimulator} />;
      case 'customer-alerts':
        return <EmergencyAlertsPage openSimulator={openSimulator} />;
      case 'customer-incidents':
        return <IncidentHistoryPage />;
      case 'customer-notifications':
        return <CustomerNotificationsPage />;
      case 'customer-reports':
        return <ReportsPage />;
      case 'customer-profile':
        return <ProfilePage />;
      case 'customer-settings':
        return <SettingsPage />;

      // Technician
      case 'technician-dashboard':
        return <TechnicianDashboard setCurrentTab={setCurrentTab} openSimulator={openSimulator} />;
      case 'technician-devices':
        return <AssignedDevicesPage setCurrentTab={setCurrentTab} openSimulator={openSimulator} />;
      case 'technician-maintenance':
        return <MaintenanceTicketsPage />;
      case 'technician-diagnostics':
        return <DeviceDiagnosticsPage openSimulator={openSimulator} />;
      case 'technician-sensors':
        return <SensorStatusPage />;
      case 'technician-history':
        return <MaintenanceHistoryPage />;

      // Admin
      case 'admin-dashboard':
        return (
          <AdminDashboard
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            openIoTDocs={openIoTDocs}
          />
        );
      case 'admin-users':
        return <AdminUsersPage />;
      case 'admin-devices':
        return (
          <CustomerDevicesPage
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            onSelectDeviceForDetails={id => setSelectedDetailDeviceId(id)}
          />
        );
      case 'admin-sensors':
        return <SensorStatusPage />;
      case 'admin-incidents':
        return <EmergencyAlertsPage openSimulator={openSimulator} />;
      case 'admin-locations':
        return <AdminLocationsPage />;
      case 'admin-maintenance':
        return <MaintenanceTicketsPage />;
      case 'admin-reports':
        return <ReportsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;
      case 'admin-audit':
        return <AdminAuditLogsPage />;

      default:
        return (
          <LandingPage
            setCurrentTab={setCurrentTab}
            openSimulator={openSimulator}
            openIoTDocs={openIoTDocs}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSimulator={openSimulator}
        openIoTDocs={openIoTDocs}
      />

      {/* Main Content View */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Persistent Global Emergency Flashing Modal if active */}
      <EmergencyAlertModal />

      {/* Interactive IoT Hardware Simulator Modal */}
      <HardwareSimulatorModal isOpen={isSimulatorOpen} onClose={closeSimulator} />

      {/* ESP32 & MQTT Hardware Integration Guide Modal */}
      <IoTDocsModal isOpen={isIoTDocsOpen} onClose={closeIoTDocs} />

      {/* Global Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        openIoTDocs={openIoTDocs}
        openSimulator={openSimulator}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <AppContent />
      </EmergencyProvider>
    </AuthProvider>
  );
}
