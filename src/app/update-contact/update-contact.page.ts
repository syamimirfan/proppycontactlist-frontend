import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonButtons, IonBackButton, IonRow, IonCol, IonFooter, IonGrid } from '@ionic/angular/standalone';
import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-update-contact',
  templateUrl: './update-contact.page.html',
  styleUrls: ['./update-contact.page.scss'],
  standalone: true,
  imports: [IonGrid, IonFooter, IonCol, IonRow, IonBackButton, IonButtons, IonInput, IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})

export class UpdateContactPage implements OnInit {
  contactId!: string;

  name!: string;
  phone_number!: string;
  email!: string;

  constructor(private route: ActivatedRoute, private router: Router, private alertController: AlertController) { }


  ngOnInit(): void {
    //get the id string from params
    this.route.params.subscribe(params => {
      this.contactId = params['id'];
    });
  }

  async updateContact() {
    const contact = {
        name: this.name,
        phone_number: this.phone_number,
        email: this.email
      };

    try {
      const response = await axios.patch(`${environment.apiUrl}/update/${this.contactId}`, contact);
      if (response.status === 200) {
        this.showSuccessAlert();
      } else {
        this.showErrorAlert();
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Contact updated successfully!',
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
      message: `Failed to update contact. Please try again later.`,
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