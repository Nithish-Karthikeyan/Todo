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
  const task = document.getElementById("task");
  const manageTask = document.getElementById("manage-task");
  const createTask = document.getElementById("create-task");
  const AddedTask = document.getElementById("added-task");

  const taskTitle = document.getElementById("display-task-title");

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
      selectCategory(null);
    }
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
    if (event.key == "Enter") {
      if (newTask.value && newTask.value.trim() !== "") {
        let taskId = tasks.length;
        let taskName = newTask.value;
        let selectedCategoryId = chosenCategory.id;
        tasks.push({
          id: ++taskId,
          name: taskName,
          categoryId: selectedCategoryId,
          note: "",
        });
        newTask.value = "";
        taskContainer.innerHTML = "";
        renderTask();
        eventListener();
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
        let importantStatus = createElement("div");
        let textContainer = createElement("p");
        textContainer.setAttribute("class", "added-task");
        container.setAttribute("id", tasks[index].id);
        let task = document.createTextNode(tasks[index].name);
        textContainer.appendChild(task);
        container.innerHTML = '<i class="fa-regular fa-circle"></i>';
        importantStatus.innerHTML = '<i class="fa-regular fa-star"></i>';
        container.appendChild(textContainer);
        container.className = "create-task";
        container.appendChild(importantStatus);
        taskContainer.appendChild(container);
        taskContainer.insertBefore(container, taskContainer.children[0]);
      }
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
   * Listen to the event to be happen for the required element
   */
  function eventListener() {
    newTask.addEventListener("keypress", addTask);
    newCategory.addEventListener("keypress", addCategory);
    note.addEventListener("input", addNote);
    exitTask.addEventListener("click", exitTaskMenu);

    for (index = 0; index < categories.length; index++) {
      selectedCategory[index].addEventListener("click", selectCategory);
    }

    for (let index = 0; index < tasks.length; index++) {
      selectedTask[index].addEventListener("click", displayTaskMenu);
    }
  }

  /**
   * It loops through the category array, and if the id of the clicked element matches the id of the
   * current category, it sets the mainContainer's title to the name of the category, the
   * mainContainer Icon to the icon of the category, the document's title will be changed to the name of the
   * category
   * @param event - the event that triggered the function
   */
  function selectCategory(event) {
    if (event == null) {
      mainContainer.innerHTML = chosenCategory.name;
      mainContainerIcon.innerHTML = chosenCategory.icon;
      document.title = chosenCategory.name;
      taskContainer.innerHTML = "";
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
    for (let index = 0; index < tasks.length; index++) {
      if (event.target.id == tasks[index].id) {
        console.log("1");
        taskTitle.value = tasks[index].name;
        chosenTask = tasks[index];
        note.value = "";
        note.value = chosenTask.note;
      }
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

  init();
})();
