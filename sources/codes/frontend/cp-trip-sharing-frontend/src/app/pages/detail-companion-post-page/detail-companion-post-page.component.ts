import { Component, OnInit, HostListener } from '@angular/core';
import { Post } from 'src/app/model/Post';
import { Comment } from 'src/app/model/Comment';
import { UserService } from 'src/app/core/services/user-service/user.service';
import { MatDialog } from '@angular/material';
import { MessagePopupComponent } from 'src/app/shared/components/message-popup/message-popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from 'src/app/core/services/post-service/post.service';
import { Like } from 'src/app/model/Like';
import { CompanionPost } from 'src/app/model/CompanionPost';
import { Bookmark } from 'src/app/model/Bookmark';
import { ActivatedRoute } from '@angular/router';
import { FindingCompanionService } from 'src/app/core/services/post-service/finding-companion.service';
import { Title } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Schedule } from 'src/app/model/Schedule';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-detail-companion-post-page',
  templateUrl: './detail-companion-post-page.component.html',
  styleUrls: ['./detail-companion-post-page.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class DetailCompanionPostPageComponent implements OnInit {
  post: Post = new Post();
  displayName = '';
  coverImg = '';
  coverImage = '../../../assets/coverimg.jpg';
  avatar = '../../../assets/img_avatar.png';
  authorId: string;
  isAuthorPost = false;
  follow = false;
  followed = false;
  token: string;
  listPostIdBookMark: string[] = [];
  listUserIdFollowing: string[] = [];
  listLocation: any[] = [];
  commentContent = '';
  comments: Comment[];
  isScrollTopShow = false;
  like: Like = new Like();
  companionPost = new CompanionPost();
  companionPostId: string;
  bookmarkObject: Bookmark = new Bookmark();
  bookmark = false;
  topPosToStartShowing = 300;
  statustRequest: StatustRequest = new StatustRequest();
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
  constructor(private postService: FindingCompanionService, private route: ActivatedRoute,
              private userService: UserService,  public dialog: MatDialog, private titleService: Title) { }
  ngOnInit() {
    this.comments = [];
    this.companionPostId = this.route.snapshot.paramMap.get('companionId');
    this.loadArticleByarticleId(this.companionPostId);
    this.statustRequest.IsRequestJoin();
  }

  // check author
  checkAuthorPost() {
    const user = JSON.parse(localStorage.getItem('User'));
    if (user.id === this.authorId) {
      this.isAuthorPost = true;
    }
  }

  // load companion post
  loadArticleByarticleId(articleId: string) {
    this.token = localStorage.getItem('Token');
    this.postService.getPost(articleId).subscribe((data: any) => {
      this.companionPost = data;
      this.post = data.post;
      if (this.post.coverImage != null) {
        this.coverImage = this.post.coverImage;
      }
      this.listLocation = data.destinations;
      this.authorId = this.post.author.id;
      this.checkAuthorPost();
      if (this.post.author.profileImage != null) {
        this.coverImg = this.post.author.profileImage;
      }
      this.displayName = this.post.author.displayName;
      this.getCommentByPostId(this.post.id);
      this.checkBookMark(this.post.id);
      const user = JSON.parse(localStorage.getItem('User'));
      if (user.id === this.authorId) {
        this.followed = false;
        this.follow = false;
      } else {
        this.listUserIdFollowing = JSON.parse(localStorage.getItem('listUserIdFollowing'));
        if (this.listUserIdFollowing != null) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.listUserIdFollowing.length; i++) {
            if (this.authorId === this.listUserIdFollowing[i]) {
              this.followed = true;
              this.follow = false;
              break;
            } else {
              this.followed = false;
              this.follow = true;
            }
          }
        }
      }
      this.titleService.setTitle(this.post.title);
    });
  }

  // check bookmark list
  checkBookMark(postId: any) {
    this.listPostIdBookMark = JSON.parse(localStorage.getItem('listPostIdBookmark'));
    if (this.listPostIdBookMark != null) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.listPostIdBookMark.length; i++) {
        if (postId === this.listPostIdBookMark[i]) {
          this.bookmark = true;
          break;
        }
      }
    }
  }

  // block user by user id
  blockUserById(userId: any) {
    const token = localStorage.getItem('Token');
    if (token != null) {
      this.userService.addBlock(userId, token).subscribe((result: any) => {
        this.openDialogMessageConfirm();
      });
    }
  }

  // dialog block user
  openDialogMessageConfirm() {
    const user = JSON.parse(localStorage.getItem('User'));
    const dialogRef = this.dialog.open(MessagePopupComponent, {
      width: '380px',
      height: '200px',
      position: {
        top: '10px'
      },
      disableClose: true
    });
    const instance = dialogRef.componentInstance;
    instance.message.messageText = 'Chặn người dùng thành công!';
    instance.message.url = '/user/' + user.id + '/danh-sach-chan';
  }

  // go to personal page
  gotoPersonalPage(authorId: any) {
    window.location.href = '/user/' + authorId;
  }

  // follow Person
  followPerson(userId: any) {
    if (this.followed === false && this.follow === true) {
      this.userService.addFollow(userId, this.token).subscribe((data: any) => {
        this.followed = true;
        this.follow = false;
        this.listUserIdFollowing.push(userId);
        localStorage.setItem('listUserIdFollowing', JSON.stringify(this.listUserIdFollowing));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    } else {
      this.userService.unFollow(userId, this.token).subscribe((data: any) => {
        this.followed = false;
        this.follow = true;
        const unfollow = this.listUserIdFollowing.indexOf(userId);
        this.listUserIdFollowing.splice(unfollow, 1);
        localStorage.setItem('listUserIdFollowing', JSON.stringify(this.listUserIdFollowing));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }

  // comment to the post
  submitComment() {
    const comment = new Comment();
    comment.content = this.commentContent;
    comment.postId = this.post.id;
    comment.parentId = null;

    this.postService.addComment(comment).subscribe((res: Comment) => {
      console.log('add comment res: ' + res);
      this.comments.push(res);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  // get comment by postID
  getCommentByPostId(postId: string) {
    this.postService.getCommentByPost(postId, this.token).subscribe((data: any) => {
      if (data != null) {
        console.log('Comment: ' + data);
        console.log('Total comment: ', data.length);
        this.comments = data;
      } else {
        console.log('Can not get comments of this post.');
      }
    });
  }

  // like a post
  likePost(like: any) {
    this.like.ObjectId = this.companionPost.post.id;
    this.like.ObjectType = 'post';
    if (like === false) {
      this.postService.likeAPost(this.like).subscribe((data: any) => {
        this.companionPost.post.liked = true;
        this.companionPost.post.likeCount += 1;
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    } else {
      this.postService.unlikeAPost(this.like).subscribe((data: any) => {
        this.companionPost.post.liked = false;
        this.companionPost.post.likeCount -= 1;
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }

  // bookmark the post
  bookmarkPost(postId: any, title: any, imgCover: any, postType: any) {
    if (this.bookmark === false) {
      this.bookmarkObject.CoverImage = imgCover;
      this.bookmarkObject.PostId = postId;
      this.bookmarkObject.PostType = postType;
      this.bookmarkObject.Title = title;
      this.userService.addBookMark(this.bookmarkObject, this.token).subscribe((data: any) => {
        this.bookmark = true;
        this.listPostIdBookMark.push(postId);
        localStorage.setItem('listPostIdBookmark', JSON.stringify(this.listPostIdBookMark));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    } else {
      this.userService.deleteBookMark(postId, this.token).subscribe((data: any) => {
        this.bookmark = false;
        const unbookmark = this.listPostIdBookMark.indexOf(postId);
        this.listPostIdBookMark.splice(unbookmark, 1);
        localStorage.setItem('listPostIdBookmark', JSON.stringify(this.listPostIdBookMark));
      }, (err: HttpErrorResponse) => {
        console.log(err);
      });
    }
  }

  commentPost(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoTopPage(el: HTMLElement) {
    el.scrollIntoView();
  }
  // send request to join group companion
  sendRequest() {
    if (this.statustRequest.type === 'request') {
      this.statustRequest.IsWaiting();
    } else {
      this.statustRequest.IsRequestJoin();
    }
  }
}
class StatustRequest {
  type: string;
  text: string;
  public IsRequestJoin() {
    this.type = 'request';
    this.text = 'Yêu cầu tham gia';
  }
  public IsWaiting() {
    this.type = 'waiting';
    this.text = 'Huỷ yêu cầu';
  }
  public IsJoined() {
    this.type = 'joined';
    this.text = 'Đã tham gia';
  }
}