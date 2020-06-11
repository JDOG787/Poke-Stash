const socket = io("/pokemons");

if (!localStorage.getItem("username")) location.href = "/signup";

$(".add").click(function(){
    $(".popup").show(400);
});

$(".close").click(function(){
    reset();
});



// ADD CARD
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

// SEARCH CARD
$(".search").keypress(e => {
    if(e.which === 13){
        if($(".search").val() !== ""){ 
            socket.emit("search", $(".search").val(), localStorage.getItem("username"));
            $(".search").val("");
            $(".cards").hide();
        } else {
            $(".cards").hide();
            $(".search-msg").hide();
            socket.emit("list", localStorage.getItem("username"));
        }  
    }  
})



// LIST CARDS
socket.emit("list", localStorage.getItem("username"));

socket.on("list", data => {
    list(data);
});

socket.on("listagain", (data, msg) => {
    list(data);
    $(".popup-msg").text(msg);
    $(".added-popup").show(400);
    setTimeout(close, 3000);
    reset();
});


// SEARCH
socket.on("found", data => {
    list(data);
});

socket.on("notfound", () => {
    $(".search-msg").fadeIn(50);
});


// DELETE
socket.on("deleted", msg => {
    $(".popup-msg").text(msg);
    $(".added-popup").show(400);
    setTimeout(close, 3000);
});

// FUNCTIONS
function reset() {
    $(".popup").hide(400);
    $(".name").val("");
    $(".health").val("");
    $(".damage").val("");
}

function close() {
    $(".added-popup").hide(400);
}

function list(data) {
    $(".card-container").html("");
    data.forEach(element => {
        $(".card-container").append(
            $("<div>").addClass("cards")
            .append(
                $("<h6>").addClass("header2").html(element.name),
                $("<p>").addClass("space").html("Health: "+element.health),
                $("<p>").html("Max Damage: "+element.damage),
                $("<button>").addClass("delete").attr("id", element.id)
                    .append(
                        $("<i>").addClass("material-icons").html("delete_forever")
                    )
                .click(() => {
                    socket.emit("delete", element.id, localStorage.getItem("username"));
                })
            )
        )
        // container.innerHTML +=
        // '<div class="cards">' +
        // "<h6 class='header2'>" + element.name + "</h6>" +
        // "<p class='space'>" + "Health: " + element.health + "</p>" +
        // "<p>" + "Max Damage: " + element.damage + "</p>" +
        // '<button class="delete" id="' + element.id + '">' +
        // ' <i class="material-icons">delete_forever</i>' + "</button>" + "</div>";
        // press();
    });
}