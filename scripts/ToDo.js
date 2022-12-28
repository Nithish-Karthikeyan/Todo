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

var input = document.getElementById("add-new-task");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log(event);
    var node = document.createElement("li");
    var textContainer = document.createElement("span")
    var task = document.getElementById("add-new-task");
    var text = document.createTextNode(task.value);
    node.innerHTML= '<i class="fa-solid fa-list-ul"></i>';
    textContainer.appendChild(text);
    node.appendChild(textContainer);
    document.getElementById("task-list").appendChild(node);
    var list = document.getElementById("task-list");
    list.insertBefore(node, list.children[0]);
    task.value = '';
  }
});
