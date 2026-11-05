import type { OpenSlideConfig } from '@open-slide/core';

// The public site is a read-only player: no slide browser, no editing UI, no HTML download.
const config: OpenSlideConfig = {
  build: { showSlideBrowser: false, showSlideUi: false, allowHtmlDownload: false },
};

export default config;
