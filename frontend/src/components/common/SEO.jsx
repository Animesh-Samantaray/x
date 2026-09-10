import React, { useEffect } from "react";

const SEO = ({
  title = "Collaborative Knowledge Marketplace — Learn, Teach & Mentor",
  description = "A full-stack, real-time interactive platform for knowledge sharing, course discussions, 1-on-1 expert mentorship sessions, and collaborative learning.",
  keywords = "knowledge marketplace, online courses, 1-on-1 mentorship, expert coaching, educational resources, real-time discussions, CKM",
  canonical,
  ogImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
  ogType = "website",
  schemaJson = null,
  noIndex = false,
}) => {
  useEffect(() => {
    const fullTitle = title.includes("Collaborative Knowledge Marketplace")
      ? title
      : `${title} | Collaborative Knowledge Marketplace`;
    document.title = fullTitle;

    const setMeta = (selector, attrName, attrValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content || "");
    };

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="keywords"]', "name", "keywords", keywords);
    setMeta('meta[name="viewport"]', "name", "viewport", "width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover");

    if (noIndex) {
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    } else {
      setMeta('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    }

    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", ogType);
    setMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", "Collaborative Knowledge Marketplace");

    const currentUrl = canonical || window.location.href;
    setMeta('meta[property="og:url"]', "property", "og:url", currentUrl);

    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", currentUrl);

    let scriptSchema = document.getElementById("json-ld-schema");
    if (schemaJson) {
      if (!scriptSchema) {
        scriptSchema = document.createElement("script");
        scriptSchema.id = "json-ld-schema";
        scriptSchema.type = "application/ld+json";
        document.head.appendChild(scriptSchema);
      }
      scriptSchema.textContent = JSON.stringify(schemaJson);
    } else if (scriptSchema) {
      scriptSchema.remove();
    }

    return () => {
      const existingScript = document.getElementById("json-ld-schema");
      if (existingScript) existingScript.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, schemaJson, noIndex]);

  return null;
};

export default SEO;
