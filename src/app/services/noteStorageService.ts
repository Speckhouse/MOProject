import {Component, Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})

//takes care of managing notes, is a singleton
export class NoteStorageService {
  private storageInstance: Storage | null = null;
  //the map, primary way of storing notes
  private notesMap: Map<number, Note> = new Map();
  //the array sorted by date, it is derived, and only used as a cache to make loading notes on home screen faster
  private notesArrayDateSorted: Array<Note> = null;
  private currentId: number = -1;


  constructor(private storageMaker: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storageInstance = await this.storageMaker.create();

    // Initialise values, check if they are actually in permanent storage, if not, storageInstance.get will return null
    // and blank ones are created, if yes, they are initialised from there
    this.currentId = await this.storageInstance.get('currentId');
    if (!this.currentId || isNaN(this.currentId)){
      this.currentId = 0;
    }

    const objectmap: Map<number, object> = await this.storageInstance.get('Notes');
    this.notesMap = new Map<number, Note>();
    if (objectmap){
      for (const [index, object] of objectmap){
        this.notesMap.set(index, Note.fromObject(object));
      }
    }
    this.notesArrayDateSorted = [...this.notesMap.values()];
    if (!this.notesArrayDateSorted){
      this.notesArrayDateSorted = [];
    }
    this.notesArrayDateSorted.sort(Note.compareDates);
  }

  //create and add note
  public addNote(title: string, datetime: string, note: string) {

    //create the new note object
    const noteobject: Note = new Note(this.currentId, title, datetime, note);
    this.notesMap.set(this.currentId, noteobject);

    // determine next id for new note and save it in storage
    while (this.notesMap.has(this.currentId)){
      this.currentId = this.currentId + 1;
      if (this.currentId > Number.MAX_SAFE_INTEGER){
        this.currentId = 0;
      }
    }
    // save note and into permanent storage
    this.storageInstance.set('currentId', this.currentId);
    this.storageInstance.set('Notes', this.notesMap);
    // update time sorted array
    this.notesArrayDateSorted.push(noteobject);
    this.notesArrayDateSorted.sort(Note.compareDates);
  }

  public editNote(id: number, title: string, datetime: string, note: string) {
    this.notesMap.get(id).edit(title, datetime, note);
    this.notesArrayDateSorted.sort(Note.compareDates);
  }

  async getNotes(){
    while(!this.notesArrayDateSorted){}
    return this.notesArrayDateSorted;
  }

  public getNodeById(id: number){
    return this.notesMap.get(id);
  }

  //this is so innefficient, but screw it, if I did it again, i'd keep the sorted list and construct the map
  public remove(id: number) {
    this.notesMap.delete(id);
    this.notesArrayDateSorted = [...this.notesMap.values()];
    this.notesArrayDateSorted.sort(Note.compareDates);
    this.storageInstance.set('Notes', this.notesMap);
  }
}

// The object for storing data about nodes
export class Note {
  constructor(private _id: number, public title: string, public datetime: string, public note: string) {
  }

  public get shortnote(): string {
    if (this.note.length < 200) {return this.note;}
    return this.note.slice(0, 200).concat('(...)');
  }

  // getters to make things smoother in templates
  public get id() {
    // eslint-disable-next-line no-underscore-dangle
    return this._id;
  }
  public get getDay(){
    return new Date(this.datetime).toLocaleDateString();
  }

  public get getTime(){
    return new Date(this.datetime).toLocaleTimeString();
  }

  // Create Note object from generic object. Permanent storage only stores generic objects and properties
  // not methods, and generic objects are crap to work with
  static fromObject(obj: object) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return new Note(obj['_id'], obj['title'], obj['datetime'], obj['note']);
  }

  // Used for sorting by date, defines which one is 'bigger'
  static compareDates(a: Note, b: Note) {
    return a.datetime.localeCompare(b.datetime)*(-1);
  }

  public edit(title: string, datetime: string, note: string) {
    this.title = title;
    this.datetime = datetime;
    this.note = note;
  }


}
