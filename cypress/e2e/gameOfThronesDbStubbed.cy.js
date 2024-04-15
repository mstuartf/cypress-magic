describe("Game of Thrones Db", () => {
  it("should work", () => {
    cy.visit("https://sens3ii.github.io/React-Game-Of-Thrones-DB/");
    cy.intercept(
      "GET",
      "https://www.anapioficeandfire.com/api/characters?page=2&pageSize=10",
      { statusCode: 200, fixture: "gameOfThronesDb/GET___api_characters_.json" }
    ).as("GET__/api/characters/");
    cy.intercept("GET", "https://www.anapioficeandfire.com/api/characters/20", {
      statusCode: 200,
      fixture: "gameOfThronesDb/GET___api_characters_20_.json",
    }).as("GET__/api/characters/20/");
    cy.get("a").contains("Characters").click();
    cy.intercept("GET", "https://www.anapioficeandfire.com/api/books/", {
      statusCode: 200,
      fixture: "gameOfThronesDb/GET___api_books_.json",
    }).as("GET__/api/books/");
    cy.get("a").contains("Books").click();
    cy.intercept("GET", "https://www.anapioficeandfire.com/api/books/1", {
      statusCode: 200,
      fixture: "gameOfThronesDb/GET___api_books_1_.json",
    }).as("GET__/api/books/1/");
    cy.get("li").contains("A Game of Thrones (694)").click();
    cy.get(
      "body > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div > div > ul > li:nth-of-type(2) > span:nth-of-type(2)"
    ).should("contain", "Bantam Books");
    cy.get(
      "body > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div > div > ul > li:nth-of-type(1) > span:nth-of-type(2)"
    ).should("contain", "694");
    cy.intercept(
      "GET",
      "https://www.anapioficeandfire.com/api/houses?page=2&pageSize=10",
      { statusCode: 200, fixture: "gameOfThronesDb/GET___api_houses_.json" }
    ).as("GET__/api/houses/");
    cy.intercept("GET", "https://www.anapioficeandfire.com/api/houses/20", {
      statusCode: 200,
      fixture: "gameOfThronesDb/GET___api_houses_20_.json",
    }).as("GET__/api/houses/20/");
    cy.get("a").contains("Houses").click();
    cy.intercept(
      "GET",
      "https://www.anapioficeandfire.com/api/houses?page=2&pageSize=10",
      { statusCode: 200, fixture: "gameOfThronesDb/GET___api_houses__1.json" }
    ).as("GET__/api/houses/_1");
    cy.intercept("GET", "https://www.anapioficeandfire.com/api/houses/11", {
      statusCode: 200,
      fixture: "gameOfThronesDb/GET___api_houses_11_.json",
    }).as("GET__/api/houses/11/");
    cy.get("li").contains("House Baelish of the Fingers (The Vale)").click();
    cy.get(
      "body > div:nth-of-type(1) > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > h4"
    ).should("contain", "House Baelish of the Fingers");
  });
});
