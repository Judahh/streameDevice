import { path, BasicApi, BasicExternalHandler, BasicSocket } from 'backapijh';
import { HardwareHandler } from '../hardwareHandler/hardwareHandler';
// import { compile } from 'morgan';

export class ExternalHandler extends BasicExternalHandler {

    constructor(hardwareHandler: HardwareHandler) {
        super(hardwareHandler);
        this.hardwareHandler = hardwareHandler;
    }

    public init() {
        let _self = this;
        this.hardwareHandler.appSubscribe('connectToServer', (data) => {
            console.log('START CONNECTION TO SERVER');
            _self.connectToServer(data.address, HardwareHandler.getIdentification());
        });
    }

    protected clientConnected(basicSocket) {
        console.log('ID:', basicSocket.getIdentification());
        // console.log('CONNECTED');
        basicSocket.emit('subscribeStream', {});
        console.log('SERVER CONNECTED');
        this.hardwareHandler.externalPublish('server', { server: basicSocket.getIdentification() });
        // basicSocket.emit('subscribeUser', {});
        // basicSocket.emit('subscribeRemoveUser', {});
        // basicSocket.emit('subscribeUsers', {});
    }

    public getUptime(socket) {
        this.hardwareHandler.getUptime((uptime) => {
            socket.emit('uptime', uptime);
        });
    }

    public getWifiConnections(socket) {
        this.hardwareHandler.getWifiConnections();
    }

    public getWifiConnected(socket) {
        this.hardwareHandler.getWifiConnected();
    }

    public getVideos() {
        this.hardwareHandler.getVideos();
    }

    public uploadVideo(video) {
        this.hardwareHandler.uploadVideo(video);
    }

    public subscribeDisk(socket) {
        this.hardwareHandler.subscribeDisk((data) => {
            socket.emit('disk', data);
        });
    }

    public subscribeGPS(socket) {
        this.hardwareHandler.subscribeGPS((data) => {
            socket.emit('gPS', data);
        });
    }

    public subscribeGSM(socket) {
        this.hardwareHandler.subscribeGSM((data) => {
            socket.emit('gsm', data);
        });
    }

    public subscribeWifi(socket) {
        this.hardwareHandler.subscribeWifi((data) => {
            socket.emit('wifi', data);
        });
    }

    public checkIsOnline(socket) {
        this.hardwareHandler.checkIsOnline((online) => {
            socket.emit('online', online);
        });
    }

    public setWifiConnection(data) {
        let _self = this;
        this.hardwareHandler.setWifiConnection(data);
    }

    public appPublish(subscribers, data) {
        this.hardwareHandler.appPublish(subscribers, data);
    }

    public appSubscribe(subscribers, socket) {
        this.hardwareHandler.appSubscribe(subscribers, (data) => {
            socket.emit(subscribers, data);
        });
    }

    public appSubscribeStream(subscribers, socket) {
        this.hardwareHandler.appSubscribe(subscribers, (data) => {
            console.log('STREAM SENT');
            socket.emit('stream', data);
        });
    }

    protected configSocketClient(basicSocket: BasicSocket) {
        let _self = this;
        basicSocket.on('getUptime', () => { _self.getUptime(basicSocket); });

        // basicSocket.on('uploadVideo', (video) => { _self.uploadVideo(video); });
        // basicSocket.on('getVideos', () => { _self.getVideos(); });
        // basicSocket.on('subscribeDisk', () => { _self.subscribeDisk(basicSocket); });

        // basicSocket.on('subscribeGPS', () => { _self.subscribeGPS(basicSocket); });

        // basicSocket.on('subscribeGSM', () => { _self.subscribeGSM(basicSocket); });

        basicSocket.on('checkIsOnline', () => { _self.checkIsOnline(basicSocket); });

        basicSocket.on('subscribeWifi', () => { _self.subscribeWifi(basicSocket); });
        basicSocket.on('getWifiConnected', () => { _self.getWifiConnected(basicSocket); });
        basicSocket.on('getWifiConnections', () => { _self.getWifiConnections(basicSocket); });
        basicSocket.on('setWifiConnection', (data) => { _self.setWifiConnection(data); });

        // basicSocket.on('user', (user) => { _self.hardwareHandler.addUser(user); });
        // basicSocket.on('removeUser', (user) => { _self.hardwareHandler.removeUser(user); });
        // basicSocket.on('users', (users) => { _self.hardwareHandler.setUsers(users); });
        // basicSocket.on('getUsers', () => { _self.hardwareHandler.getUsers(basicSocket); });


        basicSocket.on('subscribeStream', () => { _self.appSubscribeStream('streamIn', basicSocket); });
        basicSocket.on('streamIn', (data) => { _self.appPublish('streamOut', data); });
    }
}
