import * as fs from 'fs';
import * as  uuidv1 from 'uuid/v1';
let packageJson = require('./../../package.json');

export class Identification {
    public serialNumber;
    public version;
    public model;

    constructor() {
        if (process.env.STREAME_SERIAL_NUMBER) {
            this.serialNumber = process.env.STREAME_SERIAL_NUMBER;
        } else {
            let serial = uuidv1();
            let line = '\n' + 'STREAME_SERIAL_NUMBER=' + serial;
            fs.appendFileSync('.env', line);
            this.serialNumber = serial;
        }

        this.version = packageJson.version;
        this.model = process.env.STREAME_MODEL;
    }
}
