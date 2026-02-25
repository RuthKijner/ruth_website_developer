import fs from 'fs';
import path from 'path';
import ttf2woff2 from 'ttf2woff2';

const fontsFolder = './front_end/fonts';
const fontsFiles = fs.readdirSync(fontsFolder);
console.log(fontsFiles);

fontsFiles.forEach(file => {
    const extension = path.extname(file).toLocaleLowerCase();
    console.log(`Checking file: ${file} | Extension: ${extension}`);

    if (extension === '.ttf') 
    {
       // 1. Read the original TrueType data from the disk
       // We use path.join to create the full path to the file
       const inputPath = path.join(fontsFolder, file);
       console.log('Full path to file:',inputPath);
        const rawTtfData = fs.readFileSync(path.join(fontsFolder, file));
        console.log(rawTtfData);

        // 2. Transform the raw data into the compressed WebFont format
        const compressedWoff2Data = ttf2woff2(rawTtfData);

        // 3. Save the compressed data
        const outputFileName = file.replace('.ttf', '.woff2');
        const outputPath = path.join(fontsFolder, outputFileName);

        fs.writeFileSync(outputPath, compressedWoff2Data);
        console.log(`✅ Converted to: ${outputFileName}`);
    
    }

})