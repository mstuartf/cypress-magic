import { AES } from "crypto-js";

// todo: env variable
const PASSPHRASE = "Secret Passphrase";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const obfuscate: (
  raw: string | number | boolean
) => string | number | boolean = (raw) => {
  if (typeof raw !== "string") {
    return raw;
  }
  if (validateEmail(raw)) {
    const [user, domain] = raw.split("@");
    const [domain1, domain2] = domain.split(/\.(.*)/s);
    return `${obfuscate(user)}@${obfuscate(domain1)}.${obfuscate(domain2)}`;
  }
  return AES.encrypt(raw, PASSPHRASE).toString().slice(0, raw.length);
};

type NestedOption = number | boolean | string | NestedObj;

interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

const obfuscateValue: (v: NestedOption | Array<NestedOption>) => any = (v) => {
  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return obfuscate(v);
  } else if (Array.isArray(v)) {
    return v.map((item) => obfuscateValue(item));
  } else {
    return obfuscateObj(v);
  }
};

export const obfuscateObj: (obj: NestedObj) => NestedObj = (obj) => {
  if (!obj) {
    return obj;
  }
  return Object.entries(obj).reduce(
    (prev, [k, v]) => ({
      ...prev,
      [k]: obfuscateValue(v),
    }),
    {}
  );
};
