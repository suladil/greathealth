/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const link = element.querySelector(
      ".omegaxl-hero-slide a[href], a[href] img, #main-static-banner a[href], a[href]"
    );
    const anchor = link && link.tagName === "A" ? link : link ? link.closest("a[href]") : element.querySelector("a[href]");
    const image = element.querySelector(
      'img.omegaxl-hero-slide-desktop, img[class*="desktop"], img'
    );
    const cells = [];
    const imageCell = [];
    if (image) {
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      imageFrag.appendChild(image);
      imageCell.push(imageFrag);
    }
    cells.push(imageCell);
    const textCell = [];
    if (anchor && anchor.getAttribute("href")) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const cta = document.createElement("a");
      cta.setAttribute("href", anchor.getAttribute("href"));
      const title = anchor.getAttribute("title");
      if (title) cta.setAttribute("title", title);
      cta.textContent = title || (anchor.textContent || "").trim() || "Learn More";
      textFrag.appendChild(cta);
      textCell.push(textFrag);
    }
    cells.push(textCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse2(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".js_slide")).filter((slide) => {
      if (slide.classList.contains("slick-cloned")) return false;
      if (slide.getAttribute("aria-hidden") === "true" && slide.classList.contains("slick-cloned")) return false;
      return !!slide.querySelector("form");
    });
    const cells = [["Carousel"]];
    const seen = /* @__PURE__ */ new Set();
    slides.forEach((slide) => {
      const image = slide.querySelector("a.product-item-photo img, .omegaxl-products-carousel-grid-uniformity-default-item-image img, img.product-image-photo");
      const heading = slide.querySelector('.product-item-link h3, [class*="item-title"] h3, h3');
      const key = (heading ? heading.textContent : "").trim().toLowerCase() || (image ? image.getAttribute("src") || "" : "");
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      const ctaSource = slide.querySelector('a.btn-primary, a[class*="add-to-cart-btn"]');
      let cta = null;
      if (ctaSource) {
        cta = document.createElement("a");
        cta.setAttribute("href", ctaSource.getAttribute("href") || "");
        const ctaTitle = ctaSource.getAttribute("title");
        if (ctaTitle) cta.setAttribute("title", ctaTitle);
        cta.textContent = (ctaSource.textContent || "Shop Now").trim();
      }
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (image) imageCell.appendChild(image);
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (heading) {
        const h = document.createElement("h2");
        h.textContent = (heading.textContent || "").trim();
        contentCell.appendChild(h);
      }
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        contentCell.appendChild(p);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-benefit.js
  function parse3(element, { document }) {
    const items = Array.from(
      element.querySelectorAll(":scope > .omegaxl-benefits-list-grid-item")
    );
    const cells = [["Cards"]];
    items.forEach((item) => {
      const icon = item.querySelector(
        ".omegaxl-benefits-list-grid-icon-wrapper img, img"
      );
      const imageCell = [];
      const imageHint = document.createComment(" field:image ");
      imageCell.push(imageHint);
      if (icon) imageCell.push(icon);
      const heading = item.querySelector(
        '.omegaxl-benefits-list-grid-copy-heading, h3, h2, [class*="heading"]'
      );
      const description = item.querySelector(
        '.omegaxl-benefits-list-grid-copy-main, p, [class*="copy-main"]'
      );
      const textCell = [];
      const textHint = document.createComment(" field:text ");
      textCell.push(textHint);
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-benefit",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-compare.js
  function parse4(element, { document }) {
    const rows = Array.from(element.querySelectorAll("table tr, tbody > tr")).filter((row, idx, arr) => arr.indexOf(row) === idx);
    const cells = [];
    rows.forEach((row) => {
      const colCells = Array.from(row.querySelectorAll(":scope > th, :scope > td"));
      if (colCells.length === 0) return;
      const rowCells = colCells.map((colCell, colIndex) => {
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createComment(` field:column${colIndex + 1}text `));
        Array.from(colCell.childNodes).forEach((node) => frag.appendChild(node));
        return frag;
      });
      cells.push(rowCells);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "table-compare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-testimonial.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll(".omegaxl-testimonials-grid-item-wrapper");
    const cells = [];
    cards.forEach((card) => {
      const thumb = card.querySelector(".omegaxl-testimonials-grid-item-image img, .omegaxl-testimonials-grid-item-image picture img");
      const iframe = card.querySelector(".omegaxl-testimonials-modal iframe[src], iframe.omegaxl-testimonials-grid-item-video");
      const videoUrl = iframe ? iframe.getAttribute("src") : null;
      let imageContent = null;
      if (thumb && videoUrl) {
        const link = document.createElement("a");
        link.href = videoUrl;
        if (iframe && iframe.getAttribute("title")) link.title = iframe.getAttribute("title");
        link.appendChild(thumb);
        imageContent = link;
      } else if (thumb) {
        imageContent = thumb;
      }
      const imageCell = document.createDocumentFragment();
      if (imageContent) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(imageContent);
      }
      const headshot = card.querySelector(".omegaxl-testimonials-grid-item-copy-headshot img");
      const heading = card.querySelector(".omegaxl-testimonials-grid-item-copy-title h3, .omegaxl-testimonials-grid-item-copy-title");
      const quote = card.querySelector(".omegaxl-testimonials-grid-item-copy-quote q, .omegaxl-testimonials-grid-item-copy-quote");
      const stars = card.querySelector(".omegaxl-testimonials-grid-item-stars-wrapper, .omegaxl-star-rating");
      const textCell = document.createDocumentFragment();
      const textPieces = [];
      if (headshot) textPieces.push(headshot);
      if (heading) textPieces.push(heading);
      if (quote) textPieces.push(quote);
      if (stars) textPieces.push(stars);
      if (textPieces.length) {
        textCell.appendChild(document.createComment(" field:text "));
        textPieces.forEach((node) => textCell.appendChild(node));
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse6(element, { document }) {
    const iframe = element.querySelector(
      'iframe.omegaxl-main-video-frame, iframe[src*="vimeo"], iframe[src*="youtube"], iframe[src]'
    );
    const rawSrc = iframe ? iframe.getAttribute("src") || "" : "";
    let videoUrl = rawSrc;
    if (rawSrc) {
      const vimeoMatch = rawSrc.match(/player\.vimeo\.com\/video\/(\d+)/);
      const youtubeMatch = rawSrc.match(/youtube\.com\/embed\/([\w-]+)/);
      if (vimeoMatch) {
        videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
      } else if (youtubeMatch) {
        videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
      } else {
        videoUrl = rawSrc.split("?")[0];
      }
    }
    const cells = [];
    const uriCell = document.createDocumentFragment();
    uriCell.appendChild(document.createComment(" field:embed_uri "));
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.textContent = videoUrl;
      uriCell.appendChild(link);
    }
    cells.push([uriCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/quote-founder.js
  function parse7(element, { document }) {
    const quotation = element.querySelector(
      ".oxl-quote, h1 q, h2 q, h3 q, blockquote, h1, h2, h3"
    );
    const attribution = element.querySelector(
      '.omegaxl-quote-block-home-strong, [class*="strong"], cite, figcaption, p'
    );
    const cells = [];
    const quotationCell = document.createDocumentFragment();
    if (quotation) {
      quotationCell.appendChild(document.createComment(" field:quotation "));
      quotationCell.appendChild(quotation);
    }
    cells.push([quotationCell]);
    const attributionCell = document.createDocumentFragment();
    if (attribution) {
      attributionCell.appendChild(document.createComment(" field:attribution "));
      attributionCell.appendChild(attribution);
    }
    cells.push([attributionCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "quote-founder", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-rating.js
  function parse8(element, { document }) {
    const buildStars = (starList) => {
      if (!starList) return null;
      const stars = Array.from(starList.querySelectorAll("li.star"));
      if (stars.length === 0) return null;
      let filled = 0;
      let half = false;
      stars.forEach((li) => {
        const fill = li.querySelector(".fill");
        const pct = fill ? parseFloat((fill.getAttribute("style") || "").replace(/[^0-9.]/g, "")) : 0;
        if (pct >= 75) filled += 1;
        else if (pct >= 25) half = true;
      });
      const p = document.createElement("p");
      p.textContent = `${"\u2605".repeat(filled)}${half ? "\xBD" : ""}`.trim();
      return p.textContent ? p : null;
    };
    const bbbRow = element.querySelector(".omegaxl-our-mission-ratings-row-01");
    const bbbCell = [];
    if (bbbRow) {
      const bbbLink = bbbRow.querySelector("a#bbblink, .omegaxl-our-mission-bbb-rating-icon-wrapper a");
      const bbbImg = bbbRow.querySelector(".omegaxl-our-mission-bbb-rating-icon-wrapper img, a#bbblink img");
      if (bbbLink && bbbImg) {
        const a = document.createElement("a");
        a.href = bbbLink.getAttribute("href") || "";
        a.appendChild(bbbImg);
        bbbCell.push(a);
      } else if (bbbImg) {
        bbbCell.push(bbbImg);
      }
      const bbbScore = bbbRow.querySelector('.omegaxl-our-mission-bbb-rating-score-wrapper p, [class*="bbb-rating-score"] p');
      if (bbbScore) bbbCell.push(bbbScore);
      const bbbStars = buildStars(bbbRow.querySelector('.bbb-star-rating ul, [class*="bbb-star-rating"] ul'));
      if (bbbStars) bbbCell.push(bbbStars);
    }
    const googleRow = element.querySelector(".omegaxl-our-mission-ratings-row-02");
    const googleCell = [];
    if (googleRow) {
      const overlay = googleRow.querySelector('a.omegaxl-our-mission-ratings-row-overlay-link, a[aria-label*="Google Rating"]');
      const googleHref = overlay ? overlay.getAttribute("href") : null;
      const googleImg = googleRow.querySelector('.omegaxl-our-mission-google-rating-icon-wrapper img, [class*="google-rating-icon"] img');
      const googleReviews = googleRow.querySelector('.omegaxl-our-mission-google-rating-copy p, [class*="google-rating-copy"] p');
      const googleScore = googleRow.querySelector('.omegaxl-our-mission-google-rating-score-wrapper p, [class*="google-rating-score"] p');
      const googleStars = buildStars(googleRow.querySelector('.google-star-rating ul, [class*="google-star-rating"] ul'));
      if (googleHref && googleImg) {
        const a = document.createElement("a");
        a.href = googleHref;
        a.appendChild(googleImg);
        googleCell.push(a);
      } else if (googleImg) {
        googleCell.push(googleImg);
      }
      if (googleReviews) googleCell.push(googleReviews);
      if (googleScore) googleCell.push(googleScore);
      if (googleStars) googleCell.push(googleStars);
    }
    const cells = [["Columns"], [bbbCell, googleCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-rating",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-policy.js
  function parse9(element, { document }) {
    let items = Array.from(
      element.querySelectorAll(":scope > .omegaxl-our-mission-policies-autoship-wrapper")
    );
    if (items.length === 0) {
      items = Array.from(element.querySelectorAll(":scope > div"));
    }
    const cells = [["Cards"]];
    items.forEach((item) => {
      const icon = item.querySelector(
        ".omegaxl-our-mission-policies-image-wrapper img, img"
      );
      const imageCell = [];
      imageCell.push(document.createComment(" field:image "));
      if (icon) imageCell.push(icon);
      const heading = item.querySelector(
        '.omegaxl-our-mission-policies-heading-wrapper h3, h3, h2, [class*="heading"] h3'
      );
      const copy = item.querySelector(
        '.omegaxl-our-mission-policies-copy-wrapper p, [class*="copy"] p'
      );
      const textCell = [];
      textCell.push(document.createComment(" field:text "));
      if (heading) textCell.push(heading);
      if (copy) textCell.push(copy);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "cards-policy",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/omegaxl-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".uw-sl",
        // UserWay accessibility skip-link list
        ".uwy",
        // UserWay widget container
        "#userwayAccessibilityIcon",
        // UserWay icon button
        "#userwayLstIcon",
        // UserWay translations icon
        "iframe.uwif",
        // UserWay menu iframe
        "#tm-pdp-container",
        // Truemed qualifier popup (hidden)
        "#authentication-popup",
        // Login / auth modal
        "#cart-drawer"
        // Slide-out minicart / cart drawer
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.page-header",
        // Sticky site header / nav
        "#oxl-header-promo-default",
        // Top promo bar (defensive; lives in header)
        "footer.page-footer",
        // Site footer
        // Tracking pixels / beacons / sync iframes appended after the footer.
        "#cannellamedia",
        "#batBeacon240810739615",
        "#batBeacon416992444483",
        'iframe[src*="doubleclick.net"]',
        'iframe[src*="cookie.havasedge.com"]',
        'iframe[src="about:blank"]',
        "iframe#launcher",
        // Chat widget launcher
        'img[src*="analytics.twitter.com"]',
        'img[src*="t.co/1/i/adsct"]',
        'img[src*="event.havasedge.com"]',
        'img[src*="bat.bing.com"]',
        // Safe leftover non-content elements.
        "link",
        "noscript",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/omegaxl-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const doc = element.ownerDocument;
    const resolved = sections.map((section) => {
      const anchor = section.selector ? element.querySelector(section.selector) : null;
      return anchor ? { section, anchor } : null;
    }).filter(Boolean);
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, anchor } = resolved[i];
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(block);
      }
      if (i > 0) {
        let boundary = anchor;
        while (boundary.parentElement && boundary.parentElement !== element && !boundary.previousElementSibling) {
          boundary = boundary.parentElement;
        }
        const hr = doc.createElement("hr");
        boundary.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "carousel-product": parse2,
    "cards-benefit": parse3,
    "table-compare": parse4,
    "cards-testimonial": parse5,
    "embed-video": parse6,
    "quote-founder": parse7,
    "columns-rating": parse8,
    "cards-policy": parse9
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage template for OmegaXL website",
    urls: ["https://www.omegaxl.com/"],
    blocks: [
      { name: "hero-banner", instances: [".omegaxl-home-hero-section-wrapper", "#main-static-banner"] },
      { name: "carousel-product", instances: ["#oxl-product-slider-1", "#oxl-product-slider-2"] },
      { name: "cards-benefit", instances: [".omegaxl-benefits-list-grid-wrapper"] },
      { name: "table-compare", instances: [".omegaxl-difference-content-table-wrapper"] },
      { name: "cards-testimonial", instances: [".omegaxl-testimonials-grid-wrapper"] },
      { name: "embed-video", instances: [".omegaxl-main-video-content-wrapper"] },
      { name: "quote-founder", instances: [".omegaxl-quote-block-home-content-wrapper"] },
      { name: "columns-rating", instances: [".omegaxl-our-mission-ratings-wrapper"] },
      { name: "cards-policy", instances: [".omegaxl-our-mission-policies-wrapper"] }
    ],
    sections: [
      { id: "section-hero", name: "Hero slider banner", selector: ".omegaxl-home-hero-section-wrapper", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-bundles", name: "Bundles Savings", selector: "#oxl-product-slider-1", style: "light", blocks: ["carousel-product"], defaultContent: [".omegaxl-shop-all-products-heading-wrapper"] },
      { id: "section-antinol", name: "Antinol partner promo banner", selector: "#main-static-banner", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-shop-all", name: "Shop All products", selector: "#oxl-product-slider-2", style: "light", blocks: ["carousel-product"], defaultContent: [".omegaxl-shop-all-products-heading-wrapper"] },
      { id: "section-benefits", name: "OmegaXL Packed With Benefits", selector: ".omegaxl-benefits-section-wrapper", style: "light", blocks: ["cards-benefit"], defaultContent: [".omegaxl-benefits-heading", ".omegaxl-benefits-button-wrapper"] },
      { id: "section-difference", name: "The OmegaXL Difference", selector: ".omegaxl-difference-section-wrapper", style: "light", blocks: ["table-compare"], defaultContent: [".omegaxl-difference-heading", ".omegaxl-difference-button-wrapper"] },
      { id: "section-reviews", name: "OmegaXL Over 20,000+ Five Star Reviews", selector: ".omegaxl-testimonials-section-wrapper", style: "light", blocks: ["cards-testimonial"], defaultContent: [".omegaxl-testimonials-heading-wrapper"] },
      { id: "section-video", name: "Main brand video", selector: ".omegaxl-main-video-section-wrapper", style: null, blocks: ["embed-video"], defaultContent: [] },
      { id: "section-quote", name: "Founder quote", selector: ".omegaxl-quote-home-section-wrapper", style: null, blocks: ["quote-founder"], defaultContent: [] },
      { id: "section-mission", name: "Our Mission - ratings and policies", selector: ".omegaxl-our-mission-section-wrapper", style: "accent", blocks: ["columns-rating", "cards-policy"], defaultContent: [".omegaxl-our-mission-logo-heading-wrapper"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
