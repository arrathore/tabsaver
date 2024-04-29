function tabList() {
    
    // get an array of tabs
    browser.tabs.query({currentWindow: true}).then((tabs) => {
        // define an array to hold our urls
        let urls = [];
        
        tabs.forEach((tab) => {
            urls.push(tab.url);
        });
        
        console.log(urls);
        // catch errors
    }).catch((error) => {
        console.error("error during query:", error);
    })
}

browser.action.onClicked.addListener(tabList);
