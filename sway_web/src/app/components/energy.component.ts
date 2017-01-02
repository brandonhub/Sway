import { Component, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'energy',
  templateUrl: '../templates/energy.component.html'
})
export class EnergyComponent {

    @Input() members: any[];
    energyLevel = ""

    // subscribe to changes
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        var energySum = 0
        var count = 0

        for (let item of this.members) {
            if (item["energy"]) {
                energySum += item["energy"]
                count += 1
            }
        }
        if (count == 0) {
            this.energyLevel = "No Feedback"
        }
        else{
            this.energyLevel = (energySum/count).toFixed(2)
        }
    };

}