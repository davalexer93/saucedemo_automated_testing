import { expect } from '@playwright/test';
import { test } from './fixture.ts';
import { LoginPage } from './page_objects/LoginPage.ts';
import { PersonInfoPage } from './page_objects/PersonInfoPage.ts';



test('checkout in zero in saucedemo', async ({ fixtures, page }) => {
  const login = new LoginPage(page)
  await login.loginWithCredentials('standard_user','secret_sauce')
  await login.checkSuccessfulLogin()

  await expect(page).toHaveURL('/inventory.html');
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  await page.locator('[data-test="shopping-cart-link"]').click(); 

  await expect(page).toHaveURL('/cart.html');
  await expect(page.getByRole('button',{name: 'Checkout'})).toBeVisible()
  await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light')
  await page.getByRole('button',{name: 'Remove'}).click()
  await page.getByRole('button',{name: 'Checkout'}).click()

  await expect(page).toHaveURL('/checkout-step-one.html');
  const personInfo = new PersonInfoPage(page)
  await personInfo.fillPersonInfo('David Alexander', 'Rubio', '111611')

  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(page.getByRole('button',{name: 'Finish'})).toBeVisible()
  await expect (page.locator('[data-test="total-label"]')).toHaveText('Total: $0.00')
});