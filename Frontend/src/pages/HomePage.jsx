import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPosts = posts.filter((post) =>
    post.heading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getExcerpt = (blocks) => {
    if (!blocks || blocks.length === 0) return 'No preview content available.';
    const textBlock = blocks.find((b) => b.type === 'text');
    if (textBlock && textBlock.content) {
      return textBlock.content.slice(0, 150) + '...';
    }
    const codeBlock = blocks.find((b) => b.type === 'code');
    if (codeBlock && codeBlock.content) {
      return `Code snippet (${codeBlock.language || 'code'}): ` + codeBlock.content.slice(0, 100) + '...';
    }
    return 'Click to read article...';
  };

  return (
    <main className="container">
      <section className="hero-section">
        <h1 className="hero-title">
          Master Algorithms & <span className="gradient-text">Daily Code</span>
        </h1>
        <p className="hero-subtitle">
          In-depth technical solutions, system design insights, and daily programming tutorials curated for software engineers.
        </p>

        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading daily code posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <h3>No articles found</h3>
          <p style={{ marginTop: '0.5rem' }}>Check back later or try a different search term.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <Link key={post._id} to={`/post/${post.slug}`} className="post-card glass-panel">
              <div className="post-card-date">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <h2 className="post-card-title">{post.heading}</h2>
              <p className="post-card-excerpt">{getExcerpt(post.blocks)}</p>
              
              <div className="post-card-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={14} /> {post.createdBy?.username || 'Admin'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-cyan)' }}>
                  Read Post <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
