import fs from 'fs';
import path from 'path';

function saveFile(dirpath, fileName, fileBuffer) {
    try {
        console.log('dirpath', dirpath)
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true });
        }

        let fullPath = path.join(dirpath, fileName);
        console.log('fullPath', fullPath)
    
        fs.writeFileSync(fullPath, fileBuffer);
    
        console.log(`File '${fullPath}' written successfully.`);
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