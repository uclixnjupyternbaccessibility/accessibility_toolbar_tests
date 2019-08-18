const { expect } = require('chai');
const utils = require('./utils');

let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

let driver = global.driver ? global.driver : new webdriver.Builder().forBrowser('chrome')
    .usingServer('http://localhost:4444/wd/hub')
    .build();

(async function run_tests(driver) {
        describe('PlannerTests', () => {
           it('verify planner is working', async () => {
                await utils.login_to_jupyter(By, webdriver);
                await utils.open_existing_notebook(By);
                
                const planner_button = driver.wait(until.elementLocated(By.xpath("//button[@title='Planner']")));
                await planner_button.click();
                await driver.sleep(3000);

                const getTimeStatus = driver.wait(until.elementLocated(By.xpath("//span[@class='lastsaved']")));
                await driver.sleep(3000);

                var timeBefore;
                await getTimeStatus.getText().then(function(value) {
                    var status = value.split(" ");
                    timeBefore = status[status.length-1];
                    console.log("The time before is ", timeBefore);
                }).catch(function(error){
                    console.log(error);
                });
            
                const boldButton = driver.wait(until.elementLocated(By.xpath("//button[@class='bold']")));
                boldButton.click(); 
                await driver.sleep(1000);

                const headingButton = driver.wait(until.elementLocated(By.xpath("//button[@class='heading']")));
                headingButton.click();
                await driver.sleep(1000);

                const saveButton = driver.wait(until.elementLocated(By.xpath("//button[@class='custom']")));
                saveButton.click();
                await driver.sleep(1000);

                headingButton.click();
                await driver.sleep(1000);

                await getTimeStatus.getText().then(function(value) {
                    var status = value.split(" ");
                    var timeAfter= status[status.length-1];
                    console.log("The time after is ", timeAfter);
                    expect(timeAfter).to.not.equal(timeBefore);
                }).catch(function(error){
                    console.log(error);
                });

            }); 

        });
        after(async () => driver.quit());
})(driver);
