import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toPercent'})
export class ToPercentPipe implements PipeTransform {
  transform(value: number): string {
    return String((value*100).toFixed(0)) + "%"
  }
}