const { expect } = require('chai');
const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

(async function run_tests(driver) {
    describe('ThemesTests', () => {
        it('verify dark mode is enabled', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await utils.open_existing_notebook(By);
            var theme_button = driver.wait(until.elementLocated(By.id("theme")))
            await theme_button.click();
            var darkToggle = await driver.wait(until.elementLocated(By.id("darkToggle")));
            await darkToggle.click();
            var htmlElement = await driver.wait(until.elementLocated(By.tagName("html")));
            await htmlElement.getAttribute('data-theme').then(function (value) {
                expect(value).to.equal('dark');
            })
        });
        it('verify the background is dark after the dark mode is enabled', async () => {
            var theme_button = driver.wait(until.elementLocated(By.id("theme")))
            await theme_button.click();
            var darkToggle = await driver.wait(until.elementLocated(By.id("darkToggle")));
            await darkToggle.click();
            var body = await driver.wait(until.elementLocated(By.cssSelector("#notebook-container")));
            await body.getCssValue("background-color").then(function (value) {
                expect(value).to.equal('#2d323c');
            });

        });
        it('verify high contrast mode is disable when dark mode is enabled', async () => {
            var theme_button = driver.wait(until.elementLocated(By.id("theme")))
            await theme_button.click();
            var darkToggle = await driver.wait(until.elementLocated(By.id("darkToggle")));
            await darkToggle.click();
            var highToggle = await driver.wait(until.elementLocated(By.id("highToggle")));
            await highToggle.getAttribute('disabled').then(function (value) {
                expect(value).to.not.equal('null');
            });
        });
    });
    after(async () => driver.quit());
})(driver);