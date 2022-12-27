function currentDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = days[currentDate.getDay()];
    let date = currentDate.getDate();
    document.getElementById("date").innerHTML = day + ", " + month +" "+date;
}