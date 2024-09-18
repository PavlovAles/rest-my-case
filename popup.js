const stockApiUrlInput = document.getElementById('stockApiUrl');
const thresholdInput = document.getElementById('threshold');
const saveButton = document.getElementById('save');

saveButton.addEventListener('click', () => {
  const stockApiUrl = stockApiUrlInput?.value;
  const threshold = parseInt(thresholdInput?.value) || 0;
  chrome.storage.sync.set({ stockApiUrl, threshold }, () => {
    saveButton.textContent = 'Saved successfully!';
    setTimeout(() => {
      saveButton.textContent = 'Save';
    }, 1000);
  });
});

chrome.storage.sync.get(['stockApiUrl', 'threshold'], (data) => {
  stockApiUrlInput.value = data.stockApiUrl || '';
  thresholdInput.value = data.threshold || '';
});
