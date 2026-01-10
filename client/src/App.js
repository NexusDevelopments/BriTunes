
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './theme';

function Home() {
  return <div style={{ background: theme.colors.primary, color: theme.colors.text, minHeight: '100vh' }}>
    <h1>BriTunes</h1>
    <p>Welcome to BriTunes! Blue & Black Theme.</p>
  </div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
