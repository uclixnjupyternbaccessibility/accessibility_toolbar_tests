const { expect } = require('chai');
const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();


(async function run_tests(driver) {
    describe('PredefinedStyleTests', () => {
        it('when font styles changed predefined styles changes', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await utils.open_notebook(By, until, true, '04 Functions.ipynb');
            var font_style = driver.wait(until.elementLocated(By.id("fs")))
            await font_style.click();

            var predefined = await driver.wait(until.elementLocated(By.id("predefined_styles")));
            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.include('disabled');
            });
            await driver.wait(until.elementLocated(By.id("switch"))).click();

            var predefined = driver.wait(until.elementLocated(By.id("predefined_styles")));
            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            });
        });


        it('create new predefined style test', async () => {
            await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
            var new_style_button = await driver.wait(until.elementLocated(By.id("new_style_button")));
            await driver.sleep(1000);
            await new_style_button.findElement(By.xpath("./..")).click();

            var new_style = driver.wait(until.elementLocated(By.id("style_name")));
            await new_style.sendKeys('predefined_style_1');

            await driver.wait(until.elementLocated(By.id('save-button'))).click();


            driver.wait(webdriver.until.alertIsPresent()).then(await driver.switchTo().alert().accept()).catch();
            await driver.sleep(3000)
            await driver.wait(until.elementLocated(By.id("fs"))).click();
            await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
            // await driver.close();
        });
    });
    after(async () => driver.quit());

})(driver);