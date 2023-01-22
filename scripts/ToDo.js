import {
  getCategories,
  addNewCategory,
  getTasks,
  addOrUpdateTask,
  getTaskById,
} from "./FetchAPIScript.js";

(function () {
  const newTask = document.getElementById("add-new-task");
  const list = document.getElementById("task-list");
  const currentDate = document.getElementById("date");
  const newCategory = document.getElementById("add-new-task-collection");
  const mainContainer = document.getElementById("task-title");
  const mainContainerIcon = document.getElementById("main-title-icon");
  let selectedCategory = document.getElementsByClassName(
    "side-navigation-menu"
  );
  const taskContainer = document.getElementById("task-container");
  let selectedTask = document.getElementsByClassName("added-task");
  let note = document.getElementsByClassName("task-note")[0];
  const exitTask = document.getElementById("exit-task-setting-icon");
  const taskMenu = document.getElementById("right-container");

  const middleContainer = document.getElementById("main-container");
  const taskTitleHeader = document.getElementsByClassName("task-title")[0];
  const addButton = document.getElementsByClassName("hide-add-button")[0];
  let completedTaskContainer = document.getElementsByClassName(
    "completed-task-container"
  )[0];
  let importantStatus = document.getElementsByClassName("important-icon");
  let completeStatus = document.getElementsByClassName("complete-icon");
  let chosenCategory;
  let chosenTask;

  let categoryList = [];
  let tasks = [];

  function init() {
    displayDate();
    getCategory();
    getTasksList();
    eventListener();
  }

  /**
   * Get the categories from the API, then set the chosen category to the first one in the list, then
   * render the category.
   */
  function getCategory() {
    const existingCategories = getCategories("categories");
    existingCategories.then((existingCategory) => {
      categoryList = existingCategory;
      if (categoryList.length <= 5) {
        chosenCategory = categoryList[0];
      } else {
        chosenCategory = categoryList[categoryList.length - 1];
      }
      renderCategory();
      selectCategory(null);
    });
  }

  /**
   * Get the category from the category array and creates a list item for each category.
   */
  function renderCategory() {
    for (let index = 0; index < categoryList.length; index++) {
      let listContainer = createElement("li", {
        className: "side-navigation-menu",
        id: categoryList[index].id,
      });
      let iconContainer = createElement("div", {
        className: "side-navigation-menu-icon",
      });
      let icon = createElement("i", { className: categoryList[index].icon });
      let categoryContainer = createElement("div", { className: undefined });
      iconContainer.appendChild(icon);
      categoryContainer.innerHTML = categoryList[index].name;
      listContainer.appendChild(iconContainer);
      listContainer.appendChild(categoryContainer);
      list.appendChild(listContainer);
      if (categoryList[index].id == 5) {
        let line = createElement("hr", { className: "" });
        let categorySeparateLine = createElement("div", {
          className: "side-navigation-line",
        });
        categorySeparateLine.appendChild(line);
        list.appendChild(categorySeparateLine);
      }
    }
    eventListener();
  }

  /**
   * Gets the current date and displays it in the format of "Day, Month Date"
   */
  function displayDate() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let todayDate = new Date();
    let month = months[todayDate.getMonth()];
    let day = days[todayDate.getDay()];
    let date = todayDate.getDate();
    currentDate.innerHTML = day + ", " + month + " " + date;
  }

  /**
   * Listen to the event to be happen for the required element
   */
  function eventListener() {
    newTask.addEventListener("keypress", addTask);
    newCategory.addEventListener("keypress", addCategory);
    note.addEventListener("blur", addNote);
    exitTask.addEventListener("click", exitTaskMenu);
    addButton.addEventListener("click", addTask);

    if (selectedCategory.length > 0) {
      for (let index = 0; index < categoryList.length; index++) {
        selectedCategory[index].addEventListener("click", selectCategory);
      }
    }

    for (let index = 0; index < selectedTask.length; index++) {
      selectedTask[index].addEventListener("click", getTaskByTaskId);
    }

    for (let index = 0; index < importantStatus.length; index++) {
      importantStatus[index].addEventListener("click", markImportant);
    }

    for (let index = 0; index < completeStatus.length; index++) {
      completeStatus[index].addEventListener("click", completeTask);
    }

    if (taskTitleHeader.children.length > 0) {
      taskTitleHeader.getElementsByClassName("task-title");
      taskTitleHeader.children[0].addEventListener("click", completeTask);
      taskTitleHeader.children[2].addEventListener("click", markImportant);
    }
  }

  /**
   * Creates a new category for the user where the user can add specific tasks
   */
  function addCategory(event) {
    let categoryName;
    if (event.key == "Enter") {
      if (newCategory.value && newCategory.value.trim() != "") {
        categoryName = newCategory.value;
      } else {
        categoryName = "Untitled Task";
      }
      newCategory.value = "";
      let category = {
        name: categoryName,
        icon: "fa-solid fa-list-ul",
      };
      addNewCategory(category, "category").then(() => {
        list.innerHTML = "";
        getCategory();
      });
      eventListener();
    }
  }

  /**
   * Gets the task from the user and create list of task to the user
   */
  function addTask(event) {
    if (event.key == "Enter" || event.type == "click") {
      if (newTask.value && newTask.value.trim() !== "") {
        let taskName = newTask.value;
        let selectedCategoryId = chosenCategory.id;
        let importantStatus;
        if (chosenCategory.id == categoryList[1].id) {
          importantStatus = true;
        } else {
          importantStatus = false;
        }
        let addTask = {
          name: taskName,
          categoryIds: [selectedCategoryId],
          note: "",
          isImportant: importantStatus,
          isCompleted: false,
        };
        addOrUpdateTask(addTask, "task");
        newTask.value = "";
        taskContainer.innerHTML = "";
        getTasksList();
        eventListener();
      }
    }
  }

  /**
   * Get the existing tasks from the backend, then set the tasks variable to the existing tasks,
   * then clear the task container and then render the selected tasks.
   */
  function getTasksList() {
    const existingTasks = getTasks("tasks");
    existingTasks.then((existingTaskList) => {
      tasks = existingTaskList;
      taskContainer.innerHTML = "";
      renderSelectedTasks();
    });
  }

  /**
   * For each task, check if the task's categoryId  contains the id of the chosenCategory. If it
   * does, render the task fot the chosen category
   */
  function renderSelectedTasks() {
    for (let index = 0; index < tasks.length; index++) {
      let categoryIds = tasks[index].categoryIds;
      for (let i = 0; i < categoryIds.length; i++) {
        if (categoryIds[i] == chosenCategory.id) {
          renderTask(tasks[index]);
        }
      }
    }
  }

  /**
   * Get all the tasks for a specific category
   */
  function renderTask(task) {
    let container = createElement("div", {
      className: "create-task",
      id: task.id,
    });
    let importantContainer = createElement("div", {
      className: "important-icon",
      id: task.id,
    });
    let textContainer = createElement("div", {
      className: "added-task",
      id: task.id,
    });
    let completeIcon = createElement("div", {
      className: "complete-icon",
      id: task.id,
    });
    let text = createElement("p", { className: undefined });
    let taskContent = document.createTextNode(task.name);
    text.appendChild(taskContent);
    textContainer.appendChild(text);
    textContainer.classList.add(checkTaskStatus(task.isCompleted));
    completeIcon.innerHTML = checkTaskCompletedStatus(task.isCompleted);
    container.appendChild(completeIcon);
    importantContainer.innerHTML = checkTaskImportantStatus(task.isImportant);
    container.appendChild(textContainer);
    container.appendChild(importantContainer);
    if (task.isCompleted) {
      completedTaskContainer.classList.remove("hide-completed-tasks");
      completedTaskContainer.appendChild(container);
      completedTaskContainer.insertBefore(
        container,
        completedTaskContainer.children[1]
      );
    } else {
      if (completedTaskContainer.children.length == 1) {
        completedTaskContainer.classList.add("hide-completed-tasks");
      }
      taskContainer.appendChild(container);
      taskContainer.insertBefore(container, taskContainer.children[0]);
    }
    eventListener();
  }

  /**
   * If the task is completed, return a checked icon, otherwise return a unchecked icon
   * @param {*} isCompleted - boolean
   * @returns the string to create the icon.
   */
  function checkTaskCompletedStatus(isCompleted) {
    if (isCompleted) {
      return '<i class="fa-regular fa-circle-check"></i>';
    } else {
      return '<i class="fa-regular fa-circle"></i>';
    }
  }

  /**
   * If the task is important, return a important icon, otherwise return a regular icon
   * @param isImportant - boolean
   * @returns the string to create the icon.
   */
  function checkTaskImportantStatus(isImportant) {
    if (isImportant) {
      return '<i class="fa-solid fa-star"></i>';
    } else {
      return '<i class="fa-regular fa-star"></i>';
    }
  }

  /**
   * If the taskStatus is true, return the string "completed-task".
   * @param {*} taskStatus - This is the status of the task. If it's true, then the task is completed.
   * @returns the string "completed-task"
   */
  function checkTaskStatus(taskStatus) {
    if (taskStatus) {
      return "completed-task";
    }
  }

  /**
   * Create a element
   * Its gets the tag name as a parameter
   * @param tag - tag name of the element
   * @param element - object that has class name and id
   * @returns element
   */
  function createElement(tag, element) {
    let createdElement = document.createElement(tag);
    if (element.className !== undefined) {
      createdElement.className = element.className;
    }

    if (element.id !== undefined) {
      createdElement.id = element.id;
    }
    return createdElement;
  }

  /**
   * It loops through the category array, and if the id of the clicked element matches the id of the
   * current category, it sets the mainContainer's title to the name of the category, the
   * mainContainer Icon to the icon of the category, the document's title will be changed to the name of the
   * category
   *
   * @param event - the event that triggered the function
   */
  function selectCategory(event) {
    if (event == null) {
      let index = chosenCategory.id;
      mainContainer.innerHTML = chosenCategory.name;
      let icon = createElement("i", { className: chosenCategory.icon });
      mainContainerIcon.innerHTML = "";
      mainContainerIcon.appendChild(icon);
      document.title = chosenCategory.name;
      taskContainer.innerHTML = "";
      selectedCategory[--index].classList.add("selected-menu");
      getTasksList();
      exitTaskMenu();
    } else {
      removeHighlightCategory();
      for (let index = 0; index < categoryList.length; index++) {
        if (event.target.id == categoryList[index].id) {
          selectedCategory[index].classList.add("selected-menu");
          mainContainer.innerHTML = categoryList[index].name;
          let icon = createElement("i", {
            className: categoryList[index].icon,
          });
          mainContainerIcon.innerHTML = "";
          mainContainerIcon.appendChild(icon);
          document.title = categoryList[index].name;
          chosenCategory = categoryList[index];
          taskContainer.innerHTML = "";
          getTasksList();
          eventListener();
          exitTaskMenu();
        }
      }
    }
  }

  /**
   * removes the class "selected-menu" from the selectedCategory array.
   */
  function removeHighlightCategory() {
    if (selectedCategory.length > 0) {
      for (let index = 0; index < categoryList.length; index++) {
        selectedCategory[index].classList.remove("selected-menu");
      }
    }
  }

  /**
   * When the user clicks on a task, the task menu will appear and the task title will be set to the title of the task menu
   */
  function displayTaskMenu() {
    resizeMainContainer();
    removeHighlightTask();
    renderNote();
    highlightTask();
  }

  /**
   * Get the task by the task id, then it removes the highlight task and displays the task menu.
   * @param event - the event that triggered the function
   */
  function getTaskByTaskId(event) {
    let id = event.currentTarget.id;
    const existingTask = getTaskById(id, "tasks");
    existingTask.then((savedTask) => {
      chosenTask = savedTask;
      removeHighlightTask();
      displayTaskMenu();
    });
  }

  /**
   * It renders the note of the task that was clicked on.
   * @param event - the event that triggered the function
   */
  function renderNote() {
    taskTitleHeader.innerHTML = "";
    let completeIconContainer = createElement("div", {
      id: chosenTask.id,
    });
    completeIconContainer.innerHTML = checkTaskCompletedStatus(
      chosenTask.isCompleted
    );
    let importantIconContainer = createElement("div", {
      id: chosenTask.id,
    });
    importantIconContainer.innerHTML = checkTaskImportantStatus(
      chosenTask.isImportant
    );
    let taskInput = document.createElement("input", {
      className: "display-task-title",
      id: "display-task-title",
    });
    taskInput.type = "text";
    taskInput.value = chosenTask.name;
    taskInput.classList.add(checkTaskStatus(chosenTask.isCompleted));
    taskTitleHeader.appendChild(completeIconContainer);
    taskTitleHeader.appendChild(taskInput);
    taskTitleHeader.appendChild(importantIconContainer);
    note.setAttribute("id", chosenTask.id);
    note.value = chosenTask.note;
    eventListener();
  }

  /**
   * If the chosenTask is not null, then for each task in the tasks array, if the task's id is equal to
   * the chosenTask's id, then add the class 'selected-task' to the parent element of the selectedTask.
   */
  function highlightTask() {
    if (chosenTask != null) {
      let selectedTaskIndex = selectedTask.length;
      for (let index = 0; index < tasks.length; index++) {
        --selectedTaskIndex;
        if (tasks[index].id == chosenTask["id"]) {
          selectedTask[selectedTaskIndex].parentElement.classList.add(
            "selected-task"
          );
        }
      }
    }
  }

  /**
   * It removes the class "selected-task" from all the elements in the selectedTask array
   */
  function removeHighlightTask() {
    for (let index = 0; index < selectedTask.length; index++) {
      selectedTask[index].classList.remove("selected-task");
    }
  }

  /**
   * Add the note to the task.
   * @param event - The event object.
   */
  function addNote(event) {
    let savedTask = getTaskById(event.currentTarget.id, "tasks");
    savedTask.then((existingTask) => {
      let updateTask = existingTask;
      if (note.value && note.value.trim() !== "") {
        updateTask.note = note.value;
      }
      let updatedTask = addOrUpdateTask(updateTask, "task");
      updatedTask.then(renderNote());
    });
  }

  /**
   * When the user clicks on the exit button in the task menu
   * The task Menu will hide
   */
  function exitTaskMenu() {
    taskMenu.classList.add("hide-right-container");
    middleContainer.classList.remove("resize-main-container");
    addButton.classList.remove("resize-hide-add-button");
    newTask.classList.remove("resize-add-new-task");
  }

  /**
   * When the user clicks on the task, the task menu will be displayed, the middle container will be resized
   */
  function resizeMainContainer() {
    taskMenu.classList.remove("hide-right-container");
    middleContainer.classList.add("resize-main-container");
    addButton.classList.add("resize-hide-add-button");
    newTask.classList.add("resize-add-new-task");
  }

  /**
   * check the task important status, if it is not important, make it important. If it is important, make it not important.
   * @param event - the event object
   */
  function markImportant(event) {
    let savedTask = getTaskById(event.currentTarget.id, "tasks");
    savedTask.then((editTask) => {
      chosenTask = editTask;
      if (chosenTask.isImportant == false) {
        chosenTask.isImportant = true;
        chosenTask.categoryIds.splice(0, 0, categoryList[1].id);
      } else {
        chosenTask.isImportant = false;
        let categoriesId = chosenTask.categoryIds;
        chosenTask.categoriesId = categoriesId.splice(0, 1);
      }
      let updatedTask = addOrUpdateTask(chosenTask, "task");
      updatedTask.then(renderNote());
      taskContainer.innerHTML = "";
      getTasksList();
      eventListener();
    });
  }

  /**
   * check the task completed status, if it is not completed, make it completed. If it is completed, make it not completed.
   * @param event - the event object
   */
  function completeTask(event) {
    let savedTask = getTaskById(event.currentTarget.id, "tasks");
    savedTask.then((editTask) => {
      chosenTask = editTask;
      if (chosenTask.isCompleted == false) {
        chosenTask.isCompleted = true;
      } else {
        chosenTask.isCompleted = false;
      }
      let updatedTask = addOrUpdateTask(chosenTask, "task");
      updatedTask.then(renderNote());
      taskContainer.innerHTML = "";
      let completedTasks = completedTaskContainer.children;
      for (let index = 0; index < completedTasks.length; index++) {
        if (index > 0) {
          completedTasks[index].remove(completedTasks.firstChild);
        }
      }
      getTasksList();
      eventListener();
    });
  }

  init();
})();
