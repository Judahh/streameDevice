import { Observer } from 'backapijh';
import * as wifi from 'node-wifi';
import { Handler, Event, Operation } from 'flexiblepersistence';

export class Wifi implements Observer {
    private subscribers: Array<any>;

    private delay: number;

    private handler: Handler;

    private lastWifi;

    constructor(delay: number, handler: Handler) {
        wifi.init();
        this.subscribers = new Array();
        this.delay = delay;
        this.handler = handler;
        let _self = this;
        this.handler.readOne('wifis', {}, _self.getLastWifi);
        this.signalStart();
    }

    public scan() {
        let _self = this;
        wifi.scan((error, networks) => {
            if (error) {
                _self.error(error);
            } else {
                _self.publish({ visible: networks });
            }
        });
    }

    public getCurrentConnections() {
        let _self = this;
        wifi.getCurrentConnections((error, networks) => {
            if (error) {
                _self.error(error);
            } else {
                _self.publish({ current: networks });
            }
        });
    }

    public connect(data) {
        let _self = this;
        wifi.connect(data, (error) => {
            if (error) {
                _self.error(error);
                _self.updateLastWifi({ error: error });
            } else {
                _self.updateLastWifi({ connected: data });
                _self.publish({ connected: data });
            }
        });
    }

    public signalStart() {
        this.conditionalStart();
    }

    public subscribe(callback) {
         // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to WIFI');
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

    private error(error) {
        let _self = this;
        console.error('WIFI ERROR:' + error);
    }

    private conditionalStart() {
        let _self = this;
        // if (this.subscribers.length > 0) {
        this.getCurrentConnections();
        let t = setTimeout(() => { _self.conditionalStart(); }, _self.delay);
        // }
    }

    private getLastWifi = (error, result: any) => {
        if (error) {
            console.error(error);
        } else {
            this.lastWifi = result;
            if (this.lastWifi === undefined) {
                console.log('new lastWifi');
                let event: Event = new Event(Operation.add, 'wifi', {});
                this.handler.addEvent(event);
            }
            console.log('lastWifi', this.lastWifi);
        }
    }

    private updateLastWifi(lastWifi) {
        this.lastWifi = lastWifi;
        let event: Event = new Event(Operation.update, 'wifi', this.lastWifi);
        this.handler.addEvent(event);
    }
}
