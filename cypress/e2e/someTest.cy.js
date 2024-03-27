describe("SomeTest", () => {
  it("should work", () => {
    cy.visit("./demo/index.html");
    cy.intercept("GET", "https://swapi.dev/api/people/1", {
      statusCode: 200,
      fixture: "someTest/GET___api_people_1_.json",
    }).as("GET__/api/people/1/");
    cy.get("#request-button").click();
    cy.wait("@GET__/api/people/1/");
    cy.get("#change-selector-button").click();
    cy.get('[data-cy="select-this-element"]').click();
  });
});
