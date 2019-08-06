import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/core/services/user-service/user.service';
import { GlobalErrorHandler } from 'src/app/core/globals/GlobalErrorHandler';
import { HostGlobal } from 'src/app/core/global-variables';

@Component({
  selector: 'app-user-page-admin',
  templateUrl: './user-page-admin.component.html',
  styleUrls: ['./user-page-admin.component.css']
})
export class UserPageAdminComponent implements OnInit {

  search: string;
  searchType: string;
  users: User[];

  constructor(private userService: UserService,
              private errorHandler: GlobalErrorHandler) {
    this.searchType = 'text';
    this.search = '';
    this.users = [];
  }

  ngOnInit() {
    this.getUsers(undefined);
  }

  searchByText() {
    this.users = [];
    this.getUsers(this.search);
  }

  getUsers(search: string) {
    if (search === undefined || search == null) {
      search = '';
    }

    this.userService.getUsers(search).subscribe((res: []) => {
      this.users.push(...res);
    }, this.errorHandler.handleError);
  }

  goToUserPage(user: User) {
    window.open(`${HostGlobal.HOST_FRONTEND}/user/${user.id}`, '_blank');
  }

  banUser(user: User) {

  }

}