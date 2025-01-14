require('dotenv').config();
const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const ProxyAgent = require('proxy-agent');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// MongoDB Schema
const TrendSchema = new mongoose.Schema({
  _id: String,
  nameoftrend1: String,
  nameoftrend2: String,
  nameoftrend3: String,
  nameoftrend4: String,
  nameoftrend5: String,
  timestamp: Date,
  ipAddress: String
});

const Trend = mongoose.model('Trend', TrendSchema);

// Selenium scraping function
// async function scrapeTrends(proxy) {
//   let driver;
//   try {
//     const options = new chrome.Options();

//     // Add these additional Chrome arguments
//     options.addArguments('--no-sandbox');
//     options.addArguments('--disable-dev-shm-usage');
//     options.addArguments('--disable-gpu');
//     options.addArguments('--ignore-certificate-errors');
//     options.addArguments('--ignore-ssl-errors');

//     // Set proxy with credentials
//     const proxyUrl = new URL(proxy);
//     options.addArguments(`--proxy-server=${proxyUrl.protocol}//${proxyUrl.host}`);

//     // Set proxy credentials
//     const capabilities = {
//       'browserName': 'chrome',
//       'proxy': {
//         'httpProxy': proxy,
//         'sslProxy': proxy,
//         'proxyType': 'manual'
//       }
//     };

//     driver = await new Builder()
//       .forBrowser('chrome')
//       .setChromeOptions(options)
//       .withCapabilities(capabilities)
//       .build();

//     // Set page load timeout
//     await driver.manage().setTimeouts({ pageLoad: 30000 });

//     // Navigate to Twitter login
//     console.log("Navigating to login page...");
//     await driver.get('https://x.com/login');

//     // Step 1: Handle username/email input
//     console.log("Entering username...");
//     const usernameField = await driver.wait(
//       until.elementLocated(By.css('input[autocomplete="username"]')),
//       20000
//     );
//     await usernameField.sendKeys(process.env.TWITTER_USERNAME);

//     // Click the Next button using XPath
//     console.log("Clicking Next button...");
//     const nextButton = await driver.wait(
//       until.elementLocated(By.xpath('//span[text()="Next"]/ancestor::button')),
//       20000
//     );
//     await driver.executeScript("arguments[0].click();", nextButton);

//     // Wait for password field to be visible
//     console.log("Waiting for password field...");
//     const passwordField = await driver.wait(
//       until.elementLocated(By.css('input[name="password"]')),
//       20000
//     );
//     await passwordField.sendKeys(process.env.TWITTER_PASSWORD);

//     // Wait for and click the login button
//     console.log("Waiting for login button...");
//     const loginButton = await driver.wait(
//       until.elementLocated(By.xpath('//span[text()="Log in"]/ancestor::button[@data-testid="LoginForm_Login_Button"]')),
//       20000
//     );

//     // Wait for button to become enabled
//     await driver.wait(
//       until.elementIsEnabled(loginButton),
//       20000
//     );

//     console.log("Clicking login button...");
//     await driver.executeScript("arguments[0].click();", loginButton);

//     console.log("Login successful!");

//     // Navigate directly to the trending page
//     console.log("Navigating to trending page...");
//     await driver.get('https://x.com/explore/tabs/trending');

//     // Wait for trends to load with a longer timeout
//     console.log("Waiting for trends to load...");
//     await driver.wait(
//       until.elementsLocated(By.css('[data-testid="trend"]')),
//       30000
//     );

//     // Get all trend elements
//     const trendElements = await driver.findElements(By.css('[data-testid="trend"]'));

//     // Extract text from the first 5 trends
//     const trendTexts = [];
//     for (let i = 0; i < 5 && i < trendElements.length; i++) {
//       try {
//         const text = await trendElements[i].getText();
//         trendTexts.push(text);
//       } catch (err) {
//         console.error(`Failed to get text for trend ${i + 1}:`, err);
//       }
//     }

//     console.log("Successfully scraped trends:", trendTexts);

//     return trendTexts;

//   } catch (error) {
//     console.error('Failed to scrape trends:', error);
//     throw error;
//   } finally {
//     if (driver) {
//       await driver.quit();
//     }
//   }
// }

