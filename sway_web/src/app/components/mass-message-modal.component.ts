import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';


@Component({
    selector: 'mass-message-modal',
    templateUrl: '../templates/mass-message-modal.component.html',
})
export class MassMessageModalComponent {
    @Input() sessionId;
    @Input() members;
    announcementText: string;

    constructor(
        private route: ActivatedRoute,
        private af: AngularFire
    ) {}

    onSend() {
        for (let item of this.members) {
            var newMessageData = {
                body: this.announcementText,
                toNumber: item["$key"]
            };

            // Get a key for new message
            var newMessageKey = firebase.database().ref().child('message_queue').push().key;

            var updates = {};
            updates['/message_queue/' + newMessageKey] = newMessageData;
            firebase.database().ref().update(updates);
        }
        this.announcementText = ""
    }
}