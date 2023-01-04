(function () {
  const category = [
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
  let chosenCategory = category[0];

  function init() {
    displayDate();
    getCategory();
    eventListener();
    renderTask();
  }

  /**
   * Get the category from the category array and creates a list item for each category.
   */
  function getCategory() {
    for (let i = 0; i < category.length; i++) {
      let listContainer = createElement("li");
      listContainer.setAttribute("class", "side-navigation-menu");
      listContainer.setAttribute("id", category[i].id);
      let iconContainer = createElement("div");
      iconContainer.className = "side-navigation-menu-icon";
      let categoryContainer = createElement("div");
      iconContainer.innerHTML = category[i].icon;
      categoryContainer.innerHTML = category[i].name;
      listContainer.appendChild(iconContainer);
      listContainer.appendChild(categoryContainer);
      list.appendChild(listContainer);
      list.insertBefore(listContainer, list.children[i]);
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
      let categoryId = category.length;
      let categoryIcon = '<i class="fa-solid fa-list-ul"></i>';
      newCategory.value = "";
      category.push({
        id: ++categoryId,
        name: categoryName,
        icon: categoryIcon,
      });
      list.innerHTML = "";
      getCategory();
      chosenCategory = category[categoryId - 1];
      selectCategory(null);
      eventListener();
    }
  }

  /**
   * Gets the task from the user and create list of task to the user
   */
  function addTask(event) {
    if (event.key == "Enter") {
      let container = createElement("div");
      let importantStatus = createElement("div");
      let textContainer = createElement("p");
      let task = document.createTextNode(newTask.value);

      if (newTask.value && task.textContent.trim() != "") {
        container.innerHTML = '<i class="fa-regular fa-circle"></i>';
        importantStatus.innerHTML = '<i class="fa-regular fa-star"></i>';
        textContainer.appendChild(task);
        let taskId = tasks.length;
        let taskName = task.textContent;
        let selectedCategoryId = chosenCategory.id;
        tasks.push({
          id: taskId,
          name: taskName,
          categoryId: selectedCategoryId,
        });
        container.appendChild(textContainer);
        container.className = "create-task";
        container.appendChild(importantStatus);
        taskContainer.appendChild(container);
        taskContainer.insertBefore(container, taskContainer.children[0]);
        newTask.value = "";
      }
    }
  }

  /**
   * Get all the tasks for a specific category
   */
  function renderTask() {
    for (i = 0; i < tasks.length; i++) {
      if (tasks[i].categoryId == chosenCategory.id) {
        let container = createElement("div");
        let importantStatus = createElement("div");
        let textContainer = createElement("p");
        let task = document.createTextNode(tasks[i].name);
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

    for (i = 0; i < category.length; i++) {
      console.log(selectedCategory[i]);
      selectedCategory[i].addEventListener("click", selectCategory);
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
      renderTask();
    } else {
      for (let i = 0; i < category.length; i++) {
        if (event.target.id == category[i].id) {
          console.log(category[i]);
          mainContainer.innerHTML = category[i].name;
          mainContainerIcon.innerHTML = category[i].icon;
          document.title = category[i].name;
          chosenCategory = category[i];
          taskContainer.innerHTML = "";
          renderTask();
        }
      }
    }
  }

  init();
})();