async function scrapeTrends(proxy) {
  let driver;
  try {
    const options = new chrome.Options();

    // Add these additional Chrome arguments
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--ignore-ssl-errors');

    // Set proxy with credentials
    const proxyUrl = new URL(proxy);
    options.addArguments(`--proxy-server=${proxyUrl.protocol}//${proxyUrl.host}`);

    // Set proxy credentials
    const capabilities = {
      'browserName': 'chrome',
      'proxy': {
        'httpProxy': proxy,
        'sslProxy': proxy,
        'proxyType': 'manual'
      }
    };

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .withCapabilities(capabilities)
      .build();

    // Set page load timeout
    await driver.manage().setTimeouts({ pageLoad: 30000 });

    // Navigate to Twitter login
    console.log("Navigating to login page...");
    await driver.get('https://x.com/login');

    // Step 1: Handle username/email input
    console.log("Entering username...");
    const usernameField = await driver.wait(
      until.elementLocated(By.css('input[autocomplete="username"]')),
      20000
    );
    await usernameField.sendKeys(process.env.TWITTER_USERNAME);

    // Click the Next button using XPath
    console.log("Clicking Next button...");
    const nextButton = await driver.wait(
      until.elementLocated(By.xpath('//span[text()="Next"]/ancestor::button')),
      20000
    );
    await driver.executeScript("arguments[0].click();", nextButton);

    // Wait for a moment after clicking next
    await driver.sleep(2000);

    // Handle username verification step
    console.log("Handling username verification...");
    const verificationField = await driver.wait(
      until.elementLocated(By.css('input[data-testid="ocfEnterTextTextInput"]')),
      20000
    );
    await verificationField.sendKeys(process.env.TWITTER_VERIFICATION_USERNAME);

    // Click the verification Next button
    console.log("Clicking verification Next button...");
    const verificationNextButton = await driver.wait(
      until.elementLocated(By.css('[data-testid="ocfEnterTextNextButton"]')),
      20000
    );
    await driver.executeScript("arguments[0].click();", verificationNextButton);

    // Wait after verification before proceeding to password
    await driver.sleep(2000);

    // Wait for password field to be visible
    console.log("Waiting for password field...");
    const passwordField = await driver.wait(
      until.elementLocated(By.css('input[name="password"]')),
      20000
    );
    await passwordField.sendKeys(process.env.TWITTER_PASSWORD);

    // Wait for and click the login button
    console.log("Waiting for login button...");
    const loginButton = await driver.wait(
      until.elementLocated(By.xpath('//span[text()="Log in"]/ancestor::button[@data-testid="LoginForm_Login_Button"]')),
      20000
    );

    // Wait for button to become enabled
    await driver.wait(
      until.elementIsEnabled(loginButton),
      20000
    );

    console.log("Clicking login button...");
    await driver.executeScript("arguments[0].click();", loginButton);

    console.log("Login successful! Waiting for session to establish...");
    // Add a longer wait after successful login
    await driver.sleep(6000);

    // Navigate directly to the trending page
    console.log("Navigating to trending page...");
    await driver.get('https://x.com/explore/tabs/trending');

    // Add another wait after navigation to ensure page loads
    await driver.sleep(3000);

    // Wait for trends to load with a longer timeout
    console.log("Waiting for trends to load...");
    await driver.wait(
      until.elementsLocated(By.css('[data-testid="trend"]')),
      30000
    );

    // Get all trend elements
    const trendElements = await driver.findElements(By.css('[data-testid="trend"]'));

    // Extract text from the first 5 trends
    const trendTexts = [];
    for (let i = 0; i < 5 && i < trendElements.length; i++) {
      try {
        const text = await trendElements[i].getText();
        trendTexts.push(text);
      } catch (err) {
        console.error(`Failed to get text for trend ${i + 1}:`, err);
      }
    }

    console.log("Successfully scraped trends:", trendTexts);

    return trendTexts;

  } catch (error) {
    console.error('Failed to scrape trends:', error);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

// Add this array at the top of server.js
const PROXYMESH_ENDPOINTS = [
  'us-wa.proxymesh.com:31280',
  'us-ny.proxymesh.com:31280',
  'us-fl.proxymesh.com:31280',
  'us-ca.proxymesh.com:31280',
  'us-il.proxymesh.com:31280',
  'open.proxymesh.com:31280'
];

// Modify the /api/scrape endpoint
app.post('/api/scrape', async (req, res) => {
  try {
    // Randomly select a proxy endpoint
    const randomEndpoint = PROXYMESH_ENDPOINTS[Math.floor(Math.random() * PROXYMESH_ENDPOINTS.length)];
    const proxy = `http://${process.env.PROXYMESH_USERNAME}:${process.env.PROXYMESH_PASSWORD}@${randomEndpoint}`;
    
    const trends = await scrapeTrends(proxy);

    // Store the actual proxy endpoint instead of the full URL
    const trendRecord = new Trend({
      _id: uuidv4(),
      nameoftrend1: trends[0],
      nameoftrend2: trends[1],
      nameoftrend3: trends[2],
      nameoftrend4: trends[3],
      nameoftrend5: trends[4],
      timestamp: new Date(),
      ipAddress: randomEndpoint // Store the endpoint address
    });

    await trendRecord.save();

    res.json(trendRecord);
  } catch (error) {
    console.error('Error in /api/scrape:', error);
    res.status(500).json({ error: 'Failed to scrape trends' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});