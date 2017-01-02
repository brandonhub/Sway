import { Component, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'satisfaction',
  templateUrl: '../templates/satisfaction.component.html'
})
export class SatisfactionComponent {

    @Input() members: any[];
    satisfactionRating = 0.0

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        var satisfied = 0.0
        var unsatisfied = 0.0
        for (let item of this.members) {
            if (item["satisfaction"]) {
                satisfied = satisfied + 1.0
            }else{
                unsatisfied = unsatisfied + 1.0
            }
        }
        if ((satisfied + unsatisfied) < 1){
            this.satisfactionRating = 0
        }else{
            this.satisfactionRating = satisfied/(satisfied + unsatisfied)
        }
    }

}