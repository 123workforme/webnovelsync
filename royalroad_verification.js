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

  console.log('RoyalRoad verification script loaded');

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractAuthorProfile') {
      console.log('Extracting author profile link for fiction ID:', message.fictionId);
      const profileLink = extractAuthorProfileLink();
      console.log('Author profile link:', profileLink);
      sendResponse(profileLink);
      return true;
    }
    
    if (message.action === 'verifyRoyalRoadOwnership') {
      console.log('Verifying RoyalRoad ownership for fiction ID:', message.fictionId);
      verifyOwnership(message.fictionId)
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
    
    if (message.action === 'checkRoyalRoadSignIn') {
      console.log('Checking RoyalRoad sign-in status...');
      
      const signInStatus = checkSignInStatus();
      console.log('Sign-in status result:', signInStatus);
      
      sendResponse(signInStatus);
      return true;
    }
  });

  async function verifyOwnership(fictionId) {
    return new Promise((resolve, reject) => {
      const currentUrl = window.location.href;
      
      if (!currentUrl.includes('/profile/')) {
        reject(new Error('Not on a profile page'));
        return;
      }

      let checkAttempts = 0;
      const maxAttempts = 50;
      
      const checkOwnership = () => {
        checkAttempts++;
        
        const editProfileButton = document.querySelector('a[href="/account"][title="Edit Profile"]');
        if (editProfileButton) {
          console.log('Found Edit Profile button - user is the author');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit Profile button found'
          });
          return;
        }

        const editProfileAlt = document.querySelector('a.btn.btn-icon-only.btn-primary[href="/account"]');
        if (editProfileAlt && (editProfileAlt.title === 'Edit Profile' || editProfileAlt.getAttribute('aria-label') === 'Edit your profile')) {
          console.log('Found Edit Profile button (alternative) - user is the author');
          resolve({
            success: true,
            isOwner: true,
            reason: 'Edit Profile button found (alternative)'
          });
          return;
        }

        const accountLink = document.querySelector('a[href="/account"]');
        if (accountLink) {
          const editIcon = accountLink.querySelector('.fa-edit');
          if (editIcon) {
            console.log('Found account link with edit icon - user is the author');
            resolve({
              success: true,
              isOwner: true,
              reason: 'Account edit link found'
            });
            return;
          }
        }
        
        const profileTopbarButtons = document.querySelector('.profile-topbar-buttons');
        if (profileTopbarButtons) {
          const reportButton = profileTopbarButtons.querySelector('a[href*="/report/user/"]');
          
          if (reportButton) {
            console.log('Found Report button - viewing someone else\'s profile, user is NOT the author');
            resolve({
              success: true,
              isOwner: false,
              reason: 'Report button found - viewing someone else\'s profile'
            });
            return;
          }
        }

        if (checkAttempts >= maxAttempts) {
          console.log('No Edit Profile button found - user is NOT the author');
          resolve({
            success: true,
            isOwner: false,
            reason: 'No Edit Profile button found - viewing someone else\'s profile'
          });
          return;
        }

        setTimeout(checkOwnership, 100);
      };

      checkOwnership();
    });
  }

  function checkSignInStatus() {
    try {
      const loginLinkInLi = document.querySelector('li a[href*="/account/login"]');
      if (loginLinkInLi && loginLinkInLi.textContent.toLowerCase().includes('log in')) {
        console.log('Found RoyalRoad login link in li - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'RoyalRoad login link found'
        };
      }
      
      const loginLink = document.querySelector('a[href="/account/login"], a[href*="login"]');
      if (loginLink && loginLink.textContent.toLowerCase().includes('login')) {
        console.log('Found login link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Login link found on page'
        };
      }
      
      const registerLink = document.querySelector('a[href="/account/register"], a[href*="register"]');
      if (registerLink && registerLink.textContent.toLowerCase().includes('register')) {
        console.log('Found register link - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Register link found on page'
        };
      }
      
      const signInIcon = document.querySelector('.fa-sign-in');
      if (signInIcon) {
        console.log('Found sign-in icon - user is NOT signed in');
        return {
          isSignedIn: false,
          reason: 'Sign-in icon found'
        };
      }
      
      const userDropdown = document.querySelector('.dropdown-menu, .user-dropdown, [class*="user"]');
      if (userDropdown) {
        console.log('Found user dropdown - user appears to be signed in');
        return {
          isSignedIn: true,
          reason: 'User dropdown found'
        };
      }
      
      const authorDashboard = document.querySelector('a[href*="author-dashboard"]');
      if (authorDashboard) {
        console.log('Found author dashboard link - user is signed in');
        return {
          isSignedIn: true,
          reason: 'Author dashboard link found'
        };
      }
      
      console.log('No clear sign-in indicators found - assuming signed in');
      return {
        isSignedIn: true,
        reason: 'No login link detected'
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

  function extractAuthorProfileLink() {
    try {
      
      const ficHeader = document.querySelector('.fic-header');
      if (ficHeader) {
        const authorLink = ficHeader.querySelector('a[href*="/profile/"].font-white');
        if (authorLink && authorLink.href) {
          const profileUrl = authorLink.href;
          console.log('Found author profile link in fic-header:', profileUrl);
          return {
            success: true,
            profileUrl: profileUrl
          };
        }
      }
      
      const ficTitle = document.querySelector('.fic-title');
      if (ficTitle) {
        const authorLink = ficTitle.querySelector('a[href*="/profile/"].font-white');
        if (authorLink && authorLink.href) {
          const profileUrl = authorLink.href;
          console.log('Found author profile link in fic-title:', profileUrl);
          return {
            success: true,
            profileUrl: profileUrl
          };
        }
      }
      
      console.log('Could not find author profile link in fiction header');
      return {
        success: false,
        error: 'Author profile link not found in fiction header'
      };
      
    } catch (error) {
      console.error('Error extracting author profile link:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  window.verifyRoyalRoadOwnership = verifyOwnership;
  window.checkRoyalRoadSignIn = checkSignInStatus;
  window.extractAuthorProfileLink = extractAuthorProfileLink;
})();