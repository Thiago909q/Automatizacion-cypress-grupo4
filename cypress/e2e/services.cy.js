import ServicesPage from "../support/pages/servicesPage";

describe("Servicios", () => {
  const servicesPage = new ServicesPage();

  beforeEach(() => {
    servicesPage.visitCatalog();
  });

  it("muestra el catálogo de servicios", () => {
    servicesPage.heading().should("be.visible").and("contain.text", "Explorá servicios");
    servicesPage.cards().should("have.length.greaterThan", 0);
    cy.contains("resultados disponibles").should("be.visible");
  });

  it("abre el detalle de un servicio desde el catálogo", () => {
    servicesPage.cards().first().then(($service) => {
      const serviceUrl = $service.attr("href");
      const serviceTitle = $service.find("h2").text().trim();

      cy.wrap($service).click();
      cy.location("pathname").should("eq", serviceUrl);
      cy.get("main h1").should("be.visible").and("have.text", serviceTitle);
      cy.contains("Reseñas de este servicio").should("be.visible");
      cy.contains("Ver perfil profesional").should("be.visible");
    });
  });

  it("busca servicios por texto", () => {
    servicesPage.searchField().type("Fotografía");
    servicesPage.submitSearch();

    servicesPage.cards()
      .should("have.length.greaterThan", 0)
      .each(($service) => {
        cy.wrap($service).should("contain.text", "Fotografía");
      });
    cy.location("search").should("include", "search=Fotograf");
  });

  it("filtra servicios por categoría", () => {
    servicesPage.categoryField().select("Belleza");
    servicesPage.submitSearch();

    servicesPage.cards()
      .should("have.length.greaterThan", 0)
      .each(($service) => {
        cy.wrap($service).should("contain.text", "Maquillaje social profesional");
      });
    cy.location("search").should("include", "category=Belleza");
  });

  it("filtra servicios por rango de precio", () => {
    servicesPage.openPriceOptions();
    servicesPage.minimumPriceField().type("10000");
    servicesPage.maximumPriceField().type("20000");
    servicesPage.submitSearch();

    cy.location("search").should("include", "min_price=10000");
    cy.location("search").should("include", "max_price=20000");
    servicesPage.cards().should("have.length.greaterThan", 0);
    servicesPage.cards().each(($service) => {
      const priceText = $service.text().match(/\$\s*([\d.]+)/);
      expect(priceText, "precio visible en la tarjeta").to.not.be.null;
      const price = Number(priceText[1].replace(/\./g, ""));

      expect(price).to.be.within(10000, 20000);
    });
  });

  it("ordena servicios por precio de menor a mayor", () => {
    servicesPage.openPriceOptions();
    servicesPage.sortField().select("price_asc");
    servicesPage.submitSearch();

    cy.location("search").should("include", "sort=price_asc");
    servicesPage.cards().then(($services) => {
      const prices = [...$services].map((service) => {
        const priceText = service.innerText.match(/\$\s*([\d.]+)/);
        expect(priceText, "precio visible en la tarjeta").to.not.be.null;
        return Number(priceText[1].replace(/\./g, ""));
      });

      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
    });
  });
});
