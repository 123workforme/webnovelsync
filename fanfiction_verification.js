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

  console.log('FanFiction.net verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'verifyFanFictionOwnership') {
      console.log('Verifying FanFiction.net ownership for story ID:', message.storyId);
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
    
    if (message.action === 'checkFanFictionSignIn') {
      console.log('Checking FanFiction.net sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(storyId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      const expectedUrl = `https://www.fanfiction.net/story/story_edit_property.php?storyid=${storyId}`;
      
      if (!currentUrl.includes(`story_edit_property.php?storyid=${storyId}`)) {
        reject(new Error('Not on the correct FanFiction.net edit page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        
        const allGuiNormal = document.querySelectorAll('.gui_normal');
        
        for (let i = 0; i < allGuiNormal.length; i++) {
          const element = allGuiNormal[i];
          const text = element.textContent || element.innerText;
          
          if (text.includes('Invalid Story Access') && text.includes('StoryID')) {
            console.log('Found "Invalid Story Access" error message with StoryID');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Invalid Story Access'
            });
            return;
          }
        }
        
        const allPanelNormal = document.querySelectorAll('.panel_normal');
        
        for (let i = 0; i < allPanelNormal.length; i++) {
          const element = allPanelNormal[i];
          const text = element.textContent || element.innerText;
          
          if (text.includes('Invalid Story Access') && text.includes('StoryID')) {
            console.log('Found "Invalid Story Access" error message with StoryID in panel_normal');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Invalid Story Access'
            });
            return;
          }
        }

        const titleElement = document.querySelector('.tcat b');
        if (titleElement) {
          const titleText = titleElement.textContent.trim();
          console.log('Found tcat b element with text:', titleText);
          if (titleText.includes('Editing Story:')) {
            const storyTitle = titleText.replace('Editing Story: ', '');
            console.log('Found edit title element, user owns the story:', storyTitle);
            resolve({
              success: true,
              isOwner: true,
              storyTitle: storyTitle
            });
            return;
          }
        }

        const generalError = document.querySelector('.error, .error_msg, [class*="error"]');
        if (generalError) {
          const errorText = generalError.textContent || generalError.innerText;
          if (errorText.toLowerCase().includes('error') || 
              errorText.toLowerCase().includes('access') ||
              errorText.toLowerCase().includes('denied') ||
              errorText.toLowerCase().includes('invalid')) {
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
      const signInLink = document.querySelector('a[href*="login"], a[href*="signin"]');
      if (signInLink && (signInLink.textContent.toLowerCase().includes('login') || 
                        signInLink.textContent.toLowerCase().includes('sign in'))) {
        console.log('Found sign-in link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign-in link found on page'
        };
      }
      
      const guestElement = document.querySelector('.guest, [class*="guest"]');
      if (guestElement) {
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
      
      const accountMenu = document.querySelector('a[href*="account"], a[href*="profile"], a[href*="settings"]');
      if (accountMenu) {
        console.log('Found account menu - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'Account menu found'
        };
      }
      
      console.log('No clear sign-in indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No sign-in link detected'
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

  window.verifyFanFictionOwnership = verifyOwnership;
  window.checkFanFictionSignIn = checkSignInStatus;
})();