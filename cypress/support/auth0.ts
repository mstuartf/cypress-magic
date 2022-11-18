import UserProfile = Cypress.UserProfile;

// This function takes an expired token and edits its payload to trick the app. It changes the expiry date so that the
// token is considered valid, and substitutes the correct nonce for the session.
export const createMockTokenResponse = (
  args: { nonce: string; aud: string; iss: string } & UserProfile,
  header: string,
  signature: string
) => {
  const futureTime = Date.now() + 3600;
  const payload = btoa(
    JSON.stringify({
      ...args,
      iat: futureTime,
      exp: futureTime,
    })
  );
  return {
    id_token: `${header}.${payload}.${signature}`,
    access_token: null,
    scope: "openid profile email",
    expires_in: 86400,
    token_type: "Bearer",
  };
};

// copied auth0 functions
const idTokendecoded = [
  "iss",
  "aud",
  "exp",
  "nbf",
  "iat",
  "jti",
  "azp",
  "nonce",
  "auth_time",
  "at_hash",
  "c_hash",
  "acr",
  "amr",
  "sub_jwk",
  "cnf",
  "sip_from_tag",
  "sip_date",
  "sip_callid",
  "sip_cseq_num",
  "sip_via_branch",
  "orig",
  "dest",
  "mky",
  "events",
  "toe",
  "txn",
  "rph",
  "sid",
  "vot",
  "vtm",
];

const decodeB64 = (input: string) =>
  decodeURIComponent(
    atob(input)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

export const urlDecodeB64 = (input: string) =>
  decodeB64(input.replace(/_/g, "/").replace(/-/g, "+"));

export const decode = (token: string): any => {
  const parts = token.split(".");
  const [header, payload, signature] = parts;

  if (parts.length !== 3 || !header || !payload || !signature) {
    throw new Error("ID token could not be decoded");
  }
  const payloadJSON = JSON.parse(urlDecodeB64(payload));
  const claims = { __raw: token };
  const user: any = {};
  Object.keys(payloadJSON).forEach((k) => {
    claims[k] = payloadJSON[k];
    if (!idTokendecoded.includes(k)) {
      user[k] = payloadJSON[k];
    }
  });
  return {
    encoded: { header, payload, signature },
    header: JSON.parse(urlDecodeB64(header)),
    claims,
    user,
  };
};
