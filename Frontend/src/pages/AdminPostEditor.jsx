import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, FileText, Image as ImageIcon, Code, Upload, Eye, Edit2, Sparkles, Check } from 'lucide-react';
import API_BASE_URL from '../config/api';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [heading, setHeading] = useState('');
  const [slug, setSlug] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (id) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/posts/id/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setHeading(data.heading || '');
            setSlug(data.slug || '');
            setBlocks(data.blocks || []);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching post:', err);
          setError('Failed to load article for editing.');
          setLoading(false);
        });
    }
  }, [id, token, navigate]);

  const addBlock = (type) => {
    if (type === 'text') {
      setBlocks([...blocks, { type: 'text', content: '' }]);
    } else if (type === 'image') {
      setBlocks([...blocks, { type: 'image', url: '' }]);
    } else if (type === 'code') {
      setBlocks([...blocks, { type: 'code', language: 'javascript', content: '' }]);
    }
  };

  const updateBlock = (index, field, value) => {
    const newBlocks = [...blocks];
    newBlocks[index][field] = value;
    setBlocks(newBlocks);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setBlocks(newBlocks);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIdx(index);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { token },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Image upload failed');

      updateBlock(index, 'url', data.url);
    } catch (err) {
      alert('Upload Error: ' + err.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!heading.trim()) {
      setError('Article title / heading is required.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = { heading, slug, blocks };
    const url = id ? `${API_BASE_URL}/api/posts/${id}` : `${API_BASE_URL}/api/posts`;
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save article');

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '920px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ display: 'flex', items: 'center', gap: '0.75rem' }}>
          <div className="category-tabs" style={{ marginBottom: 0 }}>
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`category-pill ${activeTab === 'edit' ? 'active' : ''}`}
            >
              <Edit2 size={13} style={{ display: 'inline', marginRight: '4px' }} /> Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`category-pill ${activeTab === 'preview' ? 'active' : ''}`}
            >
              <Eye size={13} style={{ display: 'inline', marginRight: '4px' }} /> Live Preview
            </button>
          </div>

          <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem' }}>
            <Save size={18} /> {loading ? 'Saving...' : id ? 'Update Article' : 'Publish Article'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {activeTab === 'edit' ? (
        <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2.5rem' }}>
          <div className="club-pill-tag" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={13} /> The HIT Times • Article Studio
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>
            {id ? 'Edit Daily Code Article' : 'Create New Technical Article'}
          </h2>

          <div className="form-group">
            <label className="form-label">Article Heading / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Solving Two Sum with Hash Map Optimization in C++"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              required
              style={{ fontSize: '1.15rem', fontWeight: 700 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL Slug (Optional - Auto-generated if empty)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. two-sum-hash-map-cpp"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{ fontFamily: 'var(--font-code)', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Content Blocks</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{blocks.length} blocks added</span>
            </div>

            {blocks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                No content blocks added yet. Use the buttons below to add text paragraphs, photo diagrams, or code blocks!
              </div>
            ) : (
              blocks.map((block, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: 'rgba(10, 10, 14, 0.85)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {block.type === 'text' && <FileText size={15} />}
                      {block.type === 'image' && <ImageIcon size={15} />}
                      {block.type === 'code' && <Code size={15} />}
                      Block {idx + 1}: {block.type}
                    </span>
                    
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button type="button" onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="copy-btn">
                        <ArrowUp size={14} />
                      </button>
                      <button type="button" onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} className="copy-btn">
                        <ArrowDown size={14} />
                      </button>
                      <button type="button" onClick={() => removeBlock(idx)} className="copy-btn" style={{ color: '#f87171' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {block.type === 'text' && (
                    <textarea
                      rows={5}
                      className="form-textarea"
                      placeholder="Enter explanatory text, theoretical concept, or problem description..."
                      value={block.content || ''}
                      onChange={(e) => updateBlock(idx, 'content', e.target.value)}
                    />
                  )}

                  {block.type === 'image' && (
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Image URL (or upload an image file)"
                          value={block.url || ''}
                          onChange={(e) => updateBlock(idx, 'url', e.target.value)}
                          style={{ flex: 1 }}
                        />
                        <label className="btn-secondary nav-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                          <Upload size={16} /> {uploadingIdx === idx ? 'Uploading...' : 'Upload Image'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(idx, e.target.files[0])}
                            disabled={uploadingIdx === idx}
                          />
                        </label>
                      </div>
                      {block.url && (
                        <div className="block-image-container" style={{ maxHeight: '220px' }}>
                          <img src={block.url} alt="Preview" style={{ maxHeight: '220px', width: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'code' && (
                    <div>
                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label className="form-label">Programming Language</label>
                        <select
                          className="form-select"
                          value={block.language || 'javascript'}
                          onChange={(e) => updateBlock(idx, 'language', e.target.value)}
                        >
                          <option value="cpp">C++</option>
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="java">Java</option>
                          <option value="c">C</option>
                          <option value="sql">SQL</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="typescript">TypeScript</option>
                          <option value="html">HTML / CSS</option>
                          <option value="bash">Bash / Shell</option>
                        </select>
                      </div>
                      <textarea
                        rows={7}
                        className="form-textarea"
                        placeholder="Paste or write solution code here..."
                        style={{ fontFamily: 'var(--font-code)', fontSize: '0.9rem' }}
                        value={block.content || ''}
                        onChange={(e) => updateBlock(idx, 'content', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button type="button" onClick={() => addBlock('text')} className="btn-secondary nav-btn">
                <Plus size={16} /> Add Text Block
              </button>
              <button type="button" onClick={() => addBlock('image')} className="btn-secondary nav-btn">
                <Plus size={16} /> Add Image Block
              </button>
              <button type="button" onClick={() => addBlock('code')} className="btn-secondary nav-btn">
                <Plus size={16} /> Add Code Block
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Live Reader Preview Tab */
        <article className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
          <header className="post-header" style={{ padding: 0, border: 'none', marginBottom: '2.5rem' }}>
            <div className="club-pill-tag" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} /> The HIT Times • Live Reader Preview
            </div>
            <h1 className="post-title" style={{ fontSize: '2.5rem' }}>
              {heading || 'Untitled Daily Code Article'}
            </h1>
          </header>

          <div className="post-body">
            {blocks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No content blocks added yet.</p>
            ) : (
              blocks.map((block, idx) => {
                if (block.type === 'text') {
                  return <div key={idx} className="block-text">{block.content}</div>;
                }
                if (block.type === 'image') {
                  return (
                    <div key={idx} className="block-image-container">
                      <img src={block.url} alt="Preview" className="block-image" />
                    </div>
                  );
                }
                if (block.type === 'code') {
                  return (
                    <div key={idx} className="block-code-container">
                      <div className="code-header">
                        <span style={{ textTransform: 'uppercase' }}>{block.language || 'code'}</span>
                        <span className="copy-btn">Preview Code</span>
                      </div>
                      <pre className="code-content">
                        <code>{block.content}</code>
                      </pre>
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        </article>
      )}
    </main>
  );
}
