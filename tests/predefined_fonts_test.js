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
            await driver.sleep(1000);
                await new_style.sendKeys('predefined_style_1');

            await driver.wait(until.elementLocated(By.id('save-button'))).click();

            driver.switchTo().alert().then(
                function (alert) {alert.accept();},
                function (error) {}
            );
            // await driver.sleep(3000)
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
            driver.wait(until.elementLocated(By.linkText('predefined_style_1'))).click();

            var styles = driver.findElement(By.xpath('//*[@id="style-list"]'));
            for (var i; i < styles.length; i++) {
                console.log(style);
                style[i] === 'predefined_style_1' ? style[i].click() : '';
            }
            await driver.wait(until.elementLocated(By.id("delete_button"))).click();
            driver.switchTo().alert().then(
                function (alert) {alert.accept();},
                function (error) {}
            );

            let text = await driver.findElement(webdriver.By.linkText('predefined_style_1')).getText();
            expect(text.length).to.equal(0);
        });


    });
    after(async () => driver.quit());

})(driver);