function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function navigateToWattpadMyworks(storyId) {
  console.log(`Navigating to Wattpad myworks for story ${storyId}`);
  
  const targetUrl = `https://www.wattpad.com/myworks/${storyId}`;
  
  if (window.location.href !== targetUrl) {
    console.log(`Current URL: ${window.location.href}`);
    console.log(`Target URL: ${targetUrl}`);
    
    window.location.href = targetUrl;
    
    await new Promise(resolve => {
      const checkNavigation = () => {
        if (window.location.href === targetUrl) {
          resolve();
        } else {
          setTimeout(checkNavigation, 100);
        }
      };
      checkNavigation();
    });
    
    await waitForElement('#app-container', 3000);
    await waitForElement('.table-of-contents', 3000);
    await delay(500);
  }
  
  console.log("Successfully navigated to Wattpad myworks page");
  return true;
}

async function clickNewPartButton() {
  console.log("Looking for New Part button...");
  
  try {
    console.log("Switching to Table of Contents tab...");
    const tocTab = await waitForElement('button.on-switch-type[data-section="toc"]', 3000);
    
    if (!tocTab.classList.contains('active')) {
      console.log("Clicking Table of Contents tab...");
      tocTab.click();
      await delay(500);
    }
    
    await waitForElement('.table-of-contents .works-item-toc', 5000);
    const newPartButton = await waitForElement('.table-of-contents .works-item-toc button.btn.btn-orange.on-new-part', 5000);
    
    console.log("Found New Part button, verifying it's clickable...");
    
    await new Promise(resolve => {
      const checkClickable = () => {
        if (newPartButton.offsetParent !== null && !newPartButton.disabled) {
          resolve();
        } else {
          setTimeout(checkClickable, 100);
        }
      };
      checkClickable();
    });
    
    console.log("New Part button is ready, clicking...");
    
    newPartButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(300);
    
    const currentUrl = window.location.href;
    console.log("Current URL before click:", currentUrl);
    
    newPartButton.focus();
    await delay(100);
    
    
    newPartButton.click();
    await delay(100);
    
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      newPartButton.dispatchEvent(new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1
      }));
    });
    await delay(100);
    
    if (window.jQuery && window.jQuery(newPartButton).length) {
      console.log("Triggering jQuery click...");
      window.jQuery(newPartButton).trigger('click');
    }
    await delay(100);
    
    if (newPartButton.onclick) {
      console.log("Calling onclick handler directly...");
      newPartButton.onclick.call(newPartButton);
    }
    
    console.log("Button clicks executed, waiting for navigation...");
    
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkNavigation = () => {
        attempts++;
        const newUrl = window.location.href;
        console.log(`Navigation check ${attempts}: ${newUrl}`);
        
        if (newUrl !== currentUrl && newUrl.includes('/write/')) {
          console.log("Successfully navigated to editor page!");
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error("Navigation timeout - button click may not have worked");
          reject(new Error("Navigation to editor page did not occur after clicking New Part button"));
        } else {
          setTimeout(checkNavigation, 200);
        }
      };
      
      setTimeout(checkNavigation, 300);
    });
    
    await delay(1000);
    
    console.log("Successfully clicked New Part button and navigated to editor");
    return true;
  } catch (error) {
    console.error("Failed to find or click New Part button:", error);
    console.log("Current page HTML:", document.querySelector('.table-of-contents')?.innerHTML || 'No table-of-contents found');
    throw new Error("Could not find New Part button on Wattpad myworks page");
  }
}

async function fillChapterContent(chapterTitle, chapterContent) {
  console.log("Filling chapter content...");
  
  try {
    await delay(2000);
    
    console.log("Setting chapter title...");
    const titleElement = await waitForElement('#story-title', 5000);
    
    await delay(500);
    
    titleElement.textContent = chapterTitle;
    
    titleElement.dispatchEvent(new Event('input', { bubbles: true }));
    titleElement.dispatchEvent(new Event('change', { bubbles: true }));
    titleElement.dispatchEvent(new Event('keyup', { bubbles: true }));
    
    await delay(500);
    
    console.log("Setting chapter content...");
    const contentElement = await waitForElement('.story-editor.medium-editor-element', 5000);
    
    await delay(500);
    
    contentElement.innerHTML = '';
    
    const paragraphs = chapterContent.split('\n\n');
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim()) {
        const p = document.createElement('p');
        p.innerHTML = paragraph.trim().replace(/\n/g, '<br>');
        contentElement.appendChild(p);
      }
    });
    
    contentElement.dispatchEvent(new Event('input', { bubbles: true }));
    contentElement.dispatchEvent(new Event('change', { bubbles: true }));
    contentElement.dispatchEvent(new Event('keyup', { bubbles: true }));
    
    await delay(1000);
    
    console.log("Successfully filled chapter content");
    return true;
  } catch (error) {
    console.error("Failed to fill chapter content:", error);
    throw new Error("Could not fill chapter content in Wattpad editor");
  }
}

