import * as  NMEA from 'gps';
import { Parser } from './../parser/parser';
import { Observer } from 'backapijh';
import { Handler, Event, Operation } from 'flexiblepersistence';

export class GSM implements Observer {
  private subscribers: Array<any>;

  private parser: Parser;

  private atCommandSignal: string;

  private atCommandType: string;

  private isStarted: boolean;

  private portError: boolean;

  private delay: number;

  // private handler: Handler;

  private lastGSM;

  constructor(parser: Parser, atCommandSignal, atCommandType, delay: number, handler?: Handler) {
    this.atCommandSignal = atCommandSignal;
    this.atCommandType = atCommandType;
    this.parser = parser;
    this.subscribers = new Array();
    this.isStarted = false;
    this.portError = false;
    if (delay === undefined || delay < 1000) {
      delay = 1000;
    }
    this.delay = delay;
    // this.handler = handler;
    let _self = this;
    // this.handler.readOne('gSMs', {}, _self.getLastGSM);
    this.signalStart();
    this.init();
  }

  public init() {
    let _self = this;

    _self.parser.subscribe((data) => {
      switch (data.event) {
        case 'error':
          _self.error(data.error);
          break;

        case 'open':
          _self.isStarted = true;
          _self.start();
          break;

        case 'data':
          _self.data(data.data);
          break;
      }
    });

  }

  public signalStart() {
    this.conditionalStart();
  }

  public subscribe(callback) {
    // we could check to see if it is already subscribed
    this.subscribers.push(callback);
    console.log(callback.name, 'has been subscribed to GSM');
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

  public getParser() {
    return this.parser;
  }

  private getLastGSM = (error, result: any) => {
    if (error) {
      console.error(error);
    } else {
      this.lastGSM = result;
      if (this.lastGSM === undefined) {
        console.log('new lastGSM');
        // let event: Event = new Event(Operation.add, 'gSM', {});
        // this.handler.addEvent(event);
      }
      console.log('lastGSM', this.lastGSM);
    }
  }

  private updateLastGPS(gSM) {
    if (gSM.signal !== undefined) {
      this.lastGSM.signal = gSM.signal;
    }

    if (gSM.type !== undefined) {
      this.lastGSM.type = gSM.type;
    }

    if (gSM.error !== undefined) {
      this.lastGSM = gSM;
    }


    // let event: Event = new Event(Operation.update, 'gSM', this.lastGSM);
    // this.handler.addEvent(event);
  }

  private error(error) {
    console.error('GSM ERROR:' + error);
    this.portError = true;
  }

  private start() {
    let _self = this;
    if (!_self.portError) {
      console.log('start');
      _self.parser.portWrite(_self.atCommandSignal + '\r\n', (error) => {
        console.log('message GSM written INIT:' + _self.atCommandSignal);
        if (error) {
          console.error(error);
        }
      });

      _self.parser.portWrite(_self.atCommandType + '\r\n', (error) => {
        console.log('message GSM written INIT');
        if (error) {
          console.error(error);
        }
      });
    }
  }


  private data(data) {
    let _self = this;
    console.log('DATA:', data);
    // console.log(data);
    if (data.indexOf('+CSQ:') !== -1) {
      data = data.split('+CSQ:')[1];
      data = data.replace(/\s/g, '').split(',')[0];
      console.log('data CSQ:' + data);
      this.publish({ signal: data });
      // _self.start();
    }

    if (data.indexOf('*CNTI: 0,') !== -1) {
      data = data.split('*CNTI: 0,')[1];
      data = data.replace(/\s/g, '');
      console.log('data CNTI:' + data);
      switch (data) {
        case 'GSM':
          data = 'G'
          break;
        case 'GPRS':
          data = '2G'
          break;
        case 'EDGE':
          data = '2G+'
          break;
        case 'UMTS':
          data = '3G'
          break;
        case 'HSPA':
        case 'HSPA+':
        case 'HSUPA':
        case 'HSUPA+':
        case 'HSDPA':
        case 'HSDPA+':
        case 'HSDPA/HSUPA':
          data = '3G+'
          break;
        case 'LTE':
          data = '4G'
          break;
      }
      this.publish({ type: data });
      // _self.start();
    }

    if ((data.indexOf('+CREG:') !== -1)) {
      data = data.replace(/\s/g, '');
      data = data.split(':')[1];
      data = data.split(',');
      let registration: number = parseInt(data[0], 10);
      let type: number = parseInt(data[1], 10);
      if ((registration === 1)
        || (registration >= 5 && registration < 8)
        || (registration >= 9)) {
        console.log('data CNTI:' + type);
        data = type;
        switch (type) {
          case 0:
          case 1:
            data = 'G'
            break;
          case 2:
            data = '3G'
            break;
          case 3:
            data = '2G+'
            break;
          case 4:
          case 5:
          case 6:
            data = '3G+'
            break;
          case 7:
            data = '4G'
            break;
        }
        this.publish({ type: data });
      }
    }

    if ((data.indexOf('CME ERROR: 10') !== -1)
      || (data.indexOf('CME ERROR: 13') !== -1)
      || (data.indexOf('CME ERROR: 14') !== -1)
      || (data.indexOf('CME ERROR: 15') !== -1)) {
      this.publish({ error: 'SIM' });
    }
  }

  private conditionalStart() {
    let _self = this;
    // if (this.subscribers.length > 0) {
    this.start();
    let t = setTimeout(() => { _self.conditionalStart(); }, _self.delay);
    // }
  }
}
