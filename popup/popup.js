// restores a window given an array of urls
function restoreWindow(urls) {
    browser.windows.create({url: urls});
}

// pulls all windows currently in local storage and displays them in our unordered list
function updateList() {
    browser.storage.local.get().then((result) => {
        const windowList = document.getElementById("window_list");
        windowList.innerHTML = "";
        
        for (const key in result) {
            if (result.hasOwnProperty(key)) {
                // create a list entry
                const container = document.createElement("li");
                
                // create the text content of the entry
                const nameText = document.createElement("span");
                nameText.textContent = key + ": " + result[key].join(", ");
                
                // create the restore button which will bring the tabs back
                const restoreButton = document.createElement("button");
                restoreButton.textContent = "restore";
                restoreButton.onclick = function() {
                    restoreWindow(result[key]);
                }
                
                // create the delete button which will delete the entry from storage and remove it from the list
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "delete";
                deleteButton.onclick = function() {
                    browser.storage.local.remove(key);
                    updateList();
                };
                
                container.appendChild(restoreButton);
                container.appendChild(deleteButton);
                container.appendChild(nameText);
                
                windowList.append(container);
            }
        }
        
        if (windowList.children.length === 0) {
            const empty = document.createElement("li");
            empty.textContent = "no saved windows";
            windowList.appendChild(empty);
        }
        
    });
}


// saves the tab urls from the active window to local storage
function saveTabs() {
    // get the active window
    browser.windows.getCurrent({populate: true}).then((window) => {
        
        // define an array to hold our urls
        let urls = [];

        window.tabs.forEach((tab) => {
            if (tab.url != "about:newtab") urls.push(tab.url);
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

updateList();
const text = document.getElementById("window_name");
const submit = document.getElementById("submit");
submit.addEventListener("click", saveTabs);