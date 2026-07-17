document.getElementById('start-btn').addEventListener('click', async () => {
  const selectorsInput = document.getElementById('selectors').value;
  const customScriptInput = document.getElementById('customScript').value;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) return alert("Tab aktif tidak ditemukan.");

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: 'MAIN',
    func: coreScraperEngine,
    args: [selectorsInput, customScriptInput]
  });
});

// Mesin utama yang dieksekusi langsung di DOM halaman web target
async function coreScraperEngine(selectorsStr, customScriptStr) {
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  let finalResult = [];

  // 1. Eksekusi Logika Otomatisasi Kustom (Untuk Web Dinamis / Form Bertingkat)
  if (customScriptStr.trim() !== "") {
    try {
      // Mengubah string teks menjadi fungsi yang dapat dieksekusi
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const userLogic = new AsyncFunction('delay', customScriptStr);
      
      console.log("Menjalankan skrip otomatisasi kustom...");
      const customData = await userLogic(delay);
      if (customData) {
        finalResult = customData;
      }
    } catch (err) {
      alert("Terjadi error pada skrip kustom Anda: " + err.message);
      return;
    }
  } 
  
  // 2. Eksekusi Pencarian Elemen Standar (Untuk Web Statis / Elemen Instan)
  if (selectorsStr.trim() !== "" && finalResult.length === 0) {
    const listSelectors = selectorsStr.split(',').map(s => s.trim());
    let scrapedRow = {};

    listSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        // Jika elemen berupa dropdown/select, ambil opsi yang terpilih atau semua opsi
        if (elements[0].tagName === 'SELECT') {
          scrapedRow[selector] = Array.from(elements[0].options).map(o => o.text);
        } else {
          // Ambil teks data dari element biasa
          scrapedRow[selector] = elements.length === 1 ? elements[0].innerText.trim() : Array.from(elements).map(e => e.innerText.trim());
        }
      }
    });
    finalResult.push(scrapedRow);
  }

  // 3. Output Penanganan Unduhan (JSON & TXT)
  if (finalResult.length > 0) {
    console.log("Scraping Selesai!", finalResult);
    
    // Download format JSON
    const dataStrJson = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalResult, null, 2));
    const dlAnchorJson = document.createElement('a');
    dlAnchorJson.setAttribute("href", dataStrJson);
    dlAnchorJson.setAttribute("download", "scraped_data.json");
    dlAnchorJson.click();

    // Download format TXT
    const dataStrTxt = "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(finalResult, null, 2));
    const dlAnchorTxt = document.createElement('a');
    dlAnchorTxt.setAttribute("href", dataStrTxt);
    dlAnchorTxt.setAttribute("download", "scraped_data.txt");
    dlAnchorTxt.click();
  } else {
    alert("Proses selesai. Tidak ada data yang berhasil diambil. Periksa kembali Selector atau Skrip Kustom Anda.");
  }
}
