const socket = io("/signup");

$(".signup-btn").click(function() {
    if($(".username").val() !== "") { 
        socket.emit("create", $(".username").val());
        localStorage.setItem("username", $(".username").val());
    }    
});

socket.on("exists", msg => {
    $(".msg").text(msg)
});

socket.on("redirect", path => {
    location.href = path
});