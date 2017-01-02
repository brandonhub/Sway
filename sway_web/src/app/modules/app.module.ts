// CORE
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { PopoverModule } from "ng2-popover";
import { routing } from '../app.routing';


// COMPONENTS
import { AppComponent } from '../components/app.component';
import { HeaderComponent } from '../components/header.component';
import { SessionComponent } from '../components/session.component';
import { SatisfactionComponent } from '../components/satisfaction.component';
import { EnergyComponent } from '../components/energy.component';
import { MemberListComponent } from '../components/member-list.component';
import { VolumeComponent } from '../components/volume.component'
import { SongRequestListComponent } from '../components/song-request-list.component';
import { MassMessageModalComponent } from '../components/mass-message-modal.component';
import { SongTrackerComponent } from '../components/song-tracker.component';

// PIPES
import { GetClassForValuePipe } from '../pipes/get-class-for-value.pipe';
import { ToPercentPipe } from '../pipes/to-percent.pipe';

// Must export the config
export const firebaseConfig = {
    apiKey: "XXX",
    authDomain: "XXX",
    databaseURL: "XXX",
    storageBucket: "XXX",
    messagingSenderId: "XXX"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SessionComponent,
    SatisfactionComponent,
    EnergyComponent,
    VolumeComponent,
    MemberListComponent,
    SongRequestListComponent,
    MassMessageModalComponent,
    SongTrackerComponent,
    GetClassForValuePipe,
    ToPercentPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    PopoverModule,
    routing,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
