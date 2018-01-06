import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/post.model';
import {Pagination} from '../../models/pagination.model';
import {Posts} from '../../models/posts.model';
import {Photo} from '../../models/photo.model';
import {PostsService} from '../../services/posts.service';
import {MovePhotoService} from '../../services/movePhoto.service';
import {MoveOutPhotoService} from '../../services/moveOutPhoto.service';
import {ConfigService} from '../../services/config.service';
import * as moment from 'moment';

@Component({
  moduleId: module.id,
  selector: 'es-edit-posts',
  styleUrls: ['editPosts.component.css'],
  templateUrl: 'editPosts.component.html'
})

export class EditPostsComponent implements OnInit {
  navigation: Pagination = new Pagination(1, 10, 0);
  posts: Posts;
  selectedPost: Post;
  photosUrl: string;

  constructor(
    private postsService: PostsService,
    private movePhotoService: MovePhotoService,
    private moveOutPhotoService: MoveOutPhotoService,
    private configService: ConfigService
  ) {
  }

  ngOnInit(): void {
    this.photosUrl = this.configService.getOption('apiUrl') + '/photos';
    this.getPosts();
  }

  getThumbnailUrl(photo: Photo) {
    return this.photosUrl + "/100x100/" + photo.filename;
  }

  updateTitle(id, title) {
    this.postsService.updateTitle(id, title)
      .subscribe( () => {
        console.log('title updated');
      });
  }

  selectPost(post: Post): void {
    this.selectedPost = post;
  }

  moveToSelectedPost(photo) {
    this.movePhotoService.movePhotoToPost(photo, this.selectedPost)
      .subscribe(() => {
        this.getPosts();
      })
  }

  moveOutPhoto(photo) {
    this.moveOutPhotoService.moveOutPhoto(photo)
      .subscribe(() => {
        this.getPosts();
      })
  }

  getPosts(): void {
    this.postsService.getPosts(this.navigation)
      .subscribe((posts: Posts) => {
        this.posts = posts;
      })
  }

  formatDate(date) {
    return moment(date).format('LL');
  }

  hasPosts() {
    return !!this.posts;
  }

  onDrop(data: any, post: any) {
    console.log('dropped', data, post);
    this.movePhotoService.movePhotoToPost(data, post)
      .subscribe(() => {
        this.getPosts();
      })
  }

  loadNextPage() {
    this.navigation.page += 1;
    this.postsService.getPosts(this.navigation)
    .subscribe((posts: Posts) => {
      posts.items.forEach((item: Post) => {
        this.posts.items.push(item);
        // TODO: this.posts is not a Posts, just a simple data object got from the server
//        this.posts.add(item);
      });
    });
  }
}