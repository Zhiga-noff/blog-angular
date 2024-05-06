import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public postSubscription: Subscription;
  public deleteSubscription: Subscription;
  public searchStr: string = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postSubscription = this.postService.getAll().subscribe((posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }

    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  remove(id: string) {
    this.deleteSubscription = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter((post) => {
        return post.id !== id;
      });
    });
  }
}
