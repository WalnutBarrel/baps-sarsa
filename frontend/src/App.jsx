import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';

// Admin
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageYuvaks from './pages/admin/ManageYuvaks';
import AttendanceReport from './pages/admin/AttendanceReport';
import ManageEvents from './pages/admin/ManageEvents';
import ManagePrasangs from './pages/admin/ManagePrasangs';
import AdminPrasangsFeed from './pages/admin/AdminPrasangsFeed';
import AdminHelp from './pages/admin/AdminHelp';

// User
import UserLayout from './components/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import MarkAttendance from './pages/user/MarkAttendance';
import AttendanceHistory from './pages/user/AttendanceHistory';
import PrasangWorkspace from './pages/user/PrasangWorkspace';
import UserHelp from './pages/user/UserHelp';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-surface">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="yuvaks" element={<ManageYuvaks />} />
              <Route path="reports" element={<AttendanceReport />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="prasangs" element={<ManagePrasangs />} />
              <Route path="prasangs/feed" element={<AdminPrasangsFeed />} />
              <Route path="help" element={<AdminHelp />} />
            </Route>

            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="attendance" element={<MarkAttendance />} />
              <Route path="history" element={<AttendanceHistory />} />
              <Route path="prasangs" element={<PrasangWorkspace />} />
              <Route path="help" element={<UserHelp />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
