const socket = io("/pokemons");

if (!localStorage.getItem("username")) location.href = "/signup";

$(".add").click(function(){
    $(".popup").show(400);
});

$(".close").click(function(){
    reset();
});

$(".close2").click(function(){
    $(".added-popup").hide(400);
});

$(".add-card").click(() => {
    if($(".name").val() !== "" && $(".health").val() !== "" && $(".damage").val() !== ""){ 
        socket.emit("add", {
            user: localStorage.getItem("username"),
            name: $(".name").val(),
            health: $(".health").val(),
            damage: $(".damage").val()
        });
    }    
});

$(".search").keypress(e => {
    if(e.which === 13){
        if($(".search").val() !== ""){ 
            socket.emit("search", $(".search").val(), localStorage.getItem("username"));
            $(".cards").hide();
        } else {
            $(".cards").hide();
            $(".search-msg").hide();
            socket.emit("list", localStorage.getItem("username"));
        }  
    }  
})

$(".delete").click(function() {
    $(".popup").show(400);
});

socket.emit("list", localStorage.getItem("username"));

socket.on("list", data => {
    data.forEach(element => {
        let container = document.querySelector(".card-container");

        container.innerHTML += '<div class="cards">' + "<h6 class='header2'>" + element.name + "</h6>" + "<p class='space'>" + "Health: " + element.health + "</p>" + "<p>" + "Max Damage: " + element.damage + "</p>" + '<button class="delete">' + ' <i class="material-icons">delete_forever</i>' + "</button>" + "</div>"
    });
});

socket.on("listagain", data => {
    let container = document.querySelector(".card-container");

    container.innerHTML = '<div class="cards">' + "<h6 class='header2'>" + data.name + "</h6>" + "<p class='space'>" + "Health: " + data.health + "</p>" + "<p>" + "Max Damage: " + data.damage + "</p>" + '<button class="delete">' + ' <i class="material-icons">delete_forever</i>' + "</button>" + "</div>" + container.innerHTML
    $(".added-popup").show(400);
    reset();
});

socket.on("found", data => {
    data.forEach(element => {
        let container = document.querySelector(".card-container");

        container.innerHTML += '<div class="cards">' + "<h6 class='header2'>" + element.name + "</h6>" + "<p class='space'>" + "Health: " + element.health + "</p>" + "<p>" + "Max Damage: " + element.damage + "</p>" + '<button class="delete">' + ' <i class="material-icons">delete_forever</i>' + "</button>" + "</div>"
    });
});

socket.on("notfound", () => {
    $(".search-msg").fadeIn(50);
});

function reset() {
    $(".popup").hide(400);
    $(".name").val("");
    $(".health").val("");
    $(".damage").val("");
}