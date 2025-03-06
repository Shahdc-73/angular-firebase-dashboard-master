import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private afs: AngularFirestore) {}

  // Get all posts from Firestore
  getAllPosts(): Observable<any[]> {
    return this.afs.collection('posts', ref => ref.orderBy('timestamp', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  // Get a specific post by ID
  getPostById(postId: string): Observable<any> {
    return this.afs.collection('posts').doc(postId).valueChanges();
  }

  // Add a new post
  addPost(post: { title: string; content: string; mediaUrl?: string; mediaType?: string, createdBy: string }): Promise<void> {
    return this.afs.collection('posts').add({
      ...post,
      timestamp: new Date(),
    }).then(() => {
      console.log('Post added successfully');
    }).catch(error => {
      console.error('Error adding post: ', error);
      throw error;
    });
  }

  // Update an existing post
  updatePost(postId: string, updatedPost: any): Promise<void> {
    return this.afs.collection('posts').doc(postId).update(updatedPost)
      .then(() => {
        console.log('Post updated successfully');
      })
      .catch(error => {
        console.error('Error updating post: ', error);
        throw error;
      });
  }

  // Delete a post by ID
  deletePost(postId: string): Promise<void> {
    return this.afs.collection('posts').doc(postId).delete()
      .then(() => {
        console.log('Post deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting post: ', error);
        throw error;
      });
  }
}
