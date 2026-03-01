import file from '@system.file';

const PREFIX = 'internal://app/';

function readFile(fileName, defaultValue, callback) {
    const uri = `${PREFIX}${fileName}`;
    file.readText({
        uri: uri,
        success: function(data) {
            console.info(`[FileManager] READ '${fileName}' success (${data.text.length}) bytes`);
            callback(data.text);
        },
        fail: function(data, code) {
            if(code === 301) {
                console.info(`[FileManager] READ '${fileName}' not found, using default`);
            } else {
                console.error(`[FileManager] READ '${fileName}' failed (code: ${code})`);
            }
            callback(defaultValue);
        }
    });
}

function writeFile(fileName, text, success, fail) {
    const uri = `${PREFIX}${fileName}`;
    file.writeText({
        uri: uri,
        text: text,
        success: function() {
            console.info(`[FileManager] WRITE '${fileName}' success (${text.length}) bytes`);
            if (success) {
                success(true);
            }
        },
        fail: function(data, code) {
            console.error(`[FileManager] WRITE '${fileName}' failed (code: ${code}), full path: ${uri}`);
            if (fail) {
                fail(data, code);
            }
        }
    });
}

function deleteFile(fileName, success, fail) {
    const uri = `${PREFIX}${fileName}`;
    file.delete({
        uri: uri,
        success: function() {
            console.info(`[FileManager] DELETE '${fileName}'`);
            if (success) {
                success(true);
            }
        },
        fail: function(data, code) {
            console.error(`[FileManager] DELETE '${fileName}' failed (code: ${code})`);
            if (fail) {
                fail(data, code);
            }
        }
    });
}

export const fileManager = {
    read: readFile,
    write: writeFile,
    delete: deleteFile
};
