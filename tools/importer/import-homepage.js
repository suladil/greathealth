/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import carouselProductParser from './parsers/carousel-product.js';
import cardsBenefitParser from './parsers/cards-benefit.js';
import tableCompareParser from './parsers/table-compare.js';
import cardsTestimonialParser from './parsers/cards-testimonial.js';
import embedVideoParser from './parsers/embed-video.js';
import quoteFounderParser from './parsers/quote-founder.js';
import columnsRatingParser from './parsers/columns-rating.js';
import cardsPolicyParser from './parsers/cards-policy.js';

import cleanupTransformer from './transformers/omegaxl-cleanup.js';
import sectionsTransformer from './transformers/omegaxl-sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'carousel-product': carouselProductParser,
  'cards-benefit': cardsBenefitParser,
  'table-compare': tableCompareParser,
  'cards-testimonial': cardsTestimonialParser,
  'embed-video': embedVideoParser,
  'quote-founder': quoteFounderParser,
  'columns-rating': columnsRatingParser,
  'cards-policy': cardsPolicyParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage template for OmegaXL website',
  urls: ['https://www.omegaxl.com/'],
  blocks: [
    { name: 'hero-banner', instances: ['.omegaxl-home-hero-section-wrapper', '#main-static-banner'] },
    { name: 'carousel-product', instances: ['#oxl-product-slider-1', '#oxl-product-slider-2'] },
    { name: 'cards-benefit', instances: ['.omegaxl-benefits-list-grid-wrapper'] },
    { name: 'table-compare', instances: ['.omegaxl-difference-content-table-wrapper'] },
    { name: 'cards-testimonial', instances: ['.omegaxl-testimonials-grid-wrapper'] },
    { name: 'embed-video', instances: ['.omegaxl-main-video-content-wrapper'] },
    { name: 'quote-founder', instances: ['.omegaxl-quote-block-home-content-wrapper'] },
    { name: 'columns-rating', instances: ['.omegaxl-our-mission-ratings-wrapper'] },
    { name: 'cards-policy', instances: ['.omegaxl-our-mission-policies-wrapper'] },
  ],
  sections: [
    { id: 'section-hero', name: 'Hero slider banner', selector: '.omegaxl-home-hero-section-wrapper', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-bundles', name: 'Bundles Savings', selector: '#oxl-product-slider-1', style: 'light', blocks: ['carousel-product'], defaultContent: ['.omegaxl-shop-all-products-heading-wrapper'] },
    { id: 'section-antinol', name: 'Antinol partner promo banner', selector: '#main-static-banner', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-shop-all', name: 'Shop All products', selector: '#oxl-product-slider-2', style: 'light', blocks: ['carousel-product'], defaultContent: ['.omegaxl-shop-all-products-heading-wrapper'] },
    { id: 'section-benefits', name: 'OmegaXL Packed With Benefits', selector: '.omegaxl-benefits-section-wrapper', style: 'light', blocks: ['cards-benefit'], defaultContent: ['.omegaxl-benefits-heading', '.omegaxl-benefits-button-wrapper'] },
    { id: 'section-difference', name: 'The OmegaXL Difference', selector: '.omegaxl-difference-section-wrapper', style: 'light', blocks: ['table-compare'], defaultContent: ['.omegaxl-difference-heading', '.omegaxl-difference-button-wrapper'] },
    { id: 'section-reviews', name: 'OmegaXL Over 20,000+ Five Star Reviews', selector: '.omegaxl-testimonials-section-wrapper', style: 'light', blocks: ['cards-testimonial'], defaultContent: ['.omegaxl-testimonials-heading-wrapper'] },
    { id: 'section-video', name: 'Main brand video', selector: '.omegaxl-main-video-section-wrapper', style: null, blocks: ['embed-video'], defaultContent: [] },
    { id: 'section-quote', name: 'Founder quote', selector: '.omegaxl-quote-home-section-wrapper', style: null, blocks: ['quote-founder'], defaultContent: [] },
    { id: 'section-mission', name: 'Our Mission - ratings and policies', selector: '.omegaxl-our-mission-section-wrapper', style: 'accent', blocks: ['columns-rating', 'cards-policy'], defaultContent: ['.omegaxl-our-mission-logo-heading-wrapper'] },
  ],
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
