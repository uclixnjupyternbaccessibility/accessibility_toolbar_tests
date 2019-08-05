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
                var darkToggle = driver.wait(until.elementLocated(By.xpath("//*[@class='text-center switch']/div/div/label[2]")));
                await darkToggle.click();
                await driver.sleep(1000);
                var htmlElement = await driver.wait(until.elementLocated(By.tagName("html")));
                await driver.sleep(1000);
                await htmlElement.getAttribute('data-theme').then(function(value){
                      expect(value).to.equal('dark');
                })
                var body = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await body.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(45, 50, 60, 1)') || expect(value).to.equal('rgb(45, 50, 60)');
                });

                var textcolor = await driver.wait(until.elementLocated(By.css(".navbar-default .navbar-nav > li > a")));
                await textcolor.getCssValue("color").then(function(value) {
                    expect(value).to.equal('rgba(255, 255, 255, 1)');
                });
                var highToggle = await driver.wait(until.elementLocated(By.xpath("//div[@class='btn-group open']//li[2]/div")));
                await highToggle.getAttribute('disabled').then(function(value) {
                     expect(value).to.not.equal('null');
                });
                await darkToggle.click();
                await driver.sleep(1000);
            }); 
           it('verify high contrast mode is enabled', async () => {
                var highToggle = driver.wait(until.elementLocated(By.xpath("//div[@class='btn-group open']//li[2]/div/div/label[2]")));
                await highToggle.click();
                await driver.sleep(1000);
                var htmlElement = await driver.wait(until.elementLocated(By.tagName("html")));
                await htmlElement.getAttribute('data-theme').then(function(value){
                    expect(value).to.equal('contrast');
                })

                var body = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await body.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(0, 0, 0, 1)');
                });
                var textcolor = await driver.wait(until.elementLocated(By.css(".navbar-default .navbar-nav > li > a")));
                await textcolor.getCssValue("color").then(function(value) {
                    expect(value).to.equal('rgba(255, 255, 255, 1)');
                });
                await driver.sleep(1000);
                var darkToggle = await driver.wait(until.elementLocated(By.xpath("//*[@class='text-center switch']/div/div/label[2]")));
                await darkToggle.getAttribute('disabled').then(function(value) {
                    expect(value).to.not.equal('null');
                });
            });
          
        });
        after(async () => driver.quit());
})(driver);
