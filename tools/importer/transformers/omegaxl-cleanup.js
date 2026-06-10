/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: OmegaXL site-wide cleanup.
 *
 * Removes non-authorable e-commerce / Magento(Hyva) chrome so the import contains
 * only page-level authorable content. Every selector below was verified against
 * migration-work/cleaned.html for https://www.omegaxl.com/.
 *
 * Verified source locations (line numbers in cleaned.html at time of authoring):
 *   - .uw-sl                 UserWay skip-link list                    (line 2)
 *   - .uwy / #userwayAccessibilityIcon / iframe.uwif  UserWay widget   (lines 37, 49, 62)
 *   - #tm-pdp-container      Truemed qualifier popup (hidden)          (line 79)
 *   - header.page-header     Sticky site header / nav / promo bar      (line 94)
 *   - #oxl-header-promo-default  Top promo bar (inside header)         (line 102)
 *   - #cart-drawer           Slide-out minicart / cart drawer          (line 609)
 *   - #authentication-popup  Login / auth modal                        (line 790)
 *   - footer.page-footer     Site footer                               (line 2595)
 *   - #cannellamedia, #batBeacon*, doubleclick/twitter/havasedge/bing
 *     tracking pixels + chat launcher iframe                           (lines 2844-2868)
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / popups / widgets that block or pollute block parsing.
    WebImporter.DOMUtils.remove(element, [
      '.uw-sl',                    // UserWay accessibility skip-link list
      '.uwy',                      // UserWay widget container
      '#userwayAccessibilityIcon', // UserWay icon button
      '#userwayLstIcon',           // UserWay translations icon
      'iframe.uwif',               // UserWay menu iframe
      '#tm-pdp-container',         // Truemed qualifier popup (hidden)
      '#authentication-popup',     // Login / auth modal
      '#cart-drawer',              // Slide-out minicart / cart drawer
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site shell: header (with nav + top promo bar), footer,
    // tracking pixels, beacons, and the chat launcher iframe.
    WebImporter.DOMUtils.remove(element, [
      'header.page-header',            // Sticky site header / nav
      '#oxl-header-promo-default',     // Top promo bar (defensive; lives in header)
      'footer.page-footer',            // Site footer
      // Tracking pixels / beacons / sync iframes appended after the footer.
      '#cannellamedia',
      '#batBeacon240810739615',
      '#batBeacon416992444483',
      'iframe[src*="doubleclick.net"]',
      'iframe[src*="cookie.havasedge.com"]',
      'iframe[src="about:blank"]',
      'iframe#launcher',               // Chat widget launcher
      'img[src*="analytics.twitter.com"]',
      'img[src*="t.co/1/i/adsct"]',
      'img[src*="event.havasedge.com"]',
      'img[src*="bat.bing.com"]',
      // Safe leftover non-content elements.
      'link',
      'noscript',
      'style',
    ]);
  }
}
