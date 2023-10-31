import fs from 'fs';
import path from 'path';

function saveFile(fullPath, writeStream) {
    try {
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    
        const outputStream = fs.createWriteStream(fullPath);
        writeStream.pipe(outputStream);

        outputStream.on('finish', () => {
            console.log(`File '${fullPath}' written successfully.`);
        });

        outputStream.on('error', (error) => {
            throw `Error writing to ${fullPath}: ${error.message}`;
        });
      } catch (error) {
        throw `Error writing to ${dirpath} ${fileName}: ${error.message}`;
      }
}

function getFileBuffer(filePath){
    //const filename = path.basename(filePath);
    if(!fs.existsSync(filePath)){
        console.log('file does not exist');
        return null;
    }
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer;
}

function removeFile(filePath){
    fs.unlinkSync(filePath);
}

export default {
    saveFile,
    getFileBuffer,
    removeFile
}