const fs = require('fs/promises');
const path = require('path');

async function copy() {
  const ourFolder = path.join(__dirname, 'files');
  const copyFolder = path.join(__dirname, 'files-copy');

  try {
      // Удаляем новую папку, если существует
      await fs.rm(copyFolder, { recursive: true, force: true });

      // Создаем новую папку
      await fs.mkdir(copyFolder, { recursive: true });

      // Читаем содержимое исходной папки
      const files = await fs.readdir(ourFolder);

      // Создаем пути из нашей папки и новой папки
      for (const file of files) {
          const ourFile = path.join(ourFolder, file);
          const newFile = path.join(copyFolder, file);

          // Копируем файл
          await fs.copyFile(ourFile, newFile);
      }

      console.log('Копирование завершено!');
  } catch (error) {
      console.error('Ошибка при копировании:', error);
  }
}

copy();