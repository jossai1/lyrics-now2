import {Component, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {MusixmatchService} from '../services/musixmatch.service';
import {Result} from '../models/result';
import {Track} from '../models/track';


/*header part of musixmatch response*/
interface Header {
  status_code: number;
  execute_time: number;
  available: number;

}

interface LyricRes {
  message: Message
}

/*musixmatch api response*/
interface Message {
  body: { lyrics: Lyrics }; // had to change it to any for it to work (b4 was Track)
  header: Header;
}


interface Lyrics {
  selector?: string;
  template?: string;
  explicit: number;
  html_tracking_url: string;
  lyrics_body: string;
  lyrics_copyright: string;
  lyrics_id: number;
  lyrics_language: string;
  lyrics_language_description: string;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [MusixmatchService]
})
export class SearchComponent implements OnInit {

  constructor(private generalSearch: MusixmatchService) {
  }

  ngOnInit() {
  }

  searchText: string = '';
  searchArtistName: string = '';
  searchResponse: Result;
  getArtResult: any;

  display: string = '';
  // in string format
  alltrackData: Track;
  error: any;

  imgUrl: string = '';
  trackName: string = '';
  genre: string = '';
  artist: string = '';
  albumName: string = '';
  emptyField: boolean = false;


  // for lyric query
  lyricsResult: LyricRes;
  lyrics: string = '';

  /*
   * searches for the song the user inputs into search box
   * calls general search service
   * saves the result of the search
   * if track found, passes the the trackid (found in response)  to the getLyrics method
  */
  trackSearch(searchText: string, searchArtistName: string) {

    //set emptyfield to true if empty so user gets alert via ngif
    if (this.searchText.length === 0) {
      this.emptyField = true;
      //this.emptyField = false;
    } else {
      /*search for song using api, sub in what the user put in*/
      let trackSearchString = 'http://api.musixmatch.com/ws/1.1/track.search?apikey=2fd5a6a61be57415701e38894f38114e&q_track=' + searchText + '&q_artist=' + searchArtistName + '&page_size=1&f_has_lyrics=1&format=jsonp&callback=JSONP_CALLBACK';

      //call a serice to get the json search result
      this.generalSearch.set(trackSearchString);

      this.generalSearch
        .trackSearch(trackSearchString)
        .then(res => this.searchResponse = res)
        .then(() => this.alltrackData = this.searchResponse.message.body.track_list[0].track)
        .then(() => this.processTrackData()) //set track title and fetch lyrics
        .then(() => console.log(this.alltrackData))
        .catch(error => this.error = error);

      console.log('this', trackSearchString);
    }
    this.imgUrl = '';
    this.lyrics = '';
  }

  //sets track data and calls metod to fetch results
  processTrackData() {
    this.trackName = this.alltrackData.track_name; //set track title
    this.getLyrics(this.alltrackData.track_id); //get lyrics with

    this.trackName = this.alltrackData.track_name;
    this.artist = this.alltrackData.artist_name;
    this.albumName = this.alltrackData.album_name;
  }

  /*
    * takes a trackid of the song that the user searched for
    * called in search method
    * finds the lyrics for the song with supplied 'trackid'
    * sets the result of the lyric search to the global 'lyrics' variable
    * calls the getArt method in the generalsearch service to get the album art
    * sets the image to the returned obj if the returned obj is not null
  */
  getLyrics(track_id: number) {

    let lyricSearchUrl = 'https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=' + track_id + '&apikey=2fd5a6a61be57415701e38894f38114e&format=jsonp&callback=JSONP_CALLBACK';

    this.generalSearch
      .getLyrics(lyricSearchUrl)
      .then(q => this.lyricsResult = q)
      .then(() => console.log('lyricResponse', this.lyricsResult.message.body.lyrics.lyrics_body))
      .then(() => this.lyrics = this.lyricsResult.message.body.lyrics.lyrics_body)        // set the lyrics for the song
      .then(() => this.setTrackImage())
      .catch(error => this.error = error);

  }

  setTrackImage() {
    let spoftifyImgSearchUrl = 'https://api.spotify.com/v1/search?q=album:' + this.albumName + '%20artist:' + this.artist + '&type=album';

    this.generalSearch
      .getArt(spoftifyImgSearchUrl)
      .then(q => this.getArtResult = q)
      .then(() => console.log(this.getArtResult))
      .then(() => this.imgUrl = this.getArtResult.albums.items['0'].images[1].url)
      .catch(error => this.error = error);
  }
}
