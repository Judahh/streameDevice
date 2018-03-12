import { Address } from './address';
import { Phone } from './phone';
import { Authentication } from './authentication';

export class User {

    username: string;
    name: string;
    nickname: string;
    mother: string;
    father: string;
    uId: number; // rg
    uIdEmitter: string;
    uIdState: number;
    nUId: number; // cpf
    birth: Date;
    birthState: number;
    nationality: string;
    email: string;
    role: string;
    arrayAddress: Array<Address>;
    arrayPhone: Array<Phone>;
    authentication: Authentication;

    constructor(
        username: string,
        name: string,
        nickname: string,
        mother: string,
        father: string,
        uId: number,
        uIdEmitter: string,
        uIdState: number,
        nUId: number,
        birth: Date,
        birthState: number,
        nationality: string,
        email: string,
        role: string,
        authentication: Authentication) {
        this.arrayAddress = new Array<Address>();
        this.arrayPhone = new Array<Phone>();
        this.username = username;
        this.name = name;
        this.nickname = nickname;
        this.mother = mother;
        this.father = father;
        this.uId = uId;
        this.uIdEmitter = uIdEmitter;
        this.uIdState = uIdState;
        this.nUId = nUId;
        this.birth = birth;
        this.birthState = birthState;
        this.nationality = nationality;
        this.email = email;
        this.role = role;
        this.authentication = authentication
    }
}
