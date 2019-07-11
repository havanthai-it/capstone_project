import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { OnlyForHomePageComponent } from './pages/home-page/components/only-for-home-page/only-for-home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { GoogleMapComponent } from './shared/components/google-map/google-map.component';
import { AgmCoreModule } from '@agm/core';
import { HeaderComponent } from 'src/app/core/components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PersonalPageComponent } from './pages/personal-page/personal-page.component';
import { ForgotpasswordPageComponent } from './pages/forgotpassword-page/forgotpassword-page.component';
import { CreatePostPageComponent } from './pages/create-post-page/create-post-page.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ChangepasswordPageComponent } from './pages/changepassword-page/changepassword-page.component';
import { DetailpostPageComponent } from './pages/detailpost-page/detailpost-page.component';
import { SingleCommentComponent } from './shared/components/single-comment/single-comment.component';
import { MessagePopupComponent } from './shared/components/message-popup/message-popup.component';
import { EmailConfirmPageComponent } from './pages/email-confirm-page/email-confirm-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';
import { InitialUserInformationPageComponent } from './pages/initial-user-information-page/initial-user-information-page.component';
import { VirtualTripsPageComponent } from './pages/virtual-trips-page/virtual-trips-page.component';
import { DialogCreateTripComponent } from './pages/virtual-trips-page/dialog-create-trip/dialog-create-trip.component';
import { ListFollowComponent } from './shared/components/list-follow/list-follow.component';
import { DestinationTripComponent } from './pages/virtual-trips-page/destination-trip/destination-trip.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { MatInputModule, MatExpansionModule } from '@angular/material';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { provideSocialLoginConfig } from './social-login-config';
import { CreateFindingCompanionsPostComponent } from './pages/create-finding-companions-post/create-finding-companions-post.component';
import { MatBadgeModule } from '@angular/material';
import { ListPostPageComponent } from './pages/list-post-page/list-post-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    OnlyForHomePageComponent,
    LoginPageComponent,
    GoogleMapComponent,
    HeaderComponent,
    RegisterPageComponent,
    PersonalPageComponent,
    ForgotpasswordPageComponent,
    CreatePostPageComponent,
    ChangepasswordPageComponent,
    DetailpostPageComponent,
    EmailConfirmPageComponent,
    ResetPasswordPageComponent,
    InitialUserInformationPageComponent,
    VirtualTripsPageComponent,
    DialogCreateTripComponent,
    DestinationTripComponent,
    ChatPageComponent,
    CreateFindingCompanionsPostComponent,
    ListPostPageComponent
  ],
  imports: [
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatExpansionModule,
    SocialLoginModule,
    MatBadgeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDIPTZ7dpn5_hralWGDP4glqkqAaac6qeA',
      libraries: ['places']
    }),
    HttpClientModule,
    InfiniteScrollModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryService, { dataEncapsulation: false }
    // ),
    CKEditorModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideSocialLoginConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LoginPageComponent, MessagePopupComponent, DialogCreateTripComponent, ListFollowComponent]

})
export class AppModule { }
