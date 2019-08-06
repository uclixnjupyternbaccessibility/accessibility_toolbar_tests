const { expect } = require('chai');
const utils = require('./utils');
let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

function dumpCSSText(element){
    var s = {};
    var o = getComputedStyle(element);
    for(var i = 0; i < o.length; i++){
        s[o[i]+""] = o.getPropertyValue(o[i])
    }
    return s;
}
(async function run_tests(driver) {
    describe('Font Spacing tests', () => {

        it('check you can increase line height', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await utils.open_existing_notebook(By);
            var font_style = driver.wait(until.elementLocated(By.id("fs")))
            await font_style.click();
            var fs_switch = driver.wait(until.elementLocated(By.id('switch')))
            await fs_switch.click();

            var cells = await driver.findElements(By.className('cell'));
            var val = 0;
            await driver.executeScript(dumpCSSText,cells[0]).then(function(res){
                val = parseInt(res["line-height"].replace(/[^\d.-]/g, ""));
            }).catch(function(err){
                console.log(err);
            });
            var increase_lh = driver.wait(until.elementLocated(By.id('increase_line_height')));
            await increase_lh.click();
            var update_cells = await driver.findElements(By.className('cell'));
            await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                expect(new_res["line-height"]).to.equal(val + 2 +'px');
            }).catch(function(err){
                console.log(err);
            });
        })

        it('check you can reduce line height', async () => {
            var cells = await driver.findElements(By.className('cell'));
            var val = 0;
            await driver.executeScript(dumpCSSText,cells[0]).then(function(res){
                val = parseInt(res["line-height"].replace(/[^\d.-]/g, ""));
            }).catch(function(err){
                console.log(err);
            });
            var reduce_lh = driver.wait(until.elementLocated(By.id('reduce_line_height')));
            await reduce_lh.click();
            var update_cells = await driver.findElements(By.className('cell'));
            await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                expect(new_res["line-height"]).to.equal(val - 2 +'px');
            }).catch(function(err){
                console.log(err);
            });
        })

        it('verify reduce letter spacing button is disabled at start', async () => {
            // var reduce_ls = driver.wait(until.elementLocated(By.id('reduce_letter_space')));
            expect(await driver.wait(until.elementLocated(By.id('reduce_letter_space'))).isEnabled()).to.equal(false);
        })

        it('check you can increase letter spacing', async () => {
            var cells = await driver.findElements(By.className('cell'));
            var val = 0;
            await driver.executeScript(dumpCSSText,cells[0]).then(function(res){
                val = res["letter-spacing"] === "normal" ? 0 : parseInt(res["letter-spacing"].replace(/[^\d.-]/g, ""));
            }).catch(function(err){
                console.log(err);
            });
            var increase_ls = driver.wait(until.elementLocated(By.id('increase_letter_space')));
            await increase_ls.click();
            var update_cells = await driver.findElements(By.className('cell'));
            await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                expect(new_res["letter-spacing"]).to.equal(val + 2 +'px');
            }).catch(function(err){
                console.log(err);
            });
        })

        it('check you can reduce letter spacing', async () => {
            var cells = await driver.findElements(By.className('cell'));
            var val = 0;
            await driver.executeScript(dumpCSSText,cells[0]).then(function(res){
                val = res["letter-spacing"] === "normal" ? 0 : parseInt(res["letter-spacing"].replace(/[^\d.-]/g, ""));
            }).catch(function(err){
                console.log(err);
            });
            var reduce_ls = driver.wait(until.elementLocated(By.id('reduce_letter_space')));
            await reduce_ls.click();
            var update_cells = await driver.findElements(By.className('cell'));
            await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                curr_val = new_res["letter-spacing"] === "normal" ? "0px" : new_res["letter-spacing"];
                expect(curr_val).to.equal(val - 2 +'px');
            }).catch(function(err){
                console.log(err);
            });
        });

        it('verify maximum line height', async () => {
            var increase_lh = driver.wait(until.elementLocated(By.id('increase_line_height')));
            curr_val = 0;
            while(curr_val < 30) {
                await increase_lh.click();
                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                    curr_val = parseInt(new_res["line-height"].replace(/[^\d.-]/g, ""));
                }).catch(function(err){
                    console.log(err);
                });
            }
            expect(await driver.wait(until.elementLocated(By.id('increase_line_height'))).isEnabled()).to.equal(false);
        })

        it('verify minumim line height', async () => {
            var reduce_lh = driver.wait(until.elementLocated(By.id('reduce_line_height')));
            curr_val = 0;
            while(curr_val > 10) {
                await reduce_lh.click();
                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                    curr_val = parseInt(new_res["line-height"].replace(/[^\d.-]/g, ""));
                }).catch(function(err){
                    console.log(err);
                });
            }
            expect(await driver.wait(until.elementLocated(By.id('increase_line_height'))).isEnabled()).to.equal(false);
        })
        it('verify maximum Letter Spacing', async () => {
            var increase_ls = driver.wait(until.elementLocated(By.id('increase_letter_space')));
            curr_val = 0;
            while(curr_val < 10) {
                await increase_ls.click();
                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                    curr_val = parseInt(new_res["letter-spacing"].replace(/[^\d.-]/g, ""));
                }).catch(function(err){
                    console.log(err);
                });
            }
            expect(await driver.wait(until.elementLocated(By.id('increase_letter_space'))).isEnabled()).to.equal(false);
        })

        it('verify minimum letter spacing', async () => {
            var reduce_ls = driver.wait(until.elementLocated(By.id('reduce_letter_space')));
            curr_val = 10;
            while(curr_val > 0) {
                await reduce_ls.click();
                var update_cells = await driver.findElements(By.className('cell'));
                await driver.executeScript(dumpCSSText, update_cells[0]).then(function(new_res){
                    curr_val = parseInt(new_res["letter-spacing"].replace(/[^\d.-]/g, ""));
                }).catch(function(err){
                    console.log(err);
                });
            }
            expect(await driver.wait(until.elementLocated(By.id('reduce_letter_space'))).isEnabled()).to.equal(false);
        })
    });
    after(async () => driver.quit());

})(driver);
