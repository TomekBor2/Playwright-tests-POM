import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PulpitPage } from "../pages/pulpit.page";

test.describe("User login to Demobank", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("successful login with correct credentials", async ({ page }) => {
    // Arrange
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;
    const expectedUserName = "Jan Demobankowy";

    // Act
    const loginPage = new LoginPage(page);
    const pulpitPage = new PulpitPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();

    //before POM
    // await page.getByTestId("login-input").fill(userId);
    // await page.getByTestId("password-input").fill(userPassword);
    // await page.getByTestId("login-button").click();

    // Assert
    await expect(pulpitPage.usernameField).toHaveText(expectedUserName);
  });

  test("unsuccessful login with too short username", async ({ page }) => {
    // Arrange
    const incorrectUserId = "tester";
    const expectedErrorMessage = "identyfikator ma min. 8 znaków";

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(incorrectUserId);
    await loginPage.passwordInput.click();

    // begore POM
    // await page.getByTestId("login-input").fill(incorrectUserId);
    // await page.getByTestId("password-input").click();

    // Assert
    await expect(loginPage.loginError).toHaveText(expectedErrorMessage);
  });

  test("unsuccessful login with too short password", async ({ page }) => {
    // Arrange
    const userId = loginData.userId;
    const incorrectPassword = "1234";
    const expectedErrorMessage = "hasło ma min. 8 znaków";

    // Act
    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(incorrectPassword);
    await loginPage.passwordInput.blur();

    // before POM
    // await page.getByTestId("login-input").fill(userId);
    // await page.getByTestId("password-input").fill(incorrectPassword);
    // await page.getByTestId("password-input").blur();

    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
  });
});
