import { Component, OnChanges, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'song-tracker',
  templateUrl: '../templates/song-tracker.component.html'
})
export class SongTrackerComponent implements OnInit {

    @Input() sessionId;
    trackedSongs: FirebaseListObservable<any[]>;

    constructor(
        private af: AngularFire
    ) {}

    ngOnInit(): void {
        this.trackedSongs = this.af.database.list("song_tracker")
    }


}