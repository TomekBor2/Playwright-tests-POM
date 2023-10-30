import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.page";
import { paymentData } from "../test-data/payment.data";
import { PulpitPage } from "../pages/pulpit.page";

test.describe("Payment tests", () => {
  let paymentPage: PaymentPage
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto("/");
    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);

    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenu.paymentButton.click();

    paymentPage = new PaymentPage(page);
  });

  test("simple payment", async ({ page }) => {
    //Arrange
    const transferReceiver = paymentData.transferReceiver;
    const transferAccount = paymentData.transferAccount;
    const transferAmount = paymentData.transferAmount;
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    //Act
    await paymentPage.makeTransfer(transferReceiver,transferAccount, transferAmount)

    //Assert
    await expect(paymentPage.expectedMessage).toHaveText(expectedMessage);
  });
});
