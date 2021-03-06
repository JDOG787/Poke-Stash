const app = require("express")();
const http = require("http").createServer(app);
const sio = require("socket.io")(http);
const signup_io = sio.of("/signup");
const login_io = sio.of("/login");
const io = sio.of("/pokemons");
const fs = require("fs");

const accounts = JSON.parse(fs.readFileSync("data.json", "utf8"))

app.use(require("express").static(__dirname + "/public"));

app
    .get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"))
    .get("/uses", (req, res) => res.sendFile(__dirname + "/views/uses.html"))
    .get("/start", (req, res) => res.sendFile(__dirname + "/views/start.html"))
    .get("/signup", (req, res) => res.sendFile(__dirname + "/views/signup.html"))
    .get("/pokemons", (req, res) => res.sendFile(__dirname + "/views/pokemons.html"))
    .get("/login", (req, res) => res.sendFile(__dirname + "/views/login.html"))
;    

http.listen(process.env.PORT || 8080)



// TRACKER
io.on("connection", socket => {
    socket.on("add", data => {
        let idnum = Math.floor(Math.random() * 10000);
        accounts[data.user].cards.unshift({
            name: data.name,
            health: data.health,
            damage: data.damage,
            id: idnum
        });
        fs.writeFileSync("data.json", JSON.stringify(accounts));
        socket.emit("listagain", accounts[data.user].cards, "Card Added!");
    });

    socket.on("list", user => {
        socket.emit("list", accounts[user].cards);
    });

    socket.on("search", (val, user) => {
        let arr = [];
        accounts[user].cards.forEach((ele) => {
            if(ele.name === val){
                arr.push(ele)
            }
        });
        if(arr[0] !== undefined){
            socket.emit("found", arr);
        } else {
            socket.emit("notfound");
        }  

    });

    socket.on("delete", (id, user) => {
        for (let i = 0; i < accounts[user].cards.length; i++) {
            if (accounts[user].cards[i].id == id) {
                accounts[user].cards.splice(i, 1);
                break;
            }
        }
        fs.writeFileSync("data.json", JSON.stringify(accounts));
        socket.emit("list", accounts[user].cards);
        socket.emit("deleted", "Card Deleted!");
    });
});


// SIGN UP
signup_io.on("connection", socket => {
    socket.on("create", data => {
        if(!accounts[data]){
            accounts[data] = {};
            accounts[data].cards = [];
            fs.writeFileSync("data.json", JSON.stringify(accounts));
            socket.emit("redirect", "/");
        } else {
            socket.emit("exists", "This Username Is Already In Use!")
        }
    });
});

// LOGIN 
login_io.on("connection", socket => {
    socket.on("login", data => {
        if(accounts[data]){
            socket.emit("redirect", "/");
        } else {
            socket.emit("notexist", "This account doesnt exist!")
        }
    });
})