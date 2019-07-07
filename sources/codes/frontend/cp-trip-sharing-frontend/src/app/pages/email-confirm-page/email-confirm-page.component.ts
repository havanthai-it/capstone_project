import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user-service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MessagePopupComponent } from 'src/app/shared/components/message-popup/message-popup.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-email-confirm-page',
  templateUrl: './email-confirm-page.component.html',
  styleUrls: ['./email-confirm-page.component.css']
})
export class EmailConfirmPageComponent implements OnInit {

  token: string = null;
  message: string = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private dialog: MatDialog,
              private titleService: Title
  ) {
    this.titleService.setTitle('Xác nhận email');
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    this.userService.verifyEmail(this.token).subscribe((data: any) => {
      this.message = 'Xác nhận email thành công';
      this.openDialogMessageConfirm(this.message);
      setTimeout(() => {
        this.dialog.closeAll();
        window.location.href = '';
      }, 5000);
    }, (err: HttpErrorResponse) => {
      this.message = 'Xác nhận email thất bại';
      this.openDialogMessageConfirm(this.message);
      setTimeout(() => {
        window.location.href = '';
      }, 5000);
    });
  }
  openDialogMessageConfirm(message: string) {
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      width: '400px',
      height: '200px',
      position: {
        top: '10px'
      },
      disableClose: true
    });
    const instance = dialogRef.componentInstance;
    instance.message.messageText = message;
    instance.message.url = '/trang-chu';
  }
}
