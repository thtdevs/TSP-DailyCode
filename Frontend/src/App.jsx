import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostEditor from './pages/AdminPostEditor';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Reader Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:slug" element={<PostDetailPage />} />

            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/editor" element={<AdminPostEditor />} />
            <Route path="/admin/editor/:id" element={<AdminPostEditor />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
