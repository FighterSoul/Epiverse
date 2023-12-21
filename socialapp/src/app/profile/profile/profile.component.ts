import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';  // Add this line
  major: string = '';
  quote: string = '';
  courses: string = '';
  interests: string = '';
  showForm: boolean = false;
  profilePic: File | null = null;
  profilePicUrl: string = '../../assets/images/profilepic.png'; // Default image

  constructor(private sharedService: SharedService, private http: HttpClient) {
    this.username = this.sharedService.getSharedVariable();
    this.email = this.sharedService.getSecondSharedVariable();
  }

  ngOnInit(): void {
    this.http.get('http://localhost/freshstart/socialapp/src/app/profile/profile/profile.php', {
      params: new HttpParams().set('Username', this.username)
    }).subscribe((data: any) => {
      this.username = data.Username;
      this.email = data.Email;  // Update this line
      this.major = data.major;
      this.quote = data.quote;
      this.courses = data.courses;
      this.interests = data.interests;
      this.profilePicUrl = data['Profile-Picture']; // replace with the actual property name for the profile picture
    });
  }

  uploadProfilePic() {
    const formData = new FormData();
    if (this.profilePic) {
      formData.append('profilePic', this.profilePic);
      formData.append('username', this.username);
  
      this.http.post('http://localhost/freshstart/socialapp/src/app/profile/profile/profile.php', formData)
        .subscribe({
          next: (response: any) => {
            console.log('Server response: ', response);
            window.alert('Profile picture upload successful');
          },
          error: (error: any) => {
            console.error('There was an error!', error);
          }
        });
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.profilePic = inputElement.files[0];
      this.profilePicUrl = URL.createObjectURL(inputElement.files[0]);
      this.uploadProfilePic(); // upload the profile picture immediately after it's selected
    }
  }

  submitForm() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);  // Add this line
    formData.append('major', this.major);
    formData.append('quote', this.quote);
    formData.append('courses', this.courses);
    formData.append('interests', this.interests);
    
    this.http.post('http://localhost/freshstart/socialapp/src/app/profile/profile/profile.php', formData).subscribe({
      next: response => {
        console.log('Server response: ', response);
        window.alert('Profile update successful');
        location.reload(); // reload the page
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
}
