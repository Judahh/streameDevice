import { path, BasicApi, BasicExternalHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';

export class ExternalHandler extends BasicExternalHandler {

    constructor(hardwareHandler: HardwareHandler) {
        super(hardwareHandler);
        this.hardwareHandler.setExternalHandler(this);
    }

    public uploadVideo(video) {
        this.hardwareHandler.uploadVideo(video);
    }

    public externalPublish(subscribers, data) {
        this.hardwareHandler.externalPublish(subscribers, data);
    }

    public externalSubscribe(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public externalSubscribeStream(subscribers, socket) {
        this.hardwareHandler.externalSubscribe(subscribers, (data) => {
            socket.emit('stream', data);
        });
    }

    public devicePublish(device, subscribers, data) {
        this.hardwareHandler.devicePublish(device, subscribers, data);
    }

    public deviceSubscribe(device, subscribers, socket) {
        this.hardwareHandler.deviceSubscribe(device, subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public getDevices() {
        for (let index = 0; index < this.arraySocket.length; index++) {
            let socketBasic = this.arraySocket[index];
            socketBasic.emit('getUsers', {});
        }
    }

    public users(socketBasic, users) {
        let identification = socketBasic.getIdentification();
        this.externalPublish('newDevice', { identification: identification, users: users });
    }

    protected serverConnected(socketBasic) {
        console.log('ID:', socketBasic.getIdentification());
        socketBasic.emit('subscribeGPS', {});
        socketBasic.emit('subscribeGSM', {});
        socketBasic.emit('subscribeWifi', {});
        socketBasic.emit('subscribeStream', {});
        socketBasic.emit('subscribeDisk', {});
        socketBasic.emit('getUsers', {});
    }

    public configSocket(socketBasic: BasicSocket) {
        let _self = this;
        socketBasic.on('online', (online) => {
            _self.externalPublish('online', online);
        });
        socketBasic.on('gSM', (data) => {
            _self.externalPublish('gSM', data);
        });
        socketBasic.on('gPS', (data) => {
            _self.externalPublish('gPS', data);
        });
        socketBasic.on('wifi', (data) => {
            _self.externalPublish('wifi', data);
        });
        socketBasic.on('stream', (data) => {
            _self.externalPublish('streamOut', data);
        });
        socketBasic.on('subscribeStream', () => {
            _self.externalSubscribe('streamIn', socketBasic);
        });
        socketBasic.on('subscribeUser', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'user', socketBasic);
        });
        socketBasic.on('subscribeRemoveUser', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'removeUser', socketBasic);
        });
        socketBasic.on('subscribeUsers', () => {
            _self.deviceSubscribe(socketBasic.getIdentification().serialNumber, 'users', socketBasic);
        });

        socketBasic.on('disk', (data) => {
            _self.uploadVideo(data.upload);
        });

        socketBasic.on('users', (users) => {
            _self.users(socketBasic, users);
        });

        // console.log(socketBasic.getIdentification());
        // _self.externalPublish('newDevice', _self.getFullIdentification(socketBasic));
        // this.io.on()
    }
}
