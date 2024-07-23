import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resetpasswordlink',
  templateUrl: './resetpasswordlink.component.html',
  styleUrls: ['./resetpasswordlink.component.css']
})
export class ResetpasswordlinkComponent implements OnInit {

  @Input() isShow: boolean;
  @Output() editedEmitter = new EventEmitter<{}>();

  constructor() { }

  ngOnInit(): void {
  }
  Close() {
    this.isShow = false;
    this.editedEmitter.emit({ resetPasswordLink: this.isShow, forgotpassword: false });
  }
}
