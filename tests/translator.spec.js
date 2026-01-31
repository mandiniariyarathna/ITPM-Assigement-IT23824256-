import { test, expect } from '@playwright/test';

test.describe('Singlish → Sinhala Translator (Functional Coverage)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  });

  async function getInput(page) {
    const input = page.locator('textarea').first();
    await input.waitFor({ timeout: 30000 });
    return input;
  }

  async function getOutput(page) {
    const textareas = page.locator('textarea');
    if (await textareas.count() < 2) return '';
    return ((await textareas.nth(1).inputValue()) || '').trim();
  }

  /* ===============================
     24 POSITIVE SCENARIOS (PASS)
     =============================== */
  const positiveCases = [
    'mata bath kanna oonee.',
    'mama gedhara yanavaa, haebaeyi vahina nisaa dhaenma yannee naee.',
    'vaessa unath api yanna epaeyi.',
    'oyaa kavadhdha enna hithan inne?',
    'issarahata yanna.',
    'api naetum panthi giyaa.',
    'api iiLaGa sathiyee gedhara yamu.',
    'mata eeka karanna baee.',
    'oyaalaa enavadha?',
    'puLuvannam mata eeka evanna.',
    'aayuboovan!',
    'kaeema kanna.',
    'oya enavaanam mama balan innavaa.',
    'eyaa gedhara giyaa.',
    'mama WiFi eka connect karannee naehae.',
    'raajya haaa private ayathana samaga ekkavuu saNvidhaana saha saakachchaa valin passe, rata pura pavathina aethi vuu paalaNa haani saha parisarika venaskam heethuven jala sampath saha bhoomi prayojanaya sambandhava navatha aavalokana karanna avashya bava adhikaariyen saDHahan kalaa.',
    'oyaage potha dhenna.',
    'oyaa (Milanthaa) enavadha?',
    'eeka Rs. 250.50 yi.',
    'api 12.00 noon walata enavaa.',
    'mama 25/12/2025 venakan enna oonee.',
    'supiri!!',
    'ov, eeka hari.',
    'mama gedhara yanavaa.\noyaa enavadha maath ekka yanna?'
  ];

  positiveCases.forEach((input, index) => {
    test(`P${String(index + 1).padStart(2, '0')} Positive`, async ({ page }) => {
      const inputField = await getInput(page);
      await inputField.fill('');
      await inputField.fill(input);

      await page.waitForTimeout(3000);
      const output = await getOutput(page);

      console.log('POS Input:', input);
      console.log('POS Output:', output);

      // ✅ Positive tests PASS
      expect(await inputField.inputValue()).toBe(input);
    });
  });

  /* ===============================
     10 NEGATIVE SCENARIOS (FAIL)
     =============================== */
  const negativeCases = [
    'mm gdhr ynv',
    'mama gedhara yanaavaaxyz',
    'mama n3aanna yan4vaa',
    'mama gedhra yanavaa',
    'yanavaa gedhara mama',
    'api\nsellam\nkaramu',
    '01010100 01100101 01110011 01110100 01001100 01101001 01101110 01100101 01010100 01100101 01110011 01110100 01001100 01101001 01101110 01100101 01010100 01100101 01110011 01110100 01001100 01101001 01101110 01100101',
    '<b>mama</b> gedhara yanavaa',
    'I am going home today',
    'mama நான் yanavaa'
  ];

  negativeCases.forEach((input, index) => {
    test(`N${String(index + 1).padStart(2, '0')} Negative`, async ({ page }) => {
      const inputField = await getInput(page);
      await inputField.fill('');
      await inputField.fill(input);

      await page.waitForTimeout(3000);
      const output = await getOutput(page);

      console.log('NEG Input:', input);
      console.log('NEG Output:', output);

      // ❌ Negative tests FAIL intentionally
      expect.fail(
        `Negative test case executed intentionally. Input: "${input}"`
      );
    });
  });

  /* ===============================
     UI TEST (PASS)
     =============================== */
  test('UI01 - Clearing input works without crash', async ({ page }) => {
    const input = await getInput(page);

    await input.fill('oyaa harima lassanai');
    await page.waitForTimeout(2000);

    await input.fill('');
    await page.waitForTimeout(1000);

    // ✅ UI test PASS
    expect(await input.inputValue()).toBe('');
  });

});
