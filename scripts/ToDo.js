import {
  getCategories,
  addNewCategory,
  getTasks,
  addOrUpdateTask,
  getTaskById,
} from "./FetchAPIScript.js";

(function () {
  const NEW_TASK = document.getElementById("add-new-task");
  const LIST = document.getElementById("task-list");
  const CURRENT_DATE = document.getElementById("date");
  const NEW_CATEGORY = document.getElementById("add-new-task-collection");
  const MAIN_CONTAINER = document.getElementById("task-title");
  const MAIN_CONTAINER_ICON = document.getElementById("main-title-icon");
  const SELECTED_CATEGORY = document.getElementsByClassName(
    "side-navigation-menu"
  );
  const TASK_CONTAINER = document.getElementById("task-container");
  const SELECTED_TASK = document.getElementsByClassName("added-task");
  const NOTE = document.getElementsByClassName("task-note")[0];
  const EXIT_TASK = document.getElementById("exit-task-setting-icon");
  const TASK_MENU = document.getElementById("right-container");
  const MIDDLE_CONTAINER = document.getElementById("main-container");
  const TASK_TITLE_HEADER = document.getElementsByClassName("task-title")[0];
  const ADD_BUTTON = document.getElementsByClassName("hide-add-button")[0];
  const COMPLETED_TASK_CONTAINER = document.getElementsByClassName(
    "completed-task-container"
  )[0];
  const IMPORTANT_STATUS = document.getElementsByClassName("important-icon");
  const COMPLETED_STATUS = document.getElementsByClassName("complete-icon");
  const HIDE_NAV_BAR = document.getElementById("toggle-menu");
  const SIDE_NAVIGATION = document.getElementsByClassName("side-navigation")[0];
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
      LIST.appendChild(listContainer);
      if (categoryList[index].id == 5) {
        let line = createElement("hr", { className: "" });
        let categorySeparateLine = createElement("div", {
          className: "side-navigation-line",
        });
        categorySeparateLine.appendChild(line);
        LIST.appendChild(categorySeparateLine);
      }
    }
    eventListener();
  }

  /**
   * Gets the current date and displays it in the format of "Day, Month Date"
   */
  function displayDate() {
    CURRENT_DATE.innerHTML = moment().format("dddd , MMMM D");
  }

  /**
   * Listen to the event to be happen for the required element
   */
  function eventListener() {
    NEW_TASK.addEventListener("keypress", addTask);
    NEW_CATEGORY.addEventListener("keypress", addCategory);
    NOTE.addEventListener("blur", addNote);
    EXIT_TASK.addEventListener("click", exitTaskMenu);
    ADD_BUTTON.addEventListener("click", addTask);
    HIDE_NAV_BAR.addEventListener("click", hideSideNavigation);
    MAIN_CONTAINER_ICON.addEventListener("click", showSideNavigation);

    if (SELECTED_CATEGORY.length > 0) {
      for (let index = 0; index < categoryList.length; index++) {
        SELECTED_CATEGORY[index].addEventListener("click", selectCategory);
      }
    }

    for (let index = 0; index < SELECTED_TASK.length; index++) {
      SELECTED_TASK[index].addEventListener("click", getTaskByTaskId);
    }

    for (let index = 0; index < IMPORTANT_STATUS.length; index++) {
      IMPORTANT_STATUS[index].addEventListener("click", markImportant);
    }

    for (let index = 0; index < COMPLETED_STATUS.length; index++) {
      COMPLETED_STATUS[index].addEventListener("click", completeTask);
    }

    if (TASK_TITLE_HEADER.children.length > 0) {
      TASK_TITLE_HEADER.getElementsByClassName("task-title");
      TASK_TITLE_HEADER.children[0].addEventListener("click", completeTask);
      TASK_TITLE_HEADER.children[2].addEventListener("click", markImportant);
    }
  }

  /**
   * Creates a new category for the user where the user can add specific tasks
   */
  function addCategory(event) {
    let categoryName;
    if (event.key == "Enter") {
      if (NEW_CATEGORY.value && NEW_CATEGORY.value.trim() != "") {
        categoryName = NEW_CATEGORY.value;
      } else {
        categoryName = "Untitled Task";
      }
      NEW_CATEGORY.value = "";
      let category = {
        name: categoryName,
        icon: "fa-solid fa-list-ul",
      };
      addNewCategory(category, "category").then(() => {
        LIST.innerHTML = "";
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
      if (NEW_TASK.value && NEW_TASK.value.trim() !== "") {
        let taskName = NEW_TASK.value;
        let selectedCategoryId = [chosenCategory.id];
        for (let index = 0; index < 4; index++) {
          if (categoryList[index].id == chosenCategory.id) {
            selectedCategoryId = [chosenCategory.id, categoryList[4].id];
          }
        }
        let importantStatus;
        if (chosenCategory.id == categoryList[1].id) {
          importantStatus = true;
        } else {
          importantStatus = false;
        }
        let addTask = {
          name: taskName,
          categoryIds: selectedCategoryId,
          note: "",
          isImportant: importantStatus,
          isCompleted: false,
        };
        addOrUpdateTask(addTask, "task");
        NEW_TASK.value = "";
        TASK_CONTAINER.innerHTML = "";
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
      TASK_CONTAINER.innerHTML = "";
      hideCompletedContainer();
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
      if (chosenCategory.id != 2) {
        COMPLETED_TASK_CONTAINER.classList.remove("hide-completed-tasks");
        COMPLETED_TASK_CONTAINER.appendChild(container);
        COMPLETED_TASK_CONTAINER.insertBefore(
          container,
          COMPLETED_TASK_CONTAINER.children[1]
        );
      }
    } else {
      hideCompletedContainer();
      TASK_CONTAINER.appendChild(container);
      TASK_CONTAINER.insertBefore(container, TASK_CONTAINER.children[0]);
    }
    eventListener();
  }

  /**
   * If the completed task container has only one child, add the class "hide-completed-tasks" to the
   * completed task container.
   *
   */
  function hideCompletedContainer() {
    if (COMPLETED_TASK_CONTAINER.children.length == 1) {
      COMPLETED_TASK_CONTAINER.classList.add("hide-completed-tasks");
    }
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
      MAIN_CONTAINER.innerHTML = chosenCategory.name;
      let icon = createElement("i", { className: chosenCategory.icon });
      MAIN_CONTAINER_ICON.innerHTML = "";
      MAIN_CONTAINER_ICON.appendChild(icon);
      document.title = chosenCategory.name;
      TASK_CONTAINER.innerHTML = "";
      SELECTED_CATEGORY[--index].classList.add("selected-menu");
      clearRenderingCompletedTasks();
      getTasksList();
      exitTaskMenu();
    } else {
      removeHighlightCategory();
      for (let index = 0; index < categoryList.length; index++) {
        if (event.target.id == categoryList[index].id) {
          SELECTED_CATEGORY[index].classList.add("selected-menu");
          MAIN_CONTAINER.innerHTML = categoryList[index].name;
          let icon = createElement("i", {
            className: categoryList[index].icon,
          });
          MAIN_CONTAINER_ICON.innerHTML = "";
          MAIN_CONTAINER_ICON.appendChild(icon);
          document.title = categoryList[index].name;
          chosenCategory = categoryList[index];
          TASK_CONTAINER.innerHTML = "";
          clearRenderingCompletedTasks();
          getTasksList();
          eventListener();
          exitTaskMenu();
        }
      }
    }
  }

  function clearRenderingCompletedTasks() {
    let completedTasks = COMPLETED_TASK_CONTAINER.children;
    for (let index = 0; index < completedTasks.length; index++) {
      if (index > 0) {
        completedTasks[index].remove(completedTasks.firstChild);
      }
    }
  }

  /**
   * removes the class "selected-menu" from the selectedCategory array.
   */
  function removeHighlightCategory() {
    if (SELECTED_CATEGORY.length > 0) {
      for (let index = 0; index < categoryList.length; index++) {
        SELECTED_CATEGORY[index].classList.remove("selected-menu");
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
    TASK_TITLE_HEADER.innerHTML = "";
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
    TASK_TITLE_HEADER.appendChild(completeIconContainer);
    TASK_TITLE_HEADER.appendChild(taskInput);
    TASK_TITLE_HEADER.appendChild(importantIconContainer);
    NOTE.setAttribute("id", chosenTask.id);
    NOTE.value = chosenTask.note;
    eventListener();
  }

  /**
   * If the chosenTask is not null, then for each task in the tasks array, if the task's id is equal to
   * the chosenTask's id, then add the class 'selected-task' to the parent element of the selectedTask.
   */
  function highlightTask() {
    if (chosenTask != null) {
      let selectedTaskIndex = SELECTED_TASK.length;
      for (let index = 0; index < tasks.length; index++) {
        --selectedTaskIndex;
        if (tasks[index].id == chosenTask["id"]) {
          SELECTED_TASK[selectedTaskIndex].parentElement.classList.add(
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
    for (let index = 0; index < SELECTED_TASK.length; index++) {
      SELECTED_TASK[index].classList.remove("selected-task");
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
      if (NOTE.value && NOTE.value.trim() !== "") {
        updateTask.note = NOTE.value;
      }
      let updatedTask = addOrUpdateTask(updateTask, "task");
      updatedTask.then(() => {
        renderNote();
      });
    });
  }

  /**
   * When the user clicks on the exit button in the task menu
   * The task Menu will hide
   */
  function exitTaskMenu() {
    TASK_MENU.classList.add("hide-right-container");
    MIDDLE_CONTAINER.classList.remove("resize-main-container");
    ADD_BUTTON.classList.remove("resize-hide-add-button");
    NEW_TASK.classList.remove("resize-add-new-task");
  }

  /**
   * When the user clicks on the task, the task menu will be displayed, the middle container will be resized
   */
  function resizeMainContainer() {
    TASK_MENU.classList.remove("hide-right-container");
    MIDDLE_CONTAINER.classList.add("resize-main-container");
    ADD_BUTTON.classList.add("resize-hide-add-button");
    NEW_TASK.classList.add("resize-add-new-task");
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
      TASK_CONTAINER.innerHTML = "";
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
      TASK_CONTAINER.innerHTML = "";
      clearRenderingCompletedTasks();
      getTasksList();
      eventListener();
    });
  }

  function hideSideNavigation(event) {
    SIDE_NAVIGATION.classList.add("hide-side-navigation");
    MIDDLE_CONTAINER.classList.add("resize-main-container-for-side-nav");
    ADD_BUTTON.classList.add("resize-hide-add-button-for-side-nav");
    NEW_TASK.classList.add("resize-add-new-task-for-side-nav");
  }

  function showSideNavigation() {
    SIDE_NAVIGATION.classList.remove("hide-side-navigation");
    MIDDLE_CONTAINER.classList.remove("resize-main-container-for-side-nav");
    ADD_BUTTON.classList.remove("resize-hide-add-button-for-side-nav");
    NEW_TASK.classList.remove("resize-add-new-task-for-side-nav");
  }

  init();
})();
