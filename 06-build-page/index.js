// 1. Импорт всех требуемых модулей
const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");

function functionPath() {
  if (typeof arguments[0] !== "string") {
    return path.join(__dirname, arguments[0].join("/"));
  } else {
    let dir = [__dirname];
    let pathElements = Array.from(arguments);
    let totalPath = dir.concat(pathElements);
    return path.join.apply(null, totalPath);
  }
}

let componentsArray = [];
let count = 0;

//1. Создаёт папку  **project-dist**.
async function createDir(dir) {
  fs.mkdir(dir, { recursive: true }, () => {});
}

async function clearDir(dir) {
  try {
    await fsPromise.rmdir(dir, { recursive: true }, () => {});
  } catch (err) {}
}

// 7. Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist
// 4. Копирует папку **assets** в **project-dist/assets**
async function copyAssets() {
  fs.readdir(
    functionPath(Array.from(arguments)),
    { withFileTypes: true },
    (err, files) => {
      files.forEach((file) => {
        if (!file.isDirectory()) {
          fsPromise
            .appendFile(
              `${functionPath(...Array.from(arguments), file.name)}`,
              ""
            )
            .then(() => {
              fs.copyFile(
                `${functionPath(...Array.from(arguments), file.name)}`,
                `${functionPath(
                  "project-dist",
                  ...Array.from(arguments),
                  file.name
                )}`,
                () => {}
              );
            });
        } else if (file.isDirectory()) {
          fsPromise
            .mkdir(
              functionPath("project-dist", ...Array.from(arguments), file.name),
              { recursive: true }
            )
            .then(() => {
              copyAssets(...Array.from(arguments), file.name);
            });
        }
      });
    }
  );
}

// 6. Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
// 3. Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.
async function mergeStyles(folder) {
  const dest = functionPath("project-dist", "style.css");
  fs.unlink(dest, () => {});
  fs.appendFile(dest, "", () => {});
  fs.readdir(
    functionPath(folder),
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
        await writeToCss(css, dest);
      }
    });
  }
}

async function writeToCss(css, dest) {
  const readStream = new fs.ReadStream(functionPath("styles", css)).setEncoding(
    "UTF8"
  );
  readStream.on("readable", function () {
    let stream = readStream.read();
    if (stream != null) {
      fs.appendFile(dest, stream, function () {});
    }
  });
}

async function fillComponentsArray(components) {
  const filePath = functionPath(components);
  fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      if (!file.isDirectory()) {
        let filePath = functionPath(components, file.name);
        let fileExt = path.extname(filePath);
        let fileName = path.basename(filePath, fileExt);
        componentsArray.push(fileName);
      }
    });
  });
}

// 2. Прочтение и сохранение в переменной файла-шаблона
// 3. Нахождение всех имён тегов в файле шаблона
// 4. Замена шаблонных тегов содержимым файлов-компонентов
// 5. Запись изменённого шаблона в файл **index.html** в папке **project-dist**
// 2. Заменяет шаблонные теги в файле **template.html** с названиями файлов из папки components (пример:```{{section}}```) на содержимое одноимённых компонентов и  сохраняет результат в **project-dist/index.html**.
async function readTemplate(template) {
  const filePath = functionPath(template);
  let newTemplate = "";
  const readStream = new fs.ReadStream(filePath).setEncoding("UTF8");
  readStream.on("readable", function () {
    let stream = readStream.read();
    if (stream != null) {
      newTemplate += stream;
    }
  });
  readStream.on("end", function () {
    count = componentsArray.length;
    fs.readFile(filePath, "utf8", function (err, data) {
      for (template in componentsArray) {
        let newRegexp = new RegExp(`{{${componentsArray[template]}}}`, "g");
        const readStream = new fs.ReadStream(
          functionPath("components", `${componentsArray[template]}.html`)
        ).setEncoding("UTF8");
        let data = "";
        readStream.on("readable", function () {
          let stream = readStream.read();
          if (stream != null) {
            data += stream;
          }
        });
        readStream.on("end", function () {
          count -= 1;
          newTemplate = newTemplate.replace(newRegexp, data);
          if (count === 0) {
            fs.unlink(functionPath("project-dist", "index.html"), () => {});
            fs.appendFile(
              functionPath("project-dist", "index.html"),
              newTemplate,
              function (err) {
                if (err) {
                  throw err;
                }
              }
            );
          }
        });
      }
    });
  });
}

async function createPage() {
  await clearDir(functionPath("project-dist"));
  await createDir(functionPath("project-dist"));
  await copyAssets("assets");
  await mergeStyles("styles");
  await fillComponentsArray("components");
  await readTemplate("template.html");
}

createPage();
