const { expect } = require('chai');
const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();


(async function run_tests(driver) {
    describe('ColorManagerTests', () => {

        //=====================
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
             await utils.open_existing_notebook(By);
        });

        it('Open font style dropdown',async()=>{
             var fs=driver.wait(until.elementLocated(By.id("fs")));
             await fs.click();

        })

        it('Turn the switch on',async()=>{
            var toogle= driver.wait(until.elementLocated(By.xpath("//*[@id='switch']/div/div/label[2]")));
            await toogle.click();
            await driver.sleep(2000);
       })



        //=======================
        it('when font styles switch on,  cell background color is not disabled', async () => {

            var cellBackgroundColor = driver.wait(until.elementLocated(By.id("color-picker-background")));
            await cellBackgroundColor.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            }).catch(function(err) {
                console.log('error')
            });
        });

        it('when font styles switch on,  page bckground color is not disabled', async () => {
            var pageBackgroundColor = driver.wait(until.elementLocated(By.id("color-picker-page-background")));
            await pageBackgroundColor.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            }).catch(function(err) {
                console.log('error')
            });
        });

        it('when font styles switch on,  text font color is not disabled', async () => {
            var textFontColor = driver.wait(until.elementLocated(By.id("color-picker")));
            await textFontColor.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            }).catch(function(err) {
                console.log('error')
            });
        });
        //=================

        it('Change  cell background color test', async () => {
            await driver.wait(until.elementLocated(By.id("color-picker-background"))).click();
            await driver.wait(until.elementLocated(By.xpath("/html/body/div[8]/div[1]/div[1]/div[2]/span[3]/span"))).click();
            await driver.sleep(1000);

            var new_cell_color = await driver.wait(until.elementLocated(By.css(".input_area div")));
                await new_cell_color.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(255, 255, 0, 1)');}).catch(function(err) {
                        console.log('error')
                    });
        });
        it('close  cell background color picker test', async () => {
             await driver.wait(until.elementLocated(By.id("color-picker-background"))).click();
            await driver.wait(until.elementLocated(By.id("f_name"))).click().catch(function(err) {
                console.log('cell background color is not colse for that font name  is not clickable!!!')
            });
            
        });


        it('Change  page background color test', async () => {
            await driver.wait(until.elementLocated(By.id("color-picker-page-background"))).click();
            await driver.wait(until.elementLocated(By.xpath("/html/body/div[9]/div[1]/div[1]/div[3]/span[6]/span"))).click();
            await driver.sleep(1000);

            var new_page_color  = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await new_page_color.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(207, 226, 243, 1)');}).catch(function(err) {
                        console.log('error')
                    });
        });
        it('close  page background color picker test', async () => {
            await driver.wait(until.elementLocated(By.id("color-picker-page-background"))).click();
            await driver.wait(until.elementLocated(By.id("f_name"))).click().catch(function(err) {
                console.log('cell background color is not colse for that font name  is not clickable!!!')
            });
        });

        it('Change  text font color test', async () => {
            await driver.wait(until.elementLocated(By.id("color-picker"))).click();
            await driver.wait(until.elementLocated(By.xpath("/html/body/div[7]/div[1]/div[1]/div[2]/span[1]/span"))).click();
            await driver.sleep(1000);

            var new_font_color  = await driver.wait(until.elementLocated(By.css(".rendered_html p")));
                await new_font_color.getCssValue("color").then(function(value) {
                    expect(value).to.equal('rgba(255, 0, 0, 1)');}).catch(function(err) {
                        console.log('error')
                    });
        });
        it('close text font color picker test', async () => {
            await driver.wait(until.elementLocated(By.id("color-picker"))).click();
            await driver.wait(until.elementLocated(By.id("f_name"))).click().catch(function(err) {
                console.log('cell background color is not colse for that font name  is not clickable!!!')
            });
        });
        //=================

        it('when font styles switch off, color values reset to default ', async () => {
            // turn switch off
            var toogle= driver.wait(until.elementLocated(By.xpath("//*[@id='switch']/div/div/label[2]")));
             await toogle.click();
             await driver.sleep(2000);

             var def_cell_color = await driver.wait(until.elementLocated(By.css(".input_area div")));
                await def_cell_color.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(247, 247, 247, 1)');}).catch(function(err) {
                        console.log('error')
                    });


            var def_page_color  = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await def_page_color.getCssValue("background-color").then(function(value) {
                    expect(value).to.equal('rgba(255, 255, 255, 1)');}).catch(function(err) {
                        console.log('error')
                    });

            var def_font_color  = await driver.wait(until.elementLocated(By.css(".rendered_html p")));
                await def_font_color.getCssValue("color").then(function(value) {
                    expect(value).to.equal('rgba(0, 0, 0, 1)');}).catch(function(err) {
                        console.log('error')
                    });

        });
        //=================

    });
    after(async () => driver.quit());

})(driver);
