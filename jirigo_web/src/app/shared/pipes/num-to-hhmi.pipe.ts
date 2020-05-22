import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numToHHMI'
})
export class NumToHhmiPipe implements PipeTransform {

  transform(value: number): unknown {
    return Math.floor(value/60)+'h '+Math.floor(value%60)+'m';
  }

}
