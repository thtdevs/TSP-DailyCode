import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Sparkles, Code2, Cpu, BookOpen, Layers } from 'lucide-react';
import API_BASE_URL from '../config/api';

const CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'dsa', label: 'Data Structures' },
  { id: 'web', label: 'Web Dev' },
  { id: 'cpp', label: 'C++ / C' },
  { id: 'python', label: 'Python' }
];

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, []);

  const calculateReadTime = (blocks) => {
    if (!blocks || blocks.length === 0) return '2 min read';
    const totalWords = blocks.reduce((acc, block) => {
      if (block.content) {
        return acc + block.content.trim().split(/\s+/).length;
      }
      return acc;
    }, 0);
    const minutes = Math.max(1, Math.ceil(totalWords / 180));
    return `${minutes} min read`;
  };

  const getExcerpt = (blocks) => {
    if (!blocks || blocks.length === 0) return 'No preview content available.';
    const textBlock = blocks.find((b) => b.type === 'text');
    if (textBlock && textBlock.content) {
      return textBlock.content.slice(0, 160) + '...';
    }
    const codeBlock = blocks.find((b) => b.type === 'code');
    if (codeBlock && codeBlock.content) {
      return `Code snippet (${codeBlock.language || 'code'}): ` + codeBlock.content.slice(0, 100) + '...';
    }
    return 'Click to read full article...';
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.blocks && post.blocks.some(b => b.content && b.content.toLowerCase().includes(searchTerm.toLowerCase())));
    
    if (selectedCategory === 'all') return matchesSearch;

    const lowerHeading = post.heading.toLowerCase();
    const hasCategoryCode = post.blocks && post.blocks.some(b => b.language && b.language.toLowerCase().includes(selectedCategory));
    
    return matchesSearch && (lowerHeading.includes(selectedCategory) || hasCategoryCode);
  });

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="club-pill-tag">
          <Sparkles size={14} /> The HIT Times • Trainee Scholar Program
        </div>

        <h1 className="hero-title">
          Master Algorithms & <br />
          <span className="gradient-text">Daily Technical Code</span>
        </h1>
        
        <p className="hero-subtitle">
          Official problem-solving portal hosted by <strong>The HIT Times</strong> for <strong>TSP scholars</strong>. Explore daily algorithmic solutions, system design insights, and code snippets.
        </p>

        {/* Stats Counter Bar */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{posts.length > 0 ? `${posts.length}+` : 'Daily'}</span>
            <span className="stat-label">Published Solutions</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }}></div>
          <div className="stat-item">
            <span className="stat-number">TSP '26</span>
            <span className="stat-label">Trainee Scholar Event</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }}></div>
          <div className="stat-item">
            <span className="stat-number">The HIT Times</span>
            <span className="stat-label">Official Campus Media</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search daily code solutions by topic, keyword, or language..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Pills */}
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid or Loading Skeletons */}
      {loading ? (
        <div className="posts-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel post-card" style={{ gap: '1rem' }}>
              <div className="skeleton" style={{ height: '20px', width: '35%' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '85%' }}></div>
              <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
              <div className="skeleton" style={{ height: '24px', width: '40%', marginTop: 'auto' }}></div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '2rem 0', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          <Code2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>No articles found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {searchTerm ? `No articles matching "${searchTerm}"` : 'No articles published in this category yet.'}
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} 
            className="btn-secondary nav-btn"
            style={{ marginTop: '1.5rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <Link key={post._id} to={`/post/${post.slug}`} className="glass-panel glass-panel-interactive post-card">
              <div className="post-card-header">
                <span className="post-card-date">
                  <Calendar size={13} />
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="read-time-pill">{calculateReadTime(post.blocks)}</span>
              </div>

              <h2 className="post-card-title">{post.heading}</h2>
              <p className="post-card-excerpt">{getExcerpt(post.blocks)}</p>
              
              <div className="post-card-footer">
                <span className="post-author-tag">
                  <User size={14} /> {post.createdBy?.username || 'The HIT Times'}
                </span>
                <span className="post-cta">
                  Read Solution <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
