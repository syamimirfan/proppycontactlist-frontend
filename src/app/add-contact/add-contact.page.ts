import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonButtons, IonBackButton, IonRow, IonCol, IonFooter, IonGrid } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: true,
  imports: [IonGrid, IonFooter, IonCol, IonRow, IonBackButton, IonButtons, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AddContactPage {
  name!: string;
  phone_number!: string;
  email!: string;

  constructor(private alertController: AlertController, private router: Router) {}

  isFormValid(): boolean {
    // Check if all required fields are not null or empty
    return !!this.name && !!this.phone_number && !!this.email;
  }

  async createContact() {
    const contact = {
      name: this.name,
      phone_number: this.phone_number,
      email: this.email
    };
 
    if (this.isFormValid()) {
      try {
        const response = await axios.post(`${environment.apiUrl}/add`, contact);
        if (response.status === 201) {
          this.showSuccessAlert();
        } else {
          this.showErrorAlert();
        }
      } catch (error) {
        console.error('Error creating contact:', error);
        this.showErrorAlert();
      }
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Contact created successfully!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          }
        }
      ]
    });

    await alert.present();
    this.clearInputs();
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Failed to create contact. Please try again later.`,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });

    await alert.present();
    this.clearInputs();
  }

  clearInputs() {
    this.name = '';
    this.phone_number = '';
    this.email = '';
  }

  async home() {
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }
}
