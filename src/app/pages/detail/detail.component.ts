import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  olympics: Olympic[] = [];
  chart: Chart | null = null;
  countryId: number | null = null;
  countryData: Olympic | null = null;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(() => {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this.countryId = id ? parseInt(id, 10) : null;
        this.loadCountryData();
      });
    });
  }

  loadCountryData(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      if (!data) {
        console.error('Aucune donnée reçue !');
        return;
      }
  
      this.olympics = data;
      console.log('Données olympiques reçues :', this.olympics);
  
      if (this.countryId !== null) {
        this.countryData = this.olympics.find(
          (country) => country.id === this.countryId
        ) || null;
  
        if (this.countryData) {
          console.log('Données du pays sélectionné :', this.countryData);
          this.createChart();
        } else {
          console.warn('Aucun pays trouvé avec cet ID.');
          this.router.navigate(['/']);
        }
      }
    });
  }

  createChart(): void {
    if (!this.countryData) {
      return;
    }

    const labels = this.countryData.participations.map(
      (p) => p.year
    );
    const data = this.countryData.participations.map(
      (p) => p.medalsCount
    );
    this.chart = new Chart('detailChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Médailles pour ${this.countryData.country}`,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  retour(): void {
    this.router.navigate(['/']);
  }
}