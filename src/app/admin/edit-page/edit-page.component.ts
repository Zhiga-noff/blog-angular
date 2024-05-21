import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostService } from '../../shared/posts.service';
import { Subscription, switchMap } from 'rxjs';
import { Post } from '../../shared/interfaces';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.scss',
})
export class EditPageComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public post: Post;
  public submitted: boolean = false;

  public updateSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params['id']);
        }),
      )
      .subscribe((post: Post) => {
        this.post = post;
        this.form = new FormGroup<any>({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
        });
      });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    this.updateSubscription = this.postService
      .update(
        {
          ...this.post,
          title: this.form.value.title,
          text: this.form.value.text,
        },
        this.post.id,
      )
      .subscribe((post) => {
        this.submitted = false;
        this.alertService.success('Пост был обновлен');
      });
  }
}
