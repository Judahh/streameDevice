import { AppObject, Component } from 'backappjh';
import { Stream } from './stream';

export class StreamConfig extends AppObject {
    constructor(father?: Component) {
        super(father);
    }

    // public set(component) {
    //     let selectedIndex = (<HTMLSelectElement>(<Component>component.getFather()).arrayDivisor[2].
    //     arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].arrayComboBox[0].getElement()).selectedIndex;
    //     let selected = (<HTMLSelectElement>(<Component>component.getFather()).arrayDivisor[2].arrayDivisor[0].
    //     arrayDivisor[0].arrayDataInput[0].arrayComboBox[0].getElement()).options[selectedIndex].text;
    //     let duration = (<HTMLInputElement>(<Component>component.getFather()).arrayDivisor[2].arrayDivisor[0].
    //     arrayDivisor[1].arrayDataInput[0].arrayTextField[0].getElement()).value;

    //     // console.log(selected);
    //     // console.log(duration);

    //     selected = selected.replace(/\s/g, '');

    //     let array = selected.split('x');

    //     // console.log('array:',array);

    //     let stream = Stream.getInstance();
    //     stream.setDuration(parseInt(duration, 10));
    //     let video = {
    //         'width': parseInt(array[0], 10),
    //         'height': parseInt(array[1], 10),
    //         'facingMode': 'environment'
    //     };
    //     // console.log('video:', video);
    //     // console.log('duration:', duration);

    //     stream.setVideo(video);
    //     // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: selected, password: password });    
    // }

    // public read(component) {
    //     let body: Component = <Component>component.getFather().getFather().
    //     getFather().getFather().getFather().getFather().getFather().getFather().getFather().getFather();
    //     // console.log('body:', body);
    //     let selectedIndex = (<HTMLSelectElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].
    //         arrayComboBox[0].getElement()).selectedIndex;
    //     let selected = (<HTMLSelectElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].
    //         arrayComboBox[0].getElement()).options[selectedIndex].text;
    //     let duration = (<HTMLInputElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[1].arrayDataInput[0].
    //         arrayTextField[0].getElement()).value;
    //     let stream = Stream.getInstance();

    //     (<HTMLInputElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[1].arrayDataInput[0].arrayTextField[0].
    //         getElement()).value = '' + stream.getDuration();
    //     let resolution = stream.getVideo().width.exact + ' x ' + stream.getVideo().height.exact;

    //     // console.log('current: ' + resolution);

    //     for (let index = 0; index < (<HTMLSelectElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].
    //         arrayComboBox[0].getElement()).options.length; index++) {
    //         let element = (<HTMLSelectElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].
    //             arrayComboBox[0].getElement()).options[index].text;
    //         if (element === resolution) {
    //             (<HTMLSelectElement>body.arrayDivisor[2].arrayDivisor[0].arrayDivisor[0].arrayDataInput[0].arrayComboBox[0].
    //                 getElement()).selectedIndex = index;
    //             return;
    //         }
    //     }

    //     // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: selected, password: password });
    // }
}
