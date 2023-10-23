import { Page } from "@playwright/test";

export class PaymentPage {
  constructor(private page: Page) {}

  receiverInput = this.page.getByTestId("transfer_receiver");
  accountInput = this.page.getByTestId("form_account_to");
  amountInput = this.page.getByTestId("form_amount");


  acceptButton = this.page.getByRole("button", { name: "wykonaj przelew" });
  closeButton = this.page.getByTestId("close-button");

  expectedMessage = this.page.locator("#show_messages");
}
