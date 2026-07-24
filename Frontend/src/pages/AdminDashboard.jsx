import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, FileText, Search, ShieldCheck, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching posts:', err);
        setLoading(false);
      });
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { token },
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.heading.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!token) return null;

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div>
          <div className="club-pill-tag" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> The HIT Times • Admin Portal
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Scholar Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Manage published daily code articles, solution code blocks, and media content for TSP.
          </p>
        </div>
        
        <Link to="/admin/editor" className="nav-btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem' }}>
          <PlusCircle size={18} /> Create New Article
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Loading admin dashboard data...
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.1rem' }}>
              <FileText size={20} />
              <span>Published Articles ({posts.length})</span>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Filter dashboard list..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem', fontSize: '0.85rem', height: '38px' }}
              />
            </div>
          </div>

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No articles published yet. Click "Create New Article" to write your first daily code solution!
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              No matching articles found for "{filterQuery}".
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Article Heading</th>
                    <th>URL Slug</th>
                    <th>Date Created</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post._id}>
                      <td style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{post.heading}</td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-code)', fontSize: '0.85rem' }}>
                        /{post.slug}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <Link
                            to={`/post/${post.slug}`}
                            className="copy-btn"
                            title="View Reader Page"
                            style={{ textDecoration: 'none' }}
                          >
                            <Eye size={14} /> View
                          </Link>
                          <Link
                            to={`/admin/editor/${post._id}`}
                            className="copy-btn"
                            title="Edit Article"
                            style={{ textDecoration: 'none', color: '#60a5fa' }}
                          >
                            <Edit3 size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="copy-btn"
                            title="Delete Article"
                            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
