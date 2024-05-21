import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/posts.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Post } from '../shared/interfaces';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrl: './post-page.component.scss',
})
export class PostPageComponent implements OnInit {
  public post$: Observable<Post>;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.post$ = this.route.params.pipe(
      switchMap((params) => {
        return this.postService.getById(params['id']);
      }),
    );
  }
}
