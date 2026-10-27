const BookingPage = require("../support/pages/BookingPage");

const demoClient = {
  email: "cliente.demo@prolink.com",
  password: "ProLink123!",
};

describe("Reservas", () => {
  it("redirige al login si una persona sin sesión intenta crear una reserva", () => {
    cy.visit("/bookings/create");

    cy.location("pathname").should("eq", "/login");
    cy.get("#email").should("be.visible");
  });

  describe("como cliente", () => {
    beforeEach(() => {
      cy.session("cliente-demo-reservas", () => {
        cy.visit("/login");
        cy.get("#email").type(demoClient.email);
        cy.get("#password").type(demoClient.password);
        cy.contains("button", "Iniciar sesión").click();
        cy.location("pathname", { timeout: 10000 }).should("eq", "/dashboard");
      });

      cy.visit("/bookings/create");
    });

    it("muestra el formulario con servicios disponibles y el saldo", () => {
      BookingPage.heading().should("contain.text", "Reservá tu servicio");
      BookingPage.serviceSelect().should("be.visible").find("option").its("length").should("be.greaterThan", 1);
      cy.contains("Saldo disponible:").should("be.visible");
      BookingPage.createButton().should("be.disabled");
    });

    it("no permite enviar una fecha inválida", () => {
      BookingPage.selectFirstAvailableService();
      BookingPage.dateInput().type("32/12/2026");
      BookingPage.timeInput().type("10:00");

      cy.get('[role="alert"]').should("contain.text", "fecha válida");
      BookingPage.createButton().should("be.disabled");
    });

    it("crea una reserva para un horario futuro y la muestra como pendiente", () => {
      BookingPage.selectFirstAvailableService();
      // Use an amount above the 10% minimum for the selected service.
      BookingPage.amountInput().clear().type("2000");

      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() + 2);
      const formattedDate = [
        String(bookingDate.getDate()).padStart(2, "0"),
        String(bookingDate.getMonth() + 1).padStart(2, "0"),
        bookingDate.getFullYear(),
      ].join("/");

      BookingPage.dateInput().clear().type(formattedDate);
      BookingPage.timeInput().clear().type("10:00");
      BookingPage.createButton().should("be.enabled").click();

      cy.location("pathname", { timeout: 15000 }).should("match", /^\/bookings\/\d+$/);
      cy.contains("h1", "Reserva #").should("be.visible");
      cy.contains("Pendiente").should("be.visible");
      cy.contains("Pago pendiente").should("be.visible");
    });
  });
});
