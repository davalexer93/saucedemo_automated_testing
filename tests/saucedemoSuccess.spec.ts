import { expect } from '@playwright/test';
import { test } from './fixture.ts';
import { LoginPage } from './page_objects/LoginPage.ts';
import { PersonInfoPage } from './page_objects/PersonInfoPage.ts';
import { VoucherPage } from './page_objects/VoucherPage.ts';

test('successful shop in saucedemo', async ({ fixtures, page }) => {
  const login = new LoginPage(page)
  await login.loginWithCredentials('standard_user','secret_sauce')
  await login.checkSuccessfulLogin()

  await expect(page).toHaveURL('/inventory.html');
  const itemsContainer = await page.locator('#inventory_container .inventory_item').all()
  const randomIndex = Math.floor(Math.random() * itemsContainer.length)
  const randomItem = itemsContainer[randomIndex]
  const expectedName = await randomItem.locator('.inventory_item_name').innerText()
  const expectedPrice = await randomItem.locator('.inventory_item_price').innerText()
  await randomItem.getByRole('button', {name:'Add to cart'}).click()
  await page.locator('[data-test="shopping-cart-link"]').click(); 

  await expect(page).toHaveURL('/cart.html');
  await expect(page.getByRole('button',{name: 'Checkout'})).toBeVisible()
  const actualName = await page.locator('.inventory_item_name').innerText()
  const actualPrice = await page.locator('.inventory_item_price').innerText()
  expect(actualName).toEqual(expectedName)
  expect(actualPrice).toEqual(expectedPrice)
  await page.getByRole('button',{name: 'Checkout'}).click()

  await expect(page).toHaveURL('/checkout-step-one.html');
  const personInfo = new PersonInfoPage(page)
  await personInfo.fillPersonInfo('David Alexander', 'Rubio', '111611')

  await expect(page).toHaveURL('/checkout-step-two.html');
  await expect(page.getByRole('button',{name: 'Finish'})).toBeVisible()
  const confirmName = await page.locator('.inventory_item_name').innerText()
  const confirmPrice = await page.locator('.inventory_item_price').innerText()
  expect(confirmName).toEqual(expectedName)
  expect(confirmPrice).toEqual(expectedPrice)
  await page.locator('[data-test="payment-info-label"]').waitFor({ state: 'visible' });
  await page.locator('[data-test="payment-info-value"]').waitFor({ state: 'visible' });
  await page.locator('[data-test="total-info-label"]').waitFor({ state: 'visible' });
  await page.locator('[data-test="total-label"]').waitFor({ state: 'visible' });
  await page.getByRole('button',{name: 'Finish'}).click()
  
  await expect(page).toHaveURL('/checkout-complete.html');
  const voucher = new VoucherPage(page)
  await voucher.validateSuccessVoucher()
});
