import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageDetailComponent, MessageDetail, AiAnswer } from './message-detail/message-detail';

export interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  avatarGradient: string;
  avatarText: string;
  messageText: string;
  messageType: 'Voice message' | 'Text message';
  status: 'New' | 'Read';
  time: string;
  date: string;
  icon?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageDetailComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  selectedMessage: MessageDetail | null = null;
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  searchQuery: string = '';
  filterOption: string = 'All messages';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    console.log('Loading messages...');
    this.http.get<Message[]>('/assets/messages.json').subscribe(
      (data: Message[]) => {
        console.log('Messages loaded successfully:', data);
        this.messages = data;
        this.updateFilteredMessages();
        this.cdr.markForCheck();
        console.log('Messages array:', this.messages);
      },
      (error: any) => {
        console.error('Error loading messages:', error);
      }
    );
  }

  updateFilteredMessages(): void {
    console.log('updateFilteredMessages called');
    console.log('messages.length:', this.messages.length);
    this.filteredMessages = this.getFilteredMessages();
    console.log('filteredMessages.length:', this.filteredMessages.length);
  }

  getFilteredMessages(): Message[] {
    let filtered = this.messages;

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.senderName.toLowerCase().includes(query) ||
        msg.senderEmail.toLowerCase().includes(query) ||
        msg.messageText.toLowerCase().includes(query)
      );
    }

    if (this.filterOption === 'Unread') {
      filtered = filtered.filter(msg => msg.status === 'New');
    } else if (this.filterOption === 'Read') {
      filtered = filtered.filter(msg => msg.status === 'Read');
    }

    return filtered;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.updateFilteredMessages();
  }

  onFilterChange(option: string): void {
    this.filterOption = option;
    this.updateFilteredMessages();
  }

  get unreadCount(): number {
    return this.messages.filter(m => m.status === 'New').length;
  }

  toggleMessageStatus(message: Message, event: Event): void {
    event.stopPropagation();
    message.status = message.status === 'New' ? 'Read' : 'New';
    this.updateFilteredMessages();
    this.cdr.markForCheck();
  }

  onMessageClick(message: Message): void {
    if (message.status === 'New') {
      message.status = 'Read';
      this.updateFilteredMessages();
    }

    const aiAnswers: AiAnswer[] = [
      {
        text: 'Hey! Sure, tomorrow at 2pm works great. See you then!',
        tag: 'Informal'
      },
      {
        text: 'Good afternoon, tomorrow at 2:00 PM is available. We hereby confirm your appointment. See you tomorrow!',
        tag: 'Professional'
      }
    ];

    this.selectedMessage = {
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      avatarGradient: message.avatarGradient,
      avatarText: message.avatarText,
      messageText: message.messageText,
      messageType: message.messageType,
      time: message.time,
      date: message.date,
      timestamp: `18 seconds  Mar 17, 2026, 10:30:00`,
      aiAnswers: aiAnswers
    };
  }

  onBackFromDetail(): void {
    this.selectedMessage = null;
  }

  onReplyMessage(replyText: string): void {
    console.log('Reply:', replyText);
    this.selectedMessage = null;
  }
}
