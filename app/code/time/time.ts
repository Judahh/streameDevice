// import { Component } from './../../../node_modules/backappjh/app/view/common/component/component';
import { AppObject, Component, ComponentDataInput, ComponentOption } from 'backappjh';

export class Time extends AppObject {
    test: string;

    constructor(father?: Component) {
        super(father);
    }

    public getTime(component) {
        console.log('RUN TIME!!', component);
        let today = new Date();
        let hours = today.getHours();
        let m: number = today.getMinutes();
        let minutes: string;

        if (m < 10) {
            minutes = '0' + m;
        } else {
            minutes = '' + m;
        }

        if (document.getElementById(component.getElement().id) != null) {
            component.getElement().innerHTML = hours + ':' + minutes;
            let _self = this;
            let t = setTimeout(() => { _self.getTime(component); }, 5000);
        }
    }

}
