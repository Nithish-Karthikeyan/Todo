import { getTaskOrCategories, addOrUpdate } from "./api.js";

const url = "http://localhost:8080/todo/";

export function getCategories(endpoint) {
  return getTaskOrCategories(url + endpoint);
}

export function getTasks(endpoint) {
  return getTaskOrCategories(url + endpoint);
}

export function getTaskById(id, endpoint) {
  return getTaskOrCategories(url + endpoint + "/" + id);
}

export function addOrUpdateTask(task, endpoint) {
  addOrUpdate(task, url + endpoint);
}

export function addNewCategory(category, endpoint) {
  addOrUpdate(category, url + endpoint);
}
