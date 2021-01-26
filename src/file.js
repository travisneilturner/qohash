const fs = require('fs')
const path = require('path')

module.exports.formatFileSize = (number) => {
    if(number < 1024) {
        return number + ' bytes';
    } else if(number >= 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + ' KB';
    } else if(number >= 1048576) {
        return (number/1048576).toFixed(1) + ' MB';
    }
}

module.exports.getFileInfo = (route) => {
    const details = [];
    let totalFiles = 0
    let totalSize = 0

    let files = fs.readdirSync(route, 'utf8');

    for (let file of files) {
        const stats = fs.statSync(path.join(route, file));
        totalFiles++
        totalSize += stats.size
        details.push({ name: file, size: stats.size, isDirectory: stats.isDirectory(), lastModified: stats.mtime });
    }
    
    return { route, totalFiles, totalSize, details };
}
  