function checkIsLoading() {
  const preloaderElement = document.querySelector('.general-preloader');
  return preloaderElement?.parentNode.style.display !== 'none';
}

async function fetchStockData(apiUrl, id) {
  // const apiUrl = `${apiUrl}/${id}`;
  apiUrl =
    'https://www.random.org/integers/?num=1&min=1&max=666&col=1&base=10&format=plain&rnd=new';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('@fetchRest:', error);
  }
}

function showRest(productElement, amount, threshold) {
  const responseElement = document.createElement('div');
  responseElement.textContent = `На складе: ${amount}`;
  responseElement.classList.add('stock-amount');
  if (amount <= threshold) {
    responseElement.classList.add('stock-amount_low');
  }
  productElement.parentNode.insertBefore(responseElement, productElement.nextSibling);
}

function fetchAndShowStockInfo() {
  let checkInterval;
  let elapsedTime = 0;
  const maxTime = 5000;

  checkInterval = setInterval(() => {
    if (checkIsLoading()) {
      return;
    }

    const productElement = document.querySelector('span#productNmId');
    elapsedTime += 100;

    if (productElement) {
      clearInterval(checkInterval);

      const productId = productElement.textContent;
      chrome.storage.sync.get(['stockApiUrl', 'threshold'], async (data) => {
        if (!data.stockApiUrl) {
          return;
        }
        const restAmount = await fetchStockData(data.stockApiUrl, productId);
        showRest(productElement, restAmount, data.threshold);
      });
    } else if (elapsedTime >= maxTime) {
      clearInterval(checkInterval);
      console.log('Products id element did not appear within 5 seconds.');
    }
  }, 100);
}

window.addEventListener('load', fetchAndShowStockInfo);
