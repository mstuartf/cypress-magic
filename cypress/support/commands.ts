/// <reference types="cypress" />

import "cypress-file-upload";
import { createMockTokenResponse, decode } from "./auth0";

// This command intercepts the Auth0 loginWithRedirect API call and redirect. When the (test) user is redirected to the
// Auth0 login page, they will be immediately redirected back in authenticated state.
Cypress.Commands.add("prepareAuth0Login", (baseUrl, userProfile) => {
  const code = "y9v070T0iIOFaiD7OSYaTivvaXJNqZI0FUlfY6PPgr1h1";
  cy.fixture("auth0/expiredToken.txt").then((token) => {
    const {
      claims: { iss, aud },
      encoded: { header, signature },
    } = decode(token);
    let nonce: string;
    // when a real user clicks the login button they are redirected to Auth0 to login then back to the app
    // in this test, we immediately redirect back to the app (with the code and state query params)
    cy.intercept(`${iss}authorize**`, (req) => {
      // the nonce and state are temporarily added to session storage before the redirect
      const cache = JSON.parse(sessionStorage.getItem(`a0.spajs.txs.${aud}`));
      nonce = cache.nonce;
      req.redirect(
        `${baseUrl}/?code=${code}&state=${encodeURIComponent(cache.state)}`,
        302
      );
    }).as("authorize");
    cy.fixture("auth0/expiredToken.txt").then((expiredToken) => {
      cy.intercept("POST", `${iss}oauth/token**`, (req) => {
        req.reply({
          statusCode: 200,
          body: createMockTokenResponse(
            { nonce: nonce, aud, iss, ...userProfile },
            header,
            signature
          ),
        });
      }).as("token");
    });
  });
});

// This command sets the Auth0 getTokenSilently API call and iframe redirect. Call this before navigating to the app to
// ensure the (test) user starts in an authenticated state.
Cypress.Commands.add("setAuth0Authenticated", (baseUrl, userProfile) => {
  const code = "y9v070T0iIOFaiD7OSYaTivvaXJNqZI0FUlfY6PPgr1h1";
  cy.fixture("auth0/expiredToken.txt").then((token) => {
    const {
      claims: { iss, aud },
      encoded: { header, signature },
    } = decode(token);
    // If these cookies are set, Auth0 will call getTokenSilently on load, which opens the authorize url (see below)
    // in an iframe. But in this case, the nonce is not added to session storage, so we cannot access it to generate
    // a mock token that will pass the validation in the redirect callback.
    cy.setCookie(`_legacy_auth0.${aud}.is.authenticated`, "true");
    cy.setCookie(`auth0.${aud}.is.authenticated`, "true");
    let nonce: string;
    // when the user is already logged in, the authorize link is opened inside an iframe
    cy.fixture("auth0/authorize.html").then((html) => {
      cy.intercept(`${iss}authorize**`, (req) => {
        const { searchParams } = new URL(req.url);
        nonce = searchParams.get("nonce");
        req.reply({
          statusCode: 200,
          body: html
            .replace("${code}", code)
            .replace("${baseUrl}", baseUrl)
            .replace("${state}", searchParams.get("state")),
        });
      }).as("authorize");
    });
    cy.intercept("POST", `${iss}oauth/token**`, (req) => {
      req.reply({
        statusCode: 200,
        body: createMockTokenResponse(
          { nonce: nonce, aud, iss, ...userProfile },
          header,
          signature
        ),
      });
    }).as("token");
  });
});

// This command will log a warning or cause tests to fail if any live API calls are detected to any of the URLs provided.
// This is to make sure that the front end is being tested in isolation, which reduces test flakiness.
Cypress.Commands.add(
  "failOnLiveAPICall",
  (apiUrls, baseUrls, forceFailure = false) => {
    apiUrls.forEach((url) => {
      cy.intercept(`${url}/**`, (req) => {
        if (baseUrls.includes(req.url.replace(/\/$/, ""))) {
          // handle overlap between api and base urls
          req.reply();
          return;
        }
        if (forceFailure) {
          throw new Error(
            `A live API call was sent to ${req.url}. Please ensure that all API calls are mocked.`
          );
        } else {
          Cypress.log({
            displayName: "SEASMOKE WARNING",
            message: `A live API call was detected to ${req.url}. You can ignore this warning if you are refactoring and a new API call has been introduced. We will update this test for you.`,
          });
          req.reply();
        }
      });
    });
  }
);

// This is a temporary command to make up for Cypress.config('blockHosts', value) not working.
// https://github.com/cypress-io/cypress/issues/21151
// It will block requests to analytics providers, etc.
// Best practice: https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/stubbing-spying__google-analytics
Cypress.Commands.add("blockUrls", (blockUrls) => {
  blockUrls.forEach((url) => {
    cy.intercept(`${url}/**`, (req) => req.destroy());
  });
});

Cypress.Commands.add("uploadCSV", (selector, fileName, mimeType, data) => {
  cy.get(selector).attachFile({
    fileContent: new Blob(
      [data.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")],
      { type: "text/csv" }
    ),
    fileName,
    mimeType,
    encoding: "utf-8",
    lastModified: new Date().getTime(),
  });
});

Cypress.Commands.add("setStorageState", (storageType, fixture) => {
  cy.fixture(fixture).then((obj) => {
    if (storageType === "local") {
      Object.entries(obj).forEach(([k, v]) => {
        localStorage.setItem(k, JSON.stringify(v));
      });
    } else if (storageType === "session") {
      Object.entries(obj).forEach(([k, v]) => {
        sessionStorage.setItem(k, JSON.stringify(v));
      });
    } else {
      Object.entries(obj).forEach(([k, v]) => {
        cy.setCookie(k, v as string);
      });
    }
  });
});
