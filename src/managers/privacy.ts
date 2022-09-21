// Obfuscates data before sending to server

import { NestedObj, ObfuscateFn, PrivacyManager } from "../types";
import { validateEmail } from "../utils";
import { escapeRegExp } from "../utils/escapeRegexChars";
import { getRandomLetter, getRandomNumber } from "../utils/random";

export const createPrivacyManager = (): PrivacyManager => {
  // this is to keep track of all sensitive strings that should be stripped from html
  const tracker: { [key: string]: string } = {};

  // todo: this might be too slow?
  const obfuscateString = (raw: string) => {
    if (!tracker.hasOwnProperty(raw)) {
      tracker[raw] = raw
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
    }
    return tracker[raw];
  };

  const obfuscatePrimitive: (
    raw: string | number | boolean
  ) => string | number | boolean = (raw) => {
    if (typeof raw !== "string") {
      return raw;
    }
    if (validateEmail(raw)) {
      const [user, domain] = raw.split("@");
      const [domain1, domain2] = domain.split(/\.(.*)/s);
      return `${obfuscatePrimitive(user)}@${obfuscatePrimitive(
        domain1
      )}.${obfuscatePrimitive(domain2)}`;
    }
    return obfuscateString(raw);
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
      return obfuscatePrimitive(v);
    } else if (Array.isArray(v)) {
      return v.map((item) => obfuscate(item));
    } else {
      return obfuscateObj(v);
    }
  };

  // this obfuscates any state data found in a string (based on the tracker)
  const removeStateData = (val?: string): string =>
    Object.entries(tracker).reduce(
      (prev, [k, v]) =>
        prev.replace(new RegExp(`\\b${escapeRegExp(k)}\\b`, "g"), v),
      val || ""
    );

  return {
    obfuscate,
    removeStateData,
  };
};
