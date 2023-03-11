import { Component, Input } from "@angular/core";
import { Post } from "../models/models";

@Component({
    selector: "app-post",
    standalone: true,
    template: `
        <div class="post">
            <h2>{{post.title}}</h2>
            <p>{{post.content}}</p>
        </div>
    `,
})
export class PostComponent {
    @Input() post!: Post;
}