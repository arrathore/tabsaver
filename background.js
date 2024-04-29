function tabList() {
    
    // get an array of tabs
    browser.tabs.query({currentWindow: true}).then((tabs) => {
        // define an array to hold our urls
        let urls = [];
        
        tabs.forEach((tab) => {
            urls.push(tab.url);
        });
        
        // write each url to local storage
        browser.storage.local.set({urls: urls}).then(() => {
            console.log("urls saved: ", urls);
        }).catch((error) => {
            console.error("error saving to local storage: ", error);
        });
        
    }).catch((error) => {
        console.error("error during query:", error);
    })
}

browser.action.onClicked.addListener(tabList);