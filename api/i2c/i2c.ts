// // import * as  i2c from 'i2c-bus';
// import * as  async from 'async';
// import { usleep } from 'usleep';

// // https://www.npmjs.com/package/i2c-bus
// // https://github.com/fivdi/i2c-bus
// // http://www.arduinoecia.com.br/2014/09/sensor-gy-80-acelerometro-bussola-barometro.html

// export class I2C {

//     //============
//     //BMP
//     private BMPAddress = 0x77;
//     private ULTRALOWPOWER = 0;
//     private STANDARD = 1;
//     private HIGHRES = 2;
//     private ULTRAHIGHRES = 3;

//     private ac1;
//     private ac2;
//     private ac3;
//     private ac4;
//     private ac5;
//     private ac6;

//     private b1;
//     private b2;

//     private mb;
//     private mc;
//     private md;

//     private readAddress = 0xEF;
//     private writeAddress = 0xEE;

//     private CONTROL = 0xF4;
//     private TEMPDATA = 0xF6; //MSB 16bits
//     private TEMPDATA2 = 0xF7; //LSB 8bits
//     private PRESSUREDATA = 0xF8; //MSB 16bits
//     private READTEMPCMD = 0x2E;
//     private READPRESSURECMD = 0x34;

//     private oversampling;
//     private i2cPort; //= i2c.openSync(1);

//     //============


//     constructor(BMPSensorAddress?, gyroSensorAddress?, accelerometerSensorAddress?, magnetometerSensorAddress?) {
//         let _self = this;

//         this.initBMPSensor(BMPSensorAddress);

//     }

//     private unsignedByte(value) {
//         return (new Uint8Array([value]))[0];
//     }

//     private byte(value) {
//         return (new Int8Array([value]))[0];
//     }

//     private unsignedShort(value) {
//         return (new Uint16Array([value]))[0];
//     }

//     private short(value) {
//         return (new Int16Array([value]))[0];
//     }

//     private initBMPSensor(BMPAddress) {
//         let _self = this;

//         this.ac1 = this.short(this.readReg16(BMPAddress, 0xAA));//408;//
//         this.ac2 = this.short(this.readReg16(BMPAddress, 0xAC));//-72;//
//         this.ac3 = this.short(this.readReg16(BMPAddress, 0xAE));//-14383;//

//         this.ac4 = this.unsignedShort(this.readReg16(BMPAddress, 0xB0));//32741;//
//         this.ac5 = this.unsignedShort(this.readReg16(BMPAddress, 0xB2));//32757;//
//         this.ac6 = this.unsignedShort(this.readReg16(BMPAddress, 0xB4));//23153;//

//         this.b1 = this.short(this.readReg16(BMPAddress, 0xB6));//6190;// //16bits
//         this.b2 = this.short(this.readReg16(BMPAddress, 0xB8));//4;//

//         this.mb = this.short(this.readReg16(BMPAddress, 0xBA));//-32768;//
//         this.mc = this.short(this.readReg16(BMPAddress, 0xBC));//-8711;//
//         this.md = this.short(this.readReg16(BMPAddress, 0xBD));//2868;//

//         console.log(this.ac1);
//         console.log(this.ac2);
//         console.log(this.ac3);
//         console.log(this.ac4);
//         console.log(this.ac5);
//         console.log(this.ac6);

//         console.log(this.b1);
//         console.log(this.b2);

//         console.log(this.mb);
//         console.log(this.mc);
//         console.log(this.md);

//         //teste
//         this.readTemperature(BMPAddress);

//         console.log('Press' + this.readPressure(BMPAddress));

//         return true;
//     }

//     //Validado pelo debug
//     private toCelsius(rawTemp) {
//         rawTemp /= 10;
//         // tslint:disable-next-line:no-bitwise
//         let halfDegrees = ((rawTemp & 0xff) << 1) + (rawTemp >> 15);

//         // tslint:disable-next-line:no-bitwise
//         if ((halfDegrees & 0x100) === 0) {
//             return halfDegrees / 2; // Temp +ve
//         }

//         // tslint:disable-next-line:no-bitwise
//         return -((~halfDegrees & 0xff) / 2); // Temp -ve
//     }

