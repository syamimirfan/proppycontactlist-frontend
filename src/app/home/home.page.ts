import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonIcon, IonNote, IonLabel, IonButtons, IonButton, IonFab, IonFabButton, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, search } from 'ionicons/icons';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonSearchbar, IonFabButton, IonFab, IonButton, IonButtons, IonLabel, IonNote, IonIcon, IonAvatar, IonItem, IonList, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  contacts: any[] = [];

  filteredContacts: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.fetchContacts();
  }

  async fetchContacts() {
    try {
      const response = await axios.get(`${environment.apiUrl}/list`);
      this.contacts = response.data;
      this.filteredContacts = this.contacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }

  searchContacts(event: CustomEvent) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.phone_number.toLowerCase().includes(searchTerm) || 
      contact.email.toLowerCase().includes(searchTerm)
    );
  }

  constructor(private router: Router, private alertController: AlertController) {
    addIcons({ search, trash, create, add });
  }

  ionViewWillEnter() {
    this.filteredContacts = this.contacts;
  }

  async updateContact(contact: any) {
    this.router.navigate([`update-contact/${contact.id}`]);
  }

  async deleteContact(contact: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${contact.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              const response = await axios.delete(`${environment.apiUrl}/remove/${contact.id}`);
              if (response.status === 200) {
                this.contacts = this.contacts.filter(c => c.id !== contact.id);
                this.filteredContacts = this.filteredContacts.filter(c => c.id !== contact.id);
              } else {
                this.showErrorAlert();
              }
            } catch (error) {
              console.error('Error deleting contact:', error);
              this.showErrorAlert();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Failed to delete contact. Please try again later.`,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });

    await alert.present();
  }

  addContact() {
    this.router.navigate(['add-contact']);
  }
}
