if(!localStorage.getItem("username")){
    $(".logout").hide();
} else {
    $(".signup").hide();
}

$(".logout").click(function() {
    localStorage.clear();
    location.reload();
});