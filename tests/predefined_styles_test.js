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

        let browser = "";
        driver.getCapabilities().then(function (caps) {
            browser = caps.get("browserName");
        }).catch(function(err){
            console.log(err)
        });

        it('when font styles changed predefined styles changes', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await utils.open_existing_notebook(By);
            await driver.sleep(1000);
            var font_style = driver.wait(until.elementLocated(By.id("fs")));
            await font_style.click();
            var predefined = await driver.wait(until.elementLocated(By.id("predefined_styles")));
            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.include('disabled');
            });
            await driver.wait(until.elementLocated(By.id("switch"))).click();

            var predefined = driver.findElement(By.id("predefined_styles"));

            await predefined.getAttribute('class').then(function(classes) {
                expect(classes).to.not.include('disabled');
            });
        });

        it('create new predefined style test', async () => {
            if (browser === "chrome") {
                // change font size
                var font_size = driver.wait(until.elementLocated(By.id("font_size")));
                await font_size.click();
                await font_size.sendKeys('32');

                // change font name
                var font_name = driver.wait(until.elementLocated(By.id("font_name")));
                await font_name.click();
                await font_name.sendKeys('Times New Roman');

                // increase line height
                var increase_lh = driver.wait(until.elementLocated(By.id('increase_line_height')));
                await increase_lh.click();
                await increase_lh.click();
                await increase_lh.click();

                // increase letter spacing
                var increase_ls = driver.wait(until.elementLocated(By.id('increase_letter_space')));
                await increase_ls.click();
                await increase_ls.click();
                await increase_ls.click();

                // change background colour
                await driver.wait(until.elementLocated(By.id("color-picker-background"))).click();
                await driver.wait(until.elementLocated(By.xpath("/html/body/div[8]/div[1]/div[1]/div[2]/span[3]/span"))).click();
                await driver.wait(until.elementLocated(By.id("color-picker-background"))).click();

                // change page colour
                await driver.wait(until.elementLocated(By.id("color-picker-page-background"))).click();
                await driver.wait(until.elementLocated(By.xpath("/html/body/div[9]/div[1]/div[1]/div[3]/span[6]/span"))).click();
                await driver.wait(until.elementLocated(By.id("color-picker-page-background"))).click();

                // change font color
                await driver.wait(until.elementLocated(By.id("color-picker"))).click();
                await driver.wait(until.elementLocated(By.xpath("/html/body/div[7]/div[1]/div[1]/div[2]/span[1]/span"))).click();
                await driver.wait(until.elementLocated(By.id("color-picker"))).click();

                driver.executeScript("$('#predefined_styles').attr('aria-expanded', 'true')");
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
                    async function (alert) {
                        await alert.accept()
                    })
                    .catch(function (error) {
                    });

                await driver.wait(until.elementLocated(By.id("fs"))).click();
                await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
                let styles = driver.wait(until.elementLocated(By.linkText('predefined_style_1')));
                await styles.click();
                await styles.getAttribute('class').then(function (classes) {
                    expect(classes).to.include('dropdown-item-checked');
                });

                // Verify correct changes have been made
                var background = driver.wait(until.elementLocated(By.css(".input_area")));
                await background.getCssValue("font-family").then(function (value) {
                    expect(value).to.equal('"Times New Roman", Times, serif')
                });
                background = driver.wait(until.elementLocated(By.css(".CodeMirror pre")));
                await background.getCssValue("font-size").then(function (value) {
                    expect(value).to.equal('32px');
                });

                var new_cell_color = await driver.wait(until.elementLocated(By.css(".input_area div")));
                await new_cell_color.getCssValue("background-color").then(function (value) {
                    var colorValue = ['rgb(255, 255, 0)', 'rgba(255, 255, 0, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log('error')
                });

                var new_page_color = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await new_page_color.getCssValue("background-color").then(function (value) {
                    var colorValue = ['rgb(207, 226, 243)', 'rgba(207, 226, 243, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log('error')
                });

                var new_font_color = await driver.wait(until.elementLocated(By.css(".rendered_html p")));
                await new_font_color.getCssValue("color").then(function (value) {
                    var colorValue = ['rgb(255, 0, 0)', 'rgba(255, 0, 0, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log('error')
                });

                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(utils.dumpCSSText, update_cells[0]).then(function (new_res) {
                    expect(new_res["letter-spacing"]).to.equal(6 + 'px');
                }).catch(function (err) {
                    console.log(err);
                });

                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(utils.dumpCSSText, update_cells[0]).then(function (new_res) {
                    expect(new_res["line-height"]).to.equal(26 + 'px');
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });

        it('reset to default styles', async () => {
            if (browser === "chrome") {
                await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
                await driver.wait(until.elementLocated(By.id("default_style"))).click();
                await driver.wait(until.elementLocated(By.id("reset_style_button"))).click();
                await driver.switchTo().alert().then(
                    async function (alert) {
                        await alert.accept()
                    })
                    .catch(function (error) {
                    });

                var background = driver.wait(until.elementLocated(By.css(".input_area")));
                await background.getCssValue("font-family").then(function (value) {
                    expect(value).to.equal('"Helvetica Neue", Helvetica, Arial, sans-serif')
                });
                background = driver.wait(until.elementLocated(By.css(".CodeMirror pre")));
                await background.getCssValue("font-size").then(function (value) {
                    expect(value).to.equal('14px');
                });

                var new_cell_color = await driver.wait(until.elementLocated(By.css(".input_area div")));
                await new_cell_color.getCssValue("background-color").then(function (value) {
                    var colorValue = ['rgb(247, 247, 247)', 'rgba(247, 247, 247, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log(err)
                });

                var new_page_color = await driver.wait(until.elementLocated(By.css("#notebook-container")));
                await new_page_color.getCssValue("background-color").then(function (value) {
                    var colorValue = ['rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log(err)
                });

                var new_font_color = await driver.wait(until.elementLocated(By.css(".rendered_html p")));
                await new_font_color.getCssValue("color").then(function (value) {
                    var colorValue = ['rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)'];
                    expect(colorValue).to.be.an('array').that.includes(value);
                }).catch(function (err) {
                    console.log(err)
                });

                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(utils.dumpCSSText, update_cells[0]).then(function (new_res) {
                    expect(new_res["letter-spacing"]).to.equal('normal');
                }).catch(function (err) {
                    console.log(err);
                });

                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(utils.dumpCSSText, update_cells[0]).then(function (new_res) {
                    expect(new_res["line-height"]).to.equal(20 + 'px');
                }).catch(function (err) {
                    console.log(err);
                });
            }
        });

        it('delete an existing predefined style test', async () => {
            if (browser === "chrome") {
                var font_style = driver.wait(until.elementLocated(By.id("fs")));
                await font_style.click();
                await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
                var delete_style_button = await driver.wait(until.elementLocated(By.id("delete_style_button")));
                await driver.sleep(1000);
                await delete_style_button.findElement(By.xpath("./..")).click();
                await driver.sleep(1000);

                driver.wait(until.elementLocated(By.css('#style-list > option[value="' + 'predefined_style_1'))).click();
                await driver.sleep(1000);
                await driver.wait(until.elementLocated(By.id("delete-button"))).click();
                await driver.switchTo().alert().then(
                    async function (alert) {
                        await alert.accept()
                    })
                    .catch(function (error) {
                    });

                await driver.wait(until.elementLocated(By.id("fs"))).click();
                await driver.sleep(1000);
                await driver.wait(until.elementLocated(By.id("predefined_styles"))).click();
                var deleted = await driver.findElement(By.linkText('predefined_style_1')).catch(function (error) {
                });
                expect(deleted).to.equal(undefined);
            }
        });

    });
    after(async () => driver.quit());

})(driver);