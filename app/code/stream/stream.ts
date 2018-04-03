import { AppObject, Component } from 'backappjh';
import { BasicSocket, UniqueSocket } from 'basicsocket';
import { Disk } from './../disk/disk';
import * as freeice from 'freeice';
import 'webrtc-adapter';
import { UserManegement } from '../user/userManegement';
declare var MediaRecorder: any;
declare var AudioContext: any;

export class Stream extends AppObject {
    private static instance: Stream;
    private stream;
    private format: string;
    private video: any;
    private audio: boolean;
    private duration: number;
    private disk: Disk;
    private streamRecorder;
    private socketIo: BasicSocket;
    private configuration;
    private streamConnection;
    private subscribers: Array<any>;

    public static getInstance(father?: Component): Stream {
        if (!Stream.instance) {
            Stream.instance = new Stream(father);
        }
        return Stream.instance;
    }

    constructor(father?: Component) {
        super(father);
        this.init();
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

    public setDuration(duration: number) {
        this.duration = duration;
    }

    public getDuration() {
        return this.duration;
    }

    public setAudio(audio: boolean) {
        this.audio = audio;
    }

    public getAudio() {
        return this.audio;
    }

    public setFormat(format: string) {
        this.format = format;
    }

    public getFormat() {
        return this.format;
    }

    public checkStream() {
        if (this.stream === undefined) {
            UserManegement.getInstance().goTo('cameraSettings');
        }
    }

    public startVideo(video?: any, audio?: boolean) {
        let _self = this;
        let oldVideo = _self.video;
        let oldAudio = _self.audio;

        if (video !== undefined) {
            _self.video = video;
        }
        if (audio !== undefined) {
            _self.audio = audio;
        }

        // _self.streamRecorder.stop();
        // console.log('New Video:', _self.video);
        // console.log('New Audio:', _self.audio);
        let constraints = { video: _self.video, audio: _self.audio };
        // console.log('New constraints:', constraints);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                // console.log('New Stream:', stream);
                _self.stream = stream;
                // console.log(_self.stream);
                // _self.configStream(stream);
                // _self.startRecording();
            }).catch((error) => {
                console.error(error);
                if (oldVideo !== video) {
                    _self.startVideo(oldVideo, oldAudio);
                }
            });
        } else {
            console.error('cam failed');
        }
    }

    public getVideo() {
        return this.video;
    }

    public startRecording() {
        let _self = this;
        if (_self.stream !== undefined) {
            if (_self.duration > 0) {
                let type = 'audio';
                console.log('Start Record!!!');
                if (_self.video !== undefined) {
                    type = 'video';
                }
                _self.streamRecorder = new MediaRecorder(_self.stream, {

                    mimeType: (type + '/' + _self.format)
                });
                _self.streamRecorder.start();
                _self.streamRecorder.ondataavailable = (e) => {
                    _self.postVideoToServer(e.data);
                };
                setTimeout(() => { _self.restartRecording(); }, _self.duration);
            }
        }
    }

    public restartRecording() {
        // console.log('Stop Record!!!');
        let _self = this;
        _self.streamRecorder.stop();
        _self.streamRecorder.start();
        // console.log(_self.duration);
        setTimeout(() => { _self.restartRecording(); }, _self.duration);
    }

    public postVideoToServer(videoblob) {
        // console.log('Post Video to Server!!!');
        let _self = this;
        let data = {
            name: new Date(),
            video: videoblob,
            format: _self.format
        };
        _self.disk.uploadVideo(data);
    }

    public getStream() {
        return this.stream;
    }

    public getStreamView(component) {
        let stream = Stream.getInstance();
        stream.subscribe((streamingData) => { stream.streamView(component, streamingData); });
        let streaming = Stream.getInstance().getStream();
        if (streaming !== undefined && streaming != null) {
            stream.streamView(component, streaming);
        }

    }

    public streamView(component, stream) {
        console.log('STREAMVIEW!!!', component);
        (<any>(<Component>component).getElement()).src = window.URL.createObjectURL(stream);
    }

    public startStream() {
        this.configStream(this.stream);
    }

    private init() {
        let _self = this;
        _self.subscribers = new Array<any>();
        _self.socketIo = UniqueSocket.getInstance().getBasicSocket();
        _self.socketIo.emit('subscribeStream', {});
        _self.configuration = {
            'iceServers': [
                { url: 'stun:stun.l.google.com:19302' },
                { url: 'turn:71.6.135.115:3478', username: 'test', credential: 'tester' },
                { url: 'turn:71.6.135.115:3479', username: 'test', credential: 'tester' }
            ]
        };
        _self.streamConnection = new RTCPeerConnection(_self.configuration);
        // console.log('STREAM:', _self.streamConnection);
        _self.socketIo.on('stream', (stream) => {
            if (stream.answer) {
                console.log('answer!!!');
                _self.handleAnswer(stream.answer);
            }
            if (stream.candidate) {
                console.log('CANDIDATE!!!');
                _self.streamConnection.addIceCandidate(new RTCIceCandidate(stream.candidate)).then(
                    _self.onAddIceCandidateSuccess,
                    _self.onAddIceCandidateError
                );
            }
        });
    }

    private onAddIceCandidateSuccess() {
        console.log('AddIceCandidate success.');
    }

    private onAddIceCandidateError(error) {
        console.log('Failed to add ICE candidate: ' + error.toString());
    }

    private configStream(stream) {
        console.log('configStream!');
        let _self = this;
        if (_self.stream !== undefined) {
            // setup stream listening
            _self.streamConnection.addStream(stream);

            // Setup ice handling
            _self.streamConnection.onicecandidate = (event) => {
                // console.log('ICE!', event);
                if (event.candidate) {
                    console.log('onCandidate', event.candidate);
                    _self.socketIo.emit('stream', { candidate: event.candidate });
                }

            };

            _self.streamConnection.createOffer(
                (offer) => {
                    console.log('CREATE OFFER!');
                    _self.socketIo.emit('stream', { offer: offer });
                    _self.streamConnection.setLocalDescription(offer);
                },
                (error) => {
                    console.error('ERROR OFFER!', error);
                }
            );
        }
    }

    private handleAnswer(answer) {
        console.log('Answer!');
        let _self = this;
        _self.streamConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
}
