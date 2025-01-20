const fs = require('fs/promises');
const path = require('path');

async function displayFilesInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
          const filePath = path.join(folderPath, file.name);
          const { size } = await fs.stat(filePath);
          const extname = path.extname(file.name).slice(1);
          const name = path.basename(file.name, path.extname(file.name));

          console.log(`${name} - ${extname} - ${size}b`);
      }
    }
    } catch (error) {
      console.error('Error reading the directory:', error);
  }
}

displayFilesInfo();