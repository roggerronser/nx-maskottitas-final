import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { url: string; nombre: string }
  ) {}
}
