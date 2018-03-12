import * as  NMEA from 'gps';
import { Parser } from './../parser/parser';
import { Observer } from 'backapijh';
import { Handler, Event, Operation } from 'flexiblepersistence';

export class GPS implements Observer {
  private subscribers: Array<any>;
  private atParser: Parser;

  private nmeaParser: Parser;
  private nmea: NMEA;

  private atCommandInit: string;
  private atCommandStart: string;

  private isStarted;

  private handler: Handler;

  private lastGPS;

  constructor(nmeaParser: Parser, atParser: Parser, atCommandInit, atCommandStart, handler: Handler) {
    this.isStarted = false;
    this.atCommandInit = atCommandInit;
    this.atCommandStart = atCommandStart;
    this.nmeaParser = nmeaParser;
    this.atParser = atParser;
    this.nmea = new NMEA;
    this.subscribers = new Array();
    this.handler = handler;
    let _self = this;
    this.handler.readOne('gPS', {}, _self.getLastGPS);
    this.init();
  }

  public init() {
    let _self = this;

    _self.nmeaParser.subscribe((data) => {
      switch (data.event) {
        case 'error':
          _self.error(data.error);
          break;

        case 'open':
          _self.openedNmea();
          break;

        case 'data':
          _self.getNmea().update(data.data);
          break;
      }
    });

    _self.atParser.subscribe((data) => {
      switch (data.event) {
        case 'error':
          _self.error(data.error);
          break;

        case 'open':
          _self.openedAt();
          break;

        case 'data':
          _self.dataAt(data.data);
          break;
      }
    });

    _self.getNmea().on('data', (data) => {
      let gPS = { data: data, gpsState: _self.getNmea().state };
      _self.updateLastGPS(gPS);
      _self.publish(gPS);
    });
  }

  public started() {
    this.isStarted = true;
  }

  public getStart(): boolean {
    return this.isStarted;
  }

  public getNmea(): NMEA {
    return this.nmea;
  }

  public getAtParser() {
    return this.atParser;
  }

  public getNmeaParser() {
    return this.nmeaParser;
  }

  public subscribe(callback) {
    // we could check to see if it is already subscribed
    this.subscribers.push(callback);
    console.log(callback.name, 'has been subscribed to GPS');
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

  private getLastGPS = (error, result: any) => {
    if (error) {
      console.error(error);
    } else {
      this.lastGPS = result;
      if (this.lastGPS === undefined) {
        console.log('new lastGPS');
        let event: Event = new Event(Operation.add, 'gPS', {});
        this.handler.addEvent(event);
      }
      console.log('lastGPS', this.lastGPS);
    }
  }

  private updateLastGPS(gPS) {
    this.lastGPS = gPS;
    let event: Event = new Event(Operation.update, 'gPS', this.lastGPS);
    this.handler.addEvent(event);
  }

  private error(error) {
    let _self = this;
    console.error('GPS ERROR:' + error);
  }

  // tslint:disable-next-line:no-empty
  private openedNmea() { }

  private openedAt() {
    let _self = this;
    _self.atParser.portWrite(_self.atCommandInit + '\r\n', (error) => {
      console.log('message written INIT');
      if (error) {
        console.error(error);
      }
    });
  }

  private dataAt(data) {
    let _self = this;
    if (!_self.getStart()) {
      console.log('data:' + data);
      if (data === 'OK') {
        _self.atParser.portWrite(_self.atCommandStart + '\r\n', (error) => {
          console.log('message written START');
          _self.started();
          if (error) {
            console.error(error);
          }
        });
      }
    }
  }

}
