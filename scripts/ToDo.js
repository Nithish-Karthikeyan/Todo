currentDate();

function currentDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = days[currentDate.getDay()];
    let date = currentDate.getDate();
    document.getElementById("date").innerHTML = day + ", " + month +" "+date;
}

function getTask() {
  var input = document.getElementById("add-new-task");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      console.log(event);
      var listNode = document.createElement("li");
      var textContainer = document.createElement("span")
      var text = document.createTextNode(input.value);
      listNode.innerHTML= '<i class="fa-solid fa-list-ul"></i>';
      if(input.value) {
        textContainer.appendChild(text);
      } else {
        text.textContent = "Untitled Task";
        textContainer.appendChild(text);
      }  
      listNode.appendChild(textContainer);
      var list = document.getElementById("task-list");
      list.appendChild(listNode);
      list.insertBefore(listNode, list.children[6]);
      input.value = '';

      document.getElementById("task-title").innerHTML = text.textContent;
    }
  });
}

function task() {
  document.getElementById("task-title").innerHTML = 'Task'
  document.getElementById("main-title-icon").innerHTML='<i class="fa-solid fa-house"></i>'
}