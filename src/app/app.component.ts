import { Component, inject, OnInit } from '@angular/core';
import { Store } from './common/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit {
  store = inject(Store);

  ngOnInit() {
    this.store.init();
  }
}
