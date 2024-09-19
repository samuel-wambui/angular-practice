import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ MatCardModule, HomeComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    title = 'hotel-app';
    subtitle ='new app'
    todayDate = new Date()
    salary= 1000
    _obj={'name':"sam"}
    isDisabled=true
    changeTitle(){
      this.title="Church app"
    }
    updatetitle(event:any){
      this.title=event.target.value
    }
  }
  


