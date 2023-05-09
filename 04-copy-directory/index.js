// 1. Импорт всех требуемых модулей
const fs = require("fs");
const path = require("path");

const pathToFiles = (dir, file = false) => {
  if (file !== false) {
    return path.join(__dirname, dir, file);
  } else {
    return path.join(__dirname, dir);
  }
};

function clearDir() {
  fs.mkdir(pathToFiles("files-copy"), { recursive: true }, (err) => {
    fs.readdir(pathToFiles("files-copy"), (err, files) => {
      files.forEach((file) => {
        fs.unlink(pathToFiles("files-copy", file), (err) => {
          if (err) throw err;
        });
      });
    });
  });
}

function createDir() {
  fs.mkdir(pathToFiles("files-copy"), { recursive: true }, (err) => {
    fs.readdir(pathToFiles("files"), (err, files) => {
      files.forEach((file) => {
        async function createAndCopy(file) {
          await createCopyFile(file);
          await fillCopiedFile(file);
        }
        createAndCopy(file);
      });
    });
  });
}

// 2. Создание папки **files-copy** в случае если она ещё не существует
async function createCopyFile(name) {
  fs.appendFile(`${pathToFiles("files-copy", name)}`, "", () => {});
}

// 3. Чтение содержимого папки **files**
// 4. Копирование файлов из папки **files** в папку **files-copy**
async function fillCopiedFile(name) {
  fs.copyFile(
    `${pathToFiles("files", name)}`,
    `${pathToFiles("files-copy", name)}`,
    () => {}
  );
}
clearDir();
createDir();
