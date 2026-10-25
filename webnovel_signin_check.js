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

  console.log('Webnovel sign-in check script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkWebnovelSignIn') {
      console.log('Checking Webnovel sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  function checkSignInStatus() {
    try {
      const signInButton = document.querySelector('a.login-btn.j_login[title="sign in"]');
      
      if (signInButton) {
        console.log('Found sign-in button - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign-in button found on page'
        };
      }
      
      const signInLink = document.querySelector('a[href*="login"], a[data-report-uiname="signin"]');
      if (signInLink && signInLink.textContent.toLowerCase().includes('sign in')) {
        console.log('Found sign-in link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign-in link found on page'
        };
      }
      
      const userProfile = document.querySelector('.user-info, .user-avatar, .user-name, [class*="profile"], [class*="user"]');
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
        reason: 'No sign-in button detected'
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

  window.checkWebnovelSignIn = checkSignInStatus;
})();