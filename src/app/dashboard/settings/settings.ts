import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TeamMember {
  name: string;
  email: string;
  role: 'Admin' | 'Member';
  avatarText: string;
  avatarGradient: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent {
  @Output() close = new EventEmitter<void>();

  activeTab: 'team' | 'language' | 'ai' = 'team';

  teamMembers: TeamMember[] = [
    {
      name: 'Katrien Pieters',
      email: 'katrien@kapperkatrien.nl',
      role: 'Admin',
      avatarText: 'KP',
      avatarGradient: 'linear-gradient(135deg, #0066ff 0%, #66b3ff 100%)'
    },
    {
      name: 'Lien Claes',
      email: 'lien@kapperkatrien.nl',
      role: 'Member',
      avatarText: 'LC',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)'
    }
  ];

  showInviteForm = false;
  inviteEmail = '';
  inviteRole: 'Admin' | 'Member' = 'Member';

  selectedLanguage = 'nl';
  languages = [
    { code: 'nl', label: 'Dutch' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' }
  ];

  aiSuggestionsEnabled = true;
  autoAnswerText = false;
  autoAnswerVoice = false;
  autoAnswerStyle: 'informal' | 'professional' = 'professional';
  confidenceThreshold = 80;

  onClose(): void {
    this.close.emit();
  }

  setTab(tab: 'team' | 'language' | 'ai'): void {
    this.activeTab = tab;
  }

  toggleInviteForm(): void {
    this.showInviteForm = !this.showInviteForm;
    this.inviteEmail = '';
    this.inviteRole = 'Member';
  }

  sendInvite(): void {
    if (!this.inviteEmail.trim()) return;
    this.showInviteForm = false;
    this.inviteEmail = '';
    this.inviteRole = 'Member';
  }

  removeMember(member: TeamMember): void {
    this.teamMembers = this.teamMembers.filter(m => m !== member);
  }
}
