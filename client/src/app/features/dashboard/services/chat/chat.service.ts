import {inject, Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Message} from "../../../../core/interfaces/message.interface";
import {HttpClient, provideHttpClient} from "@angular/common/http";
import {User} from "../../../../core/interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly  url = 'http://localhost:3000/api'
  constructor(
    private http: HttpClient
  ) { }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<{
      messages: Message[]
    }>(this.url + '/messages/all')
      .pipe(
        map((res) => {
          return res.messages
        })
      );
  }
}
