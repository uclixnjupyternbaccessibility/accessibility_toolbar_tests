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
            await utils.open_existing_notebook(By);
            var font_style = driver.wait(until.elementLocated(By.id("fs")));
            await font_style.click();
            await driver.sleep(1000);
            var predefined = await driver.wait(until.elementLocated(By.id("predefined_styles")));
            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.include('disabled');
            });
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.id("switch"))).click();
            await driver.sleep(1000);

            var predefined = driver.findElement(By.id("predefined_styles"));

            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            });
        });

        it('create new predefined style test', async () => {
            await driver.sleep(1000);
            var ps = driver.wait(until.elementLocated(By.xpath("//*[@id=\"predefined_styles\"]")));
            await driver.sleep(1000);
            await ps.click();

            var new_style_button = await driver.wait(until.elementLocated(By.id("new_style_button")));
            await driver.sleep(1000);
            await new_style_button.findElement(By.xpath("./..")).click();
            await driver.sleep(1000);
            var new_style = driver.wait(until.elementLocated(By.id("style_name")));
            await driver.sleep(1000);
            await new_style.sendKeys('predefined_style_1');

            await driver.wait(until.elementLocated(By.id('save-button'))).click();

            await driver.sleep(1000);
            await driver.switchTo().alert().then(
                async function (alert) {await alert.accept()})
                .catch(function(error) {});

            await driver.wait(until.elementLocated(By.id("fs"))).click();
            await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
            let styles = driver.wait(until.elementLocated(By.linkText('predefined_style_1')));
            await styles.getAttribute('class').then(function(classes) {
                expect(classes).to.include('dropdown-item-checked');
            });
        });

        it('delete an existing predefined style test', async () => {
            await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
            var delete_style_button = await driver.wait(until.elementLocated(By.id("delete_style_button")));
            await driver.sleep(1000);
            await delete_style_button.findElement(By.xpath("./..")).click();
            await driver.sleep(1000);

            driver.wait(until.elementLocated(By.css('#style-list > option[value="' + 'predefined_style_1'))).click();
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.id("delete-button"))).click();
            await driver.switchTo().alert().then(
                async function (alert) {await alert.accept()})
                .catch(function(error) {});

            await driver.wait(until.elementLocated(By.id("fs"))).click();
            await driver.sleep(1000);
            await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
            var deleted = await driver.findElement(By.linkText('predefined_style_1')).catch(function(error) {});
            expect(deleted).to.equal(undefined);
        });

    });
    after(async () => driver.quit());

})(driver);