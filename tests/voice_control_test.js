const { expect } = require('chai');
const utils = require('./utils');
let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();


(async function run_tests(driver,browsers) {
    describe('Voice Control tests', () => {
        let browser = "";
        driver.getCapabilities().then(function (caps) {
            browser = caps.get("browserName");
        }).catch(function(err){
            console.log(err)
        });
        it('verify voice control button is disabled', async () => {
            await utils.login_to_jupyter(By, webdriver);
            await utils.open_existing_notebook(By);
            console.log(browser);
            if(browser === "chrome"){
                expect(await driver.wait(until.elementLocated(By.id('vc_menu'))).isEnabled()).to.equal(true);
            } else {
                expect(await driver.wait(until.elementLocated(By.id('vc_menu'))).isEnabled()).to.equal(false);
            }

        });

        it('verify voice control title information', async () => {
            if(browser === "chrome"){
                expect(await driver.wait(until.elementLocated(By.id('vc_menu'))).getAttribute("title")).to.equal("Voice Control");
            } else {
                expect(await driver.wait(until.elementLocated(By.id('vc_menu'))).getAttribute("title")).to.equal("Voice Control Disabled - This feature is only available in Google Chrome");
            }
        });

        it('verify can view commands', async () => {
            if(browser === "chrome"){
                var voice_control = driver.wait(until.elementLocated(By.id("vc_menu")));
                await voice_control.click();
                var view_commands = driver.wait(until.elementLocated(By.id("view_commands")));
                await view_commands.click();
                expect(await driver.wait(until.elementLocated(By.xpath('//*[@id="view_commands_modal"]/div/div[1]/h4'))).getText()).to.equal("View all voice control commands");
                await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view_commands_modal\"]/div/div[1]/button"))).click();
            }
        });

        it('verify can turn on voice control', async () => {
            if(browser === "chrome"){
                await driver.sleep(1000);
                var voice_control = driver.wait(until.elementLocated(By.id("vc_menu")));
                await voice_control.click();
                var voice_control_switch = driver.wait(until.elementLocated(By.id("voice_toggle_switch")));
                await voice_control.getAttribute('class').then(function (classes) {
                    expect(classes.includes("voice-control-on")).to.equal(false);
                })
                await voice_control_switch.click();
                await voice_control.click();
                await voice_control.getAttribute('class').then(function (classes) {
                    expect(classes.includes("voice-control-on")).to.equal(true);
                });
            }
        });

    });
    after(async () => driver.quit());

})(driver);
