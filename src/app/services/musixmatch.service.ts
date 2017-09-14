/*
  - Jane Ossai 2016
  - Responsible for making http requests to api for various types of queries
  - e.g. lyrics, track, album art
*/
import { Injectable } from '@angular/core';
import { Result } from '../models/result';
import { Observable } from "rxjs/Rx";
import { Headers, Http, RequestOptions, Response, Jsonp} from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MusixmatchService {

  constructor(private http: Http, private jsonp: Jsonp) { }


  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }

  private searchSongUrl = ''; //used


  set(str:string) {

    this.searchSongUrl = str;
  }


  get() {
    return this.searchSongUrl;
  }


  private url = "http://api.worldbank.org/countries/us/indicators/SH.XPD.PRIV.ZS?date=2000:2002&format=jsonP&prefix=JSONP_CALLBACK";


  getTestData(): Observable<any[]> {
          return this.jsonp.get(this.url)
          .map(function(res: Response) {
              return res.json() || {};
          }).catch(function(error: any){return Observable.throw(error);
          });
  }

//testing wth array stuff
  trackSearch(url:string): Promise<Result>{
  //  return this.jsonp.get(url)
  //         .map(function(res: Response) {
  //           return res.json() || {};
  //       }).catch(function(error: any){return Observable.throw(error);
  //       });

    return this.jsonp.get(url)
         .toPromise()
         .then(response => response.json())
         .catch(this.handleError);
    }


  getLyrics(url:string): Promise<any> {
    // console.log('music sturvs)');
    //  return this.jsonp.get(url)
    //       .map(function(res: Response) {
    //         return res.json() || {};
    //     }).catch(function(error: any){return Observable.throw(error);
    //     });
        console.log('get lyrics)');
        let response: Response;
        return this.jsonp.get(url)
           .toPromise()
           .then(response => response.json() )
           .catch(this.handleError);
  }

  accessToken:string;


    /*
      * querying spotify api
      * takes url (has album name of track in it)
      * Returns a json obj (promise) as a response
    */
    getArt(albumArtUrl:string): Promise<any> {
      console.log('getting album art');
      //set required headers ..cf /help/api
    	let headers = new Headers({});
    	// headers.append('Authorization','ApiKey jossai1:ead7d3d3e18845a807ab18af501805e05f7169eb');
      headers.append("Authorization", "Bearer " + 'BQBdTW205SYN0KjrxGtjnTHxgGEv0FGTvp-cfxpx9MYG5lIr1CLnP3icV2PR5IZRxVVA5QBI5DRuqz-vY1rHrg');
    	// headers.append('Accept','application/json');
    	let options = new RequestOptions({ headers: headers });
      return this.http.get(albumArtUrl, options)
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);

    }

  private handleError(error: any) {
     console.error('An error occurred', error);
     return Promise.reject(error.message || error);
   }


}