async function publishChapter() {
  console.log("Publishing chapter...");
  
  try {
    await delay(2000);
    
    console.log("Looking for first Publish button...");
    const firstPublishButton = await waitForElement('.button-container button:first-child', 5000);
    
    if (!firstPublishButton.textContent.includes('Publish')) {
      throw new Error("First button is not a Publish button");
    }
    
    await new Promise(resolve => {
      const checkClickable = () => {
        if (firstPublishButton.offsetParent !== null && !firstPublishButton.disabled) {
          resolve();
        } else {
          setTimeout(checkClickable, 200);
        }
      };
      checkClickable();
    });
    
    console.log("Clicking first Publish button...");
    firstPublishButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(500);
    firstPublishButton.click();
    
    await delay(2000);
    
    console.log("Looking for final Publish button...");
    const finalPublishButton = await waitForElement('.publish-footer button', 8000);
    
    await new Promise(resolve => {
      const checkClickable = () => {
        if (finalPublishButton.offsetParent !== null && !finalPublishButton.disabled) {
          resolve();
        } else {
          setTimeout(checkClickable, 200);
        }
      };
      checkClickable();
    });
    
    console.log("Clicking final Publish button...");
    finalPublishButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(500);
    
    const currentUrl = window.location.href;
    console.log("Current URL before final publish:", currentUrl);
    
    finalPublishButton.click();
    
    console.log("Final publish button clicked, waiting for navigation to published chapter page...");
    
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 40;
      
      const checkNavigation = () => {
        attempts++;
        const newUrl = window.location.href;
        console.log(`Publish navigation check ${attempts}: ${newUrl}`);
        
        const publishedPattern = /^https:\/\/www\.wattpad\.com\/\d+-/;
        if (publishedPattern.test(newUrl) && newUrl !== currentUrl) {
          console.log("Successfully navigated to published chapter page!");
          console.log("Published chapter URL:", newUrl);
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error("Publishing timeout - failed to reach published chapter URL");
          reject(new Error("Failed to navigate to published chapter page"));
        } else {
          setTimeout(checkNavigation, 200);
        }
      };
      
      setTimeout(checkNavigation, 500);
    });
    
    console.log("Successfully published chapter and confirmed final URL");
    return true;
  } catch (error) {
    console.error("Failed to publish chapter:", error);
    throw new Error("Could not publish chapter on Wattpad");
  }
}

async function saveAsDraft() {
  await delay(2000);
  const saveBtn = await waitForElement('button.secondary-variant__KvdoY', 5000);
  await new Promise(resolve => {
    const check = () => {
      if (saveBtn.offsetParent !== null && !saveBtn.disabled) resolve();
      else setTimeout(check, 200);
    };
    check();
  });
  saveBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await delay(300);
  saveBtn.click();
  await delay(2000);
  return true;
}

function fireReactOnChange(el, value) {
  const fiberKey = Object.keys(el).find(k =>
    k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance') || k.startsWith('__reactEventHandlers')
  );
  if (!fiberKey) return;
  try {
    let fiber = el[fiberKey];
    while (fiber) {
      const onChange = fiber.memoizedProps?.onChange;
      if (onChange) {
        if (value !== undefined) {
          const nativeSetter = el.tagName === 'SELECT'
            ? Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set
            : Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(el, value);
        }
        onChange({ target: el, currentTarget: el, type: 'change', preventDefault: () => {}, stopPropagation: () => {} });
        return;
      }
      fiber = fiber.return;
    }
  } catch (e) {}
}

function fireReactClick(el) {
  const fiberKey = Object.keys(el).find(k =>
    k.startsWith('__reactFiber') || k.startsWith('__reactInternalInstance') || k.startsWith('__reactEventHandlers')
  );
  if (fiberKey) {
    try {
      let fiber = el[fiberKey];
      while (fiber) {
        const onClick = fiber.memoizedProps?.onClick;
        if (onClick) {
          onClick({ type: 'click', bubbles: true, cancelable: true, target: el, currentTarget: el, preventDefault: () => {}, stopPropagation: () => {} });
          return true;
        }
        fiber = fiber.return;
      }
    } catch (e) {}
  }
  return false;
}

