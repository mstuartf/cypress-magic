describe("q2", () => {
it("tests q2", () => {
  cy.viewport(1318, 944);

  cy.visit("http://localhost:3000/login");

  cy.get("#email").click();

  cy.get("#email").type("test");

  cy.get("#email").type("test@");

  cy.get("#email").type("test@newflotest.com");

  cy.get("#password").type("invopayer");

  cy.get("#root > div.h-full.w-full.flex > div.flex-1.relative > form > div > button").click();

  cy.get("#root > div.h-full.flex.flex-col.overflow-hidden.text-qualiTextBlack > div > div.h-full.w-full.flex.flex-col.overflow-hidden > div > div > div.flex.justify-between.items-center.pb-5.pt-8 > button > span").click();

  });
});
