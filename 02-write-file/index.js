// 1. Импорт всех требуемых модулей.
const fs = require("fs");
const path = require("path");
const readline = require("readline");
// 2. Создание потока записи в текстовый файл
const pathToFile = (name) => path.join(__dirname, name);

let readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 3. Вывод в консоль приветственного сообщения
// 4. Ожидание ввода текста пользователем, с дальнейшей проверкой ввода на наличие ключевого слова **exit**
// 5. Запись текста в файл
userInteractionFirst = () => {
  readlineInterface.question(`Пожалуйста, введите текст:`, (text) => {
    if (text === "exit") {
      console.log("Ok, bye!");
      readlineInterface.close();
    } else {
      fs.appendFile(pathToFile("02-write-file-file.txt"), text, function (err) {
        if (err) {
          throw err;
        }
      });
      userInteractionAll();
    }
  });
};

// 6. Ожидание дальнейшего ввода
userInteractionAll = () => {
  readlineInterface.question(``, (text) => {
    if (text === "exit") {
      console.log("Ok, bye!");
      readlineInterface.close();
    } else {
      fs.appendFile(pathToFile("02-write-file-file.txt"), text, function (err) {
        if (err) {
          throw err;
        }
      });
      userInteractionAll();
    }
  });
};

fs.appendFile(pathToFile("02-write-file-file.txt"), '', function (err) {
  if (err) {
    throw err;
  }
});

userInteractionFirst();

readlineInterface.on("SIGINT", function () {
  process.emit("SIGINT");
});

// 7. Реализация прощального сообщения при остановке процесса
process.on("SIGINT", function () {
  console.log("Ok, bye!");
  readlineInterface.close();
});
