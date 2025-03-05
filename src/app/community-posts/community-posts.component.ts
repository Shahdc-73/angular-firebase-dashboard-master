import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-community-posts',
  templateUrl: './community-posts.component.html',
  styleUrls: ['./community-posts.component.css'],
})
export class CommunityPostsComponent implements OnInit {
  posts: any[] = [];
  newPost = { title: '', content: '' };
  editingPost: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.authService.getCommunityPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  async addPost() {
    if (!this.newPost.title || !this.newPost.content) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await this.authService.addCommunityPost(this.newPost);
      this.newPost = { title: '', content: '' }; // Reset form
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  editPost(post: any) {
    this.editingPost = { ...post }; // Copy post for editing
  }

  async updatePost() {
    if (!this.editingPost.title || !this.editingPost.content) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await this.authService.updateCommunityPost(this.editingPost.id, {
        title: this.editingPost.title,
        content: this.editingPost.content,
      });
      this.editingPost = null; // Exit edit mode
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }

  async deletePost(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await this.authService.deleteCommunityPost(postId);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }

  cancelEdit() {
    this.editingPost = null;
  }
}
