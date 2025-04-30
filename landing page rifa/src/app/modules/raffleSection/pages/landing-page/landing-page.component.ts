import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PurchaseService } from '../../shared/services/purchase.service';
import { RaffleService } from '../../shared/services/raffle.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Raffle } from '../../models/raffle.model';
import { Purchase } from '../../models/purchase';
import { switchMap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatButtonToggleModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ]
})
export class LandingPageComponent implements OnInit {
  @ViewChild('productSection') productSection!: ElementRef;
  @ViewChild('ticketsSection') ticketsSection!: ElementRef;
  @ViewChild('bankSection') bankSection!: ElementRef;
  @ViewChild('contactSection') contactSection!: ElementRef;

  purchaseForm: FormGroup;
  ticketQuantity: number = 1;
  totalAmount: number = 0;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  TICKET_PRICE: number = 0;
  MAX_TICKETS: number = 0;
  selectedBankIndex: number = 0;
  isMobileMenuOpen: boolean = false;
  raffleData: Raffle | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  currentYear = new Date().getFullYear();

  banks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private raffleService: RaffleService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.purchaseForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]]
    });
  }

  ngOnInit(): void {
    const guid = this.route.snapshot.paramMap.get('id');
    if (guid) {
      this.loadRaffleData(guid);
    } else {
      this.showError('No se encontró el identificador de la rifa');
    }
  }

  private loadRaffleData(guid: string): void {
    this.isLoading = true;
    this.raffleService.getRaffleById(guid).then((data: Raffle | null) => {
        if (data) {
          this.raffleData = data;
          this.TICKET_PRICE = data.ticketPrice;
          this.MAX_TICKETS = data.maxTickets;
          this.banks = data.banks;
          this.calculateTotal();
          this.isLoading = false;
        } else {
          this.showError('No se encontró la rifa');
          this.isLoading = false;
        }
      },
      (error) => {
        this.showError('Error al cargar los datos de la rifa');
        this.isLoading = false;
      }
    );
  }

  calculateTotal(): void {
    this.totalAmount = this.ticketQuantity * this.TICKET_PRICE;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.raffleData) {
      this.showError('No se han cargado los datos de la rifa');
      return;
    }

    if (this.purchaseForm.valid && this.selectedFile) {
      const formData = {
        ...this.purchaseForm.value,
        ticketQuantity: this.ticketQuantity,
        totalAmount: this.totalAmount,
        selectedBank: this.banks[this.selectedBankIndex].name,
        raffleId: this.raffleData.id
      };
      
      const validationErrors = this.purchaseService.validateForm(formData);
      if (validationErrors.length > 0) {
        this.showError(validationErrors.join('\n'));
        return;
      }

      // Primero creamos la compra
      this.purchaseService.submitPurchase(formData).pipe(
        // Luego subimos el archivo y actualizamos la compra
        switchMap(purchaseId => 
          this.purchaseService.uploadPaymentProof(purchaseId, this.selectedFile!)
        )
      ).subscribe({
        next: (url) => {
          this.showSuccess('¡Compra realizada con éxito!');
          this.resetForm();
        },
        error: (error) => {
          this.showError('Error al procesar la compra. Por favor, intente nuevamente.');
        }
      });
    } else {
      this.showError('Por favor, complete todos los campos requeridos y suba el comprobante de pago.');
    }
  }

  addTickets(amount: number): void {
    const newQuantity = this.ticketQuantity + amount;
    this.ticketQuantity = Math.min(newQuantity, this.MAX_TICKETS);
    this.calculateTotal();
  }

  selectBank(index: number): void {
    this.selectedBankIndex = index;
  }

  scrollToSection(element: HTMLElement | ElementRef) {
    const targetElement = element instanceof ElementRef ? element.nativeElement : element;
    targetElement.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private resetForm() {
    this.purchaseForm.reset();
    this.ticketQuantity = 1;
    this.calculateTotal();
    this.selectedFile = null;
    this.selectedBankIndex = 0;
  }
}
