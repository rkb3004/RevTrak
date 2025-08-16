
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Sales } from './pages/sales/Sales';
import { Service } from './pages/service/Service';
import { Inventory } from './pages/inventory/Inventory';
import { Customer } from './pages/customer/Customer';
import { Analytics } from './pages/analytics/Analytics';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/sales" element={<Layout><Sales /></Layout>} />
        <Route path="/service" element={<Layout><Service /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/customer" element={<Layout><Customer /></Layout>} />
        <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;