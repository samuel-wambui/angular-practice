import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './common/about/about.component';
import { ContactComponent } from './common/contact/contact.component';


export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'about/:submenu/:id', component: AboutComponent},
    {path: 'about', component: AboutComponent},
    {path: 'contact', component: ContactComponent}
];
