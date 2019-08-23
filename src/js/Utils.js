const fs = require('fs').promises;
const https = require('https');
const { join } = require('path');
const { name } = require('../../package.json');

const fileExists = async function(file) {
    try {
        let stat = await fs.stat(file);
        return stat.isFile();
    } catch (e) {
        return false;
    }
};

const removeDir = async (dir) => {
    try {
        const files = await fs.readdir(dir);
        await Promise.all(files.map(async (file) => {
            try {
                const p = join(dir, file);
                const stat = await fs.lstat(p);
                if (stat.isDirectory()) {
                    await removeDir(p);
                } else {
                    await fs.unlink(p);
                }
            } catch (err) {
                console.error(err);
            }
        }));
        await fs.rmdir(dir);
    } catch (err) {
        console.error(err);
    }
};

const downloadFile = function(url) {
    return new Promise(function(resolve, reject) {
        https.get(url, (res) => {
            if (res.statusCode != 200) {
                reject(res.statusCode);
                return;
            }
            let data = '';
            res.on('data', (d) => {
                data += d;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
};

const os = process.platform === 'win32' ? 'win.exe' : process.platform === 'darwin' ? 'macos' : 'linux';
const exeName = `${name}-${os}`;

exports.fileExists = fileExists;
exports.removeDir = removeDir;
exports.downloadFile = downloadFile;
exports.exeName = exeName;