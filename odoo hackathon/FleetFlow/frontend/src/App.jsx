import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import CustomCursor from './components/CustomCursor';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';
import Drivers from './pages/Drivers';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-2xl text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <div className="flex h-screen items-center justify-center font-bold text-2xl text-red-500">Unauthorizd Access</div>;
  return children;
};

function App() {
  const location = useLocation();

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<ProtectedRoute roles={['Fleet Manager', 'Dispatcher']}><Vehicles /></ProtectedRoute>} />
          <Route path="trips" element={<ProtectedRoute roles={['Fleet Manager', 'Dispatcher']}><Trips /></ProtectedRoute>} />
          <Route path="drivers" element={<ProtectedRoute roles={['Fleet Manager', 'Dispatcher', 'Safety Officer']}><Drivers /></ProtectedRoute>} />
          <Route path="maintenance" element={<ProtectedRoute roles={['Fleet Manager', 'Dispatcher']}><Maintenance /></ProtectedRoute>} />
          <Route path="expenses" element={<ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}><Expenses /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute roles={['Fleet Manager', 'Financial Analyst']}><Analytics /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
