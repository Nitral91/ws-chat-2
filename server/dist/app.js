"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv = __importStar(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv.config();
const auth_1 = __importDefault(require("./routes/auth"));
const messages_1 = __importDefault(require("./routes/messages"));
const db_1 = __importDefault(require("./db"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
const httpServer = http_1.default.createServer(app);
app.use('/api/auth', auth_1.default);
app.use('/api/messages', messages_1.default);
const io = new socket_io_1.Server(httpServer, { cors: { origin: "*" } });
let userList = [];
io.on('connection', (socket) => {
    const USER_NAME = socket.handshake.query.userName;
    socket.join('our-room');
    socket.on('join', () => {
        addUser(USER_NAME);
        socket.emit('user-list', getOnlineUsers());
    });
    // socket.emit('user-list', getOnlineUsers());
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.to('our-room').emit('user-list', removeUser(USER_NAME));
        console.log('user disconnected: ', getOnlineUsers());
    });
    socket.on('user-list', () => {
        socket.to('our-room').emit('user-list', getOnlineUsers());
    });
    socket.on('message', ({ text, author }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield saveMessage(author, text);
            socket.to('our-room').emit('message-broadcast', {
                text,
                author
            });
        }
        catch (e) {
            socket.to('our-room').emit('error', {
                message: 'Something went wrong. Message was not sent'
            });
        }
    }));
});
const addUser = (userName) => {
    userList.push(userName);
};
const removeUser = (userName) => {
    const indexToRemove = userList.indexOf(userName);
    console.log('userList: ', userList);
    console.log('indexToRemove: ', indexToRemove);
    if (indexToRemove !== -1) {
        userList.splice(indexToRemove, 1);
    }
    return userList;
};
const getOnlineUsers = () => {
    console.log('getOnlineUsers: ', userList);
    return userList;
};
const saveMessage = (userName, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        db_1.default.get('SELECT id FROM users WHERE username = ?', [userName], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }
            if (row) {
                const userId = row.id;
                // Insert message into the messages table
                db_1.default.run('INSERT INTO messages (text, time, author) VALUES (?, datetime("now", "localtime"), ?)', [message, userId], (err) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log('Message saved successfully');
                });
            }
            else {
                console.log('User not found');
            }
        });
    }
    catch (error) {
        console.error(error);
    }
});
app.use('', (req, res) => {
    console.log('req: ', req.url);
});
httpServer.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});
