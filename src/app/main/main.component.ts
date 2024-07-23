import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  isPrivacyPolicy = false;
  constructor(private route: ActivatedRoute,private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isPrivacyPolicy = event.url === '/privacy-policy';
    });
   }
  ngOnInit(): void {
    
  }

}
