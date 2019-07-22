// make sure your notebook is running and nbextensions are enabled

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver_fx = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

var driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

enableExtensionTest(driver_fx);
enableExtensionTest(driver_chr);

function enableExtensionTest(driver) {
    driver.get('http://localhost:8888/?token=c83ea5bbdd5fd8c1e48a65c4bfae5882188dc406ba06f7ec');

    driver.sleep(2000).then(function() {
        driver.findElement(By.linkText("Nbextensions")).click();
    }).catch(function(error) {
        console.log(error);
    });

    driver.sleep(3000).then(function() {
        driver.findElement(By.cssSelector("button.btn.btn-default.disabled")).click();
    }).catch(function(error) {
        console.log(error);
    });

    driver.sleep(5000).then(function() {
        driver.findElement(By.linkText("Files")).click();
    }).catch(function(error) {
        console.log(error);
    });

    driver.sleep(6000).then(function() {
        driver.findElement(By.linkText("Cosmos DB and its Python SDK.ipynb")).click();
    }).catch(function(error) {
        console.log(error);
    });

    driver.sleep(11000).then(function() {
      driver.getTitle().then(function(title) {
        if(title === 'Cosmos DB and its Python SDK - Jupyter Notebook') {
          console.log('Test passed');
        } else {
          console.log('Test failed');
        }
        driver.quit();
      }).catch(function(error) {
          console.log(error);
      });
    }).catch(function(error) {
        console.log(error);
    });

}
