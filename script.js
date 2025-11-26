document.getElementById('voucher-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById('card-number').value;
  const quantity = parseInt(document.getElementById('voucher-quantity').value, 10);
  const voucherCodesList = document.getElementById('voucher-codes');
  const loader = document.getElementById('loader');
  const resultContainer = document.getElementById('voucher-result');

  // reset tampilan
  voucherCodesList.innerHTML = '';
  resultContainer.classList.add('hidden');
  loader.classList.remove('hidden');

  // 👉 ini URL dari SOURCE ATL2
  const baseUrl = `https://api.teeg.cloud/vouchers/campaigns/ANDJV2I/cards/${cardNumber}?tz=MIDHD74UWB`;

  // 👉 ini TOKEN dari SOURCE ATL2
  const headers = {
    'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Imp0X1htek9Od2NqTlg0VFhjTjRvMUhNM2k5aUtpczlpSGgxYTllcEdENGsiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiI2ZjcyYzI3NS01MWI5LTQ2M2ItODQxMS0zYjA0OTM2Y2UxODkiLCJpc3MiOiJodHRwczovL2lkZW50aXR5LnRlZWcuY2xvdWQvYWYyMWUwNTYtMGEyMS00ZDgzLWI1ZGQtNDRjNDM5ZmE4ZjMwL3YyLjAvIiwiZXhwIjoxNzUxNTYxODMwLCJuYmYiOjE3NTE1NjA5MzAsImlwQWRkcmVzcyI6IjEzOS4xOTIuMjE3LjIwOCIsImlwYWRkciI6IjEzOS4xOTIuMjE3LjIwOCIsIm9pZCI6ImY0YmQwNDgwLTQ3ZTYtNGNiOS1hMTcyLTViODFmMDdkYWE3MSIsInN1YiI6ImY0YmQwNDgwLTQ3ZTYtNGNiOS1hMTcyLTViODFmMDdkYWE3MSIsInBob25lIjoiKzYyODU3NDIyNTA2OTIiLCJ0aWQiOiJhZjIxZTA1Ni0wYTIxLTRkODMtYjVkZC00NGM0MzlmYThmMzAiLCJub25jZSI6IjYyZmU5NDJkLTFjZTUtNGM5MC04Nzk2LTY1YTA0NDViNGEwYiIsInNjcCI6ImFsbC1hcGlzIiwiYXpwIjoiY2EwZTQ4NjgtMTc3Yi00OWQyLThjNjMtZjEwNDRlM2VkYzYzIiwidmVyIjoiMS4wIiwiaWF0IjoxNzUxNTYwOTMwfQ.B94h3JcBkrKCmmkevfSI3OkIvLocrRulvbceEsKqyAgwdgYD-Z_flTSg0nj_bXkETxNwOkiijJZqRxioYd1h06zyozn95e6qhTnJZKtaaKz0iSmvveUtfNXMfy3FoFMRxIIpJgZ6iUX4UsIZllczThyTwd8_HxxNyYAhRHBBZoj7PmG0iq8re-xYXLRP3kmP61N8PTrFn6mqH-XpLy0ZWRGLK6rgXUU2dnLTubk-LYzDghVEB8FErppRYd7Wp6n52Q9Ft82ZXExDYrfhdfqKWvJDxDBBL4vdHSKgX2OMCOex7qG6Jmk7ZylNJirb5EJQfqyI800FluRWe6wdc1QN6w',
    'Content-Type': 'application/json'
  };

  // bikin semua request PARAREL + tambahin cache buster
  const requests = Array.from({ length: quantity }, (_, i) => {
    const cacheBuster = `${Date.now()}-${i}`; // bikin unik tiap request
    const url = `${baseUrl}&_=${cacheBuster}`;

    return fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store' // paksa jangan cache
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => data.voucherCode || '(No code)')
      .catch(() => '(Error)');
  });

  try {
    const codes = await Promise.all(requests);

    // ⚠️ TIDAK pakai unique, sama kaya ATL1
    codes.forEach(code => {
      const li = document.createElement('li');
      li.textContent = code;
      voucherCodesList.appendChild(li);
    });

    resultContainer.classList.remove('hidden');
  } catch (error) {
    alert('Failed to generate vouchers.');
    console.error(error);
  } finally {
    loader.classList.add('hidden');
  }
});
