const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt'); // путь к файлу
const output = fs.createWriteStream(filePath, { flags: 'a' }); // создаем поток для записи в файл

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Добро пожаловать! Введите текст для записи в файл. Чтобы выйти, введите "exit".');

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    console.log('Спасибо! Процесс завершен.');
    rl.close(); // закрываем интерфейс readline
    output.end(); // закрываем поток записи
  } else {
    output.write(`${input}\n`); // записываем ввод в файл
    console.log('Текст записан. Введите следующий текст:');
  }
});

rl.on('SIGINT', () => {
  console.log('\nСпасибо! Процесс завершен.');
  rl.close(); // закрываем интерфейс readline
  output.end(); // закрываем поток записи
});