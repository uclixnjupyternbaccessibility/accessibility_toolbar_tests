const config = require('./config.json');
let webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

const Mocha = require('mocha');

const currentDate = Date.now().toString();

let asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr);
    }
};

(async () => {
    // Iterate over all browsers.
    await asyncForEach(config.browsers, async browser => {
        await asyncForEach(config.tests, async testCase => {
            // Set the global `driver` variable which will be used within tests.
            global.driver = new webdriver.Builder().forBrowser(browser.browserName)
                .usingServer('http://localhost:4444/wd/hub')
                .build();
            const mocha = new Mocha({
                timeout: testCase.timeout
            });
            return new Promise((resolve, reject) => {
                mocha.suite.on('require', function (global, file) {
                    delete require.cache[file];
                });

                console.log(`Running ${testCase.file} against ${browser.browserName} (${browser.browserVersion}))`);

                mocha.addFile(`${testCase.file}`);

                mocha.run()
                // Callback whenever a test fails.
                    .on('fail', test => reject(new Error(`Selenium test (${test.title}) failed.`)))
                    // When the test is over the Promise can be resolved.
                    .on('end', () => resolve());
            });
        });
    });
})();
