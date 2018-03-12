import * as  SerialPort from 'serialport';
import { Observer } from 'backapijh';
const Readline = SerialPort.parsers.Readline;
import * as  Semaphore from 'semaphore';

export class Parser implements Observer {
    private subscribers: Array<any>;
    private parser;
    private serialPort;
    private port;
    private timeout;
    private semaphore;
    // private isOpen: boolean;

    constructor(serialPort, timeout?) {
        this.serialPort = serialPort;
        this.timeout = timeout || 1000;
        this.port = new SerialPort(this.serialPort);
        this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
        this.subscribers = new Array();
        this.semaphore = Semaphore(1);
        // this.isOpen = false;
        this.open();
        this.error();
        this.pError();
        this.data();
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to PARSER');
    }

    public unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((element) => {
            return element !== callback;
        });
    }

    public publish(data) {
        this.subscribers.forEach((subscriber) => {
            subscriber(data);
        });
    }

    public portWrite(data, callback) {
        let _self = this;
        _self.semaphore.take(() => {
            _self.port.write(data, (error) => {
                _self.semaphore.leave();
                callback(error);
            });
        });
    }

    public setTimeout(timeout) {
        this.timeout = timeout;
    }

    public getTimeout() {
        return this.timeout;
    }

    public getSerialPort() {
        return this.serialPort;
    }

    private open() {
        let _self = this;
        _self.port.on('open', (error) => {
            if (error) {
                _self.publish({ event: 'error', error: error });
            } else {
                _self.publish({ event: 'open' });
            }
        });
    }

    // public open() {
    //     let _self = this;

    //     if (!_self.isOpen) {
    //         console.log('PARSER OPEN 0');
    //         _self.isOpen = true;
    //         _self.port.on('open', (error) => {
    //             if (error) {
    //                 _self.publish({ event: 'error', error: error });
    //             } else {
    //                 _self.publish({ event: 'open' });
    //             }
    //         });
    //     } else {
    //         console.log('PARSER OPEN 1');
    //         _self.publish({ event: 'open' });
    //     }
    // }

    private error() {
        let _self = this;
        _self.port.on('error', (error) => {
            _self.publish({ event: 'error', error: error });
        });
    }

    private pError() {
        let _self = this;
        _self.parser.on('error', (error) => {
            _self.publish({ event: 'error', error: error });
        });
    }

    private data() {
        let _self = this;
        _self.parser.on('data', (data) => {
            _self.publish({ event: 'data', data: data });
        });
    }
}
