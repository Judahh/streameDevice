import { Observer } from 'backapijh';
import { Handler, Event, Operation } from 'flexiblepersistence';
import * as disk from 'diskusage';
import * as childProcess from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

export class Disk implements Observer {
    private subscribers: Array<any>;

    // private handler: Handler;

    private lastDisk;

    constructor(handler?: Handler) {
        this.subscribers = new Array();
        // this.handler = handler;
        let _self = this;
        // this.handler.readOne('disks', {}, _self.getLastDisk);
    }

    public getSpace() {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_ROOT : process.env.LINUX_ROOT;
        disk.check(path, (error, info) => {
            if (error) {
                _self.error(error);
            } else {
                _self.updateLastDisk({ space: info });
                _self.publish({ space: info });
            }
        });
    }

    public getVideos() {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_VIDEOS_PATH : process.env.LINUX_VIDEOS_PATH;
        childProcess.exec('ls',
            { cwd: path },
            (error, stdout, stderr) => {
                if (error) {
                    _self.error(error);
                    _self.updateLastDisk({ error: error });
                } else {
                    let array = stdout.split('\n');
                    array.pop();
                    _self.updateLastDisk({ videos: array });
                    _self.publish({ videos: array });
                }
            });
    }

    public checkVideos() {
        let path = os.platform() === 'win32' ? process.env.WIN32_VIDEOS_PATH : process.env.LINUX_VIDEOS_PATH;
        return fs.existsSync(path);
    }

    public uploadVideo(video) {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_VIDEOS_PATH : process.env.LINUX_VIDEOS_PATH;
        fs.writeFile(path + '/' + video.name + '.' + video.format, video.video, (error) => {
            if (error) {
                // if (error.code != 'ENOENT') {
                _self.error(error);
                _self.updateLastDisk({ error: error });
                // }
                return;
            } else {
                _self.updateLastDisk({
                    uploaded: {
                        name: video.name,
                        format: video.format,
                        path: (path + '/' + video.name + '.' + video.format)
                    }
                });
                _self.publish({
                    uploaded: {
                        name: video.name,
                        format: video.format,
                        path: (path + '/' + video.name + '.' + video.format)
                    }
                });
            }
        });
    }

    public subscribe(callback) {
        // we could check to see if it is already subscribed
        this.subscribers.push(callback);
        console.log(callback.name, 'has been subscribed to Disk');
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

    private getLastDisk = (error, result: any) => {
        if (error) {
            console.error(error);
        } else {
            this.lastDisk = result;
            if (this.lastDisk === undefined) {
                console.log('new lastDisk');
                let event: Event = new Event(Operation.add, 'disk', {});
                // this.handler.addEvent(event);
            }
            console.log('lastDisk', this.lastDisk);
        }
    }

    private updateLastDisk(lastDisk) {
        this.lastDisk = lastDisk;
        let event: Event = new Event(Operation.update, 'disk', this.lastDisk);
        // this.handler.addEvent(event);
    }

    private error(error) {
        console.error('DISK ERROR:' + error);
    }

}
