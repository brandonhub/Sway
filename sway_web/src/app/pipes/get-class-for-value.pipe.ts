import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'getClassForValue'})
export class GetClassForValuePipe implements PipeTransform {
  transform(value, type: string): string {
    var cssClass:string
    switch (type) {

        case "satisfaction":    // SATISFACTION MEMBER CLASS
            if (value) {
                cssClass = "member-satisfied"
            }
            else {
                cssClass = "member-disatisfied"
            }
            break;
    }

    return cssClass
  }
}