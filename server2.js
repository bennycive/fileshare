const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("sender-join", function (data) {
        socket.join(data.uid);
    });

    socket.on("receiver-join", function (data) {
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });

    socket.on("file-meta", function (data) {
        socket.in(data.uid).emit("fs-share", {}); // Notify the receiver to start file sharing
    });

    socket.on("disconnect", function () {
        // Handle disconnection if needed
    });
});

app.set("view engine", "ejs");

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`File Share Server Running On: ${PORT}`);
});
