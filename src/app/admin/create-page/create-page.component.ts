import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../shared/interfaces';
import { PostService } from '../../shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss',
})
export class CreatePageComponent implements OnInit {
  protected form: FormGroup;

  constructor(
    private postService: PostService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup<any>({
      title: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required),
      author: new FormControl(null, Validators.required),
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      author: this.form.value.author,
      text: this.form.value.text,
      date: new Date(),
    };
    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Пост был создан');
    });
  }
}
