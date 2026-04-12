import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/organisms/Navigation';
import { ScrollToTop } from './components/molecules/ScrollToTop';
import Footer from './components/organisms/Footer';
import Home from './pages/Home';
import AboutHistory from './pages/AboutHistory';
import AboutLifestyle from './pages/AboutLifestyle';
import Courses from './pages/Courses';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
