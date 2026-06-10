/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: OmegaXL section boundaries + section metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections and, for each
 * section (processed in reverse DOM order so insertions don't shift earlier ones):
 *   - inserts a Section Metadata block (style cell) when section.style is set;
 *   - inserts an <hr> section break before the section when it is not the first
 *     section and there is content before it.
 *
 * Section selectors are sourced from page-templates.json and were verified against
 * migration-work/cleaned.html (hero, oxl-product-slider-1/2, main-static-banner,
 * benefits/difference/testimonials/main-video/quote-home/our-mission wrappers).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;


  const sections = payload && payload.template && payload.template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the DOM node that anchors each section, in document order.
  const resolved = sections
    .map((section) => {
      const anchor = section.selector ? element.querySelector(section.selector) : null;
      return anchor ? { section, anchor } : null;
    })
    .filter(Boolean);

  // Process in reverse so DOM insertions don't invalidate earlier anchors.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, anchor } = resolved[i];

    // Section Metadata block placed after the section content (when style set).
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(block);
    }

    // Section break before every non-first section.
    // Anchors live at heterogeneous nesting depths and some are the first child
    // of their wrapper, so a plain previousElementSibling check would miss them.
    // Walk up to the highest ancestor (still inside `element`) that has a
    // previous sibling and insert the <hr> there — the true boundary between
    // this section and the preceding one.
    if (i > 0) {
      let boundary = anchor;
      while (
        boundary.parentElement
        && boundary.parentElement !== element
        && !boundary.previousElementSibling
      ) {
        boundary = boundary.parentElement;
      }
      const hr = doc.createElement('hr');
      boundary.before(hr);
    }
  }
}
