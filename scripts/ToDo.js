(function () {
  const categories = [
    { id: 1, name: "My Day", icon: "fa-regular fa-sun" },
    { id: 2, name: "Important", icon: "fa-regular fa-star" },
    { id: 3, name: "Planned", icon: "fa-regular fa-calendar" },
    { id: 4, name: "Assigned To Me", icon: "fa-regular fa-user" },
    { id: 5, name: "Tasks", icon: "fa-solid fa-house" },
  ];

  let tasks = [];

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
  let note = document.getElementById("task-note");
  const exitTask = document.getElementById("exit-task-setting-icon");
  const taskMenu = document.getElementById("right-container");

  const middleContainer = document.getElementById("main-container");
  const taskTitleHeader = document.getElementsByClassName("task-title")[0];
  const taskTitle = document.getElementById("display-task-title");
  const addButton = document.getElementsByClassName("hide-add-button")[0];
  let completedTaskContainer = document.getElementsByClassName(
    "completed-task-container"
  )[0];
  let importantStatus = document.getElementsByClassName("important-icon");
  let completeStatus = document.getElementsByClassName("complete-icon");
  let chosenCategory = categories[0];
  let chosenTask;

  function init() {
    displayDate();
    renderCategory();
    eventListener();
    renderTaskForCategory();
  }

  /**
   * Get the category from the category array and creates a list item for each category.
   */
  function renderCategory() {
    for (let index = 0; index < categories.length; index++) {
      let listContainer = createElement("li", {
        className: "side-navigation-menu",
        id: categories[index].id,
      });
      let iconContainer = createElement("div", {
        className: "side-navigation-menu-icon",
      });
      let icon = createElement("i", { className: categories[index].icon });
      let categoryContainer = createElement("div", { className: undefined });
      iconContainer.appendChild(icon);
      categoryContainer.innerHTML = categories[index].name;
      listContainer.appendChild(iconContainer);
      listContainer.appendChild(categoryContainer);
      list.appendChild(listContainer);
      list.insertBefore(listContainer, list.children[index]);
    }
    selectCategory(null);
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
    note.addEventListener("input", addNote);
    exitTask.addEventListener("click", exitTaskMenu);
    addButton.addEventListener("click", addTask);

    for (let index = 0; index < categories.length; index++) {
      selectedCategory[index].addEventListener("click", selectCategory);
    }

    if (
      selectedTask.length > 0 ||
      importantStatus.length > 0 ||
      completeStatus.length > 0
    ) {
      for (let index = 0; index < tasks.length; index++) {
        selectedTask[index].addEventListener("click", displayTaskMenu);
        importantStatus[index].addEventListener("click", markImportant);
        completeStatus[index].addEventListener("click", completeTask);
      }
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
      let categoryId = categories.length;
      let categoryIcon = "fa-solid fa-list-ul";
      newCategory.value = "";
      categories.push({
        id: ++categoryId,
        name: categoryName,
        icon: categoryIcon,
      });
      list.innerHTML = "";
      chosenCategory = categories[categoryId - 1];
      renderCategory();
      eventListener();
    }
  }

  /**
   * Gets the task from the user and create list of task to the user
   */
  function addTask(event) {
    if (event.key == "Enter" || event.type == "click") {
      if (newTask.value && newTask.value.trim() !== "") {
        let taskId = tasks.length;
        let taskName = newTask.value;
        let selectedCategoryId = chosenCategory.id;
        let importantStatus;
        if (chosenCategory.id == categories[1].id) {
          importantStatus = true;
        } else {
          importantStatus = false;
        }
        tasks.push({
          id: "task_" + ++taskId,
          name: taskName,
          categoryId: selectedCategoryId,
          note: "",
          isImportant: importantStatus,
          isCompleted: false,
        });
        newTask.value = "";
        taskContainer.innerHTML = "";
        renderTaskForCategory();
      }
    }
  }

  function renderTaskForCategory() {
    switch (chosenCategory.id) {
      case 1:
        renderSelectedTasks();
        break;

      case 2:
        renderImportantTasks();
        break;

      case 5:
        renderAllTasks();
        break;

      default:
        renderSelectedTasks();
        break;
    }
  }

  function renderSelectedTasks() {
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].categoryId == chosenCategory.id) {
        renderTask(index);
      }
    }
    // highlightTask();
    eventListener();
  }

  function renderImportantTasks() {
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].isImportant) {
        renderTask(index);
      }
    }
    highlightTask();
    eventListener();
  }

  function renderAllTasks() {
    for (let index = 0; index < tasks.length; index++) {
      renderTask(index);
    }
    highlightTask();
    eventListener();
  }

  /**
   * Get all the tasks for a specific category
   */
  function renderTask(index) {
    let container = createElement("div", {
      className: "create-task",
      id: tasks[index].id,
    });
    let importantContainer = createElement("div", {
      className: "important-icon",
      id: tasks[index].id,
    });
    let textContainer = createElement("div", {
      className: "added-task",
      id: tasks[index].id,
    });
    let completeIcon = createElement("div", {
      className: "complete-icon",
      id: tasks[index].id,
    });
    let text = createElement("p", { className: undefined });
    let task = document.createTextNode(tasks[index].name);
    text.appendChild(task);
    textContainer.appendChild(text);
    textContainer.classList.add(checkTaskStatus(tasks[index].isCompleted));
    completeIcon.innerHTML = checkTaskCompletedStatus(tasks[index].isCompleted);
    container.appendChild(completeIcon);
    importantContainer.innerHTML = checkTaskImportantStatus(
      tasks[index].isImportant
    );
    container.appendChild(textContainer);
    container.appendChild(importantContainer);
    if (tasks[index].isCompleted) {
      completedTaskContainer.appendChild(container);
    } else {
      taskContainer.appendChild(container);
      taskContainer.insertBefore(container, taskContainer.children[0]);
    }
  }

  function checkTaskCompletedStatus(isCompleted) {
    if (isCompleted) {
      return '<i class="fa-regular fa-circle-check"></i>';
    } else {
      return '<i class="fa-regular fa-circle"></i>';
    }
  }

  function checkTaskImportantStatus(isImportant) {
    if (isImportant) {
      return '<i class="fa-solid fa-star"></i>';
    } else {
      return '<i class="fa-regular fa-star"></i>';
    }
  }

  function checkTaskStatus(taskStatus) {
    if (taskStatus) {
      return "completed-task";
    }
  }

  /**
   * Create a element
   * Its gets the tag name as a parameter
   * @param name - tag name of the element
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
    if (event === null) {
      let index = chosenCategory.id;
      mainContainer.innerHTML = chosenCategory.name;
      let icon = createElement("i", { className: chosenCategory.icon });
      mainContainerIcon.innerHTML = "";
      mainContainerIcon.appendChild(icon);
      document.title = chosenCategory.name;
      taskContainer.innerHTML = "";
      selectedCategory[--index].classList.add("selected-menu");
      renderTaskForCategory();
      exitTaskMenu();
    } else {
      removeHighlightCategory();
      for (let index = 0; index < categories.length; index++) {
        if (event.target.id == categories[index].id) {
          selectedCategory[index].classList.add("selected-menu");
          mainContainer.innerHTML = categories[index].name;
          let icon = createElement("i", { className: categories[index].icon });
          mainContainerIcon.innerHTML = "";
          mainContainerIcon.appendChild(icon);
          document.title = categories[index].name;
          chosenCategory = categories[index];
          taskContainer.innerHTML = "";
          renderTaskForCategory();
          eventListener();
          exitTaskMenu();
        }
      }
    }
  }

  function removeHighlightCategory() {
    for (let index = 0; index < categories.length; index++) {
      selectedCategory[index].classList.remove("selected-menu");
    }
  }

  /**
   * When the user clicks on a task, the task menu will appear and the task title will be set to the title of the task menu
   * @param event - the event that triggered the function
   */
  function displayTaskMenu(event) {
    resizeMainContainer();
    removeHighlightTask();
    taskTitleHeader.innerHTML = "";
    renderNote(event);
    highlightTask();
  }

  function renderNote(event) {
    for (let index = 0; index < tasks.length; index++) {
      if (event.currentTarget.id == tasks[index].id) {
        chosenTask = tasks[index];
        let completeIconContainer = createElement("div", {
          id: tasks[index].id,
        });
        completeIconContainer.innerHTML = checkTaskCompletedStatus(
          tasks[index].isCompleted
        );
        let importantIconContainer = createElement("div", {
          id: tasks[index].id,
        });
        importantIconContainer.innerHTML = checkTaskImportantStatus(
          tasks[index].isImportant
        );
        let taskInput = document.createElement("input", {
          className: "display-task-title",
          id: "display-task-title",
        });
        taskInput.type = "text";
        taskInput.value = chosenTask.name;
        taskInput.classList.add(checkTaskStatus(tasks[index].isCompleted));
        taskTitleHeader.appendChild(completeIconContainer);
        taskTitleHeader.appendChild(taskInput);
        taskTitleHeader.appendChild(importantIconContainer);
        note.value = chosenTask.note;
      }
    }
    eventListener();
  }

  function highlightTask() {
    if (chosenTask != null) {
      for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].id == chosenTask["id"]) {
          selectedTask[index].parentElement.classList.add("selected-task");
        }
      }
    }
  }

  function removeHighlightTask() {
    for (let index = 0; index < tasks.length; index++) {
      selectedTask[index].classList.remove("selected-task");
    }
  }

  /**
   * Add the note to the task.
   * @param event - The event object.
   */
  function addNote(event) {
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].id == chosenTask.id) {
        if (note.value && note.value.trim() !== "") {
          tasks[index].note = note.value;
        }
      }
    }
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

  function markImportant(event) {
    for (let index = 0; index < tasks.length; index++) {
      if (event.currentTarget.id == tasks[index].id) {
        chosenTask = tasks[index];
        if (chosenTask.isImportant == false) {
          tasks[index].isImportant = true;
        } else {
          tasks[index].isImportant = false;
        }
      }
    }
    taskContainer.innerHTML = "";
    renderTaskForCategory();
    taskTitleHeader.innerHTML = "";
    renderNote(event);
    eventListener();
  }

  function completeTask(event) {
    for (let index = 0; index < tasks.length; index++) {
      if (event.currentTarget.id == tasks[index].id) {
        chosenTask = tasks[index];
        if (chosenTask.isCompleted == false) {
          tasks[index].isCompleted = true;
        } else {
          tasks[index].isCompleted = false;
        }
      }
    }
    taskContainer.innerHTML = "";
    renderTaskForCategory();
    taskTitleHeader.innerHTML = "";
    renderNote(event);
    eventListener();
  }

  init();
})();
