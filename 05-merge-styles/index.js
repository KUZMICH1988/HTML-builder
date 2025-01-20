const fs = require('fs');
const path = require('path');

// Path to the folders
const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectPath, 'bundle.css');

// Create or clean bundle.css
fs.writeFile(bundlePath, '', (err) => {
  if (err) {
      console.error('Ошибка при записи в файл:', err);
  }
});

// Read folder 'styles'
fs.readdir(stylesPath, (err, files) => {
  if (err) {
    console.error("Ошибка чтения папки", err);
    return;
  }

  // filtr only CSS files
  const cssFiles = files.filter(file => path.extname(file) === '.css');


  // read and integrate css files
  cssFiles.forEach(file => {
    const filePath = path.join(stylesPath, file);

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error("Ошибка чтения файла", err);
        return;
      }

      // Write everything in bundle.css
      fs.appendFile(bundlePath, data + '\n', err => {
        if (err) {
          console.error("Ошибка записи файла", err);
          return;
        }
      })
    })

  })
})

