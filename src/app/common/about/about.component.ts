import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
  })

export class AboutComponent implements OnInit{
  routeValue:any;
  submenu: any;
  constructor(private route: ActivatedRoute){

  }
  ngOnInit(): void {
    this.routeValue=this.route.snapshot.paramMap.get('id');
    this.submenu=this.route.snapshot.paramMap.get('submenu');
     console.log(this.routeValue);
     console.log(this.submenu)
    
    
  }

}
