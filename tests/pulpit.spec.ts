import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PulpitPage } from "../pages/pulpit.page";
import { pulpitData } from "../test-data/pulpit.data";

test.describe("Pulpit tests", () => {
  let pulpitPage: PulpitPage;
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto("/");

    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);
    pulpitPage = new PulpitPage(page);
  });

  test("quick payment with correct data", async ({ page }) => {
    // Arrange
    const receiverId = pulpitData.receiverId;
    const transferAmount = pulpitData.transferAmount;
    const transferTitle = pulpitData.transferTitle;
    const expectedTransferReceiver = pulpitData.expectedTransferReceiver;

    // Act
    await pulpitPage.receiverDropdown.selectOption(receiverId);
    await pulpitPage.amountInput.fill(transferAmount);
    await pulpitPage.titleInput.fill(transferTitle);

    await pulpitPage.acceptButton.click();
    await pulpitPage.closeButton.click();

    // Assert
    await expect(pulpitPage.messageField).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`
    );
  });

  test("successful mobile top-up", async ({ page }) => {
    // Arrange
    const topUpReceiver = pulpitData.topUpReceiver;
    const topUpAmount = pulpitData.topUpAmount;
    const expectedMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

    // Act
    await pulpitPage.topUpDropdown.selectOption(topUpReceiver);
    await pulpitPage.topUpAmountInput.fill(topUpAmount);
    await pulpitPage.topUpCheckbox.click();
    await pulpitPage.topUpAcceptButton.click();
    await pulpitPage.closeButton.click();

    // Assert
    await expect(pulpitPage.messageField).toHaveText(expectedMessage);
  });

  test("correct balance after successful mobile top-up", async ({ page }) => {
    // Arrange

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
