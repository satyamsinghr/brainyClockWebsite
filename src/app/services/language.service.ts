import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('en');
  language$ = this.languageSubject.asObservable();

  constructor(
    private translateService: TranslateService
  ) {
    this.translateService.addLangs(['en','es']);
    this.translateService.setDefaultLang('en');
    this.languageSubject.next('en');
   }

   setLanguage(language: string) {
    this.translateService.use(language);
    this.languageSubject.next(language);
  }

  getCurrentLanguage() {
    return this.languageSubject.getValue();
  }
}
