import { EventsTarget, DOMEvent, isString, isArray, isNumber } from './vidstack-C6myozhB.js';
import { getRequestCredentials } from './vidstack-Vi2h5MrZ.js';
import { isCueActive } from './vidstack-D2w309v1.js';

const CROSS_ORIGIN = Symbol(0), READY_STATE = Symbol(0), UPDATE_ACTIVE_CUES = Symbol(0), CAN_LOAD = Symbol(0), ON_MODE_CHANGE = Symbol(0), NATIVE = Symbol(0), NATIVE_HLS = Symbol(0);
const TextTrackSymbol = {
  Db: CROSS_ORIGIN,
  ma: READY_STATE,
  Eb: UPDATE_ACTIVE_CUES,
  Z: CAN_LOAD,
  hb: ON_MODE_CHANGE,
  _: NATIVE,
  Mf: NATIVE_HLS
};

var _a, _b, _c;
class TextTrack extends EventsTarget {
  constructor(init) {
    super();
    this.id = "";
    this.label = "";
    this.language = "";
    this.default = false;
    this.Z = false;
    this.ua = 0;
    this.U = "disabled";
    this.Nf = {};
    this.$c = [];
    this.B = [];
    this.Fb = [];
    this[_c] = 0;
    this[_b] = null;
    this[_a] = null;
    for (const prop of Object.keys(init)) this[prop] = init[prop];
    if (!this.type) this.type = "vtt";
    if (init.content) {
      this._h(init);
    } else if (!init.src) {
      this[TextTrackSymbol.ma] = 2;
    }
  }
  static createId(track) {
    return `vds-${track.type}-${track.kind}-${track.src ?? track.label ?? "?"}`;
  }
  get metadata() {
    return this.Nf;
  }
  get regions() {
    return this.$c;
  }
  get cues() {
    return this.B;
  }
  get activeCues() {
    return this.Fb;
  }
  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState() {
    return this[TextTrackSymbol.ma];
  }
  get mode() {
    return this.U;
  }
  set mode(mode) {
    this.setMode(mode);
  }
  addCue(cue, trigger) {
    let i = 0, length = this.B.length;
    for (i = 0; i < length; i++) if (cue.endTime <= this.B[i].startTime) break;
    if (i === length) this.B.push(cue);
    else this.B.splice(i, 0, cue);
    if (!(cue instanceof TextTrackCue)) {
      this[TextTrackSymbol._]?.track.addCue(cue);
    }
    this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
    if (isCueActive(cue, this.ua)) {
      this[TextTrackSymbol.Eb](this.ua, trigger);
    }
  }
  removeCue(cue, trigger) {
    const index = this.B.indexOf(cue);
    if (index >= 0) {
      const isActive = this.Fb.includes(cue);
      this.B.splice(index, 1);
      this[TextTrackSymbol._]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TextTrackSymbol.Eb](this.ua, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    if (this.U === mode) return;
    this.U = mode;
    if (mode === "disabled") {
      this.Fb = [];
      this.Of();
    } else if (this.readyState === 2) {
      this[TextTrackSymbol.Eb](this.ua, trigger);
    } else {
      this.Pf();
    }
    this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
    this[TextTrackSymbol.hb]?.();
  }
  /** @internal */
  [(_c = TextTrackSymbol.ma, _b = TextTrackSymbol.hb, _a = TextTrackSymbol._, TextTrackSymbol.Eb)](currentTime, trigger) {
    this.ua = currentTime;
    if (this.mode === "disabled" || !this.B.length) return;
    const activeCues = [];
    for (let i = 0, length = this.B.length; i < length; i++) {
      const cue = this.B[i];
      if (isCueActive(cue, currentTime)) activeCues.push(cue);
    }
    let changed = activeCues.length !== this.Fb.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.Fb.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }
    this.Fb = activeCues;
    if (changed) this.Of(trigger);
  }
  /** @internal */
  [TextTrackSymbol.Z]() {
    this.Z = true;
    if (this.U !== "disabled") this.Pf();
  }
  _h(init) {
    import('media-captions').then(({ parseText, VTTCue, VTTRegion }) => {
      if (!isString(init.content) || init.type === "json") {
        this.Qf(init.content, VTTCue, VTTRegion);
        if (this.readyState !== 3) this.Ga();
      } else {
        parseText(init.content, { type: init.type }).then(({ cues, regions }) => {
          this.B = cues;
          this.$c = regions;
          this.Ga();
        });
      }
    });
  }
  async Pf() {
    if (!this.Z || this[TextTrackSymbol.ma] > 0) return;
    this[TextTrackSymbol.ma] = 1;
    this.dispatchEvent(new DOMEvent("load-start"));
    if (!this.src) {
      this.Ga();
      return;
    }
    try {
      const { parseResponse, VTTCue, VTTRegion } = await import('media-captions'), crossOrigin = this[TextTrackSymbol.Db]?.();
      const response = fetch(this.src, {
        headers: this.type === "json" ? { "Content-Type": "application/json" } : void 0,
        credentials: getRequestCredentials(crossOrigin)
      });
      if (this.type === "json") {
        this.Qf(await (await response).text(), VTTCue, VTTRegion);
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding
        });
        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this.Nf = metadata;
          this.$c = regions;
          this.B = cues;
        }
      }
      this.Ga();
    } catch (error) {
      this.Rf(error);
    }
  }
  Ga() {
    this[TextTrackSymbol.ma] = 2;
    if (!this.src || this.type !== "vtt") {
      const native = this[TextTrackSymbol._];
      if (native && !native.managed) {
        for (const cue of this.B) native.track.addCue(cue);
      }
    }
    const loadEvent = new DOMEvent("load");
    this[TextTrackSymbol.Eb](this.ua, loadEvent);
    this.dispatchEvent(loadEvent);
  }
  Rf(error) {
    this[TextTrackSymbol.ma] = 3;
    this.dispatchEvent(new DOMEvent("error", { detail: error }));
  }
  Qf(json, VTTCue, VTTRegion) {
    try {
      const { regions, cues } = parseJSONCaptionsFile(json, VTTCue, VTTRegion);
      this.$c = regions;
      this.B = cues;
    } catch (error) {
      this.Rf(error);
    }
  }
  Of(trigger) {
    this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
  }
}
const captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}
function parseJSONCaptionsFile(json, Cue, Region) {
  const content = isString(json) ? JSON.parse(json) : json;
  let regions = [], cues = [];
  if (content.regions && Region) {
    regions = content.regions.map((region) => Object.assign(new Region(), region));
  }
  if (content.cues || isArray(content)) {
    cues = (isArray(content) ? content : content.cues).filter((content2) => isNumber(content2.startTime) && isNumber(content2.endTime)).map((cue) => Object.assign(new Cue(0, 0, ""), cue));
  }
  return { regions, cues };
}

export { TextTrack, TextTrackSymbol, isTrackCaptionKind, parseJSONCaptionsFile };
