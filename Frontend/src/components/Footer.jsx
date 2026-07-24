import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="brand-wrapper" style={{ marginBottom: '0.5rem' }}>
              <div className="brand-icon-box">
                <Terminal size={22} />
              </div>
              <div className="brand-title-group">
                <span className="brand-main-title">The HIT Times</span>
                <span className="brand-event-badge">
                  <span className="brand-event-dot"></span> TSP • Trainee Scholar Program
                </span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Curating daily algorithmic challenges, computer science concepts, software architecture design patterns, and engineering insights for TSP scholars.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Daily Code Articles</Link></li>
              <li><Link to="/admin/login">Admin Portal</Link></li>
              <li><Link to="/admin">Scholar Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">The HIT Times</h4>
            <ul className="footer-links">
              <li>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Haldia Institute of Technology
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Official Campus Media & Tech Club
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} <strong>The HIT Times</strong>. All rights reserved for <strong>TSP</strong> (Trainee Scholar Program).
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} style={{ color: '#ef4444', fill: '#ef4444' }} /> for TSP Scholars
          </div>
        </div>
      </div>
    </footer>
  );
}
