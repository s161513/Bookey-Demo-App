import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface MessageDetail {
  id: string;
  senderName: string;
  senderEmail: string;
  avatarGradient: string;
  avatarText: string;
  messageText: string;
  messageType: 'Voice message' | 'Text message';
  time: string;
  date: string;
  timestamp: string;
  aiAnswers?: AiAnswer[];
}

export interface AiAnswer {
  text: string;
  tag?: string;
}

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-detail.html',
  styleUrl: './message-detail.css',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    app-message-detail {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      min-height: 0;
    }
  `]
})
export class MessageDetailComponent {
  @Input() message!: MessageDetail;
  @Output() backClick = new EventEmitter<void>();
  @Output() sendReply = new EventEmitter<string>();

  replyText: string = '';
  selectedAiAnswerText: string | null = null;

  onBackClick(): void {
    this.backClick.emit();
  }

  onSendReply(): void {
    const textToSend = this.replyText.trim() || this.selectedAiAnswerText;
    if (textToSend) {
      this.sendReply.emit(textToSend);
      this.replyText = '';
      this.selectedAiAnswerText = null;
    }
  }

  onDiscardReply(): void {
    this.replyText = '';
  }

  onKeyDownEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
      event.preventDefault();
      this.onSendReply();
    }
  }

  useAiAnswer(answerText: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.replyText = answerText;
    this.selectedAiAnswerText = null;
  }

  onReplyTextChange(): void {
    if (this.replyText.trim()) {
      this.selectedAiAnswerText = null;
    }
  }

  selectAiAnswer(answerText: string): void {
    this.selectedAiAnswerText = answerText;
  }
}
