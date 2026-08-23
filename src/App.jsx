import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/Toast";
import Home from "./pages/Home";
import PdfTools from "./pages/PdfTools";
import WordTools from "./pages/WordTools";
// import DocsTools from './pages/DocsTools';
import ExcelTools from "./pages/ExcelTools";
import ImageTools from "./pages/ImageTools";
import ChatStudio from "./pages/ChatStudio";
import WhatsAppStudio from "./pages/WhatsAppStudio";
import SharePost from "./pages/SharePost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import HowItWorks from "./pages/HowItWorks";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/pdf/:action?" element={<PdfTools />} />
        <Route path="/word/:action?" element={<WordTools />} />
        {/* <Route path="/docs/:action?"       element={<DocsTools />} /> */}
        <Route path="/excel/:action?" element={<ExcelTools />} />
        <Route path="/image/:action?" element={<ImageTools />} />
        <Route path="/chat" element={<ChatStudio />} />
        <Route path="/whatsapp" element={<WhatsAppStudio />} />
        <Route path="/share/:id" element={<SharePost />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
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
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col text-white font-inter overflow-x-hidden pt-16 selection:bg-indigo-500/30 selection:text-white">
              <Header />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
                <AppRoutes />
              </main>
              <Footer />
              <Toaster />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
