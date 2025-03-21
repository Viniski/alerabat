import puppeteer from "puppeteer";
import fs from "fs";

const discountCodes = [
  "RABAT10",
  "RABAT20",
  "DISCOUNT50",
  "PROMO25",
  "SALE30",
  "BONUS15",
  "SHOP5",
  "EXTRA40",
  "WELCOME2024",
  "VIPDEAL",
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://dev-shop-integration.alerabat.com/");

  const validCodes = [];

  const testDiscountCode = async (code) => {
    const input = page.locator('input[placeholder="Wpisz kod rabatowy"]');

    await input.fill(code);
    await page.locator("button.bg-blue-500").click();

    try {
      await page.waitForSelector("p.mt-2", { visible: true, timeout: 5000 });
      const message = await page.$eval("p.mt-2", (el) => el.textContent);
      if (message === "Zastosowano kod rabatowy") {
        validCodes.push(code);
      }
    } catch (error) {
      console.log(`Błąd przy kodzie ${code}: ${error?.message}`);
    }

    await input.fill("");
  };

  for (let code of discountCodes) {
    await testDiscountCode(code);
  }

  fs.writeFileSync("valid_codes.txt", validCodes.join("\n"), "utf8");

  console.log(
    "Test zakończony. Poprawne kody zapisane w pliku valid_codes.txt"
  );

  await browser.close();
})();
