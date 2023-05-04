const fs = require('fs');
const path = require('path');
const pathToFile = (name) => path.join(__dirname, name);
const readStream = new fs.ReadStream(pathToFile('text.txt')).setEncoding('UTF8');
let data = '';

readStream.on('readable', function(){
    let stream = readStream.read();
    if (stream != null) {
        data += stream;
    }
});
 
readStream.on('end', function(){
    console.log(data);  
});