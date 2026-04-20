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
  status: 'Nieuw' | 'Gelezen';
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
  filterOption: string = 'Alle berichten';

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

    // Filter op zoektermen
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.senderName.toLowerCase().includes(query) ||
        msg.senderEmail.toLowerCase().includes(query) ||
        msg.messageText.toLowerCase().includes(query)
      );
    }

    // Filter op status
    if (this.filterOption === 'Ongelezen') {
      filtered = filtered.filter(msg => msg.status === 'Nieuw');
    } else if (this.filterOption === 'Gelezen') {
      filtered = filtered.filter(msg => msg.status === 'Gelezen');
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

  onMessageClick(message: Message): void {
    const aiAnswers: AiAnswer[] = [
      {
        text: 'Placeholder',
        tag: 'Informeel'
      },
      {
        text: 'Placeholder',
        tag: 'Professioneel'
      }
    ];

    this.selectedMessage = {
      id: message.id,
      senderName: message.senderName,
      senderEmail: message.senderEmail,
      avatarGradient: message.avatarGradient,
      avatarText: message.avatarText,
      messageText: message.messageText,
      messageType: 'Spraakbericht',
      time: message.time,
      date: message.date,
      timestamp: `18 seconden  17 mrt. 2026, 10:30:00`,
      aiAnswers: aiAnswers
    };
  }

  onBackFromDetail(): void {
    this.selectedMessage = null;
  }

  onReplyMessage(replyText: string): void {
    console.log('Reply:', replyText);
    // Hier kan logica toegevoegd worden voor het versturen van een reply
    this.selectedMessage = null;
  }
}
