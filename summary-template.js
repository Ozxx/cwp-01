const fs = require('fs');
const path = require('path');

const directoryPath = process.argv[2];
//const directoryPath = '{directoryPath}';

function getDirectoryInfo(dirPath) {
    fs.readdir(dirPath, (error, data) => {
        data.forEach((file) =>
        {
            fs.stat(dirPath + '/' + file, (error, state) =>
            {
                const node = dirPath + '/' + file;
                if (state.isDirectory()) {
                    getDirectoryInfo(node);
                } else {
                    console.log(path.relative(directoryPath, node));
                }
            });
        })
    });
}

function createBaseDirectory(dirPath) {
    const baseDirectory = path.parse(dirPath)['base'];
    const baseDirectoryPath = dirPath + '/' + baseDirectory;
    fs.mkdir(baseDirectoryPath, (error) =>
    {
        if (error.code === 'EEXIST') {
            console.log(
                '***Notification: ' + baseDirectory +
                'already exists on' + baseDirectoryPath);
        }
    });
    console.log(baseDirectory);
}


getDirectoryInfo(directoryPath);
createBaseDirectory(directoryPath);