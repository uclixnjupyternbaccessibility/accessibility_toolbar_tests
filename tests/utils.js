let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

async function switch_to_latest_tab() {
    var tab_handles = await driver.getAllWindowHandles();
    let number_of_tabs = tab_handles.length;
    let new_tab_index = number_of_tabs-1;
    await driver.switchTo().window(tab_handles[new_tab_index]);
}

async function login_to_jupyter(By, webdriver) {
    await driver.get('http://host.docker.internal:10000/');

    let psw = await driver.wait(until.elementLocated(By.name('password')));

    await psw.sendKeys('12345678');

    await psw.sendKeys(webdriver.Key.ENTER);
}

async function open_new_notebook(By, first) {
    first ? await driver.wait(until.elementLocated(By.linkText("work"))).click() : '';
    await driver.wait(until.elementLocated(By.id("new-dropdown-button"))).click();
    await driver.wait(until.elementLocated(By.linkText("Python 3"))).click();

    await switch_to_latest_tab();
}

async function open_existing_notebook(By){
    await driver.wait(until.elementLocated(By.linkText("work"))).click();
    await driver.wait(until.elementLocated(By.linkText("PartIA-Computing-Michaelmas-master"))).click();
    await driver.wait(until.elementLocated(By.linkText("00 Part IA Michaelmas Term computing.ipynb"))).click();
    await driver.sleep(1000);
    await switch_to_latest_tab();
}

function dumpCSSText(element){
    var s = {};
    var o = getComputedStyle(element);
    for(var i = 0; i < o.length; i++){
        s[o[i]+""] = o.getPropertyValue(o[i])
    }
    return s;
}

module.exports = {switch_to_latest_tab ,login_to_jupyter, open_new_notebook, open_existing_notebook, dumpCSSText};
