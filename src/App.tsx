import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { useTranslation } from 'react-i18next';
import Navigation from './components/organisms/Navigation';
import { ScrollToTop } from './components/molecules/ScrollToTop';
import Footer from './components/organisms/Footer';
import { LangWrapper } from './components/common/LangWrapper';
import Home from './pages/Home';
import AboutHistory from './pages/AboutHistory';
import AboutLifestyle from './pages/AboutLifestyle';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Heavy 3D visualization — lazy-loaded so it doesn't bloat the main bundle.
const Tokens = lazy(() => import('./pages/Tokens'));

function AppShell() {
  const { t } = useTranslation();
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent')}
      </a>
      <ScrollToTop />
      <Navigation />
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Routes>
          {/* Language-aware routes: /:lang? covers both "/" and "/es/" */}
          <Route path="/:lang?" element={<LangWrapper />}>
            <Route index element={<Home />} />
            <Route path="about/history" element={<AboutHistory />} />
            <Route path="about/lifestyle" element={<AboutLifestyle />} />
            <Route path="courses" element={<Courses />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Tokens page is English-only, no lang prefix */}
          <Route
            path="/tokens"
            element={
              <Suspense fallback={null}>
                <Tokens />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
