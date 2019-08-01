const { expect } = require('chai');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver;
// let driver_chr = new webdriver.Builder().forBrowser('chrome')
//     .usingServer('http://localhost:4444/wd/hub')
//     .build();
// let driver_fx = new webdriver.Builder().forBrowser('firefox')
//     .usingServer('http://localhost:4444/wd/hub')
//     .build();

// run_tests(driver_chr);
// run_tests(driver_fx);

(async function run_tests(driver) {

    describe('EnableExtensionTest', () => {
       it('verify accessibility toolbar extension exists', async () => {
           await driver.get('http://host.docker.internal:10000/');
           await driver.sleep(5000);
           let psw = await driver.findElement(By.name('password'));

           await psw.sendKeys('12345678');

           await psw.sendKeys(webdriver.Key.ENTER);

           await driver.sleep(5000);

           await driver.findElement(By.linkText("Nbextensions")).click();

           await driver.sleep(5000);

           let text = await driver.findElement(webdriver.By.linkText('Accessibility Toolbar')).getText();
           expect(text).to.equal("Accessibility Toolbar");

           await driver.findElement(By.xpath("//*[@id=\"tabs\"]/li[4]/a")).click();
           await driver.sleep(5000);
           await driver.findElement(By.xpath("//*[@id=\"nbextensions-configurator-container\"]/div[3]/div[1]/div[5]/button[1]")).click();
           await driver.sleep(5000);
           await driver.findElement(By.linkText("Files")).click();
           await driver.sleep(5000);

       });
       after(async () => driver.quit());
    });


})(driver);