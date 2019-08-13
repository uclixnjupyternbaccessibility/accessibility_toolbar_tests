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
        it('verify accessibility toolbar extension exists', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await driver.sleep(2000);
            await driver.findElement(By.linkText("Nbextensions")).click();
            await driver.sleep(1000);
            let text = await driver.findElement(webdriver.By.linkText('Accessibility Toolbar')).getText();
            expect(text).to.equal("Accessibility Toolbar");
            await driver.findElement(By.xpath("//*[@id=\"tabs\"]/li[4]/a")).click();
            await driver.sleep(1000);
            await driver.findElement(By.xpath("//*[@id=\"nbextensions-configurator-container\"]/div[3]/div[1]/div[5]/button[1]")).click();
            await driver.sleep(1000);
            await driver.findElement(By.linkText("Files")).click();
            await driver.sleep(1000);

        });

        it('Open notebook', async () => {
            await driver.get('http://host.docker.internal:10000/');
            await utils.open_existing_notebook(By);
            await sleep(3000);
        });

        it('Open spell checker dropdown menu', async () => {
            await driver.sleep(3000);
            var fs = driver.wait(until.elementLocated(By.id("spc")));
            await fs.click();
            await sleep(3000);
        })

        //TODO: test for turn on spell checker
        it('Turn on spell checker',async()=>{
            await driver.wait(until.elementLocated(By.id("switch"))).click();
            await driver.sleep(1000);
            var notebook=driver.wait(until.elementLocated(By.id("notebook")));
        });

        //TODO: test for check inline spell checker
        it('Test inline spell checker',async()=>{

        });

        //TODO: test for check in checker
        it('Test checker',async()=>{

        });

        //TODO: test for add new word
        it('Test add new word',async()=>{

        });

        //TODO: test for the checker keep open after refreshing
        it('Test keep open after refreshing',async()=>{

        });

        //TODO: test for turn off spell checker
        it('Test turn of spell checker',async()=>{

        });

    });
    after(async () => driver.quit());
})(driver);

