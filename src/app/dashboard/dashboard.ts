import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  selectedMessage: MessageDetail | null = null;

  messages: Message[] = [
    {
      id: '1',
      senderName: 'Jan Vermeulen',
      senderEmail: 'jan@example.nl',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)',
      avatarText: 'JV',
      messageText: 'Hallo, ik heb een vraag over jullie diensten. Ik ben geïnteresseerd in een offerte voor een website voor mijn bedrijf. Kunnen jullie contact met mij opnemen?',
      status: 'Nieuw',
      time: '18s',
      date: '15 dagen geleden'
    },
    {
      id: '2',
      senderName: 'Sophie de Vries',
      senderEmail: 'sophie@bedrijf.nl',
      avatarGradient: 'linear-gradient(135deg, #a8d8ff 0%, #d4e8ff 100%)',
      avatarText: 'SV',
      messageText: 'Goedemiddag, ik zou graag meer informatie willen ontvangen over jullie prijzen en pakketten. Werken jullie ook met maandelijkse betalingen?',
      status: 'Nieuw',
      time: '15 dagen',
      date: '15 dagen geleden'
    },
    {
      id: '3',
      senderName: 'Peter Janssen',
      senderEmail: 'p.janssen@mail.com',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)',
      avatarText: 'PJ',
      messageText: 'Ik heb vorige week een aanvraag gedaan maar nog geen reactie ontvangen. Wanneer kan ik een terugkoppeling verwachten? Het is nogal urgent voor ons.',
      status: 'Gelezen',
      time: '16 dagen',
      date: '16 dagen geleden'
    }
  ];

  searchQuery: string = '';
  filterOption: string = 'Alle berichten';

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
  }

  onFilterChange(option: string): void {
    this.filterOption = option;
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
