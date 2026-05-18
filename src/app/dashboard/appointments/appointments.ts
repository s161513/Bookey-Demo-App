import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmedAppointment } from '../dashboard';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class AppointmentsComponent {
  @Input() appointments: ConfirmedAppointment[] = [];

  get groupedAppointments(): { date: string; items: ConfirmedAppointment[] }[] {
    const map = new Map<string, ConfirmedAppointment[]>();
    for (const appt of this.appointments) {
      const group = map.get(appt.date) ?? [];
      group.push(appt);
      map.set(appt.date, group);
    }
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
  }
}
