const headers = new Headers();
headers.append("Content-Type", "application/json");

export function getTaskOrCategories(url) {
  return fetch(url).then((response) => {
    return response.json();
  });
}

export function addOrUpdate(content, url) {
  let requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(content),
  };
  fetch(url, requestOptions);
}
