/// <reference types="cypress" />

declare namespace Cypress {
  interface UserProfile {
    sub: string;
    [key: string]: any;
  }
  interface Chainable<Subject = any> {
    prepareAuth0Login(
      baseUrl: string,
      userProfile: UserProfile
    ): Chainable<null>;
    setAuth0Authenticated(
      baseUrl: string,
      userProfile: UserProfile
    ): Chainable<null>;
    failOnLiveAPICall(
      apiUrls: string[],
      baseUrls: string[],
      forceFailure?: boolean
    ): Chainable<null>;
    blockUrls(blockUrls: string[]): Chainable<null>;
    uploadCSV(
      selector: string,
      fileName: string,
      mimeType: string,
      data: string[][]
    ): Chainable<null>;
    setStorageState(
      storageType: "local" | "session" | "cookie",
      fixture: string
    ): Chainable<null>;
  }
}
