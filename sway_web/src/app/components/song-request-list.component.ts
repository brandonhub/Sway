import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { PopoverModule } from 'ng2-popover';


@Component({
  selector: 'song-request-list',
  templateUrl: '../templates/song-request-list.component.html'
})
export class SongRequestListComponent implements OnInit {

    @Input() sessionId;
    currentSong = new Audio();
    songRequestsObservable: FirebaseListObservable<any[]>;
    songRequests:any[] = []

    constructor(
        private route: ActivatedRoute,
        private af: AngularFire
    ) {}

    ngOnInit(): void {
        this.songRequestsObservable = this.af.database.list("sessions/" + this.sessionId + "/requests", {
            query: {
                orderByChild: 'count'
            }
        })

        // subscribe to changes
        this.songRequestsObservable.subscribe(queriedItems => {
            this.songRequests = []
            for(let item of queriedItems) { // reversing order so that most requested is at the top
                this.songRequests.splice(0, 0, item);   // same as arr.insert(0, item)
            }
        });
    }

    playSong(url): void {
        this.currentSong.pause();
        this.currentSong = new Audio(url);
        this.currentSong.play();
    }

    removeSong(requestId): void {
        console.log("removing song..., ", "sessions/" + this.sessionId + "/requests/" + requestId)
        firebase.database().ref().child("sessions/" + this.sessionId + "/requests/" + requestId).set(null)
    }
    //
    // stopSong(url): void {
    //     a.stop();
    // }

}