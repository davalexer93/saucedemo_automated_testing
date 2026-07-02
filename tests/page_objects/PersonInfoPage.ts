import { Locator, Page } from "@playwright/test"

export class PersonInfoPage{
    
    private readonly firstNameTextbox: Locator
    private readonly lastNameTextbox: Locator
    private readonly postalCodeTextBox: Locator
    private readonly buttonContinue: Locator

    constructor(page: Page){
        this.firstNameTextbox = page.getByRole('textbox',{name: 'First Name'})
        this.lastNameTextbox = page.getByRole('textbox',{name: 'Last Name'})
        this.postalCodeTextBox = page.getByRole('textbox',{name: 'Zip/Postal Code'})
        this.buttonContinue = page.getByRole('button',{name: 'Continue'})
    }

    async fillFirstName(firstname: string){
        await this.firstNameTextbox.fill(firstname)
    }

    async fillLastName(lastname:string){
        await this.lastNameTextbox.fill(lastname)
    }

    async fillPostalCode(postalcode:string){
        await this.postalCodeTextBox.fill(postalcode)
    }

    async clickOnContinueButton(){
       await this.buttonContinue.click()
    }

    async fillPersonInfo(firstname: string, lastname: string, postalcode: string){
        await this.fillFirstName(firstname)
        await this.fillLastName(lastname)
        await this.fillPostalCode(postalcode)
        await this.clickOnContinueButton()
    }
}
