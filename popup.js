(function() {
  const noop = function() {};
  const originalConsole = console;
  
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;
  const originalDebug = console.debug;
  
  console.log = noop;
  console.error = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;
  
  console.enableLogging = function() {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    console.info = originalInfo;
    console.debug = originalDebug;
  };
})();

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded");
  
  initializeTheme();
  
  class ToastManager {
    constructor() {
      this.container = document.getElementById('toastContainer');
      this.toasts = new Map();
      this.toastCounter = 0;
    }
    
    show(type, title, message, duration = 5000) {
      const toastId = `toast-${++this.toastCounter}`;
      
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };
      
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.id = toastId;
      
      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || 'ℹ'}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" type="button">×</button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
      `;
      
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(toastId));
      
      this.container.appendChild(toast);
      this.toasts.set(toastId, toast);
      
      if (duration > 0) {
        setTimeout(() => this.hide(toastId), duration);
      }
      
      return toastId;
    }
    
    hide(toastId) {
      const toast = this.toasts.get(toastId);
      if (!toast) return;
      
      toast.style.animation = 'toastSlideOut 0.3s ease forwards';
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts.delete(toastId);
      }, 300);
    }
    
    success(title, message, duration) {
      return this.show('success', title, message, duration);
    }
    
    error(title, message, duration = 8000) {
      return this.show('error', title, message, duration);
    }
    
    warning(title, message, duration = 6000) {
      return this.show('warning', title, message, duration);
    }
    
    info(title, message, duration) {
      return this.show('info', title, message, duration);
    }
    
    clear() {
      this.toasts.forEach((toast, id) => this.hide(id));
    }
  }
  
  const toast = new ToastManager();
  
  
  window.showToast = toast;
  
  class FormValidator {
    constructor() {
      this.validators = new Map();
      this.validationResults = new Map();
    }
    
    addField(fieldId, validators) {
      const field = document.getElementById(fieldId);
      if (!field) return;
      
      this.validators.set(fieldId, validators);
      this.setupFieldValidation(field, validators);
    }
    
    setupFieldValidation(field, validators) {
      const fieldId = field.id;
      
      const inputGroup = field.closest('.input-group');
      
      if (inputGroup && !inputGroup.querySelector('.field-error')) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'field-error';
        inputGroup.appendChild(errorMsg);
      }
      
      field.addEventListener('input', () => this.validateField(fieldId));
      field.addEventListener('blur', () => this.validateField(fieldId));
    }
    
    validateField(fieldId) {
      const field = document.getElementById(fieldId);
      const validators = this.validators.get(fieldId);
      if (!field || !validators) return true;
      
      const value = field.value.trim();
      const inputGroup = field.closest('.input-group');
      const errorMsg = inputGroup?.querySelector('.field-error');
      
      field.classList.remove('error', 'success');
      errorMsg?.classList.remove('show');
      
      for (const validator of validators) {
        const result = validator(value, field);
        if (!result.isValid) {
          field.classList.add('error');
          if (errorMsg) {
            errorMsg.textContent = result.message;
            errorMsg.classList.add('show');
          }
          this.validationResults.set(fieldId, false);
          return false;
        }
      }
      
      field.classList.add('success');
      
      this.validationResults.set(fieldId, true);
      return true;
    }
    
    validateAll() {
      let allValid = true;
      for (const fieldId of this.validators.keys()) {
        if (!this.validateField(fieldId)) {
          allValid = false;
        }
      }
      return allValid;
    }
    
    isFieldValid(fieldId) {
      return this.validationResults.get(fieldId) === true;
    }
  }
  
  const validator = new FormValidator();
  
  validator.addField('startChapter', [
    (value) => {
      if (!value) return { isValid: false, message: 'Start chapter is required' };
      const num = parseInt(value);
      if (isNaN(num)) return { isValid: false, message: 'Must be a valid number' };
      if (num < 1) return { isValid: false, message: 'Must be at least 1' };
      if (num > 10000) return { isValid: false, message: 'Must be 10,000 or less' };
      return { isValid: true };
    }
  ]);
  
  validator.addField('endChapter', [
    (value) => {
      if (!value) return { isValid: false, message: 'End chapter is required' };
      const num = parseInt(value);
      if (isNaN(num)) return { isValid: false, message: 'Must be a valid number' };
      if (num < 1) return { isValid: false, message: 'Must be at least 1' };
      if (num > 10000) return { isValid: false, message: 'Must be 10,000 or less' };
      
      const startChapter = document.getElementById('startChapter');
      if (startChapter && startChapter.value) {
        const startNum = parseInt(startChapter.value);
        if (!isNaN(startNum) && num < startNum) {
          return { isValid: false, message: 'Must be greater than or equal to start chapter' };
        }
      }
      
      return { isValid: true };
    }
  ]);
  
  const storyIdFields = ['scribblehubStoryId', 'fanfictionStoryId', 'ao3WorkId', 'royalroadWorkId', 'webnovelStoryId', 'wattpadStoryId', 'tapasStoryId'];
  storyIdFields.forEach(fieldId => {
    validator.addField(fieldId, [
      (value, field) => {
        const platform = field.closest('.platform-box');
        const enabledToggle = platform?.querySelector('input[type="checkbox"]');
        
        if (enabledToggle && enabledToggle.checked) {
          if (!value) return { isValid: false, message: 'Story/Work ID is required when platform is enabled' };
          if (value.length < 2) return { isValid: false, message: 'ID seems too short' };
          if (!/^[a-zA-Z0-9_-]+$/.test(value)) return { isValid: false, message: 'ID contains invalid characters' };
        }
        
        return { isValid: true };
      }
    ]);
  });
  
  const ALL_FEATURES = {
    chaptersPerDay: -1,  
    batchSize: 10,       
    platforms: ['scribblehub', 'fanfiction', 'ao3', 'royalroad', 'webnovel', 'wattpad', 'inkitt', 'tapas']
  };
  
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const scanCurrentTabBtn = document.getElementById('scanCurrentTabBtn');
  const stopSyncBtn = document.getElementById('stopSyncBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const startChapterInput = document.getElementById('startChapter');
  const endChapterInput = document.getElementById('endChapter');
  const progressBar = document.getElementById('progressBar');
  const pendingCountEl = document.getElementById('pendingCount');
  const completedCountEl = document.getElementById('completedCount');
  const failedCountEl = document.getElementById('failedCount');
  const syncLogEl = document.getElementById('syncLog');
  const batchSizeSelect = document.getElementById('batchSizeSelect');
  const chapterTitleFormat = document.getElementById('chapterTitleFormat');
  const retryFailedBtn = document.getElementById('retryFailedBtn');
  const settingsToggle = document.getElementById('settingsToggle');
  const advancedSettings = document.getElementById('advancedSettings');
  
  
  
  const platforms = [
    {
      name: 'scribblehub',
      enabledToggle: document.getElementById('scribblehubEnabled'),
      detailsEl: document.getElementById('scribblehubDetails'),
      storyIdInput: document.getElementById('scribblehubStoryId'),
      lastChapterInput: document.getElementById('scribblehubLastChapter'),
      statusEl: document.getElementById('scribblehubStatus'),
      novelNameEl: document.getElementById('scribblehubNovelName'),
      novelSelectEl: document.getElementById('scribblehubNovelSelect')
    },
    {
      name: 'fanfiction',
      enabledToggle: document.getElementById('fanfictionEnabled'),
      detailsEl: document.getElementById('fanfictionDetails'),
      storyIdInput: document.getElementById('fanfictionStoryId'),
      lastChapterInput: document.getElementById('fanfictionLastChapter'),
      statusEl: document.getElementById('fanfictionStatus'),
      novelNameEl: document.getElementById('fanfictionNovelName'),
      novelSelectEl: document.getElementById('fanfictionNovelSelect')
    },
    {
      name: 'ao3',
      enabledToggle: document.getElementById('ao3Enabled'),
      detailsEl: document.getElementById('ao3Details'),
      storyIdInput: document.getElementById('ao3WorkId'),
      lastChapterInput: document.getElementById('ao3LastChapter'),
      statusEl: document.getElementById('ao3Status'),
      novelNameEl: document.getElementById('ao3NovelName'),
      novelSelectEl: document.getElementById('ao3NovelSelect')
    },
    {
      name: 'royalroad',
      enabledToggle: document.getElementById('royalroadEnabled'),
      detailsEl: document.getElementById('royalroadDetails'),
      storyIdInput: document.getElementById('royalroadWorkId'),
      lastChapterInput: document.getElementById('royalroadLastChapter'),
      statusEl: document.getElementById('royalroadStatus'),
      novelNameEl: document.getElementById('royalroadNovelName'),
      novelSelectEl: document.getElementById('royalroadNovelSelect')
    },
    {
      name: 'webnovel',
      enabledToggle: document.getElementById('webnovelEnabled'),
      detailsEl: document.getElementById('webnovelDetails'),
      storyIdInput: document.getElementById('webnovelStoryId'),
      lastChapterInput: document.getElementById('webnovelLastChapter'),
      statusEl: document.getElementById('webnovelStatus'),
      novelNameEl: document.getElementById('webnovelNovelName'),
      novelSelectEl: document.getElementById('webnovelNovelSelect')
    },
    {
      name: 'wattpad',
      enabledToggle: document.getElementById('wattpadEnabled'),
      detailsEl: document.getElementById('wattpadDetails'),
      storyIdInput: document.getElementById('wattpadStoryId'),
      lastChapterInput: document.getElementById('wattpadLastChapter'),
      statusEl: document.getElementById('wattpadStatus'),
      novelNameEl: document.getElementById('wattpadNovelName'),
      novelSelectEl: document.getElementById('wattpadNovelSelect')
    },
    {
      name: 'inkitt',
      enabledToggle: document.getElementById('inkittEnabled'),
      detailsEl: document.getElementById('inkittDetails'),
      storyIdInput: document.getElementById('inkittStoryId'),
      lastChapterInput: document.getElementById('inkittLastChapter'),
      statusEl: document.getElementById('inkittStatus'),
      novelNameEl: document.getElementById('inkittNovelName'),
      novelSelectEl: document.getElementById('inkittNovelSelect')
    },
    {
      name: 'tapas',
      enabledToggle: document.getElementById('tapasEnabled'),
      detailsEl: document.getElementById('tapasDetails'),
      storyIdInput: document.getElementById('tapasStoryId'),
      lastChapterInput: document.getElementById('tapasLastChapter'),
      statusEl: document.getElementById('tapasStatus'),
      novelNameEl: document.getElementById('tapasNovelName'),
      novelSelectEl: document.getElementById('tapasNovelSelect')
    }
  ];
  
  function sendMessageToBackground(message) {
    console.log("Sending message to background:", message);
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, response => {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
            return;
          }
          
          if (!response) {
            console.error('No response received from background script');
            reject(new Error('No response from background script'));
            return;
          }
          
          console.log(`Response received for ${message.action}:`, response);
          resolve(response);
        });
      } catch (error) {
        console.error('Error sending message:', error);
        reject(error);
      }
    });
  }
  
  async function retryFailedChapters() {
    try {
      const enabledPlatforms = platforms
        .filter(p => p.enabledToggle && p.enabledToggle.checked)
        .map(p => p.name);
      
      
      statusText.textContent = 'Retrying failed chapters...';
      statusIndicator.className = 'status-indicator syncing';
      retryFailedBtn.disabled = true;
      stopSyncBtn.disabled = false;
      
      let batchSize = batchSizeSelect ? parseInt(batchSizeSelect.value) : 1;
      
      
      const result = await sendMessageToBackground({
        action: 'retryFailedChapters',
        batchSize: batchSize
      });
      
      if (result.success) {
        statusText.textContent = `Retry complete: ${result.completedCount} succeeded, ${result.failedCount} failed`;
        if (result.failedCount > 0) {
          statusIndicator.className = 'status-indicator error';
          toast.warning('Retry Completed', `${result.completedCount} chapters succeeded, ${result.failedCount} still failed.`);
        } else {
          statusIndicator.className = 'status-indicator active';
          toast.success('Retry Successful', `All ${result.completedCount} failed chapters were successfully retried.`);
        }
      } else {
        console.error('Error retrying chapters:', result.error);
        
        toast.error('Retry Failed', result.error);
        statusText.textContent = `Error: ${result.error}`;
        
        statusIndicator.className = 'status-indicator error';
      }
      
      if (result.failedCount > 0) {
        retryFailedBtn.disabled = false;
      }
      
      stopSyncBtn.disabled = true;
    } catch (error) {
      console.error('Error retrying failed chapters:', error);
      
      toast.error('Communication Error', `Unable to communicate with background script: ${error.message}`);
      statusText.textContent = 'Communication error';
      
      statusIndicator.className = 'status-indicator error';
      retryFailedBtn.disabled = false;
      stopSyncBtn.disabled = true;
    }
  }
  


  async function checkSubscriptionStatus() {
    return {
      paid: true,
      email: 'free_user'
    };
  }


  window.addEventListener('focus', async function() {
    console.log('Window focused - checking status');
    
    await loadSettings();
    
  });
  (async function() {
    await loadSettings();
  })();
  
  
  checkSyncStatus();
  
  const statusInterval = setInterval(checkSyncStatus, 2000);
  
  if (batchSizeSelect) {
    batchSizeSelect.addEventListener('change', async function() {
      const selectedBatchSize = parseInt(this.value);
      console.log(`Batch size changed to ${selectedBatchSize}`);
    });
  }
  
  if (chapterTitleFormat) {
    chapterTitleFormat.addEventListener('change', async function() {
      const selectedFormat = this.value;
      await chrome.storage.local.set({ chapterTitleFormat: selectedFormat });
      console.log(`Chapter title format set to: ${selectedFormat}`);
    });
  }
  
  if (settingsToggle && advancedSettings) {
    settingsToggle.addEventListener('click', function() {
      const isExpanded = advancedSettings.style.display !== 'none';
      
      if (isExpanded) {
        advancedSettings.style.display = 'none';
        settingsToggle.classList.remove('expanded');
      } else {
        advancedSettings.style.display = 'block';
        settingsToggle.classList.add('expanded');
      }
      
      chrome.storage.local.set({ advancedSettingsExpanded: !isExpanded });
    });
    
    chrome.storage.local.get(['advancedSettingsExpanded']).then(data => {
      if (data.advancedSettingsExpanded) {
        advancedSettings.style.display = 'block';
        settingsToggle.classList.add('expanded');
      }
    });
  }
  
  scanCurrentTabBtn.addEventListener('click', scanCurrentTab);
  stopSyncBtn.addEventListener('click', stopSync);
  retryFailedBtn.addEventListener('click', retryFailedChapters);

  function updateModeBadge(badgeId, mode) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    badge.className = 'mode-badge';
    const labels = { draft: 'Draft', schedule: 'Schedule', queue: 'Queue' };
    const classes = { draft: 'badge-draft', schedule: 'badge-schedule', queue: 'badge-queue' };
    if (labels[mode]) {
      badge.textContent = labels[mode];
      badge.classList.add(classes[mode]);
      badge.style.display = '';
    } else {
      badge.textContent = '';
      badge.style.display = 'none';
    }
  }

  function updateModeHint(hintId, mode) {
    const hint = document.getElementById(hintId);
    if (!hint) return;
    const hints = {
      queue: 'Extension opens a tab and posts at the scheduled time.',
      schedule: "Uses the platform's own scheduling tool.",
      draft: 'Saves without publishing, you publish manually.'
    };
    hint.textContent = hints[mode] || '';
    hint.style.display = hints[mode] ? '' : 'none';
  }

  async function updateQueueCounts() {
    const entries = [
      { key: 'scribblehubQueue', badgeId: 'scribblehubQueueCount' },
      { key: 'webnovelQueue',    badgeId: 'webnovelQueueCount' },
      { key: 'fanfictionQueue',  badgeId: 'fanfictionQueueCount' },
      { key: 'ao3Queue',         badgeId: 'ao3QueueCount' },
      { key: 'wattpadQueue',     badgeId: 'wattpadQueueCount' },
      { key: 'tapasQueue',       badgeId: 'tapasQueueCount' }
    ];
    const result = await chrome.storage.local.get(entries.map(e => e.key));
    for (const { key, badgeId } of entries) {
      const pending = (result[key] || []).filter(i => i.status === 'pending').length;
      const badge = document.getElementById(badgeId);
      if (!badge) continue;
      badge.textContent = pending > 0 ? `${pending} queued` : '';
      badge.style.display = pending > 0 ? '' : 'none';
    }
  }
  
  const autoSaveInputs = [
    'startChapter', 'endChapter', 'scribblehubStoryId', 'scribblehubLastChapter',
    'fanfictionStoryId', 'fanfictionLastChapter', 'ao3WorkId', 'ao3LastChapter',
    'royalroadWorkId', 'royalroadLastChapter', 'webnovelStoryId', 'webnovelLastChapter',
    'wattpadStoryId', 'wattpadLastChapter', 'tapasStoryId', 'tapasLastChapter',
    'scribblehubScheduleDate', 'scribblehubScheduleInterval', 'scribblehubScheduleTime',
    'scribblehubChaptersPerRelease', 'scribblehubMinutesBetweenChapters',
    'webnovelScheduleDate', 'webnovelScheduleInterval', 'webnovelScheduleTime',
    'fanfictionScheduleDate', 'fanfictionScheduleInterval', 'fanfictionScheduleTime',
    'ao3ScheduleDate', 'ao3ScheduleInterval', 'ao3ScheduleTime',
    'wattpadScheduleDate', 'wattpadScheduleInterval', 'wattpadScheduleTime',
    'tapasScheduleDate', 'tapasScheduleInterval', 'tapasScheduleTime'
  ];
  
  autoSaveInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('input', autoSave);
      input.addEventListener('change', autoSave);
    }
  });
  
  const autoSaveSelects = ['batchSizeSelect', 'scribblehubPostMode', 'webnovelPostMode', 'fanfictionPostMode', 'ao3PostMode', 'wattpadPostMode', 'inkittPostMode', 'tapasPostMode'];

  autoSaveSelects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.addEventListener('change', autoSave);
    }
  });
  
  platforms.forEach(platform => {
    if (platform.enabledToggle) {
      platform.enabledToggle.addEventListener('change', autoSave);
    }
  });
  
  
  
  
  
  
  platforms.forEach(platform => {
    if (platform.enabledToggle) {
      platform.enabledToggle.addEventListener('change', function() {
        togglePlatformDetails(platform.detailsEl, this.checked);

        if (platform.storyIdInput) {
          validator.validateField(platform.storyIdInput.id);
        }
      });
    }
  });

  const postModeSelect = document.getElementById('scribblehubPostMode');
  if (postModeSelect) {
    postModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('scribblehubScheduleOptions');
      if (schedOpts) schedOpts.style.display = (this.value === 'schedule' || this.value === 'queue') ? 'block' : 'none';
      updateModeBadge('scribblehubModeBadge', this.value);
      updateModeHint('scribblehubModeHint', this.value);
      autoSave();
    });
  }

  const webnovelPostModeSelect = document.getElementById('webnovelPostMode');
  if (webnovelPostModeSelect) {
    webnovelPostModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('webnovelScheduleOptions');
      if (schedOpts) schedOpts.style.display = (this.value === 'schedule' || this.value === 'queue') ? 'block' : 'none';
      updateModeBadge('webnovelModeBadge', this.value);
      updateModeHint('webnovelModeHint', this.value);
      autoSave();
    });
  }

  const fanfictionPostModeSelect = document.getElementById('fanfictionPostMode');
  if (fanfictionPostModeSelect) {
    fanfictionPostModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('fanfictionScheduleOptions');
      if (schedOpts) schedOpts.style.display = this.value === 'queue' ? 'block' : 'none';
      updateModeBadge('fanfictionModeBadge', this.value);
      updateModeHint('fanfictionModeHint', this.value);
      autoSave();
    });
  }

  const ao3PostModeSelect = document.getElementById('ao3PostMode');
  if (ao3PostModeSelect) {
    ao3PostModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('ao3ScheduleOptions');
      if (schedOpts) schedOpts.style.display = this.value === 'queue' ? 'block' : 'none';
      updateModeBadge('ao3ModeBadge', this.value);
      updateModeHint('ao3ModeHint', this.value);
      autoSave();
    });
  }

  const wattpadPostModeSelect = document.getElementById('wattpadPostMode');
  if (wattpadPostModeSelect) {
    wattpadPostModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('wattpadScheduleOptions');
      if (schedOpts) schedOpts.style.display = (this.value === 'schedule' || this.value === 'queue') ? 'block' : 'none';
      updateModeBadge('wattpadModeBadge', this.value);
      updateModeHint('wattpadModeHint', this.value);
      autoSave();
    });
  }

  const inkittPostModeSelect = document.getElementById('inkittPostMode');
  if (inkittPostModeSelect) {
    inkittPostModeSelect.addEventListener('change', function() {
      updateModeBadge('inkittModeBadge', this.value);
      updateModeHint('inkittModeHint', this.value);
      autoSave();
    });
  }

  const tapasPostModeSelect = document.getElementById('tapasPostMode');
  if (tapasPostModeSelect) {
    tapasPostModeSelect.addEventListener('change', function() {
      const schedOpts = document.getElementById('tapasScheduleOptions');
      if (schedOpts) schedOpts.style.display = this.value === 'queue' ? 'block' : 'none';
      updateModeBadge('tapasModeBadge', this.value);
      updateModeHint('tapasModeHint', this.value);
      autoSave();
    });
  }

  const advancedToggle = document.getElementById('scribblehubAdvancedToggle');
  if (advancedToggle) {
    advancedToggle.addEventListener('click', function() {
      const advOpts = document.getElementById('scribblehubAdvancedOptions');
      const isOpen = advOpts.style.display !== 'none';
      advOpts.style.display = isOpen ? 'none' : 'block';
      this.textContent = (isOpen ? '▶' : '▼') + ' Advanced scheduling';
    });
  }
  
  
  const platformSavedNovels = {};

  function populateNovelSelect(platform, savedNovels, currentId) {
    if (!platform.novelSelectEl) return;
    platform.novelSelectEl.innerHTML = '';
    savedNovels.forEach(novel => {
      const opt = document.createElement('option');
      opt.value = novel.id;
      opt.textContent = novel.name || novel.id;
      if (novel.id === currentId) opt.selected = true;
      platform.novelSelectEl.appendChild(opt);
    });
    const newOpt = document.createElement('option');
    newOpt.value = '__new__';
    newOpt.textContent = '+ Add new story';
    platform.novelSelectEl.appendChild(newOpt);
  }

  function showNovelSelect(platform) {
    if (!platform.novelSelectEl) return;
    platform.novelSelectEl.style.display = '';
    platform.storyIdInput.style.display = 'none';
    if (platform.novelNameEl) platform.novelNameEl.style.display = 'none';
  }

  function showNovelInput(platform) {
    if (!platform.novelSelectEl) return;
    platform.novelSelectEl.style.display = 'none';
    platform.storyIdInput.style.display = '';
  }

  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get(['platforms', 'batchSize', 'chapterTitleFormat', 'startChapter', 'endChapter']);
      
      console.log('LoadSettings - All features available');
      
      if (batchSizeSelect) {
        let savedBatchSize = data.batchSize || 1;
        batchSizeSelect.value = savedBatchSize;
        
        Array.from(batchSizeSelect.options).forEach(option => {
          option.disabled = false;
          option.text = option.text.replace(/ \(Upgrade Required\)$/, '');
        });
        
      }
      
      if (chapterTitleFormat) {
        const savedTitleFormat = data.chapterTitleFormat || 'with_number';
        chapterTitleFormat.value = savedTitleFormat;
      }
      
      if (startChapterInput && data.startChapter !== undefined) {
        startChapterInput.value = data.startChapter;
      }
      if (endChapterInput && data.endChapter !== undefined) {
        endChapterInput.value = data.endChapter;
      }
      
      platforms.forEach(platform => {
        if (platform.enabledToggle) {
          platform.enabledToggle.disabled = false;
          const header = platform.enabledToggle.closest('.platform-header');
          if (header) {
            const labels = header.querySelectorAll('.pro-label, .basic-label');
            labels.forEach(label => label.remove());
          }
        }
      });
      
      const platformConfig = data.platforms || {
        scribblehub: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        fanfiction: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        ao3: { enabled: false, workId: '', lastSyncedChapter: 0 },
        royalroad: { enabled: false, workId: '', lastSyncedChapter: 0 },
        webnovel: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        wattpad: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        inkitt: { enabled: false, storyId: '', lastSyncedChapter: 0 },
        tapas: { enabled: false, storyId: '', lastSyncedChapter: 0 }
      };
      
      platforms.forEach(platform => {
        const config = platformConfig[platform.name] || { enabled: false, storyId: '', lastSyncedChapter: 0 };
        if (platform.enabledToggle) platform.enabledToggle.checked = config.enabled;

        if (platform.name === 'ao3' || platform.name === 'royalroad') {
          if (platform.storyIdInput) platform.storyIdInput.value = config.workId || '';
        } else {
          if (platform.storyIdInput) platform.storyIdInput.value = config.storyId || '';
        }

        if (platform.lastChapterInput) platform.lastChapterInput.value = config.lastSyncedChapter || 0;
        if (platform.novelNameEl) {
          const name = config.novelName || '';
          platform.novelNameEl.textContent = name ? `📖 ${name}` : '';
          platform.novelNameEl.dataset.novelName = name;
          platform.novelNameEl.style.display = name ? '' : 'none';
        }

        const savedNovels = config.savedNovels || [];
        platformSavedNovels[platform.name] = savedNovels;
        const currentId = config.storyId || config.workId || '';
        if (savedNovels.length > 0 && platform.novelSelectEl) {
          populateNovelSelect(platform, savedNovels, currentId);
          showNovelSelect(platform);
        }

        if (platform.detailsEl && platform.enabledToggle) {
          togglePlatformDetails(platform.detailsEl, platform.enabledToggle.checked);
        }
      });

      const shConfig = platformConfig.scribblehub || {};
      const postModeEl = document.getElementById('scribblehubPostMode');
      if (postModeEl) postModeEl.value = shConfig.postMode || 'publish';
      const schedDateEl = document.getElementById('scribblehubScheduleDate');
      if (schedDateEl) schedDateEl.value = shConfig.scheduleDate || '';
      const schedIntervalEl = document.getElementById('scribblehubScheduleInterval');
      if (schedIntervalEl) schedIntervalEl.value = shConfig.scheduleIntervalDays || 1;
      const schedTimeEl = document.getElementById('scribblehubScheduleTime');
      if (schedTimeEl) schedTimeEl.value = shConfig.scheduleTime || '12:00';
      const schedOpts = document.getElementById('scribblehubScheduleOptions');
      if (schedOpts) schedOpts.style.display = (shConfig.postMode === 'schedule' || shConfig.postMode === 'queue') ? 'block' : 'none';
      const cprEl = document.getElementById('scribblehubChaptersPerRelease');
      if (cprEl) cprEl.value = shConfig.chaptersPerRelease || 1;
      const mbcEl = document.getElementById('scribblehubMinutesBetweenChapters');
      if (mbcEl) mbcEl.value = shConfig.minutesBetweenChapters || 1;
      if (shConfig.chaptersPerRelease > 1 || shConfig.minutesBetweenChapters > 1) {
        const advOpts = document.getElementById('scribblehubAdvancedOptions');
        const advToggle = document.getElementById('scribblehubAdvancedToggle');
        if (advOpts) advOpts.style.display = 'block';
        if (advToggle) advToggle.textContent = '▼ Advanced scheduling';
      }
      const wnConfig = platformConfig.webnovel || {};
      const wnPostModeEl = document.getElementById('webnovelPostMode');
      if (wnPostModeEl) wnPostModeEl.value = wnConfig.postMode || 'publish';
      const wnSchedDateEl = document.getElementById('webnovelScheduleDate');
      if (wnSchedDateEl) wnSchedDateEl.value = wnConfig.scheduleDate || '';
      const wnSchedIntervalEl = document.getElementById('webnovelScheduleInterval');
      if (wnSchedIntervalEl) wnSchedIntervalEl.value = wnConfig.scheduleIntervalDays || 1;
      const wnSchedTimeEl = document.getElementById('webnovelScheduleTime');
      if (wnSchedTimeEl) wnSchedTimeEl.value = wnConfig.scheduleTime || '12:00';
      const wnSchedOpts = document.getElementById('webnovelScheduleOptions');
      if (wnSchedOpts) wnSchedOpts.style.display = (wnConfig.postMode === 'schedule' || wnConfig.postMode === 'queue') ? 'block' : 'none';

      const ffConfig = platformConfig.fanfiction || {};
      const ffPostModeEl = document.getElementById('fanfictionPostMode');
      if (ffPostModeEl) ffPostModeEl.value = ffConfig.postMode || 'publish';
      const ffSchedDateEl = document.getElementById('fanfictionScheduleDate');
      if (ffSchedDateEl) ffSchedDateEl.value = ffConfig.scheduleDate || '';
      const ffSchedIntervalEl = document.getElementById('fanfictionScheduleInterval');
      if (ffSchedIntervalEl) ffSchedIntervalEl.value = ffConfig.scheduleIntervalDays || 1;
      const ffSchedTimeEl = document.getElementById('fanfictionScheduleTime');
      if (ffSchedTimeEl) ffSchedTimeEl.value = ffConfig.scheduleTime || '12:00';
      const ffSchedOpts = document.getElementById('fanfictionScheduleOptions');
      if (ffSchedOpts) ffSchedOpts.style.display = ffConfig.postMode === 'queue' ? 'block' : 'none';

      const ao3Config = platformConfig.ao3 || {};
      const ao3PostModeEl = document.getElementById('ao3PostMode');
      if (ao3PostModeEl) ao3PostModeEl.value = ao3Config.postMode || 'publish';
      const ao3SchedDateEl = document.getElementById('ao3ScheduleDate');
      if (ao3SchedDateEl) ao3SchedDateEl.value = ao3Config.scheduleDate || '';
      const ao3SchedIntervalEl = document.getElementById('ao3ScheduleInterval');
      if (ao3SchedIntervalEl) ao3SchedIntervalEl.value = ao3Config.scheduleIntervalDays || 1;
      const ao3SchedTimeEl = document.getElementById('ao3ScheduleTime');
      if (ao3SchedTimeEl) ao3SchedTimeEl.value = ao3Config.scheduleTime || '12:00';
      const ao3SchedOpts = document.getElementById('ao3ScheduleOptions');
      if (ao3SchedOpts) ao3SchedOpts.style.display = ao3Config.postMode === 'queue' ? 'block' : 'none';

      const wpConfig = platformConfig.wattpad || {};
      const wpPostModeEl = document.getElementById('wattpadPostMode');
      if (wpPostModeEl) wpPostModeEl.value = wpConfig.postMode || 'publish';
      const wpSchedDateEl = document.getElementById('wattpadScheduleDate');
      if (wpSchedDateEl) wpSchedDateEl.value = wpConfig.scheduleDate || '';
      const wpSchedIntervalEl = document.getElementById('wattpadScheduleInterval');
      if (wpSchedIntervalEl) wpSchedIntervalEl.value = wpConfig.scheduleIntervalDays || 1;
      const wpSchedTimeEl = document.getElementById('wattpadScheduleTime');
      if (wpSchedTimeEl) wpSchedTimeEl.value = wpConfig.scheduleTime || '12:00';
      const wpSchedOpts = document.getElementById('wattpadScheduleOptions');
      if (wpSchedOpts) wpSchedOpts.style.display = wpConfig.postMode === 'queue' ? 'block' : 'none';

      const inkConfig = platformConfig.inkitt || {};
      const inkPostModeEl = document.getElementById('inkittPostMode');
      if (inkPostModeEl) inkPostModeEl.value = inkConfig.postMode || 'publish';

      const tapasConfig = platformConfig.tapas || {};
      const tapasPostModeEl = document.getElementById('tapasPostMode');
      if (tapasPostModeEl) tapasPostModeEl.value = tapasConfig.postMode || 'publish';
      const tapasSchedDateEl = document.getElementById('tapasScheduleDate');
      if (tapasSchedDateEl) tapasSchedDateEl.value = tapasConfig.scheduleDate || '';
      const tapasSchedIntervalEl = document.getElementById('tapasScheduleInterval');
      if (tapasSchedIntervalEl) tapasSchedIntervalEl.value = tapasConfig.scheduleIntervalDays || 1;
      const tapasSchedTimeEl = document.getElementById('tapasScheduleTime');
      if (tapasSchedTimeEl) tapasSchedTimeEl.value = tapasConfig.scheduleTime || '12:00';
      const tapasSchedOpts = document.getElementById('tapasScheduleOptions');
      if (tapasSchedOpts) tapasSchedOpts.style.display = tapasConfig.postMode === 'queue' ? 'block' : 'none';

      const modeMap = {
        scribblehub: shConfig.postMode || 'publish',
        webnovel:    wnConfig.postMode || 'publish',
        fanfiction:  ffConfig.postMode || 'publish',
        ao3:         ao3Config.postMode || 'publish',
        wattpad:     wpConfig.postMode || 'publish',
        inkitt:      inkConfig.postMode || 'publish',
        tapas:       tapasConfig.postMode || 'publish'
      };
      for (const [p, mode] of Object.entries(modeMap)) {
        updateModeBadge(`${p}ModeBadge`, mode);
        updateModeHint(`${p}ModeHint`, mode);
      }
      updateQueueCounts();

    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  function togglePlatformDetails(element, isVisible) {
    if (!element) return;
    
    if (isVisible) {
      element.classList.add('visible');
    } else {
      element.classList.remove('visible');
    }
  }
  
  async function checkSyncStatus() {
    try {
      console.log("Checking sync status...");
      
      const storageData = await chrome.storage.local.get(['lastSyncLog']);
      console.log("Direct storage sync log:", storageData.lastSyncLog);
      
      const response = await sendMessageToBackground({ action: 'getStatus' });
      console.log("Received status response:", response);
      
      if (!response || !response.success) {
        console.error("Invalid status response:", response);
        if (storageData.lastSyncLog && storageData.lastSyncLog.length > 0) {
          console.log("Using fallback storage sync log");
          updateSyncLog(storageData.lastSyncLog);
        }
        return;
      }
      
      const statusData = response.status || {};
      console.log("Status data:", statusData);
      
      const isSyncing = statusData.isSyncing || false;
      const scanningPhase = statusData.scanningPhase || false;
      const postingPhase = statusData.postingPhase || false;
      const queueConfig = statusData.queueConfig || {};
      
      console.log("Queue config:", queueConfig);
      
      const totalChapters = queueConfig.totalChapters || 0;
      const completedChapters = queueConfig.completedChapters || 0;
      const failedChapters = queueConfig.failedChapters || 0;
      const scannedChapters = queueConfig.scannedChapters || 0;
      const pendingChapters = totalChapters - completedChapters - failedChapters;
      
      console.log(`Status: isSyncing=${isSyncing}, scanning=${scanningPhase}, posting=${postingPhase}`);
      console.log(`Chapters: total=${totalChapters}, completed=${completedChapters}, failed=${failedChapters}, scanned=${scannedChapters}`);
      
      statusIndicator.className = 'status-indicator';
      
      if (isSyncing) {
        scanCurrentTabBtn.disabled = true;
        stopSyncBtn.disabled = false;
        
        if (scanningPhase) {
          statusIndicator.classList.add('scanning');
          statusText.textContent = `Scanning chapters: ${scannedChapters}/${totalChapters}`;
        } else if (postingPhase) {
          statusIndicator.classList.add('syncing');
          const chaptersToPost = Math.max(scannedChapters, totalChapters);
          statusText.textContent = `Posting chapters: ${completedChapters + failedChapters}/${chaptersToPost}`;
        } else {
          statusIndicator.classList.add('syncing');
          statusText.textContent = 'Preparing sync...';
        }
      } else if (totalChapters > 0 && pendingChapters === 0) {
        if (failedChapters > 0) {
          statusIndicator.classList.add('error');
          statusText.textContent = `Sync completed with ${failedChapters} errors`;
        } else {
          statusIndicator.classList.add('active');
          statusText.textContent = 'Sync completed successfully';
          
        }
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      } else {
        statusIndicator.classList.add(totalChapters > 0 ? 'active' : '');
        statusText.textContent = totalChapters > 0 ? 'Ready to sync' : 'No sync queue';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
      
      retryFailedBtn.disabled = isSyncing || failedChapters === 0;
      
      pendingCountEl.textContent = pendingChapters;
      completedCountEl.textContent = completedChapters;
      failedCountEl.textContent = failedChapters;
      
      if (totalChapters > 0) {
        let progress;
        
        if (scanningPhase) {
          progress = Math.min((scannedChapters / totalChapters) * 100, 100);
        } else if (postingPhase) {
          const chaptersToPost = Math.max(scannedChapters, 1); 
          const processedChapters = completedChapters + failedChapters;
          progress = Math.min((processedChapters / chaptersToPost) * 100, 100);
        } else if (completedChapters + failedChapters > 0) {
          progress = 100;
        } else {
          progress = 0;
        }
        
        progress = Math.max(0, Math.min(100, progress || 0));
        
        console.log(`Progress bar: ${progress.toFixed(2)}% (scanning: ${scanningPhase}, posting: ${postingPhase}, scanned: ${scannedChapters}/${totalChapters}, posted: ${completedChapters + failedChapters})`);
        progressBar.style.width = `${progress}%`;
      } else {
        progressBar.style.width = '0%';
      }
      
      const responseSyncLog = statusData.lastSyncLog || [];
      const storageSyncLog = storageData.lastSyncLog || [];
      
      const syncLogToUse = storageSyncLog.length >= responseSyncLog.length ? storageSyncLog : responseSyncLog;
      
      console.log("Response sync log entries:", responseSyncLog.length);
      console.log("Storage sync log entries:", storageSyncLog.length);
      console.log("Using sync log with", syncLogToUse.length, "entries");
      
      updateSyncLog(syncLogToUse);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }
  
  function updateSyncLog(logEntries) {
    console.log(`Updating sync log with ${logEntries.length} entries`);
    
    if (!logEntries || logEntries.length === 0) {
      syncLogEl.innerHTML = '<div class="empty-log">No sync history yet</div>';
      return;
    }
    
    syncLogEl.innerHTML = '';
    
    logEntries.forEach((entry, index) => {
      console.log(`Processing log entry ${index}:`, entry);
      
      if (!entry || !entry.timestamp) {
        console.warn("Invalid log entry:", entry);
        return;
      }
      
      const logEntry = document.createElement('div');
      logEntry.className = 'log-entry';
      
      let timestamp;
      try {
        timestamp = new Date(entry.timestamp);
      } catch (e) {
        console.warn("Invalid timestamp:", entry.timestamp);
        timestamp = new Date();
      }
      
      const formattedTime = timestamp.toLocaleString();
      
      let platformsHtml = '';
      if (entry.results && Array.isArray(entry.results)) {
        entry.results.forEach(result => {
          if (!result) return;
          
          const statusClass = result.success ? 'log-success' : 'log-error';
          const statusText = result.success ? 'Success' : 'Failed';
          platformsHtml += `
            <div class="log-platform">
              <span class="${statusClass}">${result.platform || 'Unknown'}: ${statusText}</span>
              ${!result.success && result.message ? ` - ${result.message}` : ''}
            </div>
          `;
        });
      }
      
      logEntry.innerHTML = `
        <div class="log-timestamp">${formattedTime}</div>
        <div class="log-title">Chapter ${entry.chapterNumber || '?'}: ${entry.chapterTitle || 'Unknown'}</div>
        <div class="log-platforms">${platformsHtml || '<div>No platform details</div>'}</div>
      `;
      
      syncLogEl.appendChild(logEntry);
    });
  }
  
  async function scanCurrentTab() {
      const enabledPlatforms = platforms
        .filter(p => p.enabledToggle && p.enabledToggle.checked)
        .map(p => p.name);
      
      if (enabledPlatforms.length === 0) {
        toast.warning('No Platforms Selected', 'Please enable at least one platform to sync to.');
        return;
      }
    
    let missingIds = [];
    enabledPlatforms.forEach(platformName => {
      const platform = platforms.find(p => p.name === platformName);
      if (platform && platform.storyIdInput) {
        const hasId = platform.name === 'ao3'
          ? platform.storyIdInput.value.trim() !== ''
          : platform.storyIdInput.value.trim() !== '';
          
        if (!hasId) {
          missingIds.push(platformName);
        }
      }
    });
    
    if (missingIds.length > 0) {
      toast.error('Missing Story IDs', `Please enter story IDs for: ${missingIds.join(', ')}`);
      return;
    }
    
    if (!validator.validateAll()) {
      toast.error('Validation Failed', 'Please fix the errors shown below before continuing.');
      return;
    }
    
    const startChapter = parseInt(startChapterInput.value);
    const endChapter = parseInt(endChapterInput.value);
    
    saveSettings(false, async function() {
      try {
        statusText.textContent = 'Scanning current tab...';
        statusIndicator.className = 'status-indicator scanning';
        scanCurrentTabBtn.disabled = true;
        stopSyncBtn.disabled = false;
        
        let batchSize = batchSizeSelect ? parseInt(batchSizeSelect.value) : 1;
        
        const result = await sendMessageToBackground({
          action: 'scanCurrentTab',
          startChapter: startChapter,
          endChapter: endChapter,
          targetPlatforms: enabledPlatforms,
          batchSize: batchSize
        });
        
      if (!result.success) {
        console.error('Error scanning tab:', result.error);
        
        toast.error('Scan Failed', result.error);
        statusText.textContent = `Error: ${result.error}`;
        
        statusIndicator.className = 'status-indicator error';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
      } catch (error) {
        console.error('Error scanning tab:', error);
        
      toast.error('Communication Error', `Unable to communicate with background script: ${error.message}`);
      statusText.textContent = 'Communication error';
        
        statusIndicator.className = 'status-indicator error';
        scanCurrentTabBtn.disabled = false;
        stopSyncBtn.disabled = true;
      }
    });
  }
  
  async function stopSync() {
    try {
      const result = await sendMessageToBackground({ action: 'stopProcessing' });
      
      console.log('Stop sync result:', result);
      
      statusText.textContent = 'Sync stopped';
      statusIndicator.classList.remove('syncing');
      statusIndicator.classList.remove('scanning');
      scanCurrentTabBtn.disabled = false;
      stopSyncBtn.disabled = true;
    } catch (error) {
      console.error('Error stopping sync:', error);
      
      toast.error('Communication Error', `Unable to stop sync: ${error.message}`);
      statusText.textContent = 'Communication error';
      
      statusIndicator.className = 'status-indicator error';
    }
  }
  
  async function saveSettings(showConfirmation = false, callback = null) {
    const settings = {
      platforms: {},
      batchSize: batchSizeSelect ? parseInt(batchSizeSelect.value) || 1 : 1,
      startChapter: startChapterInput ? parseInt(startChapterInput.value) || 1 : 1,
      endChapter: endChapterInput ? parseInt(endChapterInput.value) || 10 : 10
    };
    
    platforms.forEach(platform => {
      if (!platform.enabledToggle || !platform.storyIdInput) return;
      
      settings.platforms[platform.name] = {
        enabled: platform.enabledToggle.checked,
        lastSyncedChapter: parseInt(platform.lastChapterInput?.value) || 0
      };
      if (platform.name === 'ao3' || platform.name === 'royalroad') {
        settings.platforms[platform.name].workId = platform.storyIdInput.value;
      } else {
        settings.platforms[platform.name].storyId = platform.storyIdInput.value;
      }

      settings.platforms[platform.name].novelName = platform.novelNameEl?.dataset.novelName || '';
      settings.platforms[platform.name].savedNovels = platformSavedNovels[platform.name] || [];

      if (platform.name === 'scribblehub') {
        settings.platforms.scribblehub.postMode = document.getElementById('scribblehubPostMode')?.value || 'publish';
        settings.platforms.scribblehub.scheduleDate = document.getElementById('scribblehubScheduleDate')?.value || '';
        settings.platforms.scribblehub.scheduleIntervalDays = parseInt(document.getElementById('scribblehubScheduleInterval')?.value) || 1;
        settings.platforms.scribblehub.scheduleTime = document.getElementById('scribblehubScheduleTime')?.value || '12:00';
        settings.platforms.scribblehub.chaptersPerRelease = parseInt(document.getElementById('scribblehubChaptersPerRelease')?.value) || 1;
        settings.platforms.scribblehub.minutesBetweenChapters = parseInt(document.getElementById('scribblehubMinutesBetweenChapters')?.value) || 1;
      }

      if (platform.name === 'webnovel') {
        settings.platforms.webnovel.postMode = document.getElementById('webnovelPostMode')?.value || 'publish';
        settings.platforms.webnovel.scheduleDate = document.getElementById('webnovelScheduleDate')?.value || '';
        settings.platforms.webnovel.scheduleIntervalDays = parseInt(document.getElementById('webnovelScheduleInterval')?.value) || 1;
        settings.platforms.webnovel.scheduleTime = document.getElementById('webnovelScheduleTime')?.value || '12:00';
      }

      if (platform.name === 'fanfiction') {
        settings.platforms.fanfiction.postMode = document.getElementById('fanfictionPostMode')?.value || 'publish';
        settings.platforms.fanfiction.scheduleDate = document.getElementById('fanfictionScheduleDate')?.value || '';
        settings.platforms.fanfiction.scheduleIntervalDays = parseInt(document.getElementById('fanfictionScheduleInterval')?.value) || 1;
        settings.platforms.fanfiction.scheduleTime = document.getElementById('fanfictionScheduleTime')?.value || '12:00';
      }

      if (platform.name === 'ao3') {
        settings.platforms.ao3.postMode = document.getElementById('ao3PostMode')?.value || 'publish';
        settings.platforms.ao3.scheduleDate = document.getElementById('ao3ScheduleDate')?.value || '';
        settings.platforms.ao3.scheduleIntervalDays = parseInt(document.getElementById('ao3ScheduleInterval')?.value) || 1;
        settings.platforms.ao3.scheduleTime = document.getElementById('ao3ScheduleTime')?.value || '12:00';
      }

      if (platform.name === 'wattpad') {
        settings.platforms.wattpad.postMode = document.getElementById('wattpadPostMode')?.value || 'publish';
        settings.platforms.wattpad.scheduleDate = document.getElementById('wattpadScheduleDate')?.value || '';
        settings.platforms.wattpad.scheduleIntervalDays = parseInt(document.getElementById('wattpadScheduleInterval')?.value) || 1;
        settings.platforms.wattpad.scheduleTime = document.getElementById('wattpadScheduleTime')?.value || '12:00';
      }

      if (platform.name === 'inkitt') {
        settings.platforms.inkitt.postMode = document.getElementById('inkittPostMode')?.value || 'publish';
      }

      if (platform.name === 'tapas') {
        settings.platforms.tapas.postMode = document.getElementById('tapasPostMode')?.value || 'publish';
        settings.platforms.tapas.scheduleDate = document.getElementById('tapasScheduleDate')?.value || '';
        settings.platforms.tapas.scheduleIntervalDays = parseInt(document.getElementById('tapasScheduleInterval')?.value) || 1;
        settings.platforms.tapas.scheduleTime = document.getElementById('tapasScheduleTime')?.value || '12:00';
      }

      console.log(`Auto-saving settings for ${platform.name}:`, settings.platforms[platform.name]);
    });
    
    chrome.storage.local.set(settings, function() {
      if (showConfirmation) {
        toast.success('Settings Saved', 'Your configuration has been saved successfully.');
      }
      
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  }
  
  let autoSaveTimeout;
  function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveSettings(false);
    }, 1000);
  }
  

  const tutorialSteps = [
    {
      title: "Welcome to WebnovelSync!",
      text: "This extension helps you sync chapters between different novel platforms. Let's take a quick tour to get you started!",
      target: null,
      highlight: false
    },
    {
      title: "Chapter Range",
      text: "First, set which chapters you want to sync. Enter the start and end chapter numbers here.",
      target: ".sync-range-container",
      highlight: true
    },
    {
      title: "Choose Platforms",
      text: "Enable the platforms you want to sync TO. Each platform requires its own Story/Work ID. All platforms are now free!",
      target: ".platform-settings",
      highlight: true
    },
    {
      title: "Advanced Settings",
      text: "Click 'Advanced Settings' to access batch size and chapter title formatting options. Larger batch sizes are faster but may cause errors.",
      target: ".settings-toggle-container",
      highlight: true
    },
    {
      title: "Ready to Sync!",
      text: "Navigate to a supported source (Webnovel, AO3, etc.), configure your settings, and click 'Scan Current Tab' to start!",
      target: "#scanCurrentTabBtn",
      highlight: true
    }
  ];

  let currentTutorialStep = 0;
  let tutorialActive = false;

  const tutorialOverlay = document.getElementById('tutorialOverlay');
  const tutorialTitle = document.getElementById('tutorialTitle');
  const tutorialText = document.getElementById('tutorialText');
  const tutorialStepCounter = document.getElementById('tutorialStepCounter');
  const tutorialProgressFill = document.getElementById('tutorialProgressFill');
  const tutorialHighlight = document.querySelector('.tutorial-highlight');
  const tutorialClearOverlay = document.getElementById('tutorialClearOverlay');
  const tutorialPrevBtn = document.getElementById('tutorialPrev');
  const tutorialNextBtn = document.getElementById('tutorialNext');
  const tutorialSkipBtn = document.getElementById('tutorialSkip');

  const WHATS_NEW_KEY = 'whatsNew_v2';

  const whatsNewSlides = [
    {
      title: "What's New in WebnovelSync",
      html: `<p>This update brings posting flexibility, automatic novel name tracking, and a cleaner interface. Here's a quick overview of what changed.</p>`
    },
    {
      title: "Post Modes: Draft, Schedule & Queue",
      html: `<p>Every platform now has a <b>Post Mode</b> selector:</p>
<ul>
  <li><b>Draft</b>: saves without publishing (ScribbleHub, Webnovel, Wattpad, Inkitt, Tapas)</li>
  <li><b>Schedule</b>: uses the platform's own scheduler (ScribbleHub, Webnovel)</li>
  <li><b>Queue</b>: extension posts at a scheduled time (all platforms)</li>
</ul>
<p class="wn-note">Queue uses Chrome alarms, so chapters post even after you restart the browser.</p>`
    },
    {
      title: "Novel Name Display",
      html: `<p>The extension now <b>automatically captures your novel's name</b> the first time you post to each platform.</p>
<p style="margin-top:8px;">A small label appears below each Story ID field so you always know which ID belongs to which novel, no more guessing when you manage multiple stories.</p>`
    },
    {
      title: "UI Improvements",
      html: `<p>A few things are now easier to read at a glance:</p>
<ul>
  <li><b>Mode badge</b>: colored tag in each platform header shows Draft / Schedule / Queue without expanding</li>
  <li><b>Queue count</b>: "X queued" badge appears when chapters are waiting to post</li>
  <li><b>"Last Posted"</b>: the chapter counter field is now labeled more clearly</li>
</ul>`
    }
  ];

  let whatsNewStep = 0;

  const whatsNewOverlay = document.getElementById('whatsNewOverlay');
  const whatsNewTitleEl = document.getElementById('whatsNewTitle');
  const whatsNewContentEl = document.getElementById('whatsNewContent');
  const whatsNewCounterEl = document.getElementById('whatsNewCounter');
  const whatsNewFillEl = document.getElementById('whatsNewProgressFill');
  const whatsNewPrevBtn = document.getElementById('whatsNewPrev');
  const whatsNewNextBtn = document.getElementById('whatsNewNext');
  const whatsNewDismissBtn = document.getElementById('whatsNewDismiss');

  function updateWhatsNewSlide() {
    const slide = whatsNewSlides[whatsNewStep];
    const total = whatsNewSlides.length;
    whatsNewTitleEl.textContent = slide.title;
    whatsNewContentEl.innerHTML = slide.html;
    whatsNewCounterEl.textContent = `${whatsNewStep + 1} / ${total}`;
    whatsNewFillEl.style.width = `${((whatsNewStep + 1) / total) * 100}%`;
    whatsNewPrevBtn.disabled = whatsNewStep === 0;
    whatsNewNextBtn.textContent = whatsNewStep === total - 1 ? 'Got it!' : 'Next';
  }

  function dismissWhatsNew() {
    whatsNewOverlay.style.display = 'none';
    chrome.storage.local.set({ [WHATS_NEW_KEY]: true });
  }

  if (whatsNewNextBtn) {
    whatsNewNextBtn.addEventListener('click', () => {
      if (whatsNewStep < whatsNewSlides.length - 1) {
        whatsNewStep++;
        updateWhatsNewSlide();
      } else {
        dismissWhatsNew();
      }
    });
  }

  if (whatsNewPrevBtn) {
    whatsNewPrevBtn.addEventListener('click', () => {
      if (whatsNewStep > 0) { whatsNewStep--; updateWhatsNewSlide(); }
    });
  }

  if (whatsNewDismissBtn) whatsNewDismissBtn.addEventListener('click', dismissWhatsNew);

  chrome.storage.local.get([WHATS_NEW_KEY, 'tutorialCompleted', 'platforms'], (data) => {
    const alreadySeen = data[WHATS_NEW_KEY];
    const isExistingUser = data.tutorialCompleted ||
      (data.platforms && Object.values(data.platforms).some(p => p.enabled));
    if (!alreadySeen && isExistingUser) {
      setTimeout(() => { whatsNewStep = 0; whatsNewOverlay.style.display = 'flex'; updateWhatsNewSlide(); }, 800);
    }
  });
  function checkIfNewUser() {
    chrome.storage.local.get(['tutorialCompleted', 'platforms'], function(data) {
      const hasCompletedTutorial = data.tutorialCompleted;
      const hasConfiguredPlatforms = data.platforms && Object.values(data.platforms).some(p => p.enabled);
      
      if (!hasCompletedTutorial && !hasConfiguredPlatforms) {
        setTimeout(() => startTutorial(), 1000);
      }
    });
  }

  function startTutorial() {
    if (tutorialActive) return;
    
    tutorialActive = true;
    currentTutorialStep = 0;
    document.body.classList.add('tutorial-active');
    tutorialOverlay.style.display = 'flex';
    updateTutorialStep();
  }

  function updateTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const totalSteps = tutorialSteps.length;
    
    tutorialTitle.textContent = step.title;
    tutorialText.textContent = step.text;
    tutorialStepCounter.textContent = `${currentTutorialStep + 1} / ${totalSteps}`;
    
    const progressPercent = ((currentTutorialStep + 1) / totalSteps) * 100;
    tutorialProgressFill.style.width = `${progressPercent}%`;
    
    tutorialPrevBtn.disabled = currentTutorialStep === 0;
    tutorialNextBtn.textContent = currentTutorialStep === totalSteps - 1 ? 'Finish' : 'Next';
    
    if (step.target && step.highlight) {
      highlightElement(step.target);
    } else {
      hideHighlight();
      positionTutorialContent();
    }
  }

  function highlightElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      hideHighlight();
      positionTutorialContent();
      return;
    }
    
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      const rect = element.getBoundingClientRect();
      
      tutorialHighlight.style.display = 'block';
      tutorialHighlight.style.top = `${rect.top - 4}px`;
      tutorialHighlight.style.left = `${rect.left - 4}px`;
      tutorialHighlight.style.width = `${rect.width + 8}px`;
      tutorialHighlight.style.height = `${rect.height + 8}px`;
      tutorialHighlight.classList.add('pulse');
      
      createClearOverlay(element, rect);
      
      positionTutorialContent(rect);
    }, 300);
  }
  
  function createClearOverlay(element, rect) {
    const clone = element.cloneNode(true);
    
    tutorialClearOverlay.innerHTML = '';
    tutorialClearOverlay.appendChild(clone);
    
    tutorialClearOverlay.style.display = 'block';
    tutorialClearOverlay.style.top = `${rect.top}px`;
    tutorialClearOverlay.style.left = `${rect.left}px`;
    tutorialClearOverlay.style.width = `${rect.width}px`;
    tutorialClearOverlay.style.height = `${rect.height}px`;
    
    const computedStyle = window.getComputedStyle(element);
    clone.style.margin = '0';
    clone.style.padding = computedStyle.padding;
    clone.style.border = computedStyle.border;
    clone.style.borderRadius = computedStyle.borderRadius;
    clone.style.background = computedStyle.background;
    clone.style.color = computedStyle.color;
    clone.style.fontSize = computedStyle.fontSize;
    clone.style.fontFamily = computedStyle.fontFamily;
    clone.style.fontWeight = computedStyle.fontWeight;
  }

  function hideHighlight() {
    tutorialHighlight.style.display = 'none';
    tutorialHighlight.classList.remove('pulse');
    tutorialClearOverlay.style.display = 'none';
    tutorialClearOverlay.innerHTML = '';
  }
  
  function positionTutorialContent(highlightRect = null) {
    const tutorialContent = document.querySelector('.tutorial-content');
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const contentWidth = 320;
    const contentHeight = tutorialContent.offsetHeight;
    
    let left, top;
    
    if (highlightRect) {
      const margin = 20;
      
      if (highlightRect.right + margin + contentWidth <= viewportWidth) {
        left = highlightRect.right + margin;
        top = Math.max(20, Math.min(highlightRect.top, viewportHeight - contentHeight - 20));
      }
      else if (highlightRect.left - margin - contentWidth >= 0) {
        left = highlightRect.left - margin - contentWidth;
        top = Math.max(20, Math.min(highlightRect.top, viewportHeight - contentHeight - 20));
      }
      else if (highlightRect.top - margin - contentHeight >= 0) {
        left = Math.max(20, Math.min(highlightRect.left, viewportWidth - contentWidth - 20));
        top = highlightRect.top - margin - contentHeight;
      }
      else {
        left = Math.max(20, Math.min(highlightRect.left, viewportWidth - contentWidth - 20));
        top = Math.min(highlightRect.bottom + margin, viewportHeight - contentHeight - 20);
      }
    } else {
      left = (viewportWidth - contentWidth) / 2;
      top = (viewportHeight - contentHeight) / 2;
    }
    
    tutorialContent.style.left = `${left}px`;
    tutorialContent.style.top = `${top}px`;
  }

  function nextTutorialStep() {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      currentTutorialStep++;
      updateTutorialStep();
    } else {
      finishTutorial();
    }
  }

  function prevTutorialStep() {
    if (currentTutorialStep > 0) {
      currentTutorialStep--;
      updateTutorialStep();
    }
  }

  function finishTutorial() {
    tutorialActive = false;
    document.body.classList.remove('tutorial-active');
    tutorialOverlay.style.display = 'none';
    hideHighlight();
    
    chrome.storage.local.set({ 'tutorialCompleted': true });
  }

  function skipTutorial() {
    finishTutorial();
  }

  if (tutorialNextBtn) {
    tutorialNextBtn.addEventListener('click', nextTutorialStep);
  }

  if (tutorialPrevBtn) {
    tutorialPrevBtn.addEventListener('click', prevTutorialStep);
  }

  if (tutorialSkipBtn) {
    tutorialSkipBtn.addEventListener('click', skipTutorial);
  }

  tutorialOverlay.addEventListener('click', function(e) {
    if (e.target === tutorialOverlay || e.target.classList.contains('tutorial-backdrop')) {
      skipTutorial();
    }
  });

  checkIfNewUser();
  
  async function initializeTheme() {
    try {
      const result = await chrome.storage.local.get(['theme']);
      const savedTheme = result.theme || 'dark';
      
      setTheme(savedTheme);
      updateThemeIcon(savedTheme);
      
      const themeToggle = document.getElementById('themeToggle');
      if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
      }
    } catch (error) {
      console.error('Error initializing theme:', error);
      setTheme('dark');
      updateThemeIcon('dark');
    }
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  async function toggleTheme() {
    try {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      setTheme(newTheme);
      updateThemeIcon(newTheme);
      
      await chrome.storage.local.set({ theme: newTheme });
      
      console.log(`Theme switched to: ${newTheme}`);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  }
  
  platforms.forEach(platform => {
    if (!platform.storyIdInput || !platform.novelNameEl) return;
    platform.storyIdInput.addEventListener('input', function() {
      platform.novelNameEl.textContent = '';
      platform.novelNameEl.dataset.novelName = '';
      platform.novelNameEl.style.display = 'none';
    });
  });

  platforms.forEach(platform => {
    if (!platform.novelSelectEl) return;
    platform.novelSelectEl.addEventListener('change', function() {
      if (this.value === '__new__') {
        platform.storyIdInput.value = '';
        showNovelInput(platform);
        platform.storyIdInput.focus();
        if (platform.novelNameEl) {
          platform.novelNameEl.textContent = '';
          platform.novelNameEl.dataset.novelName = '';
          platform.novelNameEl.style.display = 'none';
        }
      } else {
        platform.storyIdInput.value = this.value;
        const saved = (platformSavedNovels[platform.name] || []).find(n => n.id === this.value);
        if (saved && platform.lastChapterInput) {
          platform.lastChapterInput.value = saved.lastChapter || 0;
        }
        if (platform.novelNameEl && saved?.name) {
          platform.novelNameEl.dataset.novelName = saved.name;
        }
      }
      autoSave();
    });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    updateQueueCounts();
    if (!changes.platforms) return;
    const updated = changes.platforms.newValue || {};
    platforms.forEach(platform => {
      const config = updated[platform.name] || {};
      const savedNovels = config.savedNovels || [];
      const currentId = config.storyId || config.workId || '';

      if (savedNovels.length > 0 && platform.novelSelectEl) {
        platformSavedNovels[platform.name] = savedNovels;
        populateNovelSelect(platform, savedNovels, currentId);
        showNovelSelect(platform);
      } else if (platform.novelNameEl) {
        const name = config.novelName || '';
        if (name && platform.novelNameEl.dataset.novelName !== name) {
          platform.novelNameEl.textContent = `📖 ${name}`;
          platform.novelNameEl.dataset.novelName = name;
          platform.novelNameEl.style.display = '';
        }
      }
    });
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSyncLog') {
      updateSyncLog(request.logEntries);
    } else if (request.action === 'showToast') {
      showToast(request.message, request.type || 'info', request.duration || 5000);
    }
  });
  
});
