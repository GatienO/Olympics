import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CardComponent } from 'src/app/components/card/card.component';


/**
 * DetailComponent
 *
 * This component displays detailed information for a specific country, including a line chart
 * showing the medals won by the country over the years. It uses the `OlympicService` to fetch data
 * and the Angular Router to navigate between views.
 */
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  /*List of all Olympic data.*/
  olympics: Olympic[] = [];


  /*Chart.js instance for rendering the line chart.*/
  chart: Chart | null = null;

   /* ID of the selected country extracted from the route parameters.*/
  countryId: number | null = null;

  /* Data for the selected country, if available.*/
  countryData: Olympic | null = null;


  /** Total number of medals won by the selected country. */
  totalMedals: number | null = null;

  /** Total number of athletes who participated for the selected country. */
  totalAthletes: number | null = null;


  /**
   * Constructor
   * @param olympicService Service to fetch Olympic data.
   * @param route ActivatedRoute to access route parameters.
   * @param router Angular Router for navigation.
   */
  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after the component's initialization.
   * Loads the initial data and retrieves the country data based on the route parameter.
   */
  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(() => {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        this.countryId = id ? parseInt(id, 10) : null;
        this.loadCountryData();
      });
    });
  }

   /**
   * Loads the data for the selected country based on the `countryId` from the route.
   * Calculates total medals and total athletes for the selected country.
   * If the country is not found, navigates back to the home page.
   */
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
          this.totalMedals = this.calculateTotalMedals();
          this.totalAthletes = this.calculateTotalAthletes();
          this.createChart();
        } else {
          console.warn('Aucun pays trouvé avec cet ID.');
          this.router.navigate(['/']);
        }
      }
    });
  }


    /**
   * Calcule le nombre total de médailles pour le pays sélectionné.
   * @returns Le nombre total de médailles ou null si aucun pays n'est sélectionné.
   */
    calculateTotalMedals(): number | null {
      if (!this.countryData || !this.countryData.participations) {
        return null;
      }
      return this.countryData.participations.reduce((total, participation) => total + participation.medalsCount, 0);
    }

    calculateTotalAthletes(): number | null {
      if (!this.countryData || !this.countryData.participations) {
        return null;
      }
      return this.countryData.participations.reduce((total, participation) => total + participation.athleteCount, 0);
    }

    /**
   * Creates a line chart showing the medals won by the selected country over the years.
   */
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



  /**
   * Navigates back to the home page.
   */
  retour(): void {
    this.router.navigate(['/']);
  }
}