function tabList() {
    // get an array of windows
    browser.windows.getAll({populate: true}).then((windows) => {
        windows.forEach((window, index) => {
            // define an array to hold our urls
            let urls = [];
            
            window.tabs.forEach((tab) => {
                urls.push(tab.url);
            });

            // write each url to local storage
            browser.storage.local.set({ ["window_" + index]: urls}).then(() => {
                console.log("urls saved for window", index, ": ", urls);
            }).catch((error) => {
                console.error("error saving urls for window", index, "to local storage: ", error);
            });  
        });
    });
}

browser.action.onClicked.addListener(tabList);