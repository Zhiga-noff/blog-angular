import { Component, OnInit } from '@angular/core';
import { PostService } from '../shared/posts.service';
import { Observable } from 'rxjs';
import { Post } from '../shared/interfaces';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  public posts$: Observable<Post[]>;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.posts$ = this.postService.getAll();
  }
}
