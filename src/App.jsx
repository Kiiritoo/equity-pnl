import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TradeProvider } from './context/TradeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import TradeList from './pages/TradeList';

function App() {
  return (
    <TradeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="trades" element={<TradeList />} />
          </Route>
        </Routes>
      </Router>
    </TradeProvider>
  );
}

export default App;
