import { Header } from './header';
import { Track } from './track';

export class Message  {
  body: {track_list: Array<any>}; //had to change it to any for it to work (b4 was Track)
  header:Header;

}
