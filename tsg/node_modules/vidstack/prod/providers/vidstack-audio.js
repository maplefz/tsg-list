import { scoped } from '../chunks/vidstack-C6myozhB.js';
import { HTMLMediaProvider } from './vidstack-html.js';
import { HTMLAirPlayAdapter } from '../chunks/vidstack-DuY_sHvx.js';
import '../chunks/vidstack-B9TAFm_g.js';
import '../chunks/vidstack-C-clE4br.js';
import '../chunks/vidstack-Dihypf8P.js';
import '../chunks/vidstack-BoSiLpaP.js';

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
    if (this.type === "audio") this.b.delegate.c("provider-setup", this);
  }
  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this.a;
  }
}

export { AudioProvider };
