(function () {
  const categories = [
    {
      id: 1,
      name: "My Day",
      icon: '<i class="fa-regular fa-sun"></i>',
    },
    {
      id: 2,
      name: "Important",
      icon: '<i class="fa-regular fa-star"></i>',
    },
    {
      id: 3,
      name: "Planned",
      icon: '<i class="fa-regular fa-calendar"></i>',
    },
    {
      id: 4,
      name: "Assigned To Me",
      icon: '<i class="fa-regular fa-user"></i>',
    },
    {
      id: 5,
      name: "Tasks",
      icon: '<i class="fa-solid fa-house"></i>',
    },
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
  let selectedTask = document.getElementsByClassName("create-task");
  let note = document.getElementById("task-note");
  const exitTask = document.getElementById("exit-task-setting-icon");
  const taskMenu = document.getElementById("right-container");

  const middleContainer = document.getElementById("main-container");
  const taskTitle = document.getElementById("display-task-title");
  const addButton = document.getElementById("hide-add-button");
  let importantStatus = document.getElementsByClassName("important-icon");
  let completeStatus = document.getElementsByClassName("complete-icon");
  let taskCompleteStatus = document.getElementById("checkbox");
  let taskImportantStatus = document.getElementById("important-status-icon");
  let chosenCategory = categories[0];
  let chosenTask;

  function init() {
    displayDate();
    renderCategory();
    eventListener();
    renderTask();
  }

  /**
   * Get the category from the category array and creates a list item for each category.
   */
  function renderCategory() {
    for (let i = 0; i < categories.length; i++) {
      let listContainer = createElement("li");
      listContainer.setAttribute("class", "side-navigation-menu");
      listContainer.setAttribute("id", categories[i].id);
      let iconContainer = createElement("div");
      iconContainer.className = "side-navigation-menu-icon";
      let categoryContainer = createElement("div");
      iconContainer.innerHTML = categories[i].icon;
      categoryContainer.innerHTML = categories[i].name;
      listContainer.appendChild(iconContainer);
      listContainer.appendChild(categoryContainer);
      list.appendChild(listContainer);
      list.insertBefore(listContainer, list.children[i]);
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

    for (index = 0; index < categories.length; index++) {
      selectedCategory[index].addEventListener("click", selectCategory);
    }

    for (let index = 0; index < tasks.length; index++) {
      selectedTask[index].addEventListener("click", displayTaskMenu);
    }

    for (let index = 0; index < tasks.length; index++) {
      importantStatus[index].addEventListener("click", markImportant);
    }

    for (let index = 0; index < tasks.length; index++) {
      completeStatus[index].addEventListener("click", completeTask);
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
      let categoryIcon = '<i class="fa-solid fa-list-ul"></i>';
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
        renderTask();
      }
    }
  }

  /**
   * Get all the tasks for a specific category
   */
  function renderTask() {
    for (index = 0; index < tasks.length; index++) {
      if (tasks[index].categoryId == chosenCategory.id) {
        let container = createElement("div");
        let importantContainer = createElement("div");
        let textContainer = createElement("div");
        let completeIcon = createElement("div");
        let text = createElement("p");
        textContainer.setAttribute("class", "added-task");
        completeIcon.setAttribute("id", tasks[index].id);
        container.setAttribute("id", tasks[index].id);
        textContainer.setAttribute("id", tasks[index].id);
        completeIcon.setAttribute("class", "complete-icon");
        let task = document.createTextNode(tasks[index].name);
        text.appendChild(task);
        textContainer.appendChild(text);
        completeIcon.innerHTML = validateTaskCompleted(
          tasks[index].isCompleted
        );
        container.appendChild(completeIcon);
        importantContainer.className = "important-icon";
        importantContainer.setAttribute("id", tasks[index].id);
        importantContainer.innerHTML = validateTaskImportant(
          tasks[index].isImportant
        );
        container.appendChild(textContainer);
        container.className = "create-task";
        container.appendChild(importantContainer);
        taskContainer.appendChild(container);
        taskContainer.insertBefore(container, taskContainer.children[0]);
      }
    }
    highlightTask();
    eventListener();
  }

  function validateTaskCompleted(isCompleted) {
    if (isCompleted) {
      return '<i class="fa-regular fa-circle-check"></i>';
    } else {
      return '<i class="fa-regular fa-circle"></i>';
    }
  }

  function validateTaskImportant(isImportant) {
    if (isImportant) {
      return '<i class="fa-solid fa-star"></i>';
    } else {
      return '<i class="fa-regular fa-star"></i>';
    }
  }

  /**
   * Create a element
   * Its gets the tag name as a parameter
   * @param name - tag name of the element
   * @returns element
   */
  function createElement(name) {
    return document.createElement(name);
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
      mainContainerIcon.innerHTML = chosenCategory.icon;
      document.title = chosenCategory.name;
      taskContainer.innerHTML = "";
      selectedCategory[--index].classList.add("selected-menu");
      renderTask();
    } else {
      for (let index = 0; index < categories.length; index++) {
        selectedCategory[index].classList.remove("selected-menu");
        if (event.target.id == categories[index].id) {
          selectedCategory[index].classList.add("selected-menu");
          mainContainer.innerHTML = categories[index].name;
          mainContainerIcon.innerHTML = categories[index].icon;
          document.title = categories[index].name;
          chosenCategory = categories[index];
          taskContainer.innerHTML = "";
          renderTask();
          eventListener();
        }
      }
    }
  }

  /**
   * When the user clicks on a task, the task menu will appear and the task title will be set to the title of the task menu
   * @param event - the event that triggered the function
   */
  function displayTaskMenu(event) {
    resizeMainContainer();
    removeHighlightTask();
    renderNote(event);
    highlightTask();
  }

  function renderNote(event) {
    for (let index = 0; index < tasks.length; index++) {
      if (event.currentTarget.id == tasks[index].id) {
        chosenTask = tasks[index];
        taskTitle.value = tasks[index].name;
        taskCompleteStatus.innerHTML = validateTaskCompleted(
          tasks[index].isCompleted
        );
        taskImportantStatus.innerHTML = validateTaskImportant(
          tasks[index].isImportant
        );
        note.value = chosenTask.note;
      }
    }
  }

  function highlightTask() {
    if (chosenTask != null) {
      for (let index = 0; index < tasks.length; index++) {
        if (tasks[index].id == chosenTask["id"]) {
          let highlightTask = document.getElementById(chosenTask.id);
          highlightTask.classList.add("selected-task");
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
    if (note.value && note.value.trim() !== "") {
      let taskId = chosenTask.id;
      tasks[--taskId].note = note.value;
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
      console.log(event.target.id);
      console.log(event.currentTarget.id);
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
    renderTask();
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
    renderTask();
    renderNote(event);
    eventListener();
  }

  init();
})();
