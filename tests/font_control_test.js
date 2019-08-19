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
            await driver.sleep(1000);
        });

        it('Open notebook', async () => {
            await driver.get('http://host.docker.internal:10000/');
            await utils.open_existing_notebook(By);
        });

        it('Open font style dropdown', async () => {
            var fs = driver.wait(until.elementLocated(By.id("fs")));
            await fs.click();
            await driver.wait(until.elementLocated(By.id("switch"))).click();
            await driver.sleep(3000);
        })

        it('Verify font name changing', async () => {
            var font_name = driver.wait(until.elementLocated(By.id("font_name")));
            var font_name_value_list = [
                "monospace",
                "Arial, Helvetica, sans-serif",
                '"Arial Black", Gadget, sans-serif',
                '"Comic Sans MS", cursive, sans-serif',
                "Georgia, serif",
                "Impact, Charcoal, sans-serif, cursive, sans-serif",
                '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
                '"Palatino Linotype", "Book Antiqua", Palatino, serif',
                "Tahoma, Geneva, sans-serif",
                '"Times New Roman", Times, serif',
                "Verdana, Geneva, sans-serif"
            ];
            await driver.sleep(1000);
            var background = driver.wait(until.elementLocated(By.css(".input_area")));
            for (var i = 1; i < font_name_value_list.length; i++) {
                await font_name.click();
                var temp = i + 1;
                var path = "//*[@id='font_name']/option[" + temp + "]";
                await driver.wait(until.elementLocated(By.xpath(path))).click();
                await driver.sleep(1000);
                await background.getCssValue("font-family").then(function (value) {
                    expect(value).to.equal(font_name_value_list[i - 1])
                }).catch(function (err) {
                    console.log(err);
                })
            }
            await font_name.sendKeys(webdriver.Key.ESCAPE);
        });

        it('Verify font size changing', async () => {
            var font_size = driver.wait(until.elementLocated(By.id("font_size")));
            var font_size_list = [
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
            var background = driver.wait(until.elementLocated(By.css(".CodeMirror pre")));
            for (var i = 0; i < font_size_list.length; i++) {
                await font_size.click();
                var temp = i + 1;
                var path = "//*[@id='font_size']/option[" + temp + "]";
                await driver.wait(until.elementLocated(By.xpath(path))).click();
                await driver.sleep(1000)
                await background.getCssValue("font-size").then(function (value) {
                    expect(value).to.equal(font_size_list[i] + "px")
                }).catch(function (err) {
                    console.log(err);
                })
            }
            await driver.sleep(3000);
        });

        it('when font styles switch off, reset to default ', async () => {
            await driver.wait(until.elementLocated(By.id("switch"))).click();
            await driver.sleep(2000);

            var background = driver.wait(until.elementLocated(By.css(".input_area")));
            await background.getCssValue("font-size").then(function (value) {
                expect(value).to.equal('14px');
            }).catch(function (err) {
                console.log(err)
            });
            await background.getCssValue("font-family").then(function (value) {
                expect(value).to.equal('"Helvetica Neue", Helvetica, Arial, sans-serif')
            }).catch(function (err) {
                console.log(err);
            })
        });
    });
    after(async () => driver.quit());
})(driver);

