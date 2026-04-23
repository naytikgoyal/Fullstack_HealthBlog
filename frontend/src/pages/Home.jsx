// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NEW: State for our Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fitness', 'Nutrition', 'Mental Health', 'Lifestyle'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // NEW: The Filtering Engine!
  // This instantly filters the array based on what you type or click
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="loading">Loading amazing articles...</div>;

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to HealthPulse</h1>
        <p>Your daily dose of wellness, nutrition, and mental health tips.</p>
        
        {/* NEW: The Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for articles, workouts, or diets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* NEW: Category Buttons */}
        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="latest-posts">
        <h2>{selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}</h2>
        
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <h3>No articles found!</h3>
            <p>Try adjusting your search or category filter.</p>
            <button onClick={() => {setSearchTerm(''); setSelectedCategory('All')}} className="reset-btn">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="post-grid">
            {filteredPosts.map((post) => (
              <article key={post._id} className="post-card">
                <img src={post.featuredImage} alt={post.title} className="post-image" />
                <div className="post-content">
                  <span className="category-badge">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-meta">
                    <span>By {post.author}</span>
                    <Link to={`/blog/${post.slug}`} className="read-more">Read More →</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}