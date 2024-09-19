// contact.component.ts
import { Component } from '@angular/core';
import { TreeDynamicExample } from './contact.component.tree'; // Ensure correct path

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <h2>Contact Page</h2>
    <tree-dynamic-example></tree-dynamic-example>
  `,
  styleUrls: ['./contact.component.css'],
  imports: [TreeDynamicExample],
})
export class ContactComponent {}
