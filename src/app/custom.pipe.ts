import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone: true
})
export class CustomPipe implements PipeTransform {

  transform(value: String, ...args: String  []): String {
    return value.split('').reverse().join('');
  }

}
