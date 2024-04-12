import { Cookie } from "tough-cookie";

export class CookieJar {
  static parse(cookie: string) {
    const toughCookie = Cookie.parse(cookie);

    if (!toughCookie) return;

    // not all browsers currently default to lax, but they're heading in that
    // direction since it's now the standard, so this is more future-proof
    if (toughCookie.sameSite === undefined) {
      toughCookie.sameSite = "lax";
    }

    return toughCookie;
  }
}

export const cookieJar = new CookieJar();
