import { Component, OnInit } from '@angular/core';
import { OlympicDataService } from "../../services/olympic-data.service";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  countries: any[] = [];

  constructor(private dataService: OlympicDataService) {}

  ngOnInit(): void {
    this.dataService.getOlympicData().subscribe((data) => {
      this.countries = data.countries;
    });
  }

}
