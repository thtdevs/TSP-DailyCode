import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, ShieldCheck, LogOut, PlusCircle } from 'lucide-react';

export default function Header() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="brand-logo">
          <Code2 className="gradient-text" size={28} />
          <span>TSP<span className="gradient-text">DailyCode</span></span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className="nav-btn btn-secondary">Articles</Link>
          {token ? (
            <>
              <Link to="/admin" className="nav-btn btn-secondary flex items-center gap-1">
                <ShieldCheck size={16} /> Dashboard
              </Link>
              <Link to="/admin/editor" className="nav-btn btn-primary flex items-center gap-1">
                <PlusCircle size={16} /> New Post
              </Link>
              <button onClick={handleLogout} className="nav-btn btn-secondary flex items-center gap-1">
                <LogOut size={16} /> Logout ({username})
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="nav-btn btn-primary flex items-center gap-1">
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
