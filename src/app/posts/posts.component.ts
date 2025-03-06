import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service'; // Ensure the path is correct
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts$: Observable<any[]>;  // Observable for fetching posts
  newPost = { title: '', content: '', mediaUrl: '', mediaType: '' };
  editingPost: any = null;  // Track which post is being edited

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    // Get all posts on initialization
    this.posts$ = this.postsService.getAllPosts();
  }

  // Add new post
  addPost() {
    if (!this.newPost.title || !this.newPost.content) {
      alert('Title and content are required!');
      return;
    }
    this.postsService.addPost({
      title: this.newPost.title,
      content: this.newPost.content,
      mediaUrl: this.newPost.mediaUrl,
      mediaType: this.newPost.mediaType,
      createdBy: 'Admin', // Replace with dynamic username if available
    }).then(() => {
      this.newPost = { title: '', content: '', mediaUrl: '', mediaType: '' }; // Reset the form
    }).catch(error => {
      console.error('Error adding post: ', error);
    });
  }

  // Start editing post
  startEditing(post: any) {
    this.editingPost = { ...post };  // Clone the post to avoid direct mutation
  }

  // Save post after editing
  saveEdit() {
    if (!this.editingPost.title || !this.editingPost.content) {
      alert('Title and content are required!');
      return;
    }
    this.postsService.updatePost(this.editingPost.id, this.editingPost)
      .then(() => {
        this.editingPost = null;  // Clear editing state
      })
      .catch(error => {
        console.error('Error updating post: ', error);
      });
  }

  // Cancel editing
  cancelEdit() {
    this.editingPost = null;
  }

  // Delete post
  deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postsService.deletePost(postId)
        .catch(error => {
          console.error('Error deleting post: ', error);
        });
    }
  }
}
