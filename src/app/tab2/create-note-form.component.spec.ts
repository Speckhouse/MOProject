import {CreateNoteFormComponent} from './create-note-form.component';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

describe('CreateForm', () => {
  let component: CreateNoteFormComponent;
  let fixture: ComponentFixture<CreateNoteFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNoteFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNoteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
  });
});
