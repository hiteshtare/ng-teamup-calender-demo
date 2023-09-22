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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMyCalenderEvents();
  }

  public async getMyCalenderEvents() {
    console.warn('getMyCalenderEvents');

    const calendarKey = 'ks91nc4hq4vimq69g2';
    const url = `https://api.teamup.com/${calendarKey}/events`;
    const teamupToken =
      'd835b37beb748a92356e6eab167768baa4ef5832f6fd98c4d1f0b82583648cdb';

    const headers = new HttpHeaders({
      'Teamup-Token': teamupToken,
    });

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
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
