import { Observer } from 'backapijh';
import * as childProcess from 'child_process';
import * as os from 'os';
import * as fs from 'fs';

export class Disk implements Observer {
    private subscribers: Array<any>;
    private lastFile: string;
    private currentFile: string;

    constructor() {
        this.subscribers = new Array();
    }

    private error(error) {
        console.error('DISK ERROR:' + error);
    }

    public getVideos() {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_VIDEOS_PATH : process.env.LINUX_VIDEOS_PATH;
        childProcess.exec('ls',
            { cwd: path },
            (error, stdout, stderr) => {
                if (error) {
                    _self.error(error);
                } else {
                    let array = stdout.split('\n');
                    array.pop();
                    _self.publish({ videos: array });
                }
            });
    }

    public uploadVideo(video) {
        let _self = this;
        let path = os.platform() === 'win32' ? process.env.WIN32_VIDEOS_PATH : process.env.LINUX_VIDEOS_PATH;
        fs.writeFile(path + '/' + video.name + '.' + video.format, video.video, (error) => {
            if (error) {
                // if (error.code != 'ENOENT') {
                _self.error(error);
                // }
                return;
            } else {
                _self.publish({
                    uploaded: {
                        name: video.name,
                        format: video.format,
                        path: (path + '/' + video.name + '.' + video.format)
                    }
                });
                let doDelete = (_self.lastFile != undefined);
                if (_self.currentFile != undefined) {
                    _self.lastFile = _self.currentFile;
                }
                _self.currentFile = path + '/' + video.name + '.' + video.format;
                if (doDelete) {
                    _self.delete(_self.lastFile);
                }
            }
        });
    }

    public delete(lastFile) {
        // console.log(video);
        let _self = this;
        this.publish({ delete: lastFile });
        if (lastFile != undefined && lastFile != null) {
            fs.unlink(lastFile, (error) => {
                if (error) {
                    if (error.code != 'ENOENT') {
                        _self.error(error);
                    }
                } else {
                    _self.publish({ deleted: lastFile });
                }
            });
        }

    }

    public subscribe(callback) {
        //we could check to see if it is already subscribed
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

}
