import { Injectable } from '@angular/core';
import { Session } from '../shared/models/Session';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private localStorageService;
  private currentSession: Session = null;

  constructor() {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  public loadSessionData(): Session {
    var sessionStr = this.localStorageService.getItem('bookmarks');
    var session = new Session();

    if (sessionStr) {
      session = <Session>JSON.parse(sessionStr);
    }
    this.setCurrentSession(session);
    
    return session;
  }

  public getCurrentSession(): Session {
    return this.currentSession;
  }

  public setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.localStorageService.setItem('bookmarks', JSON.stringify(session));
  }

  public removeCurrentSession(): void {
    this.localStorageService.removeItem('bookmarks');
    this.currentSession = null;
  }

}
