import { Component } from '@angular/core';
import { Header } from "../header/header";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-landing',
  imports: [Header, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
