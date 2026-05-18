import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AppointmentRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarText: string;
  avatarGradient: string;
  service: string;
  requestedDate: string;
  requestedTime: string;
  note?: string;
  status: 'Pending' | 'Accepted' | 'Denied';
  receivedAt: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class AppointmentsComponent {
  activeFilter: 'Pending' | 'Accepted' | 'Denied' = 'Pending';

  requests: AppointmentRequest[] = [
    {
      id: '1',
      customerName: 'Jan Vermeulen',
      customerEmail: 'jan@example.nl',
      avatarText: 'JV',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)',
      service: 'Haircut',
      requestedDate: 'Thursday, May 22, 2026',
      requestedTime: '14:00',
      note: 'I would like a short cut on the sides and a bit longer on top.',
      status: 'Pending',
      receivedAt: '2 hours ago'
    },
    {
      id: '2',
      customerName: 'Sophie de Vries',
      customerEmail: 'sophie@bedrijf.nl',
      avatarText: 'SV',
      avatarGradient: 'linear-gradient(135deg, #a8d8ff 0%, #d4e8ff 100%)',
      service: 'Hair coloring',
      requestedDate: 'Friday, May 23, 2026',
      requestedTime: '10:30',
      status: 'Pending',
      receivedAt: '5 hours ago'
    },
    {
      id: '3',
      customerName: 'Anna Bakker',
      customerEmail: 'anna.bakker@mail.com',
      avatarText: 'AB',
      avatarGradient: 'linear-gradient(135deg, #ffa0a0 0%, #ffd4d4 100%)',
      service: 'Full treatment',
      requestedDate: 'Wednesday, May 21, 2026',
      requestedTime: '15:00',
      note: 'Highlights and a trim please.',
      status: 'Pending',
      receivedAt: '1 day ago'
    },
    {
      id: '4',
      customerName: 'Peter Janssen',
      customerEmail: 'p.janssen@mail.com',
      avatarText: 'PJ',
      avatarGradient: 'linear-gradient(135deg, #c4a0ff 0%, #e6ccff 100%)',
      service: 'Trim & Beard',
      requestedDate: 'Monday, May 19, 2026',
      requestedTime: '09:00',
      status: 'Accepted',
      receivedAt: '2 days ago'
    },
    {
      id: '5',
      customerName: 'Lars Meijer',
      customerEmail: 'lars@example.nl',
      avatarText: 'LM',
      avatarGradient: 'linear-gradient(135deg, #a0ffb4 0%, #d4ffe0 100%)',
      service: 'Haircut',
      requestedDate: 'Tuesday, May 20, 2026',
      requestedTime: '11:00',
      note: 'Sorry, I am no longer available this day.',
      status: 'Denied',
      receivedAt: '3 days ago'
    }
  ];

  get filteredRequests(): AppointmentRequest[] {
    return this.requests.filter(r => r.status === this.activeFilter);
  }

  get pendingCount(): number {
    return this.requests.filter(r => r.status === 'Pending').length;
  }

  accept(request: AppointmentRequest): void {
    request.status = 'Accepted';
  }

  deny(request: AppointmentRequest): void {
    request.status = 'Denied';
  }

  setFilter(filter: 'Pending' | 'Accepted' | 'Denied'): void {
    this.activeFilter = filter;
  }
}
