// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import SinglePost from './pages/SinglePost';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      {/* Navbar sits outside Routes so it shows on every page */}
      <Navbar /> 
      
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog/:slug" element={<SinglePost />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;