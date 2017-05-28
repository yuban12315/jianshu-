let plantuml = require('node-plantuml');
let fs = require('fs');

let gen = plantuml.generate("input-file");
gen.out.pipe(fs.createWriteStream("output-file.png"))