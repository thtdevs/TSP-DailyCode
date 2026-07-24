import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, ShieldCheck, LogOut, PlusCircle, Menu, X, BookOpen } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <Link to="/" className="brand-wrapper">
          <div className="brand-icon-box">
            <Terminal size={22} />
          </div>
          <div className="brand-title-group">
            <span className="brand-main-title">The HIT Times</span>
            <span className="brand-event-badge">
              <span className="brand-event-dot"></span> TSP • Trainee Scholar Program
            </span>
          </div>
        </Link>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link 
            to="/" 
            className="nav-btn btn-secondary"
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={16} /> Articles
          </Link>

          {token ? (
            <>
              <Link 
                to="/admin" 
                className="nav-btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShieldCheck size={16} /> Dashboard
              </Link>
              <Link 
                to="/admin/editor" 
                className="nav-btn btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusCircle size={16} /> New Article
              </Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }} 
                className="nav-btn btn-secondary"
              >
                <LogOut size={16} /> Logout ({username})
              </button>
            </>
          ) : (
            <Link 
              to="/admin/login" 
              className="nav-btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          )}
        </nav>

        <button 
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
