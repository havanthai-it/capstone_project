import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user-service/user.service';
import { User } from 'src/app/model/User';
import { MatDialog } from '@angular/material/dialog';
import { InitialUserInformationPageComponent } from '../initial-user-information-page/initial-user-information-page.component';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ListFollowComponent } from 'src/app/shared/components/list-follow/list-follow.component';

@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  user: User;
  gender = '';
  coverImage = '../../../assets/coverimg.jpg';
  avatar = '../../../assets/img_avatar.png';
  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = 0;
  userId: string;
  listUser: User[] = [];

  constructor(private router: Router, private userService: UserService, public dialog: MatDialog, private route: ActivatedRoute) {
    this.navLinks = [
      {
        label: 'Bài viết',
        link: './articles',
        index: 0
      },
      {
        label: 'Chuyến đi',
        link: './virtual-trips',
        index: 1
      },
      {
        label: 'Tìm bạn đồng hành',
        link: './companion-posts',
        index: 2
      }
    ];
    this.user = new User();
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.getInforUser(this.userId);
  }
  ngOnInit(): void {
    this.router.events.subscribe(res => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find(tab => tab.link === '.' + this.router.url)
      );
    });
  }

  getInforUser(userId: string) {
    this.userService.getUserById(userId).subscribe((data: any) => {
      console.log(data);
      this.user.ContributionPoint = data.contributionPoint;
      this.user.Dob = data.dob;
      this.user.DisplayName = data.displayName;
      this.user.FirstName = data.firstName;
      this.user.Gender = data.gender;
      this.user.Interested = data.interested;
      this.user.LastName = data.lastName;
      this.user.UserName = data.userName;
      this.user.Address = data.address;
      this.user.FollowerCount = data.followerCount;
      this.user.FollowingCount = data.followingCount;
      if (this.user.Gender === true) {
        this.gender = 'Nam';
      } else {
        this.gender = 'Nữ';
      }
      console.log(this.user);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  callUpdateProfile() {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InitialUserInformationPageComponent, {
      width: '60%',
      data: {
        toppics: [],
        destinations: [],
      }
    });
    const instance = dialogRef.componentInstance;
    instance.user.UserId = this.userId;
    instance.user.UserName = this.user.UserName;
    instance.user.DisplayName = this.user.DisplayName;
    instance.user.FirstName = this.user.FirstName;
    instance.user.Gender = this.user.Gender;
    instance.user.Interested = this.user.Interested;
    instance.user.LastName = this.user.LastName;
    instance.user.UserName = this.user.UserName;
    instance.user.Address = this.user.Address;
    instance.user.Dob = this.user.Dob;
    instance.user.Gender = this.user.Gender;
  }

  showFollowingUser() {
    this.userService.getAllFollowing(this.userId).subscribe((result: any) => {
      console.log(result);
      this.listUser = result;
      this.openDialogFollow('Danh sách những người đang theo dõi');
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  showFolowerUser() {
    this.userService.getAllFollower(this.userId).subscribe((result: any) => {
      console.log(result);
      this.listUser = result;
      this.openDialogFollow('Danh sách những người theo dõi');
    }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  openDialogFollow(title: any) {
    const dialogRef = this.dialog.open(ListFollowComponent, {
      height: 'auto',
      width: '80%'
    });
    const instance = dialogRef.componentInstance;
    instance.listUser = this.listUser;
    instance.title = title;
  }
}
