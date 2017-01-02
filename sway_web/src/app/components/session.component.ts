import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'session',
  templateUrl: '../templates/session.component.html'
})
export class SessionComponent implements OnInit {

    sessionId: number
    membersObservable: FirebaseListObservable<any[]>;
    members: any[] = []

    constructor(
        private route: ActivatedRoute,
        private af: AngularFire
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.sessionId = params['id'];
            this.membersObservable = this.af.database.list("sessions/" + this.sessionId + "/members")

        });

        // subscribe to changes
        this.membersObservable.subscribe(queriedItems => {
            this.members = []   // update members to be passed down to children
            for(let item of queriedItems) {
                this.members.push(item)
            }
        });

    }

}