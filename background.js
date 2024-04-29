function tabList() {
    // get the active window
    browser.windows.getCurrent({populate: true}).then((window) => {
        
        // define an array to hold our urls
        let urls = [];

        window.tabs.forEach((tab) => {
            urls.push(tab.url);
        });
        
        let key = "window_" + window.id;
        // write each url to local storage
        browser.storage.local.set({ [key]: urls}).then(() => {
            console.log("urls saved for", key, ": ", urls);
        }).catch((error) => {
            console.error("error saving urls for", key, "to local storage: ", error);
        });  
        
    });
}

browser.action.onClicked.addListener(tabList);