// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/login', { password });
      
      if (response.data.success) {
        // Save a VIP pass in the browser
        localStorage.setItem('isAdminLoggedIn', 'true');
        // Teleport the user to the Admin page
        navigate('/admin');
      }
    } catch (err) {
      setError('❌ Incorrect password. Access denied.');
      setPassword(''); // Clear the input box
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <p>Please enter the secret password to continue.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input 
            type="password" 
            placeholder="Enter Password..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="login-btn">Secure Login</button>
        </form>
      </div>
    </div>
  );
}