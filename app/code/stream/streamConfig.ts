import { AppObject, Component } from 'backappjh';
import { Stream } from './stream';

export class StreamConfig extends AppObject {
    constructor(father?: Component) {
        super(father);
    }

    public set(component) {
        let divisor: Component = <Component>(<Component>component.getFather().getFather());
        let arrayField: Array<any> = new Array<any>();
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        let selectedIndex = arrayField[0].selectedIndex;
        let selected = arrayField[0].options[selectedIndex].text;
        let duration = arrayField[1].value;

        // console.log(selected);
        // console.log(duration);

        selected = selected.replace(/\s/g, '');

        let array = selected.split('x');

        // console.log('array:',array);

        let stream = Stream.getInstance();
        stream.setDuration(parseInt(duration, 10));
        let video = {
            'width': parseInt(array[0], 10),
            'height': parseInt(array[1], 10),
            'facingMode': 'environment'
        };
        // console.log('video:', video);
        // console.log('duration:', duration);

        stream.setVideo(video);
        // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: selected, password: password });
    }

    public read(component) {
        // console.log('READ');
        // console.log(component);
        let divisor: Component = <Component>(<Component>component.getFather().getFather());
        let arrayField: Array<any> = new Array<any>();
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        let selectedIndex = arrayField[0].selectedIndex;
        let selected = arrayField[0].options[selectedIndex].text;
        let duration = arrayField[1].value;
        let stream = Stream.getInstance();
        // console.log(arrayField);
        // console.log(stream);

        arrayField[1].value = '' + stream.getDuration();
        let resolution = stream.getVideo().width + ' x ' + stream.getVideo().height;

        console.log('current: ' + resolution);

        for (let index = 0; index < arrayField[0].options.length; index++) {
            let element = arrayField[0].options[index].text;
            if (element === resolution) {
                arrayField[0].selectedIndex = index;
                console.log('current: ' + arrayField[0].options[selectedIndex].text);
                return;
            }
        }

        // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: selected, password: password });
    }
}
