import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Workstation } from '../../services/models/workstation';

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.scss']
})
export class WorkstationComponent implements OnInit, OnChanges {

  @Input() clearAllSearch: number;
  @Output() sendWorkstation: EventEmitter<any> = new EventEmitter();

  public workstationID: string;

  constructor(
    private apiService: ApiService
  ) { }

  public workstations: Array<Workstation> = [];

  ngOnInit() {
    this.getListWorkstation();
  }

  // ================== change value input ==================
  ngOnChanges(changes: SimpleChanges) {
    if (changes.clearAllSearch && changes.clearAllSearch.currentValue > 0) {
      this.workstationID = '0';
    }
  }

  // ================== get list workstation ==================
  getListWorkstation() {
    const params = {
      cols: 'sid,workstation_name',
      sort: 'sid,asc'
    };
    this.apiService.getWorkStations(params).subscribe(
      response => {
        if (response) {
          this.workstations = response.data.map(
            (workstation: any) => {
              return {
                id: workstation.sid,
                name: workstation.workstation_name
              };
            }
          );
          this.workstations.unshift({
            id: '0',
            name: 'All'
          });
          this.workstationID = this.workstations[0].id;
        }
      }
    );
  }

  // ================== send value workstation to search ==================
  onSelectionChanged() {
    this.sendWorkstation.emit(this.workstationID);
  }
}