//     //Validado pelo debug
//     private computeB5(UT): number {
//         let X1 = (UT - this.ac6) * (this.ac5) >> 15;
//         let X2 = (this.mc << 11) / (X1 + this.md);
//         return X1 + X2;
//     }

//     private readRawTemperature(BMPAddress) {
//         this.writeReg8(BMPAddress, this.CONTROL, this.READTEMPCMD);
//         usleep(4500);
//         let UT = this.short(this.readReg16(BMPAddress, this.TEMPDATA));
//         return UT;
//     }


//     private readRawPressure(BMPAddress) {
//         let raw;
//         this.writeReg8(BMPAddress, this.CONTROL, this.READPRESSURECMD + (this.oversampling << 6));

//         if (this.oversampling == this.ULTRALOWPOWER)
//             usleep(5000);
//         else if (this.oversampling == this.STANDARD)
//             usleep(8000);
//         else if (this.oversampling == this.HIGHRES)
//             usleep(14000);
//         else
//             usleep(26000);

//         raw = this.readReg8(BMPAddress, this.PRESSUREDATA) << 16;
//         raw += this.readReg8(BMPAddress, this.PRESSUREDATA - 1) << 8;
//         raw += this.readReg8(BMPAddress, this.PRESSUREDATA - 2);
//         raw >>= (8 - this.oversampling);

//         return raw;
//     }


//     public readPressure(BMPAddress) {
//         let UT, UP, B3, B5, B6, X1, X2, X3, p;
//         let B4, B7;

//         UT = this.readRawTemperature(BMPAddress);
//         UP = this.readRawPressure(BMPAddress);


//         B5 = this.computeB5(UT);

//         //Calculate Pressure
//         B6 = B5 - 4000;
//         X1 = (this.b2 * ((B6 * B6) >> 12)) >> 11;
//         X2 = (this.ac2 * B6) >> 11;
//         X3 = X1 + X2;
//         B3 = (((this.ac1 * 4 + X3) << this.oversampling) + 2) / 4;

//         X1 = (this.ac3 * B6) >> 13;
//         X2 = (this.b1 * ((B6 * B6) >> 12)) >> 16;
//         X3 = ((X1 + X2) + 2) >> 2;
//         B4 = (this.ac4 * (X3 + 32768)) >> 15;
//         //B7 = (UP - B3) * (50000UL >> this.oversampling);
//         B7 = (UP - B3) * (50000 >> this.oversampling);

//         if (B7 < 0x80000000) {
//             p = (B7 * 2) / B4;
//         } else {
//             p = (B7 / B4) * 2;
//         }
//         X1 = (p >> 8) * (p >> 8);
//         X1 = (X1 * 3038) >> 16;
//         X2 = (-7357 * p) >> 16;

//         p = p + ((X1 + X2 + 3791) >> 4);

//         return p;
//     }


//     public readSealevelPressure(BMPAddress, altitude_meters) {
//         let pressure = this.readPressure(BMPAddress);
//         return (pressure / Math.pow(1.0 - altitude_meters / 44330, 5.255));
//     }


//     public readTemperature(BMPAddress) {
//         let UT, B5;
//         let temperature;

//         UT = this.readRawTemperature(BMPAddress);
//         console.log("UT:", UT);

//         B5 = this.computeB5(UT);
//         console.log("B5:", B5);
//         temperature = (B5 + 8) >> 4;
//         // temperature /= 10;

//         console.log("temp:", temperature);
//         console.log("temp C:", this.toCelsius(temperature));

//         return temperature;
//     }

//     public readAltitude(BMPAddress, sealevelPressure) {
//         let altitude;
//         let pressure = this.readPressure(BMPAddress);

//         altitude = 44330 * (1.0 - Math.pow(pressure / sealevelPressure, 0.1903));

//         return altitude;
//     }


//     private readReg8(address, register) {
//         return this.i2cPort.readByteSync(address, register);
//     }

//     private readReg16(address, register) {
//         return this.byte(this.i2cPort.readByteSync(address, register) <<
//         8 + this.unsignedByte(this.i2cPort.readByteSync(address, register + 1)));
//     }

//     private writeReg8(address, register, value) {
//         return this.i2cPort.writeByteSync(address, register, value);
//     }

//     private writeReg16(address, register, value) {
//         return this.i2cPort.writeWordSync(address, register, value);
//     }


// }
