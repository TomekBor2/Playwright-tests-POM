import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PulpitPage } from "../pages/pulpit.page";
import { pulpitData } from "../test-data/pulpit.data";

test.describe("Pulpit tests", () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    //before POM
    // await page.getByTestId("login-input").fill(userId);
    // await page.getByTestId("password-input").fill(userPassword);
    // await page.getByTestId("login-button").click();
  });

  test("quick payment with correct data", async ({ page }) => {
    // Arrange
    const receiverId = pulpitData.receiverId;
    const transferAmount = pulpitData.transferAmount;
    const transferTitle = pulpitData.transferTitle;
    const expectedTransferReceiver = pulpitData.expectedTransferReceiver;

    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.receiverDropdown.selectOption(receiverId);
    await pulpitPage.amountInput.fill(transferAmount);
    await pulpitPage.titleInput.fill(transferTitle);

    await pulpitPage.acceptButton.click();
    await pulpitPage.closeButton.click();

    // before POM
    // await page.locator("#widget_1_transfer_receiver").selectOption(receiverId);
    // await page.locator("#widget_1_transfer_amount").fill(transferAmount);
    // await page.locator("#widget_1_transfer_title").fill(transferTitle);

    // await page.getByRole("button", { name: "wykonaj" }).click();
    // await page.getByTestId("close-button").click();

    // Assert
    await expect(pulpitPage.messageField).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`
    );
  });

  test.only("successful mobile top-up", async ({ page }) => {
    // Arrange
    const topUpReceiver = pulpitData.topUpReceiver;
    const topUpAmount = pulpitData.topUpAmount;
    const expectedMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

    // Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.topUpDropdown.selectOption(topUpReceiver);
    await pulpitPage.topUpAmountInput.fill(topUpAmount);
    await pulpitPage.topUpCheckbox.click();
    await pulpitPage.topUpAcceptButton.click();
    await pulpitPage.closeButton.click();

    // before POM
    // await page.locator("#widget_1_topup_receiver").selectOption(topUpReceiver);
    // await page.locator("#widget_1_topup_amount").fill(topUpAmount);
    // await page.locator("#uniform-widget_1_topup_agreement span").click();
    // await page.getByRole("button", { name: "doładuj telefon" }).click();
    // await page.getByTestId("close-button").click();

    // Assert
    await expect(pulpitPage.messageField).toHaveText(expectedMessage);
  });

  test.only("correct balance after successful mobile top-up", async ({
    page,
  }) => {
    // Arrange
    const pulpitPage = new PulpitPage(page);
    const topUpReceiver = pulpitData.topUpReceiver;
    const topUpAmount = pulpitData.topUpAmount;
    const initialBalance = await pulpitPage.moneyValue.innerText();
    const expectedBalance = Number(initialBalance) - Number(topUpAmount);

    // Act
    await pulpitPage.topUpDropdown.selectOption(topUpReceiver);
    await pulpitPage.topUpAmountInput.fill(topUpAmount);
    await pulpitPage.topUpCheckbox.click();
    await pulpitPage.topUpAcceptButton.click();
    await page.getByTestId("close-button").click();

    // Assert
    await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);
  });
});
