const fs = require('fs');
const path = require('path');

const directoryPath = process.argv[2];

if (directoryPath !== undefined) {
    fs.stat(directoryPath, (err, stats) => {
        if (err || !(stats.isDirectory())) {
            console.error("Неверный путь!");
        } else {
            fs.readFile("summary-template.js", "utf8", (error, data) => {
                let scriptData = data.replace("{directoryPath}", directoryPath);
                fs.writeFile(directoryPath + '/' + 'summary.js', scriptData);
            });
            console.log('node ' + directoryPath + '\\summary.js');
        }
    });
} else {
    console.error("Введите путь к файлу!");
}
