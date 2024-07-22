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
                
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                summary.textContent = key;
                
                const list = document.createElement("ul");
                
                for (const link in result[key]) {
                    const listItem = document.createElement("li");
                    listItem.textContent = result[key][link];
                    list.appendChild(listItem);
                }
                
                details.appendChild(summary);
                details.appendChild(list);
                
                nameText.append(details);
                
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
    // check if the user has entered a name
    let key = text.value;
    if (key.length == 0) {
        name_error.innerHTML = "name cannot be empty";
        event.preventDefault();
        return;
    }
    
    // get the active window
    browser.windows.getCurrent({populate: true}).then((window) => {
        name_error.innerHTML = "";
        
        // define an array to hold our urls
        let urls = [];

        window.tabs.forEach((tab) => {
            if (tab.url != "about:newtab") urls.push(tab.url);
        });
        
        // write each url to local storage
        browser.storage.local.set({ [key]: urls}).then(() => {
            // console.log("urls saved for", key, ": ", urls);
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
const name_error = document.getElementById("name_error");
submit.addEventListener("click", saveTabs);