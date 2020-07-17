import { Router } from '@angular/router';
import { GlobalSearchService } from './../../../services/global-search/global-search.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.css']
})
export class GlobalSearchComponent implements OnInit {
  searchText:string="";
  showSearchDropdown:boolean=false;
  faSearch=faSearch;
  globalSearchResults:any[]=[];
  constructor(
    private _serGlobalSearch:GlobalSearchService,
    private _router:Router
  ) { }

  ngOnInit(): void {
  }

  globalSearch(event){
    this.globalSearchResults=[];
    console.log("-------------------");
    console.log(this.searchText);
    if(event.keyCode !=27){
      console.log(event.target.value);
      this._serGlobalSearch.getTicketTasksByGlobalSearch(this.searchText)
      .subscribe(res=>{
        if(res['dbQryStatus'] == "Success" && res['dbQryResponse']){
            console.log(res['dbQryResponse']);
            this.globalSearchResults=res['dbQryResponse'];
            this.showSearchDropdown=true;
            }
          })
    }
  }

  navigateToItem(item){
    console.log("----------------------");
    console.log(item);
    if(item.item_type === "Task"){
      console.log(item.item_no);
      this._router.navigate(['tasks/view-edit-tasks'],{queryParams:{'task_no':item.item_no}});
      this.globalSearchResults=[];
      this.searchText="";
      this.showSearchDropdown=false;
      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.onSameUrlNavigation = 'reload';
    }
    else if (item.item_type === 'Ticket'){
      console.log(item.item_no);
      this._router.navigate(['tickets/view-edit-tickets'],{queryParams:{'ticket_no':item.item_no}});
      this.globalSearchResults=[];
      this.searchText="";
      this.showSearchDropdown=false;
      this._router.routeReuseStrategy.shouldReuseRoute = () => false;
      this._router.onSameUrlNavigation = 'reload';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    console.log('escape pressed');
    this.showSearchDropdown=false;
    this.searchText="";
  }


  // @HostListener('click') onClick() {
  //   console.log('click');
  //   this.showSearchDropdown=false;
  // }

}
