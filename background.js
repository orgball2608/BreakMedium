// Background script for persistent functionality
chrome.runtime.onInstalled.addListener(function() {
  console.log("Extension installed");
  
  // Example: Initialize storage
  chrome.storage.local.set({
    isEnabled: true,
    settings: {
      option1: true,
      option2: false
    }
  });
});

// Example: Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getSettings") {
    chrome.storage.local.get("settings", function(data) {
      sendResponse({settings: data.settings});
    });
    return true; // Required for async sendResponse
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openInNewTab") {
    // Open the URL in a new tab
    chrome.tabs.create({ url: message.url });
    sendResponse({ success: true });
  }
  return true; // Required for async response
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is fully loaded and is a Medium site
  if (changeInfo.status === 'complete' && 
     (tab.url.includes('medium.com') || tab.url.includes('towardsdatascience.com'))) {
    
    console.log("Medium page detected, injecting automatically:", tab.url);
    
    // Automatically send the injection message to the content script
    chrome.tabs.sendMessage(tabId, { action: "injectButton" });
  }
});
