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

  console.log('ScribbleHub verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyScribbleHubOwnership') {
      console.log('Verifying ScribbleHub ownership for story ID:', message.storyId);
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
    
    if (message.action === 'checkScribbleHubSignIn') {
      console.log('Checking ScribbleHub sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      const expectedUrl = `https://www.scribblehub.com/editseries/${storyId}/`;
      
      if (!currentUrl.includes(`/editseries/${storyId}/`)) {
        reject(new Error('Not on the correct ScribbleHub edit page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 20;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        const errorMessage = document.querySelector('.error_msg_profile');
        if (errorMessage) {
          const errorText = errorMessage.textContent || errorMessage.innerText;
          if (errorText.includes('You cannot edit this series')) {
            console.log('Found "cannot edit" error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Cannot edit this series'
            });
            return;
          }
        }

        const titleElement = document.querySelector('.edit_fic_title a');
        if (titleElement && titleElement.textContent.trim()) {
          console.log('Found edit title element, user owns the story:', titleElement.textContent);
          resolve({
            success: true,
            isOwner: true,
            storyTitle: titleElement.textContent.trim()
          });
          return;
        }

        const generalError = document.querySelector('.error, .error_msg, [class*="error"]');
        if (generalError) {
          const errorText = generalError.textContent || generalError.innerText;
          if (errorText.toLowerCase().includes('error') || 
              errorText.toLowerCase().includes('access') ||
              errorText.toLowerCase().includes('denied') ||
              errorText.toLowerCase().includes('cannot')) {
            console.log('Found general error message');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Access error or permission denied'
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

  function checkSignInStatus() {
    try {
      const guestIcon = document.querySelector('span.menu_right_icon.guest.gt[title="Guest Options"]');
      
      if (guestIcon) {
        console.log('Found guest icon - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Guest icon found on page'
        };
      }
      
      const guestElement = document.querySelector('.guest, [class*="guest"]');
      if (guestElement && guestElement.textContent.toLowerCase().includes('guest')) {
        console.log('Found guest element - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Guest element found on page'
        };
      }
      
      const userProfile = document.querySelector('.user-info, .user-avatar, .user-name, [class*="profile"], [class*="user"]:not(.guest)');
      if (userProfile) {
        console.log('Found user profile element - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User profile elements found'
        };
      }
      
      console.log('No clear sign-in indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No guest icon detected'
      };
      
    } catch (error) {
      console.error('Error checking sign-in status:', error);
      return {
        isSignedIn: true,
        reason: 'Error during check - assuming signed in',
        error: error.message
      };
    }
  }

  window.verifyScribbleHubOwnership = verifyOwnership;
  window.checkScribbleHubSignIn = checkSignInStatus;
})();