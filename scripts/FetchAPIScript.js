const url = "http://localhost:8080/todo/";
const headers = new Headers();
headers.append("Content-Type", "application/json");

export async function getCategories(endpoint) {
  const response = await fetch(url + endpoint);
  const categories = await response.json();
  return await categories;
}

export async function addNewCategory(category, endpoint) {
  let newCategory = JSON.stringify(category);

  let requestOptions = {
    method: "POST",
    headers: headers,
    body: newCategory,
  };

  fetch(url + endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export async function getTasks(endpoint) {
  const response = await fetch(url + endpoint);
  const tasks = await response.json();
  return await tasks;
}

export async function addOrUpdateTask(task, endpoint) {
  let newTask = JSON.stringify(task);

  let requestOptions = {
    method: "POST",
    headers: headers,
    body: newTask,
  };

  fetch(url + endpoint, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export async function getTaskById(id, endpoint) {
  const response = await fetch(url + endpoint + "/" + id);
  const task = await response.json();
  return await task;
}
