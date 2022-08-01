import {AES} from "crypto-js";


// todo: env variable
const PASSPHRASE = "Secret Passphrase"

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const obfuscate: (raw: string) => string = (raw) => {
    if (validateEmail(raw)) {
        const [user, domain] = raw.split("@");
        const [domain1, domain2] = domain.split(/\.(.*)/s)
        return `${obfuscate(user)}@${obfuscate(domain1)}.${obfuscate(domain2)}`;
    }
    return AES.encrypt(raw, PASSPHRASE).toString().slice(0, raw.length);
};
