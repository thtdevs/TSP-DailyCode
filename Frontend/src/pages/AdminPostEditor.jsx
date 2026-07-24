import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, FileText, Image as ImageIcon, Code, Upload } from 'lucide-react';
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
          setError('Failed to load post for editing.');
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
    e.preventDefault();
    if (!heading.trim()) {
      setError('Post heading is required.');
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
      if (!res.ok) throw new Error(data.message || 'Failed to save post');

      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <button onClick={handleSave} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem' }}>
          <Save size={18} /> {loading ? 'Saving...' : id ? 'Update Post' : 'Publish Post'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          {id ? 'Edit Post' : 'Create New Post'}
        </h2>

        <div className="form-group">
          <label className="form-label">Article Heading / Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. How to Implement Binary Search in C++"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">URL Slug (Optional - Auto-generated if left blank)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. binary-search-cpp"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Content Blocks</h3>

          {blocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No content blocks added yet. Use the buttons below to add text, photos, or code snippets!
            </div>
          ) : (
            blocks.map((block, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.25rem', background: 'rgba(17, 24, 39, 0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {block.type === 'text' && <FileText size={14} />}
                    {block.type === 'image' && <ImageIcon size={14} />}
                    {block.type === 'code' && <Code size={14} />}
                    Block {idx + 1}: {block.type}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
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
                    rows={4}
                    className="form-textarea"
                    placeholder="Enter text paragraph content..."
                    value={block.content || ''}
                    onChange={(e) => updateBlock(idx, 'content', e.target.value)}
                  />
                )}

                {block.type === 'image' && (
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Image URL (or upload image below)"
                        value={block.url || ''}
                        onChange={(e) => updateBlock(idx, 'url', e.target.value)}
                      />
                      <label className="btn-secondary nav-btn" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
                        <Upload size={16} /> {uploadingIdx === idx ? 'Uploading...' : 'Upload Photo'}
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
                      <img src={block.url} alt="Preview" style={{ maxHeight: '180px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
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
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="html">HTML / CSS</option>
                        <option value="sql">SQL</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="typescript">TypeScript</option>
                        <option value="bash">Bash / Shell</option>
                      </select>
                    </div>
                    <textarea
                      rows={6}
                      className="form-textarea"
                      placeholder="Paste or write your code snippet here..."
                      style={{ fontFamily: 'Fira Code, monospace', fontSize: '0.9rem' }}
                      value={block.content || ''}
                      onChange={(e) => updateBlock(idx, 'content', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => addBlock('text')} className="btn-secondary nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Add Text Block
            </button>
            <button type="button" onClick={() => addBlock('image')} className="btn-secondary nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Add Photo/Image Block
            </button>
            <button type="button" onClick={() => addBlock('code')} className="btn-secondary nav-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> Add Code Block
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
