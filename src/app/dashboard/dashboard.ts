import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MessageDetailComponent, MessageDetail, AiAnswer } from './message-detail/message-detail';
import { SettingsComponent } from './settings/settings';
import { AppointmentsComponent } from './appointments/appointments';

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
  isAppointmentRequest?: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  service?: string;
  appointmentStatus?: 'accepted' | 'denied';
}

export interface ConfirmedAppointment {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarText: string;
  avatarGradient: string;
  service: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageDetailComponent, SettingsComponent, AppointmentsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  currentView: 'inbox' | 'appointments' | 'settings' = 'inbox';
  selectedMessage: MessageDetail | null = null;
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  searchQuery: string = '';
  filterOption: string = 'All messages';
  confirmedAppointments: ConfirmedAppointment[] = [
    {
      id: 'pre-1',
      customerName: 'Peter Janssen',
      customerEmail: 'p.janssen@mail.com',
      avatarText: 'PJ',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)',
      service: 'Trim & Beard',
      date: 'Monday, May 19, 2026',
      time: '09:00'
    }
  ];

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

    const aiAnswers: AiAnswer[] = message.isAppointmentRequest
      ? [
          {
            text: `Hey ${message.senderName.split(' ')[0]}! ${message.appointmentDate} at ${message.appointmentTime} works perfectly. See you then!`,
            tag: 'Confirm · Casual',
            tagType: 'confirm'
          },
          {
            text: `Good day, ${message.senderName}. We confirm your ${message.service} appointment on ${message.appointmentDate} at ${message.appointmentTime}. We look forward to seeing you.`,
            tag: 'Confirm · Formal',
            tagType: 'confirm'
          },
          {
            text: `Hey ${message.senderName.split(' ')[0]}, unfortunately ${message.appointmentDate} at ${message.appointmentTime} is already taken. Could you come by on Friday, May 23 at 10:00 instead? Let me know!`,
            tag: 'Decline · Casual',
            tagType: 'decline'
          },
          {
            text: `Dear ${message.senderName}, unfortunately we are fully booked on ${message.appointmentDate} at ${message.appointmentTime}. We would like to offer you an alternative: Friday, May 23 at 10:00. Please let us know if this suits you.`,
            tag: 'Decline · Formal',
            tagType: 'decline'
          }
        ]
      : [
          {
            text: 'Hey! Sure, tomorrow at 2pm works great. See you then!',
            tag: 'Informal',
            tagType: 'default'
          },
          {
            text: 'Good afternoon, tomorrow at 2:00 PM is available. We hereby confirm your appointment. See you tomorrow!',
            tag: 'Professional',
            tagType: 'default'
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
      aiAnswers: aiAnswers,
      isAppointmentRequest: message.isAppointmentRequest,
      appointmentDate: message.appointmentDate,
      appointmentTime: message.appointmentTime,
      service: message.service,
      appointmentStatus: message.appointmentStatus
    };
  }

  onBackFromDetail(): void {
    this.selectedMessage = null;
  }

  onReplyMessage(replyText: string): void {
    console.log('Reply:', replyText);
    this.selectedMessage = null;
  }

  onAcceptAppointment(): void {
    if (!this.selectedMessage) return;
    const message = this.messages.find(m => m.id === this.selectedMessage!.id);
    if (!message) return;
    message.appointmentStatus = 'accepted';
    this.selectedMessage.appointmentStatus = 'accepted';
    this.confirmedAppointments = [
      ...this.confirmedAppointments,
      {
        id: message.id,
        customerName: message.senderName,
        customerEmail: message.senderEmail,
        avatarText: message.avatarText,
        avatarGradient: message.avatarGradient,
        service: message.service ?? 'Appointment',
        date: message.appointmentDate ?? '',
        time: message.appointmentTime ?? ''
      }
    ];
    this.cdr.markForCheck();
  }

  onDenyAppointment(): void {
    if (!this.selectedMessage) return;
    const message = this.messages.find(m => m.id === this.selectedMessage!.id);
    if (!message) return;
    message.appointmentStatus = 'denied';
    this.selectedMessage.appointmentStatus = 'denied';
    this.cdr.markForCheck();
  }

  showSettings(): void {
    this.currentView = 'settings';
    this.selectedMessage = null;
  }

  showAppointments(): void {
    this.currentView = 'appointments';
    this.selectedMessage = null;
  }

  showInbox(): void {
    this.currentView = 'inbox';
  }
}
