var stash = [];

document.addEventListener("DOMContentLoaded", function() { 
  // Called when the user clicks on the browser action.
  const stashButton = document.getElementById('stash');
  const applyButton = document.getElementById('apply');
  stashButton.addEventListener('click', function() {
  	stash = [];
  	let query = chrome.tabs.query({}, tabs => {
  		tabs.map(tab => {
				stash.push(tab.url);
        chrome.tabs.remove(tab.id);
  		});
      chrome.storage.local.clear();
      chrome.storage.local.set({stash: stash}, function() {
        chrome.windows.create({}, function() {
          chrome.extension.getBackgroundPage()
           .console.log('Settings saved', stash.length);     
        }); 
        
      });
    });
  });
  applyButton.addEventListener('click', function() {
    chrome.storage.local.get(null, function(items) {
      chrome.extension.getBackgroundPage()
        .console.log('Settings retrieved', items['stash'].length);
      if(items['stash'].length > 0) {
        items['stash'].map(url => {
          chrome.tabs.create({url: url});
        });
      }
    });
  });
}, false);

