import { expect, Locator, Page } from "@playwright/test"

export class VoucherPage{
    
    private readonly homeButton: Locator
    private readonly orderHeading: Locator
    private readonly ponyImg: Locator


    constructor(page: Page){
        this.homeButton = page.getByRole('button',{name: 'Back Home'})
        this.orderHeading = page.getByRole('heading',{name: 'Thank you for your order!'})
        this.ponyImg = page.getByRole('img',{name: 'Pony Express'})
  
    }

    async validateSuccessVoucher(){
        await expect(this.homeButton).toBeVisible()
        await expect(this.orderHeading).toBeVisible()
        await expect(this.ponyImg).toBeVisible()
    }
}
