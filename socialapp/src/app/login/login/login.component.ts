import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  constructor(private router: Router, private http: HttpClient,private sharedService: SharedService) { }
  ngOnInit() {
    // Use the service to get the shared variable
    const sharedVariable = this.sharedService.getSharedVariable();
    const sharedVariable2 = this.sharedService.getSecondSharedVariable();
    console.log(sharedVariable);
  }
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  username: string = '';  // Changed from email to username
  password: string = '';
  clickedd: boolean = true;
  errorMessage: string = '';
  
  submitForm() {
    const params = new HttpParams()
      .set('username', this.username)
      .set('password', this.password);  // Add password to the request parameters
  
    this.http.post<any>('http://localhost/freshstart/socialapp/src/app/login/login/login.php', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .subscribe({
      next: (response) => {
        console.log('Response:', response);  // Log the response
        console.log('User:', response.user);  // Log the user
  
        if (response && response.message === 'User exists') {
          console.log('User exists');
          // If the login is successful, store the username and email in local storage
          this.sharedService.setSharedVariable(this.username);
          console.log(response.user);
          this.sharedService.setSecondSharedVariable(response.user.Email);
          this.sharedService.setThirdSharedVariable(response.user.UserID);
          this.onSubmit.emit(true);
          this.router.navigate(['/feed']);
        } else {
          this.errorMessage = 'Invalid username or password';  // Update error message
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred during login';
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
  clicked() {
    this.clickedd = false;
  }
}