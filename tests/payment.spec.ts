import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.page";
import { paymentData } from "../test-data/payment.data";

test.describe("Payment tests", () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto("/");
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    await page.getByRole("link", { name: "płatności" }).click();
  });

  test("simple payment", async ({ page }) => {
    //Arrange
    const transferReceiver = paymentData.transferReceiver;
    const transferAccount = paymentData.transferAccount;
    const transferAmount = paymentData.transferAmount;
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    //Act
    const paymentPage = new PaymentPage(page);
    await paymentPage.receiverInput.fill(transferReceiver);
    await paymentPage.accountInput.fill(transferAccount);
    await paymentPage.amountInput.fill(transferAmount);

    await paymentPage.acceptButton.click();
    await paymentPage.closeButton.click();

    //Assert
    await expect(paymentPage.expectedMessage).toHaveText(expectedMessage);
  });
});
