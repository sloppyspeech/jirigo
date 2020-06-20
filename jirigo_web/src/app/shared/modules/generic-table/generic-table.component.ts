import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {
  @Input() showTable:boolean=false;
  @Input() tableData:any;
  @Input() tableColumnHeaders:columnHeader[];
  @Input() rowsToDisplay:number=10;
  @Input() globalFilterFields:any[]=[];

  constructor() { }

  ngOnInit(): void {
    console.log('Ng OnInit Generic Table');
    console.log(this.tableColumnHeaders);
    console.log(this.tableData);
    this.showTable=true;
  }

}

export interface columnHeader{
  'header':string,
  'field':string,
  'width':string,
  'type':string
}
