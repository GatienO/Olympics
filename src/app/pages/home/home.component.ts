import { Component, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  olympics: Olympic[] = [];
  chart: any;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe((data) => {
      this.olympics = data;
      this.createChart();
    });
  }

  createChart(): void {
    const labels = this.olympics.map((country) => country.country);
    const data = this.olympics.map((country) =>
      country.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    );


    this.chart = new Chart('homeChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Médailles',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCountry = this.olympics[index];
            this.router.navigate(['/detail', selectedCountry.id]);
          }
        },
      },
    });
  }
}






