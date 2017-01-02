import { Component, OnChanges, Input } from '@angular/core';
import { PopoverModule } from 'ng2-popover';


@Component({
  selector: 'member-list',
  templateUrl: '../templates/member-list.component.html'
})
export class MemberListComponent {

    @Input() members: any[];
    selectedMember = {}

    onSelect(member) {
        this.selectedMember = member
    }

}