import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';

dotenv.config();

import authRoutes from './routes/auth';
import messagesRoutes from './routes/messages';
import {User} from "./interfaces/user.inerface";
import db from "./db";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const httpServer = http.createServer(app);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

const io = new Server(httpServer, { cors: { origin: "*" } });

let userList: string[] = [];

io.on('connection', (socket: Socket) => {
    const USER_NAME = socket.handshake.query.userName! as string;
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
    })

    socket.on('message', async ({ text, author }: {
        text: string;
        author: string;
    }) => {
        try {
            await saveMessage(author, text);

            socket.to('our-room').emit('message-broadcast', {
                text,
                author
            })
        } catch (e) {
            socket.to('our-room').emit('error', {
                message: 'Something went wrong. Message was not sent'
            })
        }
    });
});

const addUser = (userName: string): void => {
    userList.push(userName);
}

const removeUser = (userName: string): string[] => {
    const indexToRemove = userList.indexOf(userName);

    console.log('userList: ', userList);
    console.log('indexToRemove: ', indexToRemove);

    if (indexToRemove !== -1) {
        userList.splice(indexToRemove, 1);
    }

    return userList;
}

const getOnlineUsers = (): string[] => {
    console.log('getOnlineUsers: ', userList);
    return userList;
}

const saveMessage = async (userName: string, message: string) => {
    try {
        db.get<User>('SELECT id FROM users WHERE username = ?', [userName], (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }

            if (row) {
                const userId = row.id;

                // Insert message into the messages table
                db.run(
                    'INSERT INTO messages (text, time, author) VALUES (?, datetime("now", "localtime"), ?)',
                    [message, userId],
                    (err) => {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                        console.log('Message saved successfully');
                    }
                );
            } else {
                console.log('User not found');
            }
        });
    } catch (error) {
        console.error(error);
    }
};

app.use('', (req, res) => {
    console.log('req: ', req.url);
});

httpServer.listen(PORT, () => {
    console.log('Server is running on port: ', PORT);
});