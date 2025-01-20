const fs = require('fs').promises;
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');


// 1. Создаем папку project-dist
async function createProjectDist() {
    await fs.mkdir(projectDist, { recursive: true });
}

// 2. Заменяем теги в шаблоне
async function createIndexHtml() {
    const template = await fs.readFile(templatePath, 'utf-8');

    const componentNames = template.match(/{{(.*?)}}/g) || [];
    const uniqueComponents = [...new Set(componentNames.map(name => name.replace(/{{|}}/g, '').trim()))];

    let resultTemplate = template;

    for (const componentName of uniqueComponents) {
        const componentPath = path.join(componentsPath, `${componentName}.html`);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        resultTemplate = resultTemplate.replace(`{{${componentName}}}`, componentContent);
    }

    await fs.writeFile(path.join(projectDist, 'index.html'), resultTemplate);
}

// 3. Компилируем стили
async function compileStyles() {
  const newStylePath = path.join(projectDist, 'style.css');

  await fs.writeFile(newStylePath, '');

  try {
      const files = await fs.readdir(stylesPath);
      const cssFiles = files.filter(file => path.extname(file) === '.css');

      for (const file of cssFiles) {
          const filePath = path.join(stylesPath, file);
          const data = await fs.readFile(filePath, 'utf-8');
          await fs.appendFile(newStylePath, data + '\n');
      }
  } catch (err) {
      console.error("Ошибка при компиляции стилей:", err);
  }
}


// 4. Копируем assets
async function copyAssets() {

  const destAssetsPath = path.join(projectDist, 'assets');

  try {
      // Удаляем новую папку, если существует
      await fs.rm(destAssetsPath, { recursive: true, force: true });

      // Создаем новую папку
      await fs.mkdir(destAssetsPath, { recursive: true });

      // Читаем содержимое исходной папки с withFileTypes
      const files = await fs.readdir(assetsPath, { withFileTypes: true });

      // Создаем пути из нашей папки и новой папки
      for (const file of files) {
          const ourFile = path.join(assetsPath, file.name);
          const newFile = path.join(destAssetsPath, file.name);

          // проверяем, есть ли вложенность
          if (file.isDirectory()) {
              // Рекурсивно вызываем функцию
              await fs.mkdir(newFile, { recursive: true });
              await copyRecursive(ourFile, newFile);
          } else {
              // Копируем файл(если это файл)
              await fs.copyFile(ourFile, newFile);
          }
      }
  } catch (error) {
      console.error('Ошибка при копировании:', error);
  }
}

async function copyRecursive(our1, new1) {
  const files = await fs.readdir(our1, { withFileTypes: true });

  for (const file of files) {
      const ourFile = path.join(our1, file.name);
      const newFile = path.join(new1, file.name);

      if (file.isDirectory()) {
          await fs.mkdir(newFile, { recursive: true });
          await copyRecursive(ourFile, newFile);
      } else {
          await fs.copyFile(ourFile, newFile);
      }
  }

}

// Главная функция
async function build() {
    try {
        await createProjectDist();
        await createIndexHtml();
        await compileStyles();
        await copyAssets();
        console.log('Сборка завершена! Папка project-dist создана.');
    } catch (error) {
        console.error('Ошибка при сборке:', error);
    }
}

build();
