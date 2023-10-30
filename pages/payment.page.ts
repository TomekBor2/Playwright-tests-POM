import { Page } from "@playwright/test";
import { SideMenuComponent } from "../components/side-menu.component";

export class PaymentPage {
  constructor(private page: Page) {}

  sideMenu = new SideMenuComponent(this.page);

  receiverInput = this.page.getByTestId("transfer_receiver");
  accountInput = this.page.getByTestId("form_account_to");
  amountInput = this.page.getByTestId("form_amount");

  acceptButton = this.page.getByRole("button", { name: "wykonaj przelew" });
  closeButton = this.page.getByTestId("close-button");

  expectedMessage = this.page.locator("#show_messages");

  async makeTransfer(
    transferReceiver: string,
    transferAccount: string,
    transferAmount: string
  ): Promise<void> {
    await this.receiverInput.fill(transferReceiver);
    await this.accountInput.fill(transferAccount);
    await this.amountInput.fill(transferAmount);

    await this.acceptButton.click();
    await this.closeButton.click();
  }
}
