// frontend/src/pages/SinglePost.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './SinglePost.css';

export default function SinglePost() {
  const { slug } = useParams(); // Grabs the slug from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Remember to use your new Port 5001!
        const response = await axios.get(`http://localhost:5001/api/posts/${slug}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError('Article not found.');
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="loading">Loading article...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="single-post-container">
      <Link to="/" className="back-link">← Back to Articles</Link>
      
      <article className="full-post">
        <header className="post-header">
          <span className="category-badge">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="author-date">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </header>

        <img src={post.featuredImage} alt={post.title} className="hero-image" />
        
       <div 
          className="post-body" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}