async function scheduleChapter(scheduleTimestamp) {
  await delay(2000);

  const firstPublishButton = await waitForElement('.button-container button:first-child', 5000);
  await new Promise(resolve => {
    const check = () => {
      if (firstPublishButton.offsetParent !== null && !firstPublishButton.disabled) resolve();
      else setTimeout(check, 200);
    };
    check();
  });
  firstPublishButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
  await delay(500);
  firstPublishButton.click();

  await delay(2000);
  await waitForElement('#publish-modal', 5000);

  const scheduleRadio = document.querySelector('input[name="publish_type"][value="1"]');
  if (scheduleRadio) {
    fireReactOnChange(scheduleRadio, '1');
    scheduleRadio.click();
    scheduleRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  await delay(1500);

  const d = new Date(scheduleTimestamp);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const totalMinutes = d.getHours() * 60 + d.getMinutes();
  const rounded = Math.round(totalMinutes / 15) * 15;
  const rHours = Math.floor(rounded / 60) % 24;
  const rMins = rounded % 60;
  const timeValue = `${String(rHours).padStart(2,'0')}:${String(rMins).padStart(2,'0')}:00`;

  const dateInput = document.querySelector('input.date-form-field[type="date"]');
  if (dateInput) {
    const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    nativeSetter.call(dateInput, dateStr);
    dateInput.dispatchEvent(new Event('input', { bubbles: true }));
    dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  await delay(1500);

  const timeSelect = document.querySelector('select.time-form-field');
  if (timeSelect) {
    const opts = Array.from(timeSelect.options).filter(o => !o.disabled && o.value);
    const chosen = opts.find(o => o.value === timeValue) || opts.find(o => o.value >= timeValue) || opts[0];
    if (chosen) {
      timeSelect.value = chosen.value;
      timeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  await delay(1500);

  const label = document.querySelector('label.schedule-confirm');
  const checkbox = document.querySelector('button.react-checkbox');

  if (label) fireReactClick(label);
  await delay(200);

  if (checkbox) fireReactClick(checkbox);
  await delay(200);

  if (label) {
    const rect = label.getBoundingClientRect();
    const evtOpts = { bubbles: true, cancelable: true, view: window, clientX: rect.left + 30, clientY: rect.top + rect.height / 2 };
    label.dispatchEvent(new MouseEvent('mousedown', evtOpts));
    await delay(40);
    label.dispatchEvent(new MouseEvent('mouseup', evtOpts));
    label.dispatchEvent(new MouseEvent('click', evtOpts));
  }
  await delay(200);

  if (checkbox) {
    checkbox.click();
    await delay(60);
    const rect = checkbox.getBoundingClientRect();
    const evtOpts = { bubbles: true, cancelable: true, view: window, clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 };
    checkbox.dispatchEvent(new MouseEvent('mousedown', evtOpts));
    await delay(40);
    checkbox.dispatchEvent(new MouseEvent('mouseup', evtOpts));
    checkbox.dispatchEvent(new MouseEvent('click', evtOpts));
  }
  await delay(200);

  if (window.jQuery) {
    if (checkbox) window.jQuery(checkbox).trigger('click');
    if (label) window.jQuery(label).trigger('click');
  }
  await delay(200);

  if (checkbox && checkbox.onclick) checkbox.onclick.call(checkbox);
  if (label && label.onclick) label.onclick.call(label);

  await delay(1000);

  let scheduleBtn = document.querySelector('.publish-footer button:not([disabled])');
  if (!scheduleBtn) {
    const disabledBtn = document.querySelector('.publish-footer button[disabled]');
    if (disabledBtn) {
      disabledBtn.removeAttribute('disabled');
      scheduleBtn = disabledBtn;
    }
  }

  if (scheduleBtn) {
    scheduleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(300);
    fireReactClick(scheduleBtn);
    await delay(100);
    scheduleBtn.click();
  }

  await delay(2000);
  return true;
}

async function postChapterToWattpad(storyId, chapterTitle, chapterContent, options = {}) {
  const mode = options.mode || 'publish';
  console.log(`Starting Wattpad chapter posting for story ${storyId}, mode: ${mode}`);

  try {
    await navigateToWattpadMyworks(storyId);
    await clickNewPartButton();
    await fillChapterContent(chapterTitle, chapterContent);

    if (mode === 'draft') {
      await saveAsDraft();
      return { success: true, message: "Chapter saved as draft on Wattpad" };
    } else if (mode === 'schedule') {
      await scheduleChapter(options.scheduleTimestamp);
      return { success: true, message: "Chapter scheduled on Wattpad" };
    } else {
      await publishChapter();
      return { success: true, message: "Chapter posted successfully" };
    }
  } catch (error) {
    console.error("Error posting to Wattpad:", error);
    return { success: false, error: error.message };
  }
}

if (typeof window !== 'undefined') {
  window.postChapterToWattpad = postChapterToWattpad;
}