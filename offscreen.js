chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target !== 'offscreen') return;

  if (message.action === 'parseChapterHtml') {
    const result = parseChapterContent(message.html, message.platform, message.url);
    sendResponse(result);
    return true;
  }
});

function parseChapterContent(html, platform, url) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let title = '';
    let content = '';

    switch (platform) {
      case 'ao3':
        title = extractAO3Title(doc);
        content = extractAO3Content(doc);
        break;
      case 'scribblehub':
        title = extractScribbleHubTitle(doc);
        content = extractScribbleHubContent(doc);
        break;
      case 'wattpad':
        title = extractWattpadTitle(doc);
        content = extractWattpadContent(doc);
        break;
      default:
        return { success: false, error: 'Unknown platform' };
    }

    if (!content) {
      return { success: false, error: 'Could not extract chapter content' };
    }

    return {
      success: true,
      title: title || 'Untitled Chapter',
      content: content
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function extractAO3Title(doc) {
  const chapterTitle = doc.querySelector('.chapter.preface.group h3.title');
  if (chapterTitle) {
    return chapterTitle.textContent.trim();
  }
  const workTitle = doc.querySelector('h2.title.heading');
  if (workTitle) {
    return workTitle.textContent.trim();
  }
  return '';
}

function extractAO3Content(doc) {
  const container =
    doc.querySelector('#chapters .userstuff.module[role="article"]') ||
    doc.querySelector('.userstuff.module[role="article"]') ||
    doc.querySelector('#chapters .chapter .userstuff.module') ||
    doc.querySelector('#chapters > .userstuff') ||
    doc.querySelector('#workskin div.userstuff.module') ||
    doc.querySelector('#workskin > div.userstuff');

  if (!container) return '';

  const clone = container.cloneNode(true);
  clone.querySelectorAll('h3.landmark, .landmark').forEach(el => el.remove());
  return clone.innerHTML;
}

function extractScribbleHubTitle(doc) {
  const chapterTitle = doc.querySelector('.chapter-title');
  if (chapterTitle) {
    return chapterTitle.textContent.trim();
  }
  return '';
}

function extractScribbleHubContent(doc) {
  let content = doc.querySelector('#chp_raw');
  if (content) {
    return content.innerHTML;
  }
  content = doc.querySelector('.chp_raw');
  if (content) {
    return content.innerHTML;
  }
  return '';
}

function extractWattpadTitle(doc) {
  const header = doc.querySelector('header.panel-reading h1, .story-part-info h2');
  if (header) {
    return header.textContent.trim();
  }
  return '';
}

function extractWattpadContent(doc) {
  const preContent = doc.querySelector('.panel-reading pre');
  if (preContent) {
    return preContent.innerHTML;
  }
  const storyPart = doc.querySelector('[data-page-number] pre, .part-content pre');
  if (storyPart) {
    return storyPart.innerHTML;
  }
  return '';
}
