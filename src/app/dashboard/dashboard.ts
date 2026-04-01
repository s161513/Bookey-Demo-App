import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Kpi = {
  label: string;
  value: string;
  deltaLabel: string;
  deltaType: 'up' | 'down' | 'neutral';
};

type Ticket = {
  id: string;
  subject: string;
  customer: string;
  status: 'Open' | 'In behandeling' | 'Wacht op klant' | 'Gesloten';
  priority: 'Laag' | 'Normaal' | 'Hoog';
  updatedAt: string;
};

type AiAnswer = {
  question: string;
  answer: string;
  sources: string[];
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly companyName = 'Bookey BV';

  protected readonly kpis: Kpi[] = [
    {
      label: 'Omzet (MTD)',
      value: '€ 128.430',
      deltaLabel: '+8,2% vs vorige maand',
      deltaType: 'up'
    },
    {
      label: 'Nieuwe leads',
      value: '342',
      deltaLabel: '-3,1% vs vorige maand',
      deltaType: 'down'
    },
    {
      label: 'Actieve klanten',
      value: '1.284',
      deltaLabel: '+1,4% vs vorige maand',
      deltaType: 'up'
    },
    {
      label: 'Support SLA',
      value: '97,6%',
      deltaLabel: 'stabiel',
      deltaType: 'neutral'
    }
  ];

  protected readonly tickets = signal<Ticket[]>([
    {
      id: 'TCK-1048',
      subject: 'Factuur komt dubbel binnen',
      customer: 'Van Dijk Transport',
      status: 'In behandeling',
      priority: 'Hoog',
      updatedAt: 'Vandaag 10:12'
    },
    {
      id: 'TCK-1042',
      subject: 'Inloggen lukt niet met SSO',
      customer: 'Koster & Zn.',
      status: 'Open',
      priority: 'Normaal',
      updatedAt: 'Gisteren 16:50'
    },
    {
      id: 'TCK-1039',
      subject: 'Export naar Excel is leeg',
      customer: 'Noordhout',
      status: 'Wacht op klant',
      priority: 'Normaal',
      updatedAt: 'Gisteren 09:03'
    },
    {
      id: 'TCK-1031',
      subject: 'Abonnement wijzigen',
      customer: 'Studio Lumen',
      status: 'Gesloten',
      priority: 'Laag',
      updatedAt: 'Ma 13:22'
    }
  ]);

  protected readonly aiAnswers = signal<AiAnswer[]>([
    {
      question: 'Waarom daalde het aantal leads in week 2?',
      answer:
        'Week 2 had minder instroom door lagere advertentie spend en een tijdelijke daling in conversie op de landingspagina. De grootste impact kwam van kanaal “Search” (-14%) en “Social” (-9%).',
      sources: ['Marketing dashboard', 'Campaign spend', 'Landing page analytics']
    },
    {
      question: 'Welke klanten hebben het hoogste churn risico?',
      answer:
        'Op basis van gebruik (logins, feature adoptie) en support volume lijken “Koster & Zn.” en “Noordhout” verhoogd risico te hebben. Advies: plan een check‑in en bied onboarding voor de nieuwe workflow aan.',
      sources: ['Product usage', 'Support tickets', 'Account health model']
    }
  ]);

  protected readonly selectedAiIndex = signal(0);
  protected readonly question = signal('');

  protected readonly selectedAi = computed(() => {
    const list = this.aiAnswers();
    return list[this.selectedAiIndex()] ?? null;
  });

  protected setSelectedAi(index: number) {
    this.selectedAiIndex.set(index);
  }

  protected ask() {
    const q = this.question().trim();
    if (!q) return;

    const newCard: AiAnswer = {
      question: q,
      answer:
        'Demo antwoord: Ik heb je vraag gezien. In een echte app zou dit vanuit een (RAG) AI‑service komen met bronnen en context uit je bedrijfsdata.',
      sources: ['Demo dataset']
    };

    this.aiAnswers.update((cards) => [newCard, ...cards]);
    this.selectedAiIndex.set(0);
    this.question.set('');
  }

  protected trackByIndex = (i: number) => i;
}
