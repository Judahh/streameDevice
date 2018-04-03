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
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[2].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[3].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[0].arrayAppObject[0]).getElement());
        let resolutionSelectedIndex = arrayField[0].selectedIndex;
        let resolutionSelected = arrayField[0].options[resolutionSelectedIndex].text;
        let facingModeSelectedIndex = arrayField[1].selectedIndex;
        let facingModeSelected = arrayField[1].options[facingModeSelectedIndex].text;
        let formatSelectedIndex = arrayField[2].selectedIndex;
        let formatSelected = arrayField[2].options[formatSelectedIndex].text;
        let duration = arrayField[3].value;
        let audio = arrayField[4].checked;

        console.log(arrayField);
        // console.log(duration);

        resolutionSelected = resolutionSelected.replace(/\s/g, '');

        let array = resolutionSelected.split('x');

        // console.log('array:',array);

        let stream = Stream.getInstance();
        stream.setDuration(parseInt(duration, 10));
        // stream.setAudio(audio);
        stream.setFormat(formatSelected);

        let width: any = parseInt(array[0], 10);
        let height: any = parseInt(array[1], 10);
        let facingMode: any = facingModeSelected;
        let widthHasExact = false;
        let heightHasExact = false;
        let facingModeHasExact = false;

        if (stream.getVideo().width.exact !== undefined) {
            widthHasExact = true;
        }

        if (stream.getVideo().height.exact !== undefined) {
            heightHasExact = true;
        }

        if (stream.getVideo().facingMode.exact !== undefined) {
            facingModeHasExact = true;
        }

        if (widthHasExact) {
            width = { 'exact' : width };
        }

        if (heightHasExact) {
            height = { 'exact' : height };
        }

        if (facingModeHasExact) {
            facingMode = { 'exact' : facingMode };
        }

        let video = {
            'width': width,
            'height': height,
            'facingMode': facingMode
        };
        // console.log('video:', video);
        // console.log('duration:', duration);

        stream.startVideo(video, audio);
        // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: resolutionSelected, password: password });
    }

    public read(component) {
        // console.log('READ');
        // console.log(component);
        let divisor: Component = <Component>(<Component>component.getFather().getFather());
        let arrayField: Array<any> = new Array<any>();
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[0].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[1].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLSelectElement>(<Component>divisor.arrayAppObject[2].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[3].arrayAppObject[0].arrayAppObject[0]).getElement());
        arrayField.push(<HTMLInputElement>(<Component>divisor.arrayAppObject[4].arrayAppObject[0].arrayAppObject[0]).getElement());

        let resolutionSelectedIndex = arrayField[0].selectedIndex;
        let resolutionSelected = arrayField[0].options[resolutionSelectedIndex].text;
        let facingModeSelectedIndex = arrayField[1].selectedIndex;
        let facingModeSelected = arrayField[1].options[facingModeSelectedIndex].text;
        let formatSelectedIndex = arrayField[2].selectedIndex;
        let formatSelected = arrayField[2].options[formatSelectedIndex].text;
        let duration = arrayField[3].value;
        let audio = arrayField[4].checked;
        let stream = Stream.getInstance();
        // console.log(arrayField);
        // console.log(stream);

        arrayField[3].value = '' + stream.getDuration();

        let width = stream.getVideo().width;
        let height = stream.getVideo().height;
        let facingMode = stream.getVideo().facingMode;

        if (width.exact !== undefined) {
            width = stream.getVideo().width.exact;
        }

        if (height.exact !== undefined) {
            height = stream.getVideo().height.exact;
        }

        if (facingMode.exact !== undefined) {
            facingMode = stream.getVideo().facingMode.exact;
        }

        let resolution = width + ' x ' + height;
        let format = stream.getFormat();

        // console.log('current: ' + resolution);
        arrayField[0].selectedIndex = this.getCurrentIndex(arrayField[0], resolution);
        arrayField[1].selectedIndex = this.getCurrentIndex(arrayField[1], facingMode);
        arrayField[2].selectedIndex = this.getCurrentIndex(arrayField[2], format);
        // if (arrayField[4].checked !== stream.getAudio()) {
        //     arrayField[4].click();
        // }
        arrayField[4].checked = stream.getAudio();
        console.log('getAudio: ' + stream.getAudio());

        // _self.stream.setWifiConnection((data) => { _self.response(data); }, { ssid: resolutionSelected, password: password });
    }

    private getCurrentIndex(arrayField, value) {
        for (let index = 0; index < arrayField.options.length; index++) {
            let element = arrayField.options[index].text;
            if (element === value) {
                // console.log('current: ' + element);
                return index;
            }
        }
        return 0;
    }
}
