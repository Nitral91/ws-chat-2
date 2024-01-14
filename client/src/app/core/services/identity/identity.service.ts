import {Injectable, signal} from '@angular/core';
import {User} from "../../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  currentUser = signal<User | null>(null);

  constructor() { }

  setUser(user: User): void {
    this.currentUser.set(user);
  }

  clearUser(): void {
    this.currentUser.set(null);
  }
}
