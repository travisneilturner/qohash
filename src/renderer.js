const backButton = document.getElementById('back_button')
const preview = document.querySelector('.preview');
const textInput = document.getElementById('dir_text');

// Register an event handler to receive file data from the
// main process
window.api.receive("file-response", (data) => {
  if (data.error) {
    // I know, I know... :(
    alert("An error occurred: " + data.error)
    return
  }

  // update the text box to show new path
  textInput.value = data.route

  // render the output
  renderFileOutput(data);
});

// Handle the back button click event
backButton.onclick = (ev) => {
  ev.preventDefault();
  const pathParts = textInput.value.split('/');
 
  let newPath = pathParts.splice(0, pathParts.length-1).join('/');

  if (newPath === "") {
    newPath = "/";
  }

  getNewPath(newPath);
};

// Handle the on change event for the directory text box
textInput.onchange = (ev) => {
  ev.preventDefault();
  getNewPath(textInput.value);
}

// Return a pretty string for file sizes
const formatFileSize = (number) => {
  if(number < 1024) {
      return number + ' bytes';
  } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + ' KB';
  } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + ' MB';
  }
}

// Send the IPC message to the main process to get filesystem info
const getNewPath = (newPath) => {
  window.api.send('get-files', newPath);
}

// Render the received data from the main process
const renderFileOutput = (data) => {
  const { details, totalSize, totalFiles } = data;
  details.sort((a, b) => b.size - a.size);

  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  if(details.length === 0) {
    const para = document.createElement('p');
    para.textContent = 'Directory contains no files';
    preview.appendChild(para);
    return;
  } 

  const totals = document.createElement('p');
  totals.textContent = `Total files: ${totalFiles}\tTotal size: ${formatFileSize(totalSize)}`;
  preview.appendChild(totals);

  const list = document.createElement('table');

  for (let file of data.details) {
    const listItem = document.createElement('tr');
    const fileCol = document.createElement('td');
    const sizeCol = document.createElement('td');
    const lastModifiedCol = document.createElement('td');

    const text = document.createTextNode(file.name);
    const size = document.createTextNode(formatFileSize(file.size));
    const lastModified = document.createTextNode(
      file.lastModified.toISOString().
        replace(/T/, ' ').
        replace(/\..+/, '')
    );

    if (file.isDirectory) {
      const anchor = document.createElement('a');
      anchor.href = '#';
      anchor.onclick = (ev) => {
        ev.preventDefault();
        let newPath;
        if (textInput.value === "/") {
          newPath = textInput.value + file.name
        } else {
          newPath = textInput.value + "/" + file.name
        }
        getNewPath(newPath);
      }
      anchor.appendChild(text);
      fileCol.appendChild(anchor);
    } else {
      fileCol.appendChild(text);
    }

    sizeCol.appendChild(size);
    lastModifiedCol.appendChild(lastModified);
    listItem.appendChild(fileCol);
    listItem.appendChild(sizeCol);
    listItem.appendChild(lastModifiedCol);
    list.appendChild(listItem);
  }

  preview.appendChild(list);
}

textInput.value = "/";
getNewPath("/");