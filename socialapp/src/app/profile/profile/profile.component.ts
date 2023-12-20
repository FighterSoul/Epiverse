import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  ngOnInit(): void {
    // Initialization logic here
  }

  username: string = '';
  email: string = '';
  major: string = '';
  quote: string = '';
  courses: string[] = [];
  interests: string[] = [];
  showForm: boolean = false;
  profilePic: File | null = null;

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.username = this.sharedService.getSharedVariable();
    console.log('Shared variable:', this.sharedService.getSharedVariable());

    this.email = this.sharedService.getSecondSharedVariable();
    console.log('Second shared variable:', this.sharedService.getSecondSharedVariable());

    console.log(this.username);
    console.log(this.email);
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.profilePic = inputElement.files[0]; // Update profilePic with the selected file
    } else {
      this.profilePic = null; // If no file is selected, set profilePic to null
    }
  }

  submitForm() {
    const formData = new FormData();
    formData.append('major', this.major);
    formData.append('quote', this.quote);
    formData.append('courses', this.courses.join(', '));
    formData.append('interests', this.interests.join(', '));
    if (this.profilePic) {
      formData.append('profilePic', this.profilePic);
    }

    this.http.post('http://localhost/profile.php', formData)
      .subscribe(response => {
        // handle successful response
        console.log(response);
      }, error => {
        // handle error response
        console.error(error);
      });

    this.showForm = false;
  }
}