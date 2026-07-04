import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { Toaster } from './components/Toast';
import Home from './pages/Home';
import PdfTools from './pages/PdfTools';
import WordTools from './pages/WordTools';
import DocsTools from './pages/DocsTools';
import ExcelTools from './pages/ExcelTools';
import ImageTools from './pages/ImageTools';
import ChatStudio from './pages/ChatStudio';
import WhatsAppStudio from './pages/WhatsAppStudio';
import SharePost from './pages/SharePost';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Home />} />
        <Route path="/pdf"        element={<PdfTools />} />
        <Route path="/word"       element={<WordTools />} />
        <Route path="/docs"       element={<DocsTools />} />
        <Route path="/excel"      element={<ExcelTools />} />
        <Route path="/image"      element={<ImageTools />} />
        <Route path="/chat"       element={<ChatStudio />} />
        <Route path="/whatsapp"   element={<WhatsAppStudio />} />
        <Route path="/share/:id"  element={<SharePost />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Share page has no sidebar/header */}
        <Route path="/share/:id" element={<SharePost />} />
        {/* All other pages use the main layout */}
        <Route path="/*" element={
          <div className="app-layout">
            <Sidebar />
            <div className="main-content">
              <Header />
              <AppRoutes />
            </div>
            <Toaster />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

