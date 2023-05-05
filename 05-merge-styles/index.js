// 1. Импорт всех требуемых модулей
const fs = require("fs");
const path = require("path");
const functionPath = (folder, name = false) => {
  if (name === false) {
    return path.join(__dirname, folder);
  } else {
    return path.join(__dirname, folder, name);
  }
};

// 3. Чтение содержимого папки **styles**
async function createNewCss(name) {
  fs.unlink(functionPath("project-dist", name), () => {});
  fs.appendFile(functionPath("project-dist", name), "", () => {});
}

// 4. Проверка является ли объект файлом и имеет ли файл нужное расширение
async function mergeCss(dest) {
  fs.readdir(
    functionPath(dest),
    { withFileTypes: true },
    async (err, files) => {
      for (const file of files) {
        await checkExtension(file, dest);
      }
    }
  );
}

async function checkExtension(file, dest) {
  if (!file.isDirectory()) {
    fs.stat(functionPath(dest, path.parse(file.name).base), async () => {
      if (`${path.parse(file.name).ext}` === ".css") {
        const css = path.parse(file.name).base;
        await writeToCss(css);
      }
    });
  }
}

async function runTask() {
  await createNewCss(`bundle.css`);
  await mergeCss("styles");
}

// 4. Чтение файла стилей
// 5. Запись прочитанных данных в массив
// 6. Запись массива стилей в файл **bundle.css**
async function writeToCss(css) {
  const readStream = new fs.ReadStream(functionPath("styles", css)).setEncoding(
    "UTF8"
  );
  readStream.on("readable", function () {
    let stream = readStream.read();
    if (stream != null) {
      fs.appendFile(
        functionPath("project-dist", "bundle.css"),
        stream,
        function () {}
      );
    }
  });
}

runTask();
