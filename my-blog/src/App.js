import './App.css';
import NavBar from './NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage';
import ArticleListPage from './pages/ArticleListPage';
import WriteArticlePage from './pages/WriteArticlePage';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <div className="App">
      <NavBar />
      <header className="app-hero">
        <h1 className="app-hero__title">KWS Phoenix Blog</h1>
        <div className="app-hero__rule" aria-hidden="true" />
      </header>
      <div id="page-body" className="page-body">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/articles-list" element={<ArticleListPage />} />
            <Route path="/write" element={<WriteArticlePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
    </Router>
  );
}

export default App;
