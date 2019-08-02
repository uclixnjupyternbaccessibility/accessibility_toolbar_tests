let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function switch_to_latest_tab() {
    var tab_handles = await driver.getAllWindowHandles();
    let number_of_tabs = tab_handles.length;
    let new_tab_index = number_of_tabs-1;
    await driver.switchTo().window(tab_handles[new_tab_index]);
    // await driver.switchTo().defaultContent();
}

async function login_to_jupyter(By, webdriver) {
    await driver.get('http://host.docker.internal:10000/');

    let psw = await driver.wait(until.elementLocated(By.name('password')));

    await psw.sendKeys('12345678');

    await psw.sendKeys(webdriver.Key.ENTER);
}

async function open_new_notebook(By, first) {
    first ? await driver.findElement(By.linkText("work")).click() : '';
    await driver.findElement(By.id("new-dropdown-button")).click();
    await driver.findElement(By.linkText("Python 3")).click();

    await switch_to_latest_tab();
}

async function open_notebook(By, until, first, name) {
    if (first) {
        driver.wait(until.elementLocated(By.linkText("work"))).click();
        driver.wait(until.elementLocated(By.linkText("PartIA-Computing-Michaelmas-master"))).click();
    }
    await driver.wait(until.elementLocated(By.linkText(name))).click();
    await driver.sleep(2000);
    await switch_to_latest_tab();
}

module.exports = {switch_to_latest_tab ,login_to_jupyter, open_new_notebook, open_notebook};