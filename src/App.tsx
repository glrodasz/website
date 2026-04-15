import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Navigation from './components/organisms/Navigation';
import { ScrollToTop } from './components/molecules/ScrollToTop';
import Footer from './components/organisms/Footer';
import Home from './pages/Home';
import AboutHistory from './pages/AboutHistory';
import AboutLifestyle from './pages/AboutLifestyle';
import Courses from './pages/Courses';
import Contact from './pages/Contact';

// Heavy 3D visualization — lazy-loaded so it doesn't bloat the main bundle.
const Tokens = lazy(() => import('./pages/Tokens'));

function App() {
  return (
    <ThemeProvider>
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
            <Route
              path="/tokens"
              element={
                <Suspense fallback={null}>
                  <Tokens />
                </Suspense>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
