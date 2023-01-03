(function() {

  category = [
    {
      id: 'category1',
      name :'My Day', 
      icon:'<i class="fa-regular fa-sun"></i>'
    }, 
    {
      id: 'category2',
      name:'Important', 
      icon:'<i class="fa-regular fa-star"></i>'
    }, 
    {
      id: 'category3',
      name:'Planned', 
      icon:'<i class="fa-regular fa-calendar"></i>'
    }, 
    {
      id: 'category4',
      name:'Assigned To Me', 
      icon:'<i class="fa-regular fa-user"></i>'
    }, 
    {
      id: 'category5',
      name:'Tasks', 
      icon:'<i class="fa-solid fa-house"></i>'
    }
  ]

  var tasks = [];                

  function init() {
    currentDate();
    getCategory();
    addTask();
    addTaskCollection();
    selectCategory(id);
}

/**
 * Get the category from the category array and creates a list item for each category.
 */
function getCategory() {
  for (var i=0; i < category.length; i++) {
    var listContainer = createElement("li");
    listContainer.setAttribute("class","side-navigation-menu");
    listContainer.setAttribute("id",category[i].id);
    listContainer.setAttribute("onclick","selectCategory(this.id)");
    var iconContainer = createElement("div");
    iconContainer.className  = 'side-navigation-menu-icon';
    var categoryContainer = createElement("div");
    iconContainer.innerHTML = category[i].icon;
    categoryContainer.innerHTML = category[i].name;
    listContainer.appendChild(iconContainer);
    listContainer.appendChild(categoryContainer);
    var list =  getElementById("task-list");
    list.appendChild(listContainer);
    list.insertBefore(listContainer, list.children[i]);
  }
}

/**
 * Gets the current date and displays it in the format of "Day, Month Date"
 */
function currentDate() {
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var currentDate = new Date();
  var month = months[currentDate.getMonth()];
  var day = days[currentDate.getDay()];
  var date = currentDate.getDate();
  document.getElementById("date").innerHTML = day + ", " + month +" "+date;
}

/**
 * Creates a task collection to the user where the user can add specific tasks 
 */
function addTaskCollection() {
  var input = getElementById("add-new-task-collection");  
  input.addEventListener("keypress", function(event) {

  if (event.key === "Enter") {
    var listNode = createElement("li");
    var textContainer = createElement("span")
    var text = document.createTextNode(input.value);
    listNode.innerHTML= '<i class="fa-solid fa-list-ul"></i>';

    if(input.value && text.textContent.trim() != "" ) {
      textContainer.appendChild(text);
    } else {
      text.textContent = "Untitled Task";
      textContainer.appendChild(text);
    }  
    listNode.appendChild(textContainer);
    var list = getElementById("task-list");
    list.appendChild(listNode);
    list.insertBefore(listNode, list.children[6]);
    input.value = '';
  }
});
}


/**
 * Gets the task from the user and create list of task to the user
 */
function addTask() {
  var input = getElementById("add-new-task");
  input.addEventListener("keypress", function(event) {

  if (event.key === "Enter") {
    console.log(input.textContent);
    var container = createElement("div");
    var importantStatus = createElement("div");
    var textContainer = createElement("p");
    var task = document.createTextNode(input.value);
    
    if(input.value && task.textContent.trim() != "" ) {
      container.innerHTML = '<i class="fa-regular fa-circle"></i>';
      importantStatus.innerHTML = '<i class="fa-regular fa-star"></i>';
      textContainer.appendChild(task);
      tasks.push(task.textContent);
      container.appendChild(textContainer);
      container.className = 'create-task';
      container.appendChild(importantStatus);
      var taskContainer = document.getElementById("task-container");
      taskContainer.appendChild(container);
      taskContainer.insertBefore(container, taskContainer.children[0]);
      input.value = '';
      }
    }
  });
  console.log(tasks);
}


/**
 * Gets the element by using their Id
 * If the element does not exist it returns null
 * @param id - id of the element 
 * @returns element 
 */
function getElementById(id) {
    return document.getElementById(id);
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

init();
})();

function selectCategory(id) {
  var selectCategory = document.getElementById(id);
  for (var i=0; i < category.length; i++) {
    if(selectCategory.id == category[i].id) {
      var mainContainer = document.getElementById("task-title");
      mainContainer.innerHTML = category[i].name;
      var mainContainerIcon = document.getElementById("main-title-icon");
      mainContainerIcon.innerHTML = category[i].icon;
      document.title = category[i].name;
    }
  } 
}