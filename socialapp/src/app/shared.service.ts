import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sharedVariable: string = '';  // Initialize sharedVariable with an empty string
  private secondSharedVariable: string = '';  // Initialize sharedVariable with an empty string
  private thirdSharedVariable: number = 0;  // Initialize sharedVariable with an empty string

  constructor() { }

  setThirdSharedVariable(value: number) {
    this.thirdSharedVariable = value;
    localStorage.setItem('thirdSharedVariable', value.toString());
  }

  setSharedVariable(value: string) {
    this.sharedVariable = value;
    localStorage.setItem('sharedVariable', value);
  }

  setSecondSharedVariable(value: string) {
    this.secondSharedVariable = value;
    localStorage.setItem('secondSharedVariable', value);
  }

  getSharedVariable() {
    if (!this.sharedVariable) {
      this.sharedVariable = localStorage.getItem('sharedVariable') || '' ;
    }
    return this.sharedVariable;
  }

  getSecondSharedVariable() {
    if (!this.secondSharedVariable) {
      this.secondSharedVariable = localStorage.getItem('secondSharedVariable') || '';
    }
    return this.secondSharedVariable;
  }

  getThirdSharedVariable() {
    if (!this.thirdSharedVariable) {
      this.thirdSharedVariable = Number(localStorage.getItem('thirdSharedVariable'));
    }
    return this.thirdSharedVariable;
  }
}