describe("A tesxt", () => {
  it("should work", () => {
    cy.visit("./demo/index.html");
    cy.get("#add-param-button").click();
    cy.url().should("include", "newParam=value");
    cy.get("#username").click();
    cy.get("#username").clear().type("asdfasdf");
    cy.get("#select-this-element").click();
    cy.get("#change-selector-button").click();
  });
});
