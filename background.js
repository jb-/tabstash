// declaration part
const redirectionURL = "about:blank";

function redirect(requestDetails) {

    // console.log("You should not visit " + requestDetails.url);
    chrome.tabs.query({ currentWindow: true, active: true },
        function(tabs) {
            var tab = tabs[0];
            chrome.tabs.update(tab.id, { url: redirectionURL })
        }
    );

}

function getAJAXPromise(url) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', url);
        request.onload = () => {
            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error(request.statusText));
            }
        }
        // Handle network errors
        request.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        request.send();
    });
}

function addFilter(filter) {

}

function updateFilterList() { // update filterList.json when idle, locked, or when chrome exits

}


// execution part
var JsonURL = chrome.runtime.getURL('filterList.json');

// console.log(JsonURL);
getAJAXPromise(JsonURL).then((response) => {
    let filterList = JSON.parse(response);
    console.log("Filter successfully loaded: ", filterList);
    return filterList;
}, (error) => {
    console.error("Loading filter list failed: ", error);
}).then((filterList) => {
    chrome.webRequest.onBeforeRequest.addListener(redirect, filterList);
});