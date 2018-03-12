import { Parser } from './parser';

export class Parsers {
    private static instance;
    private parsers: Array<Parser>;

    public static getInstance(): Parsers {
        if (!Parsers.instance) {
            Parsers.instance = new Parsers();
        }
        return Parsers.instance;
    }

    constructor() {
        this.parsers = new Array<Parser>();
    }

    public getParser(serialPort, timeout?): Parser {
        serialPort = serialPort.replace(/\s/g, '');
        for (let index = 0; index < this.parsers.length; index++) {
            let newParser = this.parsers[index];
            if (newParser.getSerialPort() === serialPort) {
                if (timeout) {
                    newParser.setTimeout(timeout);
                }
                return newParser;
            }
        }
        let parser = new Parser(serialPort, timeout);
        this.parsers.push(parser);
        return parser;
    }

}
