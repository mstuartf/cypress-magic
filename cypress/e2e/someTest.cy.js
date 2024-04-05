describe("asdf", () => {
  it("asdg", () => {
    cy.visit(
      "./demo/index.html?_ijt=4svtedidmuk5f2opgdoorupnj9&_ij_reload=RELOAD_ON_SAVE"
    );
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > button"
    ).should("contain", "Submit");
    cy.get("body > div:nth-of-type(1) > div:nth-of-type(10) > button").should(
      "contain",
      "Change selector button"
    );
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(2) > div:nth-of-type(2) > input"
    ).check();
    cy.contains("CSS").click();
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(2) > div:nth-of-type(3) > input"
    ).check();
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(1) > input"
    )
      .clear()
      .type("adfsa");
  });
});
