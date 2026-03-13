import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Landing } from './common/landing/landing';
import { Dashboard } from './common/dashboard/dashboard';
import { Pricing } from './components/pricing/pricing';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , Landing , Dashboard , Pricing],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('data-output');
}
