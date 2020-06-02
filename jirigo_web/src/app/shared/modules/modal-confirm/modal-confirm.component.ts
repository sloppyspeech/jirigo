import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css']
})
export class ModalConfirmComponent implements OnInit {
  @ViewChild('jirigoModalHeader') modalHeader: ElementRef;

  _showModal: boolean = false;
  _modalContent: string = '';
  _modalType: string = '';
  
  @Input() title: string = "";
  @Input() cancelButtonLabel: string = '';
  @Input() confirmButtonLabel: string = "Ok";

  @Input() set showModal(value: boolean) {
    if (value) {
      this._showModal = true;
      this.setModalClasses();
    }
    else {
      this._showModal = false;
    }
  }

  @Input('modalContent')
  set modalContent(value: any) {
    this._modalContent = value;
  }
  get modalContent(): any {
    return this._modalContent;
  }

  @Input('modalType')
  set modalType(value: string) {
    this._modalType = value;
  }
  get modalType() {
    return this._modalType;
  }


  @Output('dialogCanceled') dialogCanceled = new EventEmitter;
  @Output('dialogConfirmed') dialogConfirmed = new EventEmitter;
  @Output('dialogClosed') dialogClosed = new EventEmitter;

  modalTypeBSClasses = {
    'primary': 'bg-new-primary',
    'success': 'bg-new-success',
    'secondary': 'bg-secondary',
    'info': 'bg-info',
    'dark': 'bg-dark',
    'light': 'bg-light',
    'danger': 'bg-new-danger',
    'warning': 'bg-warning'
  }

  constructor(private _renderer2: Renderer2
  ) { }

  ngOnInit(): void {
  }

  setModalClasses() {
    let classTypeToAdd = this.modalTypeBSClasses[this.modalType.toLowerCase()] ? this.modalTypeBSClasses[this.modalType.toLowerCase()] : this.modalTypeBSClasses['info']
    console.log("=========setModalClasses=========");
    console.log(this.modalType.toLowerCase());
    console.log(classTypeToAdd);
    for (const property in this.modalTypeBSClasses){
      this._renderer2.removeClass(this.modalHeader.nativeElement,this.modalTypeBSClasses[property]);
    }
    this._renderer2.addClass(this.modalHeader.nativeElement, 'text-light');
    this._renderer2.addClass(this.modalHeader.nativeElement, classTypeToAdd);
  }

  closeModal(action) {
    if (action === 'close') {
      this.dialogClosed.emit(true);
    }
    else if (action == 'cancel') {
      this.dialogCanceled.emit(true);
    }
    else if (action == 'confirm') {
      this.dialogConfirmed.emit(true);
    }
    this.showModal = false;
  }

}
