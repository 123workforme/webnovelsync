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

  console.log('Inkstone verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyWebnovelOwnership') {
      console.log('Verifying Webnovel ownership for story ID:', message.storyId);
      verifyOwnership(message.storyId)
        .then(result => {
          console.log('Verification result:', result);
          sendResponse(result);
        })
        .catch(error => {
          console.error('Verification error:', error);
          sendResponse({
            success: false,
            isOwner: false,
            error: error.message
          });
        });
      
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      const expectedUrl = `https://inkstone.webnovel.com/novels/view/${storyId}`;
      
      if (!currentUrl.includes(`/novels/view/${storyId}`)) {
        reject(new Error('Not on the correct Inkstone verification page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 20;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        const errorMessage = document.querySelector('.ant-message-notice .ant-message-error');
        if (errorMessage) {
          const errorText = errorMessage.textContent || errorMessage.innerText;
          if (errorText.includes('You are not the owner of this book')) {
            console.log('Found ownership error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Not the owner of this story'
            });
            return;
          }
        }

        const titleElement = document.querySelector('h2.t_h6.c_l.dib');
        if (titleElement && titleElement.textContent.trim()) {
          console.log('Found title element, user owns the story:', titleElement.textContent);
          resolve({
            success: true,
            isOwner: true,
            storyTitle: titleElement.textContent.trim()
          });
          return;
        }

        const generalError = document.querySelector('.ant-message-error, .error-message, [class*="error"]');
        if (generalError) {
          const errorText = generalError.textContent || generalError.innerText;
          if (errorText.toLowerCase().includes('access') || 
              errorText.toLowerCase().includes('denied') ||
              errorText.toLowerCase().includes('unauthorized')) {
            console.log('Found access error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Access denied to this story'
            });
            return;
          }
        }

        if (checkAttempts >= maxAttempts) {
          console.log('Verification timeout - could not determine ownership');
          reject(new Error('Could not verify ownership - page did not load properly'));
          return;
        }

        setTimeout(checkOwnership, 100);
      };

      checkOwnership();
    });
  }

  window.verifyWebnovelOwnership = verifyOwnership;
})();