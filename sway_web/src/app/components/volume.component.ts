import { Component, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';


@Component({
  selector: 'volume',
  templateUrl: '../templates/volume.component.html'
})
export class VolumeComponent {

    @Input() members: any[];
    guidance: string;

    constructor(
        private route: ActivatedRoute,
        private af: AngularFire
    ) {}

    // subscribe to changes
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        var quieter = 0
        var justRight = 0
        var louder = 0

        for (let item of this.members) {
            if (item["volume"] == 0) {
                justRight += 1
            }
            else if (item["volume"] == 1) {
                louder += 1
            }
            else if (item["volume"] == -1) {
                quieter += 1
            }
        }

        if (justRight >= quieter && justRight >= louder) {
            this.guidance = "GOOD"
        }
        else if (quieter > louder) {
            this.guidance = "TOO HIGH"
        }
        else if (louder > quieter) {
            this.guidance = "TOO LOW"
        }else{
            this.guidance = "GOOD"
        }
    };

}