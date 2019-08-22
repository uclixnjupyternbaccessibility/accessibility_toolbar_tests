const { expect } = require('chai');

const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

(async function run_tests(driver) {

    describe('Spell checker testing', () => {
        var spc = driver.wait(until.elementLocated(By.id("spc")));
        var text=driver.wait(until.elementLocated(By.xpath("//*[@id='notebook-container']/div[1]/div[2]/div[2]/div/div[6]/div[1]/div/div/div/div[5]/pre[1]/span/span")));
        var notebook=driver.wait(until.elementLocated(By.id("notebook")));
        it('verify accessibility toolbar extension exists', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await driver.sleep(2000);
        });

        it('Open notebook', async () => {
            await driver.get('http://host.docker.internal:10000/');
            await utils.open_existing_notebook(By);
            await driver.sleep(3000);
        });

        it('Open spell checker dropdown menu', async () => {
            await spc.click();
            await driver.sleep(3000);
        })

        it('Turn on spell checker',async()=>{
            await driver.wait(until.elementLocated(By.id("lispcswitch"))).click();
            await driver.sleep(1000);
            await notebook.click();
        });

        it('Test inline spell checker',async()=>{
            await text.getCssValue("font-weight").then(function(value){
                expect(value).to.equal('700');
            }).catch(function(err){
                console.log(err);
            });
            await driver.sleep(3000);
        });

        it('Test underline',async()=>{
            await spc.click();
            await driver.wait(until.elementLocated(By.id("listyle"))).click();
            await driver.sleep(3000);
            await text.getCssValue("text-decoration").then(function(value){
                expect(value).to.equal('none solid rgb(0, 0, 255)');
            }).catch(function(err){
                console.log(err);
            });
            await notebook.click();
            await driver.sleep(3000);
        });

        it('Test checker',async()=>{
            await spc.click();
            await driver.wait(until.elementLocated(By.xpath("//*[@id='spc_dropdown']/li[3]"))).click();
            await driver.sleep(3000);
            var checker_text="thiss iss unit tseting";
            await driver.executeScript(utils.checker,checker_text);
            await driver.wait(until.elementLocated(By.id("check-btn"))).click();
            var thiss=driver.wait(until.elementLocated(By.xpath("//*[@id='textarea1']/div/div[6]/div[1]/div/div/div/div[5]/pre/span/span[1]")));
            await thiss.getCssValue("font-weight").then(function(value){
                expect(value).to.equal('700');
            }).catch(function(err){
                console.log(err);
            })
            await driver.sleep(3000);
        });

        it('Test add new word',async()=>{
            var new_word="iss";
            var new_word_cell=driver.wait(until.elementLocated(By.id("new_word")));
            await new_word_cell.click();
            await new_word_cell.sendKeys(new_word);
            await driver.wait(until.elementLocated(By.id("add-new-btn"))).click();
            await driver.wait(until.elementLocated(By.id("check-btn"))).click();
            var iss=driver.wait(until.elementLocated(By.xpath("//*[@id='textarea1']/div/div[6]/div[1]/div/div/div/div[5]/pre/span/span[2]")));
            await iss.getText().then(function(value){
                expect(value).to.equal('tseting');
            }).catch(function(err){
                console.log(err);
            })
            await driver.wait(until.elementLocated(By.xpath("//*[@id='spc_main_body']/div/div[3]/button"))).click();
            await driver.sleep(3000);
        });

        it('Test keep open after refreshing',async()=>{
            await driver.navigate().refresh();
            await driver.switchTo().alert().then(
                async function (alert) {await alert.accept()})
                .catch(function(error) {});
            var _text=driver.wait(until.elementLocated(By.xpath("//*[@id='notebook-container']/div[1]/div[2]/div[2]/div/div[6]/div[1]/div/div/div/div[5]/pre[1]/span/span")));
            var _notebook=driver.wait(until.elementLocated(By.id("notebook")));
            await _notebook.click();
            await _text.getCssValue("font-weight").then(function(value){
                expect(value).to.equal('700');
            }).catch(function(err){
                console.log(err);
            });
            await driver.sleep(3000);
        });

        it('Test turn off spell checker',async()=>{
            await driver.wait(until.elementLocated(By.id("spc"))).click();
            await driver.wait(until.elementLocated(By.id("lispcswitch"))).click();
            await driver.sleep(3000);
        });

    });
   after(async () => driver.quit());
})(driver);

