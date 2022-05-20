/* eslint-disable @typescript-eslint/no-inferrable-types,no-underscore-dangle */
import { Component, Input } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Note, NoteStorageService} from '../services/noteStorageService';
import {Router} from '@angular/router';
import {Moment} from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-create-note-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="store()">
      <ion-item *ngIf="displayEditing">
        <ion-label>Editing note: {{title}}</ion-label>
      </ion-item>
      <ion-item>
        <ion-label>Title:</ion-label>
        <ion-input type="text" formControlName="title" [value]="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-accordion-group>
          <ion-accordion>
            <ion-item slot="header">
              <ion-label>Date: {{timeNice}}</ion-label>
            </ion-item>
            <ion-item slot="content">
              <ion-datetime hour-cycle="h12" locale="en-CZ" formControlName="date" [value]="dateTime"></ion-datetime>
            </ion-item>
          </ion-accordion>
        </ion-accordion-group>
      </ion-item>
      <ion-item>
        <ion-label>Note:</ion-label>
        <ion-textarea auto-grow="true" formControlName="note" [value]="note"></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-button (click)="store()" *ngIf="displayCreate">Create</ion-button>
        <ion-button (click)="edit()" *ngIf="displayEditing">Edit</ion-button>
        <ion-button (click)="delete()" *ngIf="displayEditing">Delete</ion-button>
      </ion-item>
    </form>
  `,
  styleUrls: ['create-note-form.component.scss']
})

export class CreateNoteFormComponent {

  //the @input can be set up when this component is used in the HTML template, see tab2.page.html
  @Input() title: string = '';
  @Input() dateTime: string = moment().toISOString(true);
  @Input() note: string ='';

  public form: FormGroup;

  private _id: number = -1;
  // storage is injected here according to settings in app.module.ts
  constructor(private storage: NoteStorageService, private formBuilder: FormBuilder, private router: Router) {
    this.createForm();
  }

  //info for the HTML template
  public get displayCreate(){
    return this.id < 0;
  }

  public get displayEditing(){
    return this.id >= 0;
  }

  public get timeNice() {
    const date = new Date(this.form.get('date').value);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  public get id(){
    return this._id;
  }

  //when Id is changed, check if we are editing. If we are, load all other values from the edited Note
  @Input() set id(value: number){
    this._id = value;
    if (value > -1) {
      this.loadById(this._id);
    }
  }

  //initialisation of the form
  createForm() {
    this.form = this.formBuilder.group({
      title: [this.title, Validators.required],
      date: [this.dateTime, Validators.required],
      note: [this.note],
    });
  }

  //quick way to clean up values in the form
  public clearValues(){
    this.id = -1;
    this.title = '';
    this.dateTime = moment().toISOString(true);
    this.note = '';
  }

  //manipulation with the note, calls methods from noteStorageService, triggered by various buttons in HTML
  public store(){
    this.storage.addNote(this.form.get('title').value, this.form.get('date').value, this.form.get('note').value);
    this.clearValues();
    this.router.navigate(['tabs']);
  }

  public edit(){
    this.storage.editNote(this.id, this.form.get('title').value, this.form.get('date').value, this.form.get('note').value);
    this.router.navigate(['tabs']);
  }

  public delete(){
    this.storage.remove(this.id);
    this.router.navigate(['tabs']);
  }

  // grab a Note with given id from storage and fill out the form with its data
  public loadById(id: number){
    const note = this.storage.getNodeById(id);
    this.title = note.title;
    this.dateTime = note.datetime;
    this.note = note.note;
  }
}
