describe("User Login", () => {
  it("alskjd", () => {
    cy.visit("./demo/index.html");
    cy.intercept("GET", "https://swapi.dev/api/people/1", {
      statusCode: 200,
      fixture: "userLogin/GET___api_people_1_.json",
    }).as("GET__/api/people/1/");
    cy.get("#request-button").click();
    cy.wait("@GET__/api/people/1/");
    cy.get("#add-param-button").click();
    cy.url().should("include", "newParam=value");
    cy.get("#change-selector-button").contains("Change selector button");
  });
});
