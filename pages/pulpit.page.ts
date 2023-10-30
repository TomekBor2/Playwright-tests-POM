import { Page } from "@playwright/test";
import { SideMenuComponent } from "../components/side-menu.component";

export class PulpitPage {
  constructor(private page: Page) {}

  sideMenu = new SideMenuComponent(this.page)

  usernameField = this.page.getByTestId("user-name");

  //   quick payment
  receiverDropdown = this.page.locator("#widget_1_transfer_receiver");
  amountInput = this.page.locator("#widget_1_transfer_amount");
  titleInput = this.page.locator("#widget_1_transfer_title");

  acceptButton = this.page.getByRole("button", { name: "wykonaj" });
  closeButton = this.page.getByTestId("close-button");

  messageField = this.page.locator("#show_messages");

  // topup
  topUpDropdown = this.page.locator("#widget_1_topup_receiver");
  topUpAmountInput = this.page.locator("#widget_1_topup_amount");
  topUpCheckbox = this.page.locator("#uniform-widget_1_topup_agreement span");
  topUpAcceptButton = this.page.getByRole("button", {
    name: "doładuj telefon",
  });
  //   topUpCloseButton = this.page.getByTestId("close-button").click();
  moneyValue = this.page.locator("#money_value");

  async makeQuickPayment(receiverId: string, transferAmount: string, transferTitle: string): Promise <void> {
    await this.receiverDropdown.selectOption(receiverId);
    await this.amountInput.fill(transferAmount);
    await this.titleInput.fill(transferTitle);

    await this.acceptButton.click();
    await this.closeButton.click();
  }

  async makeTopUp(topUpReceiver: string, topUpAmount: string): Promise <void> {
    await this.topUpDropdown.selectOption(topUpReceiver);
    await this.topUpAmountInput.fill(topUpAmount);
    await this.topUpCheckbox.click();
    await this.topUpAcceptButton.click();
    await this.closeButton.click();
  }
}
