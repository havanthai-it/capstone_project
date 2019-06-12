import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-personal-page',
  templateUrl: './personal-page.component.html',
  styleUrls: ['./personal-page.component.css']
})
export class PersonalPageComponent implements OnInit {
  componentRefer: any;
  coverImage = '../../../assets/coverimg.jpg';
  avatar = '../../../assets/img_avatar.png';
  title = 'angular-material-tab-router';
  navLinks: any[];
  activeLinkIndex = 0;
  isScrollTopShow = false;
  topPosToStartShowing = 100;
  @HostListener('window:scroll') checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isScrollTopShow = true;
    } else {
      this.isScrollTopShow = false;
    }
  }

  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'Bản tin hoạt động ',
        link: './personalfeed',
        index: 0
      },
      {
        label: 'Chuyến đi',
        link: './virtual',
        index: 1
      },
      {
        label: 'Tìm bạn đồng hành',
        link: './third',
        index: 2
      }
    ];
  }
  ngOnInit(): void {
    this.router.events.subscribe(res => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find(tab => tab.link === '.' + this.router.url)
      );
    });
  }
  onActivate(componentRef) {
    this.componentRefer = componentRef;
  }
  onScroll() {
    this.componentRefer.onScroll();
  }
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
