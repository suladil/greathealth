/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-video.
 * Base block: embed
 * Source: https://www.omegaxl.com/ (section "Main brand video", .omegaxl-main-video-content-wrapper)
 * Generated: 2026-06-09.
 *
 * Project type: xwalk — field hints emitted per hinting rules.
 * Block library structure (embed): 1 column, 2 rows.
 *   Row 1: block name "Embed"
 *   Row 2: video URL as a plain anchor link (field: embed_uri).
 *          Optional poster image (field: embed_placeholder) would be placed
 *          above the link, but this source has no poster image.
 *
 * The source embeds a Vimeo player iframe; the iframe src is a player.vimeo.com
 * URL with query params. We extract the numeric video id and produce a clean
 * https://vimeo.com/VIDEOID anchor matching the block library example.
 */
export default function parse(element, { document }) {
  // Locate the embedded player iframe (validated against source.html).
  const iframe = element.querySelector(
    'iframe.omegaxl-main-video-frame, iframe[src*="vimeo"], iframe[src*="youtube"], iframe[src]',
  );

  const rawSrc = iframe ? iframe.getAttribute('src') || '' : '';

  // Normalize the embed src into a canonical share URL.
  let videoUrl = rawSrc;
  if (rawSrc) {
    const vimeoMatch = rawSrc.match(/player\.vimeo\.com\/video\/(\d+)/);
    const youtubeMatch = rawSrc.match(/youtube\.com\/embed\/([\w-]+)/);
    if (vimeoMatch) {
      videoUrl = `https://vimeo.com/${vimeoMatch[1]}`;
    } else if (youtubeMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
    } else {
      // Strip query string for any other provider so the link is clean.
      videoUrl = rawSrc.split('?')[0];
    }
  }

  const cells = [];

  // Row 2: the video link. Field hint required for xwalk content cells.
  const uriCell = document.createDocumentFragment();
  uriCell.appendChild(document.createComment(' field:embed_uri '));
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    uriCell.appendChild(link);
  }
  cells.push([uriCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
