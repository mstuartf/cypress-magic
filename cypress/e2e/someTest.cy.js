describe("User Login", () => {
  it("alskjd", () => {
    cy.visit(
      "./demo/index.html?a=asjdhfgas&b=ldkjhladskjhlksajdhfkljashfljdhljasdlkfjahsglkjhaslgkjadlkgjdalkghldfkgh"
    );
    cy.get("#request-results").should("contain", "askldjfh");
    cy.intercept("GET", "https://swapi.dev/api/people/1", {
      statusCode: 200,
      fixture: "someTest/GET___api_people_1_.json",
    }).as("GET__/api/people/1/");
    cy.wait("@GET__/api/people/1/");
    cy.get("#add-param-button").click();
    cy.url().should("include", "newParam=value");
    cy.get("#change-selector-button").should(
      "contain",
      "Change selector button"
    );
    cy.reload();
    cy.get("#username").clear().type("alskdjfh");
  });
});
