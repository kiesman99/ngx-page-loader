import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';
import { ProfileInfo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  getProfileInfo(userId: string) {
    const dummyProfile: ProfileInfo = {
      username: 'sample',
    };
    return of(dummyProfile).pipe(delay(1000));
  }
}
