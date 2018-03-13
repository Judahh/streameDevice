import { ServiceModel, AppObject, Component, ComponentDataInput, ComponentOption, ComponentComboBox } from 'backappjh';

export class Languages extends AppObject {
    private static languages: Array<any>;

    public static getLanguages() {
        return this.languages;
    }

    constructor(father?: Component) {
        super(father);
        if (Languages.languages === undefined) {
            Languages.languages = [];
        }
    }

    public run() {
        let _self = this;
        this.getLanguage();
    }

    protected updateLanguage(jSON) {
        // console.log('updateLanguage!!', jSON);
        if (Languages.languages.length === 0) {
            for (let lIndex = 0; lIndex < jSON.length; lIndex++) {
                let code = jSON[lIndex]['language'];
                let name = jSON[lIndex]['languageName'];
                let newLanguage = {
                    'code': code,
                    'name': name
                }
                Languages.languages.push(newLanguage);
            }
            // console.log('NEW:', Languages.languages);
        }

        let _self = this;


        // (<ComponentComboBox>this.father).destroyChildElements();
        // (<ComponentComboBox>this.father).arrayOption = new Array<ComponentOption>();
        // (<ComponentComboBox>this.father).arrayOption.type = ComponentOption;

        let currentLanguage = this.getCurrentLanguage();
        // let index = 0;
        let comboBox = <ComponentComboBox>this.father.getFather();
        for (let index = 0; index < Languages.languages.length; index++) {
            let language = Languages.languages[index];
            let option: ComponentOption = new ComponentOption(comboBox);
            option.getElement().innerHTML = language.name;
            // console.log(language.name);
            (comboBox).arrayOption.push(option);
            if (language.code === currentLanguage) {
                (<HTMLSelectElement>(comboBox).getElement()).selectedIndex = index;
            }
        }
        // Languages.languages.forEach(language => {
        //     let option: ComponentOption = new ComponentOption((<ComponentComboBox>this.father));
        //     option.getElement().innerHTML = language.name;
        //     // console.log(language.name);
        //     (<ComponentComboBox>this.father).arrayOption.push(option);
        //     if (language.code === currentLanguage) {
        //         (<HTMLSelectElement>(<ComponentComboBox>this.father).getElement()).selectedIndex = index;
        //     }
        //     index++;
        // });
        // this.destroyElement();
    }

    public setLanguage(component) {
        // console.log('setLanguage!!');
        let languages = Languages.getLanguages();
        console.log('RECEIVED!!', component);

        let element: any = (<ComponentDataInput>component).getElement();
        let languageName = element.options[element.selectedIndex].text;
        // let index = 0;
        for (let index = 0; index < languages.length; index++) {
            let language = languages[index];
            if (language.name === languageName) {
                (<ComponentDataInput>component).setCurrentLanguage(language.code);
                this.getPageBody().refreshPage();
                // (<ComponentDataInput>component).getJSONPromise((<ComponentDataInput>component).getPage());
                return;
            }
        }
        // languages.forEach(language => {
        //     if (language.name === languageName) {
        //         (<ComponentDataInput>component).setCurrentLanguage(language.code);
        //         this.getPageBody().refreshPage();
        //         // (<ComponentDataInput>component).getJSONPromise((<ComponentDataInput>component).getPage());
        //         return;
        //     }
        // });
    }
}
