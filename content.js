function checkIsLoading() {
  const preloaderElement = document.querySelector('.general-preloader');
  return preloaderElement?.parentNode.style.display !== 'none';
}

async function fetchStockData(apiUrl, id) {
  const url = `${apiUrl}${id}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('@fetchRest:', error);
  }
}

function showRest(productElement, amount, threshold) {
  if (!parseInt(amount)) return;
  const responseElement = document.createElement('div');
  responseElement.textContent = `На складе: ${amount}`;
  responseElement.classList.add('stock-amount');
  if (amount <= threshold) {
    responseElement.classList.add('stock-amount_low');
  }
  productElement.parentNode.insertBefore(responseElement, productElement.nextSibling);
}

async function fetchAndShowStockInfo(data, productElement) {
  const productId = productElement.textContent;
  if (!data.stockApiUrl || !productId) {
    return;
  }
  const restAmount = await fetchStockData(data.stockApiUrl, productId);
  showRest(productElement, restAmount, data.threshold);
}

function runExtension() {
  let checkInterval;
  let elapsedTime = 0;
  const maxTime = 5000;

  checkInterval = setInterval(() => {
    if (checkIsLoading()) {
      return;
    }

    const productIdElement = document.querySelector('span#productNmId');
    elapsedTime += 100;

    if (productIdElement) {
      clearInterval(checkInterval);
      chrome.storage.sync.get(['stockApiUrl', 'threshold'], (data) =>
        fetchAndShowStockInfo(data, productIdElement)
      );
    } else if (elapsedTime >= maxTime) {
      clearInterval(checkInterval);
      console.log('Products id element did not appear within 5 seconds.');
    }
  }, 100);
}

window.addEventListener('load', runExtension);
