import { useEffect } from "react";

/**
 * React 19 Native SEO & Document Metadata Component
 * Leverages React 19's native head hoisting for <title>, <meta>, and <link>,
 * combined with DOM synchronization for maximum crawler & browser compatibility.
 */
export default function SEO({
  title = "ApniPDFs — Free Online PDF, Word, Excel & Image Document Suite",
  description = "Edit, merge, split, and convert PDFs, Word documents (.docx), Excel spreadsheets (.xlsx), and images directly in your browser with complete privacy. 100% free with no watermarks.",
  keywords = "PDF editor, merge PDF, split PDF, convert PDF to Word, edit docx online, split excel sheets, edit image online, free document tools, ApniPDFs",
  canonical = "https://www.apnipdfs.com/",
  ogType = "website",
  ogImage = "https://www.apnipdfs.com/favicon.png",
}) {
  useEffect(() => {
    // Synchronize document title
    if (title) {
      document.title = title;
    }

    // Helper to update or create meta tag
    const updateMetaTag = (attrName, attrValue, content) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (description) updateMetaTag("name", "description", description);
    if (keywords) updateMetaTag("name", "keywords", keywords);
    if (title) updateMetaTag("property", "og:title", title);
    if (description) updateMetaTag("property", "og:description", description);
    if (canonical) updateMetaTag("property", "og:url", canonical);
    if (ogImage) updateMetaTag("property", "og:image", ogImage);

    // Canonical link synchronization
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);
  }, [title, description, keywords, canonical, ogImage]);

  return (
    <>
      {/* React 19 Native Document Metadata Hoisting */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
