import type { OpenSlideConfig } from '@open-slide/core';

// Same layout as the dev server: a deck browser at "/" and the full slide UI.
// Editing tools only appear in dev, so the built site stays read-only.
const config: OpenSlideConfig = {
  build: { showSlideBrowser: true, showSlideUi: true, allowHtmlDownload: true },
};

export default config;
