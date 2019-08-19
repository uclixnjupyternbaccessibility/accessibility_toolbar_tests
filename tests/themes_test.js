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
           it('verify dark mode is working', async () => {
                await utils.login_to_jupyter(By, webdriver);
                await utils.open_existing_notebook(By);

                const theme_button = driver.wait(until.elementLocated(By.id("theme")))
                await theme_button.click();
                await driver.sleep(2000);

                var darkToggle = driver.wait(until.elementLocated(By.xpath("//*[@id='theme_dropdown']/li[1]")));
                await darkToggle.click();
                await driver.sleep(1000);

                var htmlElement = await driver.wait(until.elementLocated(By.tagName("html")));
                await htmlElement.getAttribute('data-theme').then(function(value){
                      expect(value).to.equal('dark');
                }).catch(function(error){
                    console.log(error);
                });
                
                var body = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await body.getCssValue("background-color").then(function(value) {
                    var colorValue = ['rgb(45, 50, 60)','rgba(45, 50, 60, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                var textcolor = await driver.wait(until.elementLocated(By.css(".navbar-default .navbar-nav > li > a")));
                await textcolor.getCssValue("color").then(function(value) {
                    var colorValue  = ['rgb(255, 255, 255)','rgba(255, 255, 255, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                var highToggle = await driver.wait(until.elementLocated(By.xpath("//div[@class='btn-group open']//li[2]/div/input")));
                await highToggle.getAttribute('disabled').then(function(value) {
                     expect(value).to.not.equal('false');
                }).catch(function(error){
                    console.log(error);
                });
                await darkToggle.click();

                await driver.sleep(1000);

                await htmlElement.getAttribute('data-theme').then(function(value){
                      expect(value).to.equal('default');
                }).catch(function(error){
                    console.log(error);
                });

                await body.getCssValue("background-color").then(function(value) {
                    var colorValue  = ['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                await textcolor.getCssValue("color").then(function(value) {
                    var colorValue  = ['rgb(119, 119, 119)','rgba(119, 119, 119, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                await highToggle.getAttribute('disabled').then(function(value) {
                     expect(value).to.equal(null);
                }).catch(function(error){
                    console.log(error);
                });
            
            }); 
           it('verify high contrast mode is working', async () => {
                var highToggle = driver.wait(until.elementLocated(By.xpath("//div[@class='btn-group open']//li[2]/div/div/label[2]")));
                await highToggle.click();
                await driver.sleep(1000);
                var htmlElement = await driver.wait(until.elementLocated(By.tagName("html")));
                await htmlElement.getAttribute('data-theme').then(function(value){
                    expect(value).to.equal('contrast');
                }).catch(function(error){
                    console.log(error);
                });

                var body = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await body.getCssValue("background-color").then(function(value) {
                    var colorValue = ['rgb(0, 0, 0)','rgba(0, 0, 0, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                var textcolor = await driver.wait(until.elementLocated(By.css(".navbar-default .navbar-nav > li > a")));
                await textcolor.getCssValue("color").then(function(value) {
                    var colorValue  = ['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                    console.log(error);
                });

                await driver.sleep(1000);
                var darkToggle = await driver.wait(until.elementLocated(By.xpath("//*[@class='text-center switch']/div/div/label[2]")));
                await darkToggle.getAttribute('disabled').then(function(value) {
                    expect(value).to.not.equal('false');
                }).catch(function(error){
                    console.log(error);
                });

                await highToggle.click();
                await driver.sleep(1000);

                await htmlElement.getAttribute('data-theme').then(function(value){
                    expect(value).to.equal('default');
                }).catch(function(error){
                  console.log(error);
                });
    
                await body.getCssValue("background-color").then(function(value) {
                    var colorValue  = ['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                  console.log(error);
                });
    
                await textcolor.getCssValue("color").then(function(value) {
                   var colorValue = ['rgb(119, 119, 119)','rgba(119, 119, 119, 1)']
                   expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function(error){
                  console.log(error);
                });
    
                await highToggle.getAttribute('disabled').then(function(value) {
                   expect(value).to.equal(null);
                }).catch(function(error){
                  console.log(error);
                });
            });   
        });
        after(async () => driver.quit());
})(driver);
