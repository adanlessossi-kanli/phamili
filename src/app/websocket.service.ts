import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<any>();
  private connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');

  connectionStatus$ = this.connectionStatus.asReadonly();
  messages$ = this.messageSubject.asObservable();

  connect(url: string = 'ws://localhost:8080') {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.connectionStatus.set('connecting');
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connectionStatus.set('connected');
      console.log('WebSocket connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageSubject.next(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      this.connectionStatus.set('disconnected');
      console.log('WebSocket disconnected');
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connect(url), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.set('disconnected');
    };
  }

  send(message: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Real-time notifications
  sendNotification(type: string, message: string) {
    this.send({
      type: 'notification',
      data: { type, message, timestamp: Date.now() }
    });
  }

  // Real-time comments
  sendComment(postId: string, comment: string, author: string) {
    this.send({
      type: 'comment',
      data: { postId, comment, author, timestamp: Date.now() }
    });
  }
}