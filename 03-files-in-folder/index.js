const fs = require("fs");
const path = require("path");

const pathToFolder = () => path.join(__dirname, `secret-folder`);
const pathToFile = (file) => path.join(__dirname, `secret-folder`, file);

fs.readdir(pathToFolder(), { withFileTypes: true }, (err, files) => {
  files.forEach((file) => {
    if (!file.isDirectory()) {
      fs.stat(pathToFile(path.parse(file.name).base), (err, stats) => {
        console.log(
          `${path.parse(file.name).name} - ${path
            .parse(file.name)
            .ext.split("")
            .slice(1)
            .join("")} - ${stats.size}b`
        );
      });
    }
  });
});
