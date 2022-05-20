import {Component, OnInit} from '@angular/core';
import {Note, NoteStorageService} from "../services/noteStorageService";
import {Joke, JokeRestApiService} from "../services/joke-rest-api.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  items: Array<Note>;
  lastDate: string;
  joke: any = {value: ''};

  constructor(private noteStorage: NoteStorageService, public jokeService: JokeRestApiService) {
    //this.items = [...await this.noteStorage.getNotes()];
    this.lastDate = ' ';
  }

  public dateSameAsLast(index: number){
    if (index === 0) {return false;}
    return this.items[index].getDay.localeCompare(this.items[index-1].getDay) === 0;
  }

  async refreshScroll(){
    this.items = [...await this.noteStorage.getNotes()];
  }

  ionViewDidEnter() {
    this.jokeService.getJoke().toPromise().then((response) => {
      this.joke = response;
    });
  }

  //while entering the page, refresh the available notes
  ionViewWillEnter(){
    this.refreshScroll();
  }
}
