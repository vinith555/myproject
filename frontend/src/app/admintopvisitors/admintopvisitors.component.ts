import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingService } from '../upcoming.service';
import { PeronDetailService } from '../peron-detail.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admintopvisitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admintopvisitors.component.html',
  styleUrls: ['./admintopvisitors.component.css']
})
export class AdmintopvisitorsComponent implements OnInit {
  todayDate: string;
  @ViewChild('f') form!: NgForm;
  total: number = 0;
  completed: number = 0;
  upcoming: number = 0;

  upCome: Array<{ guestName: string; eventName: string; date: string; _id?: string }> = [];

  constructor(private upco: UpcomingService, private perser: PeronDetailService) {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.completed = 20;

    this.upco.getUpcomingEv().subscribe(
      (events) => {
        this.upCome = events;
        this.upcoming = this.upCome.length;
        this.total = this.completed + this.upcoming;
      },
      (error) => {
        console.error('Error fetching upcoming events:', error);
      }
    );
  }

  removeData(index: number) {
    const eventToRemove = this.upCome[index];

    if (eventToRemove._id) {
      this.upco.deleteEv(eventToRemove._id).subscribe(
        () => {
          this.upCome.splice(index, 1);
          this.upcoming = this.upCome.length;
          this.total = this.completed + this.upcoming;
        },
        (error) => {
          console.error('Error removing event:', error);
        }
      );
    }
  }

  onSubmit() {
    const newEvent = {
      guestName: this.form.value.guest,
      eventName: this.form.value.event,
      date: this.form.value.dat
    };

    this.upco.addEv(newEvent).subscribe(
      (addedEvent) => {
        this.upCome.push(addedEvent);
        this.form.reset();
        this.upcoming = this.upCome.length;
        this.total = this.completed + this.upcoming;
      },
      (error) => {
        console.error('Error adding event:', error);
      }
    );
  }
}