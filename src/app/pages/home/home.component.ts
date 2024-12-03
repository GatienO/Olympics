import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  chart: any;
  public olympics$: Observable<any> = of(null);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {

    this.olympics$ = this.olympicService.getOlympics();
    console.log(this.olympics$);


    this.olympicService.getOlympics().subscribe(data => {
      const countries = data.map((item: any) => item.country); // Noms des pays
      const participations = data.map((item: any) => 
        item.participations.reduce((sum: number, p: any) => sum + p.medalsCount, 0)
      );
      this.createChart(countries, participations);
    });
  }


  createChart(countries: string[], participations: number[]) {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Total Medals',
            data: participations,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
  
}







