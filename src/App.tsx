import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Navigation from './components/organisms/Navigation';
import { ScrollToTop } from './components/molecules/ScrollToTop';
import Footer from './components/organisms/Footer';
import { LangWrapper } from './components/common/LangWrapper';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Home is the landing page and stays in the main bundle; the other pages are
// split out so their code (react-markdown on AboutHistory, for one) never
// delays the first paint of /.
const AboutHistory = lazy(() => import('./pages/AboutHistory'));
const AboutLifestyle = lazy(() => import('./pages/AboutLifestyle'));
const Courses = lazy(() => import('./pages/Courses'));
const FunProjects = lazy(() => import('./pages/FunProjects'));
const Contact = lazy(() => import('./pages/Contact'));

// Dev-only token explorer: bundles every token JSON plus the audit engine,
// so it is lazy-loaded to keep it out of the main bundle.
const Tokens = lazy(() => import('./pages/tokens/Tokens'));
// Layout only, inline: the explorer's stylesheet ships in the lazy chunk this
// fallback waits for, so no class from it could style the fallback.
const TOKENS_FALLBACK_LAYOUT = {
  position: 'fixed',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
} as const;

/** Routes that own the whole viewport and render no site chrome around them. */
function isFullScreenRoute(pathname: string): boolean {
  return pathname === '/tokens' || pathname.startsWith('/tokens/');
}

function AppShell() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  // The token explorer is a fixed, full-viewport panel, so the navbar and
  // footer around it are never visible. Rendering them anyway added document
  // height — which is what made the page scroll with content sliding past
  // behind it — and left stray tab stops in content nobody could see.
  const showChrome = !isFullScreenRoute(pathname);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {t('skipToContent')}
      </a>
      <ScrollToTop />
      {showChrome && <Navigation />}
      <main id="main-content" className="app-main" tabIndex={-1}>
        <Suspense fallback={null}>
          <Routes>
            {/* Language-aware routes: /:lang? covers both "/" and "/es/" */}
            <Route path="/:lang?" element={<LangWrapper />}>
              <Route index element={<Home />} />
              <Route path="about/history" element={<AboutHistory />} />
              <Route path="about/lifestyle" element={<AboutLifestyle />} />
              <Route path="courses" element={<Courses />} />
              <Route path="projects" element={<FunProjects />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            {/* Tokens page is English-only, no lang prefix */}
            <Route
              path="/tokens"
              element={
                <Suspense fallback={<div style={TOKENS_FALLBACK_LAYOUT}>Loading tokens…</div>}>
                  <Tokens />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {showChrome && <Footer />}
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
