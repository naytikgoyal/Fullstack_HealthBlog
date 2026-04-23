// frontend/src/pages/Admin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Admin() {
  const navigate = useNavigate();
  
  // States for the Form
  const [formData, setFormData] = useState({
    title: '', excerpt: '', content: '', category: 'Fitness', featuredImage: ''
  });
  const [message, setMessage] = useState('');
  
  // NEW States for Editing and Listing
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null); // Keeps track of which post we are editing

  // The Bouncer (Security)
  useEffect(() => {
    const isLogged = localStorage.getItem('isAdminLoggedIn');
    if (!isLogged) navigate('/login');
    else fetchPosts(); // If logged in, fetch the posts!
  }, [navigate]);

  // Fetch all posts for the management list
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // NEW: Handle Form Submit (Handles BOTH Create and Update!)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // We are UPDATING an existing post
        await axios.put(`http://localhost:5001/api/posts/${editingId}`, formData);
        setMessage('✅ Post updated successfully!');
      } else {
        // We are CREATING a new post
        await axios.post('http://localhost:5001/api/posts', formData);
        setMessage('✅ New post published!');
      }
      
      // Reset form and refresh the list
      setFormData({ title: '', excerpt: '', content: '', category: 'Fitness', featuredImage: '' });
      setEditingId(null);
      fetchPosts();
      
      // Hide message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error saving post.');
    }
  };

  // NEW: Handle Edit Button Click
  const handleEdit = (post) => {
    // Populate the form with the clicked post's data
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featuredImage: post.featuredImage || ''
    });
    setEditingId(post._id); // Tell the system we are in "Edit Mode"
    window.scrollTo(0, 0); // Scroll to top of page
  };

  // NEW: Handle Delete Button Click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post forever?")) {
      try {
        await axios.delete(`http://localhost:5001/api/posts/${id}`);
        setMessage('🗑️ Post deleted.');
        fetchPosts(); // Refresh list
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting post.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="admin-container" style={{ marginTop: '40px' }}>
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      {message && <div className="status-message">{message}</div>}

      <div className="admin-card">
        <h3>{editingId ? "✏️ Edit Post" : "✍️ Create New Post"}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Blog Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Featured Image URL</label>
            <input type="text" name="featuredImage" value={formData.featuredImage} onChange={handleChange} placeholder="Paste Unsplash image link" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Fitness">Fitness</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div className="form-group">
            <label>Short Excerpt</label>
            <textarea name="excerpt" rows="2" value={formData.excerpt} onChange={handleChange} required />
          </div>

          {/* HERE IS THE REPLACED TEXT AREA! */}
          <div className="form-group">
            <label>Full Content</label>
            <ReactQuill 
              theme="snow" 
              value={formData.content} 
              onChange={(value) => setFormData({ ...formData, content: value })} 
              placeholder="Write your amazing article here..."
              style={{ height: '250px', marginBottom: '50px' }} 
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              {editingId ? "Update Post" : "Publish Post"}
            </button>
            
            {/* Show a Cancel button if we are in Edit Mode */}
            {editingId && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', excerpt: '', content: '', category: 'Fitness', featuredImage: '' });
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* NEW: The Management List */}
      <div className="manage-posts-section">
        <h3>Manage Existing Posts</h3>
        <div className="admin-post-list">
          {posts.map(post => (
            <div key={post._id} className="admin-post-item">
              <div className="admin-post-info">
                <strong>{post.title}</strong>
                <span className="admin-badge">{post.category}</span>
              </div>
              <div className="admin-post-actions">
                <button onClick={() => handleEdit(post)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(post._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}