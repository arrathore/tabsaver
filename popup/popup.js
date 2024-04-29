// saves the tab urls from the active window to local storage
function saveTabs() {
    // get the active window
    browser.windows.getCurrent({populate: true}).then((window) => {
        
        // define an array to hold our urls
        let urls = [];

        window.tabs.forEach((tab) => {
            urls.push(tab.url);
        });
        
        let key = text.value;
        // write each url to local storage
        browser.storage.local.set({ [key]: urls}).then(() => {
            console.log("urls saved for", key, ": ", urls);
        }).catch((error) => {
            console.error("error saving urls for", key, "to local storage: ", error);
        });  
        
    });
    // update the list
    updateList();   
}

// pulls all windows currently in local storage and displays them in our unordered list
function updateList() {
    browser.storage.local.get().then((result) => {
        const windowList = document.getElementById("window_list");
        windowList.innerHTML = "";
        
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                const listItem = document.createElement("li");
                listItem.textContent = key + ": " + result[key].join(", ");
                windowList.appendChild(listItem);
            }
        }
        
        if (windowList.children.length === 0) {
            const empty = document.createElement("li");
            empty.textContent = "no saved windows";
            windowList.appendChild(empty);
        }
        
    });
}

updateList();
const text = document.getElementById("window_name");
const submit = document.getElementById("submit");
submit.addEventListener("click", saveTabs);