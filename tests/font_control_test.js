const { expect } = require('chai');

const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

(async function run_tests(driver) {

    describe('Font control testing', () => {
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

       it('Create new notebook', async () => {
            await driver.get('http://host.docker.internal:10000/');
            await driver.sleep(2000);
            await utils.open_existed_notebook(By);
       });

       it('Open font style dropdown',async()=>{
            var fs=driver.wait(until.elementLocated(By.id("fs")));
            await fs.click();
            var toogle= driver.wait(until.elementLocated(By.xpath("//*[@id='switch']/div/div/label[2]")));
            await toogle.click();
            await driver.sleep(2000);
       })

       it('Change font name', async() =>{
            var font_name= driver.wait(until.elementLocated(By.id("font_name")));
            var font_name_list=[
                "Monospace",
                "Arial",
                "Arial Black",
                "Comic Sans MS",
                "Georgia",
                "Impact",
                "Lucida Sans Unicode",
                "Palatino Linotype",
                "Tahoma",
                "Times New Roman",
                "Verdana",
                "Default"
              ];
            await driver.sleep(1000);
            for(var i=0;i<font_name_list.length;i++){
                await font_name.click();
                await font_name.sendKeys(font_name_list[i]);
                await driver.sleep(1000)
                await font_name.sendKeys(webdriver.Key.ENTER);
                await driver.sleep(1000);
            }
       });

       it('Change font size', async() =>{
        var font_size= driver.wait(until.elementLocated(By.id("font_size")));
        var font_size_list=[
            "10",
            "12",
            "14",
            "20",
            "28",
            "32",
            "48",
            "56",
            "64",
            "72"
          ];
        await driver.sleep(1000);
        for(var i=0;i<font_size_list.length;i++){
            await font_size.click();
            await font_size.sendKeys(font_size_list[i]);
            await driver.sleep(1000)
            await font_size.sendKeys(webdriver.Key.ENTER);
            await driver.sleep(2000);
        }
        await driver.sleep(3000);
   });

       after(async () => driver.quit());
    });
})(driver);

