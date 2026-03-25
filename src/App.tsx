import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import AboutHistory from './pages/AboutHistory';
import AboutLifestyle from './pages/AboutLifestyle';
import Courses from './pages/Courses';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/history" element={<AboutHistory />} />
          <Route path="/about/lifestyle" element={<AboutLifestyle />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
