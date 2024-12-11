import { Component, OnDestroy, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';
import { Olympic } from 'src/app/core/models/Olympic';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CardComponent } from 'src/app/components/card/card.component'; // Import du composant standalone

/**
 * HomeComponent
 *
 * This component displays a summary of Olympic data including a pie chart of total medals won by each country.
 * It fetches the data from the OlympicService and provides navigation to detailed views of individual countries.
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  /*List of Olympic data fetched from the service.*/
  olympics: Olympic[] = [];

  /*Instance of the Chart.js chart displayed in the component.*/
  chart: any;

  /*Subject used to manage the lifecycle of subscriptions and avoid memory leaks.*/
  private destroy$ = new Subject<void>();


   /**
   * Constructor
   * @param olympicService Service to fetch Olympic data.
   * @param router Angular Router for navigation.
   */

  constructor(private olympicService: OlympicService, private router: Router) {}


   /**
   * Lifecycle hook that is called after component initialization.
   * Fetches Olympic data and initializes the chart.
   */
  ngOnInit(): void {
    this.olympicService.getOlympics()
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.olympics = data;
      this.createChart();
    });
  }



  /**
   * Calculates the total number of participations across all countries.
   * @returns The total number of participations.
   */
  getTotalParticipations(): number {
    const uniqueYears = new Set<number>();

    this.olympics.forEach((country) => {
      country.participations.forEach((participation) => {
        uniqueYears.add(participation.year);
      });
    });

    return uniqueYears.size;
  }



  /**
   * Creates and initializes a pie chart to display the total medals won by each country.
   */
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

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Cleans up resources and unsubscribes from observables.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}






