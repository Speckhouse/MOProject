import {Component, OnInit} from '@angular/core';
import { NoteStorageService } from '../services/noteStorageService';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CreateNoteFormComponent} from './create-note-form.component';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  public id = -1;

  constructor(private storage: NoteStorageService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
  }

  // when coming to page, check for the 'id' URL parameter, if there is one, initialise id to it,
  // the create-note-form component will switch into editing mode, and load up the form with the Note's data
  ngOnInit(){
    if (this.route.snapshot.paramMap.has('id')){
      this.id = parseInt(this.route.snapshot.paramMap.get('id'),10);
    }
  }
}
