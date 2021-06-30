import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { isObject } from 'util';
import crypto from "crypto";
const randomId = () => crypto.randomBytes(8).toString("hex");

import InMemorySessionStore  from "./sessionStore.js";
const sessionStore = new InMemorySessionStore();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200"
    }
});

io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    console.log(sessionID);
    if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.userID = session.userID;
            socket.username = session.username;
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }

    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>crypto chat</h1>');
});



io.on('connection', (socket) => {

    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
    });

    console.log('a user connected ');

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    socket.join(socket.userID);

    const users = [];
    sessionStore.findAllSessions().forEach((session) => {
        users.push({
            userID: session.userID,
            username: session.username,
            connected: session.connected,
        });
    });
    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
    });

    socket.on("private message", ({ content, to }) => {
        console.log("msg: ", content, " to: ", to, " from: ", socket.userID);
        socket.to(to).to(socket.userID).emit("private message", {
            content,
            from: socket.userID,
            to,
        });
    });

    socket.on("ping", ({ key, to }) => {
        console.log(" to: ", to, " from: ", socket.userID);
        socket.to(to).to(socket.userID).emit("ping", {
            key,
            from: socket.userID,
            to,
        });
    });

    socket.on("pong", ({key, to }) => {
        console.log(" to: ", to, " from: ", socket.userID);
        socket.to(to).to(socket.userID).emit("pong", {
            key,
            from: socket.userID,
            to,
        });
    });

    socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", socket.userID);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionID, {
                userID: socket.userID,
                username: socket.username,
                connected: false,
            });
        }
    });

});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
