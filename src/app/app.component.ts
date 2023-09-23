import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'NG Teamup Calender Demo ';
  public listOfEvents = [];
  public groupArrays = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.getMyCalenderEvents();
  }

  public formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public async getMyCalenderEvents() {
    console.warn('getMyCalenderEvents');

    const calendarKey = 'ks91nc4hq4vimq69g2';
    const currentDate = new Date();
    const startDateParam = this.formatDate(currentDate);
    const endDateParam = this.formatDate(
      currentDate.setDate(currentDate.getDate() + 1)
    );

    const url = `https://api.teamup.com/${calendarKey}/events?startDate=${startDateParam}&endDate=${endDateParam}`;
    const teamupToken =
      'd835b37beb748a92356e6eab167768baa4ef5832f6fd98c4d1f0b82583648cdb';

    const headers = new HttpHeaders({
      'Teamup-Token': teamupToken,
    });

    this.listOfEvents = [];
    this.groupArrays = [];

    await this.http
      .get(url, { headers })
      .toPromise()
      .then((response) => {
        console.warn('response');
        console.log(response);

        if (response && response['events']) {
          if (response['events'].length !== 0) {
            response['events'].map((event) => {
              this.listOfEvents.push({
                title: event.title,
                rawStartTime: event.start_dt,
                startTime: new Date(event.start_dt).toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }),
                endTime: new Date(event.end_dt).toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }),
              });
            });

            // this gives an object with dates as keys
            const groups = this.listOfEvents.reduce((groups, game) => {
              const date = new Date(game.rawStartTime).toDateString();
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(game);
              return groups;
            }, {});

            // Edit: to add it in the array format instead
            this.groupArrays = Object.keys(groups).map((date) => {
              return {
                date,
                events: groups[date],
              };
            });

            console.log(this.groupArrays);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
