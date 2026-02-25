import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const __dirname = import.meta.dirname;
console.log(__dirname);

// # set the directory of the file
const imagesFolder = path.join(__dirname, '../frontend/assets');
console.log(imagesFolder);

const imagesFiles = fs.readdirSync(imagesFolder);
console.log(imagesFiles);


// # setting which files format to convert 
const supportedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

// # converting the files in array
console.log(`📸 Starting image optimization...`);

//# going over the entire list 
imagesFiles.forEach(async (file) => {
    const fileExtension = path.extname(file).toLowerCase();
    console.log(`Checking file: ${file} | Extension: ${fileExtension}`);

    //# checking the the file is with supported extension 
    if(supportedExtensions.includes(fileExtension)){
        // 1. Create the 'Source Address': We combine the folder path and the original filename 
        // so Node.js knows exactly which file to pick up from your hard drive.
        const filePath = path.join(imagesFolder, file);
        console.log('Full path to file:', filePath);
        
        // 2. The "Naming Phase": This does NOT create a file. 
        // It simply calculates what the name will be (e.g., "sky.png" -> "sky.avif").
        const newExtensionName = file.replace(fileExtension, '.avif');
        console.log('New file extension name:', newExtensionName);

        // 3. Create the 'Destination Address': We tell the script exactly where to 
        // save the new data once the conversion is finished.
        const FilePath = path.join(imagesFolder, newExtensionName);

            try{
            // # The Actual Conversion: Sharp takes the "Source Address", 
            // crunches the data, and saves it to the "Destination Address".
                await sharp(filePath).avif({ quality: 65 }).toFile(FilePath);
                console.log(`✅ Converted to: ${newExtensionName}`);

            }catch(error){
                console.error(`❌ Error with ${file}:`, err.message);
            }

    }
});