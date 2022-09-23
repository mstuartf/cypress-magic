// Obfuscates data before sending to server

import { NestedObj, ObfuscateFn, PrivacyManager } from "../types";
import { validateEmail } from "../utils";
import { getRandomLetter, getRandomNumber } from "../utils/random";
import { validateDate } from "../utils/validateDate";
import { validateUrl } from "../utils/validateUrl";

type TypeName = string | number;
type ObjectType<T> = T extends string
  ? string
  : T extends number
  ? number
  : never;

const obfuscatePrimitive = <T extends TypeName>(raw: T): ObjectType<T> => {
  if (typeof raw === "number") {
    return obfuscateNumber(raw) as ObjectType<T>;
  }
  return obfuscateString(raw) as ObjectType<T>;
};

const obfuscateString = (raw: string): string => {
  if (validateEmail(raw)) {
    const [user, domain] = raw.split("@");
    const [domain1, domain2] = domain.split(/\.(.*)/s);
    return `${obfuscateString(user)}@${obfuscateString(
      domain1
    )}.${obfuscateString(domain2)}`;
  }
  if (validateDate(raw)) {
    return raw;
  }
  if (validateUrl(raw)) {
    return raw;
  }
  return obfuscateByChar(raw);
};

const obfuscateNumber = (raw: number): number => raw;

// todo: this might be too slow?
const obfuscateByChar = (raw: string): string =>
  raw
    .split("")
    .map((char) => {
      if (/^\d+$/.test(char)) {
        return `${getRandomNumber(1)}`;
      }
      if (char.match(/[a-z]/i)) {
        const isUppercase = char === char.toUpperCase();
        const letter = getRandomLetter();
        return isUppercase ? letter.toUpperCase() : letter;
      }
      return char;
    })
    .join("");

export const createPrivacyManager = (): PrivacyManager => {
  // this is to keep track of all sensitive strings that should be stripped from html
  const tracker: { [key: string | number]: string | number } = {};

  const obfuscateWithTracker: (
    raw: string | number | boolean
  ) => string | number | boolean = (raw) => {
    if (typeof raw === "boolean") {
      return raw;
    }
    if (!tracker.hasOwnProperty(raw)) {
      tracker[raw] = obfuscatePrimitive(raw);
    }
    return tracker[raw];
  };

  const obfuscateObj: (obj: NestedObj) => NestedObj = (obj) => {
    if (!obj) {
      return obj;
    }
    return Object.entries(obj).reduce(
      (prev, [k, v]) => ({
        ...prev,
        [k]: obfuscate(v),
      }),
      {}
    );
  };

  const obfuscate: ObfuscateFn = (v) => {
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      return obfuscateWithTracker(v);
    } else if (Array.isArray(v)) {
      return v.map((item) => obfuscate(item));
    } else {
      return obfuscateObj(v);
    }
  };

  return {
    obfuscate,
  };
};
