const socket = io("/login");

$(".login-btn").click(function(){
    if($(".username").val() !== "") { 
        socket.emit("login", $(".username").val());
        localStorage.setItem("username", $(".username").val());
    }
});

socket.on("notexist", msg => {
    $(".msg").text(msg)
});

socket.on("redirect", path => {
    location.href = path
});