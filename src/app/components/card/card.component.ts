import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';



/**
 * CardComponent
 *
 * This component is a reusable card that displays a list of items. Each item contains a title and a numeric value.
 * It accepts data through an `@Input` property and displays the items dynamically in its template.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  
   /**
   * List of items to be displayed in the card.
   * Each item consists of a title and a value.
   */
  @Input() items: { title: string; value: number }[] = [];

  /**
   * Lifecycle hook that is called after the component is initialized.
   * Logs the received items to the console for debugging purposes.
   */
  ngOnInit() {
    console.log('Received items:', this.items);
  }
}