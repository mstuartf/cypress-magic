describe("sdf", () => {
  it("ddd", () => {
    cy.visit(
      "./demo/index.html?_ijt=4svtedidmuk5f2opgdoorupnj9&_ij_reload=RELOAD_ON_SAVE"
    );
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(2) > input"
    ).check();
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(2) > input"
    ).uncheck();
    cy.get(
      "body > div:nth-of-type(1) > div:nth-of-type(9) > form > div:nth-of-type(3) > select"
    ).select("mercedes");
  });
});
