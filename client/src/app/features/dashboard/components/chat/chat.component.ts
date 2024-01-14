import {AfterViewInit, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import { Socket, io } from 'socket.io-client';
import {IdentityService} from "../../../../core/services/identity/identity.service";
import {Subject, takeUntil} from "rxjs";
import {Message} from "../../../../core/interfaces/message.interface";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ChatService} from "../../services/chat/chat.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  private identityService = inject(IdentityService);
  private chatService = inject(ChatService)

  private readonly destroy$ = new Subject();

  newMessage = '';
  userLogin: string;
  socket: Socket;

  userList = signal<string[]>([]);
  messages = signal<Message[]>([]);

  constructor() {
    this.userLogin = this.identityService.currentUser()!.username;
    this.socket = io(`http://localhost:3000?userName=${this.userLogin}`);
  }

  ngOnInit(): void {
    this.socket.emit('join');

    this.retrieveMessages();

    this.socket.on('user-list', userList => {
      console.log('userList: ', userList)
      this.userList.set(userList);
    });

    this.socket.on(
      'message-broadcast',
      (data: { text: string; author: string, date: string }) => {
        console.log('message broadcast');
        if (data) {
          this.messages.update(messages => [...messages, {
            text: data.text,
            author: data.author,
            date: new Date(),
            id: this.messages().length
          }]);

          console.log('this messages: ', this.messages());
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.socket.emit('user-list');
  }

  ngOnDestroy(): void {
    this.socket.emit('leave');
    this.socket.disconnect();

    this.destroy$.next(true);
    this.destroy$.complete();
  }

  retrieveMessages(): void {
    this.chatService.getAllMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: Message[]) => {
        console.log('messages: ', messages);
        this.messages.set(messages);
      })
  }
  sendMessage(): void {
    this.socket.emit('message', {
      author: this.userLogin,
      text: this.newMessage,
    });
    this.messages.update(messages => [...messages, {
      text: this.newMessage,
      author: this.userLogin,
      date: new Date(),
      id: this.messages().length
    }]);
  }
}
