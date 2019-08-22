const { expect } = require('chai');

const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

(async function run_tests(driver) {

    describe('EnableExtensionTest', () => {
       it('verify accessibility toolbar extension exists', async () => {
           await utils.login_to_jupyter(By, webdriver);

           await driver.sleep(2000);

           await driver.findElement(By.linkText("Nbextensions")).click();

           await driver.sleep(1000);

           let text = await driver.findElement(webdriver.By.linkText('Accessibility Toolbar')).getText();
           expect(text).to.equal("Accessibility Toolbar");
       });

       it('Create new notebook', async () => {
           await driver.get('http://host.docker.internal:10000/');
           await driver.sleep(2000);
           await utils.open_new_notebook(By ,true);

           await driver.sleep(5000);
           await driver.findElement(By.id("fs")).click();
           await driver.sleep(2000);
       });
       after(async () => driver.quit());
    });
})(driver);

