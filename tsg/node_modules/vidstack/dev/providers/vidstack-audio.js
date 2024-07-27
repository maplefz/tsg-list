import { scoped } from '../chunks/vidstack-fG_Sx3Q9.js';
import { HTMLMediaProvider } from './vidstack-html.js';
import { HTMLAirPlayAdapter } from '../chunks/vidstack-C4-EsreN.js';
import '../chunks/vidstack-C7y2WK8R.js';
import '../chunks/vidstack-B2NpDfPa.js';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-sHzLCnVW.js';

class AudioProvider extends HTMLMediaProvider {
  constructor(audio, ctx) {
    super(audio, ctx);
    this.$$PROVIDER_TYPE = "AUDIO";
    scoped(() => {
      this.airPlay = new HTMLAirPlayAdapter(this.media, ctx);
    }, this.scope);
  }
  get type() {
    return "audio";
  }
  setup() {
    super.setup();
    if (this.type === "audio") this._ctx.delegate._notify("provider-setup", this);
  }
  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this._media;
  }
}

export { AudioProvider };
