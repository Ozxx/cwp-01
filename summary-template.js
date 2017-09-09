const fs = require('fs');
const path = require('path');

const directoryPath = '{directoryPath}';

function getDirectoryInfo(dirPath) {
    fs.readdir(dirPath, (error, data) => {
        data.forEach((file) => {
            fs.stat(dirPath + '/' + file, (error, state) => {
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
    fs.mkdir(baseDirectoryPath, (error) => {
        if (error.code === 'EEXIST') {
            console.log(
                '***Notification: ' + baseDirectory +
                'already exists on' + baseDirectoryPath);
        }
    });
    return baseDirectoryPath;
}

function getCopyright() {
    let copyright = "";
    fs.readFile('config.json', function (err, data) {
        if (err) {
            throw new Error('Copyright not specified');
        } else {
            copyright = JSON.parse(data.toString());
        }
    });
    return copyright;
}

function copyTxtFiles(from, to) {
    const baseName = path.parse(to)['base'];
    const copyright = getCopyright();
    fs.readdir(from, (error, data) => {
        data.forEach((file) => {
            fs.stat(from + '/' + file, (error, state) => {
                const node = from + '/' + file;
                if (file !== baseName) {
                    if (state.isDirectory()) {
                        copyTxtFiles(node, to);
                    } else {
                        if (path.extname(file).toLowerCase() === '.txt') {
                            fs.createReadStream(from + '/' +file).pipe(fs.createWriteStream(to + '/' + file));
                            fs.readFile(to + '/' + file, (err, data) => {
                                if (err) {
                                    console.error('');
                                } else {
                                    newData = copyright + data.toString() + copyright;
                                    fs.writeFile(to + '/' + file, newData, 'utf8', () => {});
                                }
                            });
                        }
                    }
                }
            });
        })
    });
}

try {
    getDirectoryInfo(directoryPath);
    let base = createBaseDirectory(directoryPath);
    copyTxtFiles(directoryPath, base);
    fs.watch(base, {encoding: 'buffer'}, (eventType, filename) => {
    if (filename) { console.log(filename.toString()); }
    });
} catch (error) {
    console.log(error.message);
}



