// Obfuscates data before sending to server

import { AES } from "crypto-js";
import { NestedObj, ObfuscateFn } from "./types";

// todo: env variable
const PASSPHRASE = "Secret Passphrase";

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const createPrivacyManager = () => {
  // this is to keep track of all sensitive strings that should be stripped from html
  const tracker: { [key: string]: string } = {};

  const obfuscateString = (raw: string) => {
    if (!tracker.hasOwnProperty(raw)) {
      tracker[raw] = AES.encrypt(raw, PASSPHRASE)
        .toString()
        .slice(0, raw.length);
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
  const removeStateData = (val: string): string =>
    Object.entries(tracker).reduce(
      (prev, [k, v]) => prev.replace(new RegExp(`\\b${k}\\b`, "g"), v),
      val
    );

  return {
    obfuscate,
    removeStateData,
  };
};
