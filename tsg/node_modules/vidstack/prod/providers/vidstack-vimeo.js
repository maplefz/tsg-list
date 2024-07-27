import { createScope, signal, effect, peek, isString, deferredPromise, listenEvent, isArray } from '../chunks/vidstack-C6myozhB.js';
import { QualitySymbol } from '../chunks/vidstack-DH8xaM_3.js';
import { TimeRange } from '../chunks/vidstack-Dy-iOvF5.js';
import { TextTrack } from '../chunks/vidstack-B97tQYIP.js';
import { ListSymbol } from '../chunks/vidstack-BoSiLpaP.js';
import { RAFLoop } from '../chunks/vidstack-C-clE4br.js';
import { preconnect } from '../chunks/vidstack-Vi2h5MrZ.js';
import { EmbedProvider } from '../chunks/vidstack-DBsjVADd.js';
import { resolveVimeoVideoId, getVimeoVideoInfo } from '../chunks/vidstack-krOAtKMi.js';
import '../chunks/vidstack-D2w309v1.js';
import '../chunks/vidstack-B9TAFm_g.js';

const trackedVimeoEvents = [
  "bufferend",
  "bufferstart",
  // 'cuechange',
  "durationchange",
  "ended",
  "enterpictureinpicture",
  "error",
  "fullscreenchange",
  "leavepictureinpicture",
  "loaded",
  // 'loadeddata',
  // 'loadedmetadata',
  // 'loadstart',
  "playProgress",
  "loadProgress",
  "pause",
  "play",
  "playbackratechange",
  // 'progress',
  "qualitychange",
  "seeked",
  "seeking",
  // 'texttrackchange',
  "timeupdate",
  "volumechange",
  "waiting"
  // 'adstarted',
  // 'adcompleted',
  // 'aderror',
  // 'adskipped',
  // 'adallcompleted',
  // 'adclicked',
  // 'chapterchange',
  // 'chromecastconnected',
  // 'remoteplaybackavailabilitychange',
  // 'remoteplaybackconnecting',
  // 'remoteplaybackconnect',
  // 'remoteplaybackdisconnect',
  // 'liveeventended',
  // 'liveeventstarted',
  // 'livestreamoffline',
  // 'livestreamonline',
];

class VimeoProvider extends EmbedProvider {
  constructor(iframe, _ctx) {
    super(iframe);
    this.b = _ctx;
    this.$$PROVIDER_TYPE = "VIMEO";
    this.scope = createScope();
    this.ha = signal("");
    this.tc = signal(false);
    this.ve = null;
    this.K = null;
    this.Tn = false;
    this.Aa = new TimeRange(0, 0);
    this.fa = new RAFLoop(this.kc.bind(this));
    this.Yi = null;
    this.hd = null;
    this.Rn = /* @__PURE__ */ new Map();
    this.ue = null;
    this.cookies = false;
    this.title = true;
    this.byline = true;
    this.portrait = true;
    this.color = "00ADEF";
    this.jd = false;
    const self = this;
    this.fullscreen = {
      get active() {
        return self.Tn;
      },
      supported: true,
      enter: () => this.t("requestFullscreen"),
      exit: () => this.t("exitFullscreen")
    };
  }
  get c() {
    return this.b.delegate.c;
  }
  get type() {
    return "vimeo";
  }
  get currentSrc() {
    return this.K;
  }
  get videoId() {
    return this.ha();
  }
  get hash() {
    return this.ve;
  }
  get isPro() {
    return this.tc();
  }
  preconnect() {
    preconnect(this.Nb());
  }
  setup() {
    super.setup();
    effect(this.we.bind(this));
    effect(this.Zi.bind(this));
    effect(this._i.bind(this));
    this.c("provider-setup", this);
  }
  destroy() {
    this.z();
    this.fullscreen = void 0;
    const message = "provider destroyed";
    for (const promises of this.Rn.values()) {
      for (const { reject } of promises) reject(message);
    }
    this.Rn.clear();
    this.t("destroy");
  }
  async play() {
    return this.t("play");
  }
  async pause() {
    return this.t("pause");
  }
  setMuted(muted) {
    this.t("setMuted", muted);
  }
  setCurrentTime(time) {
    this.t("seekTo", time);
    this.c("seeking", time);
  }
  setVolume(volume) {
    this.t("setVolume", volume);
    this.t("setMuted", peek(this.b.$state.muted));
  }
  setPlaybackRate(rate) {
    this.t("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this.K = null;
      this.ve = null;
      this.ha.set("");
      return;
    }
    const { videoId, hash } = resolveVimeoVideoId(src.src);
    this.ha.set(videoId ?? "");
    this.ve = hash ?? null;
    this.K = src;
  }
  we() {
    this.z();
    const videoId = this.ha();
    if (!videoId) {
      this.sc.set("");
      return;
    }
    this.sc.set(`${this.Nb()}/video/${videoId}`);
    this.c("load-start");
  }
  Zi() {
    const videoId = this.ha();
    if (!videoId) return;
    const promise = deferredPromise(), abort = new AbortController();
    this.ue = promise;
    getVimeoVideoInfo(videoId, abort, this.ve).then((info) => {
      promise.resolve(info);
    }).catch((e) => {
      promise.reject();
    });
    return () => {
      promise.reject();
      abort.abort();
    };
  }
  _i() {
    const isPro = this.tc(), { $state, qualities } = this.b;
    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol.Od](!isPro);
    if (isPro) {
      return listenEvent(qualities, "change", () => {
        if (qualities.auto) return;
        const id = qualities.selected?.id;
        if (id) this.t("setQuality", id);
      });
    }
  }
  Nb() {
    return "https://player.vimeo.com";
  }
  mg() {
    const { keyDisabled } = this.b.$props, { playsInline, nativeControls } = this.b.$state, showControls = nativeControls();
    return {
      title: this.title,
      byline: this.byline,
      color: this.color,
      portrait: this.portrait,
      controls: showControls,
      h: this.hash,
      keyboard: showControls && !keyDisabled(),
      transparent: true,
      playsinline: playsInline(),
      dnt: !this.cookies
    };
  }
  kc() {
    this.t("getCurrentTime");
  }
  mc(time, trigger) {
    if (this.jd && time === 0) return;
    const { realCurrentTime, realDuration, paused, bufferedEnd } = this.b.$state;
    if (realCurrentTime() === time) return;
    const prevTime = realCurrentTime();
    this.c("time-change", time, trigger);
    if (Math.abs(prevTime - time) > 1.5) {
      this.c("seeking", time, trigger);
      if (!paused() && bufferedEnd() < time) {
        this.c("waiting", void 0, trigger);
      }
    }
    if (realDuration() - time < 0.01) {
      this.c("end", void 0, trigger);
      this.jd = true;
      setTimeout(() => {
        this.jd = false;
      }, 500);
    }
  }
  ob(time, trigger) {
    this.c("seeked", time, trigger);
  }
  tb(trigger) {
    const videoId = this.ha();
    this.ue?.promise.then((info) => {
      if (!info) return;
      const { title, poster, duration, pro } = info;
      this.tc.set(pro);
      this.c("title-change", title, trigger);
      this.c("poster-change", poster, trigger);
      this.c("duration-change", duration, trigger);
      this.kd(duration, trigger);
    }).catch(() => {
      if (videoId !== this.ha()) return;
      this.t("getVideoTitle");
      this.t("getDuration");
    });
  }
  kd(duration, trigger) {
    const { nativeControls } = this.b.$state, showEmbedControls = nativeControls();
    this.Aa = new TimeRange(0, duration);
    const detail = {
      buffered: new TimeRange(0, 0),
      seekable: this.Aa,
      duration
    };
    this.b.delegate.Ga(detail, trigger);
    if (!showEmbedControls) {
      this.t("_hideOverlay");
    }
    this.t("getQualities");
    this.t("getChapters");
  }
  $i(method, data, trigger) {
    switch (method) {
      case "getVideoTitle":
        const videoTitle = data;
        this.c("title-change", videoTitle, trigger);
        break;
      case "getDuration":
        const duration = data;
        if (!this.b.$state.canPlay()) {
          this.kd(duration, trigger);
        } else {
          this.c("duration-change", duration, trigger);
        }
        break;
      case "getCurrentTime":
        this.mc(data, trigger);
        break;
      case "getBuffered":
        if (isArray(data) && data.length) {
          this.ng(data[data.length - 1][1], trigger);
        }
        break;
      case "setMuted":
        this.Na(peek(this.b.$state.volume), data, trigger);
        break;
      case "getChapters":
        this.aj(data);
        break;
      case "getQualities":
        this.ld(data, trigger);
        break;
    }
    this.Sn(method)?.resolve();
  }
  bj() {
    for (const type of trackedVimeoEvents) {
      this.t("addEventListener", type);
    }
  }
  ib(trigger) {
    this.fa.$();
    this.c("pause", void 0, trigger);
  }
  gc(trigger) {
    this.fa.Xa();
    this.c("play", void 0, trigger);
  }
  cj(trigger) {
    const { paused } = this.b.$state;
    if (!paused() && !this.jd) {
      this.c("playing", void 0, trigger);
    }
  }
  ng(buffered, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this.Aa
    };
    this.c("progress", detail, trigger);
  }
  dj(trigger) {
    this.c("waiting", void 0, trigger);
  }
  ej(trigger) {
    const { paused } = this.b.$state;
    if (!paused()) this.c("playing", void 0, trigger);
  }
  ee(trigger) {
    const { paused } = this.b.$state;
    if (paused()) {
      this.c("play", void 0, trigger);
    }
    this.c("waiting", void 0, trigger);
  }
  Na(volume, muted, trigger) {
    const detail = { volume, muted };
    this.c("volume-change", detail, trigger);
  }
  // protected _onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
  //   const textTrack = this._ctx.textTracks.toArray().find((t) => t.language === track.language);
  //   if (textTrack) textTrack.mode = track.mode;
  // }
  // protected _onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
  //   for (const init of tracks) {
  //     const textTrack = new TextTrack({
  //       ...init,
  //       label: init.label.replace('auto-generated', 'auto'),
  //     });
  //     textTrack[TextTrackSymbol._readyState] = 2;
  //     this._ctx.textTracks.add(textTrack, trigger);
  //     textTrack.setMode(init.mode, trigger);
  //   }
  // }
  // protected _onCueChange(cue: VimeoTextCue, trigger: Event) {
  //   const { textTracks, $state } = this._ctx,
  //     { currentTime } = $state,
  //     track = textTracks.selected;
  //   if (this._currentCue) track?.removeCue(this._currentCue, trigger);
  //   this._currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
  //   track?.addCue(this._currentCue, trigger);
  // }
  aj(chapters) {
    this.og();
    if (!chapters.length) return;
    const track = new TextTrack({
      kind: "chapters",
      default: true
    }), { realDuration } = this.b.$state;
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i], nextChapter = chapters[i + 1];
      track.addCue(
        new window.VTTCue(
          chapter.startTime,
          nextChapter?.startTime ?? realDuration(),
          chapter.title
        )
      );
    }
    this.hd = track;
    this.b.textTracks.add(track);
  }
  og() {
    if (!this.hd) return;
    this.b.textTracks.remove(this.hd);
    this.hd = null;
  }
  ld(qualities, trigger) {
    this.b.qualities[QualitySymbol.Ia] = qualities.some((q) => q.id === "auto") ? () => this.t("setQuality", "auto") : void 0;
    for (const quality of qualities) {
      if (quality.id === "auto") continue;
      const height = +quality.id.slice(0, -1);
      if (isNaN(height)) continue;
      this.b.qualities[ListSymbol.da](
        {
          id: quality.id,
          width: height * (16 / 9),
          height,
          codec: "avc1,h.264",
          bitrate: -1
        },
        trigger
      );
    }
    this.Za(
      qualities.find((q) => q.active),
      trigger
    );
  }
  Za({ id } = {}, trigger) {
    if (!id) return;
    const isAuto = id === "auto", newQuality = this.b.qualities.getById(id);
    if (isAuto) {
      this.b.qualities[QualitySymbol.Wa](isAuto, trigger);
      this.b.qualities[ListSymbol.ea](void 0, true, trigger);
    } else {
      this.b.qualities[ListSymbol.ea](newQuality ?? void 0, true, trigger);
    }
  }
  fj(event, payload, trigger) {
    switch (event) {
      case "ready":
        this.bj();
        break;
      case "loaded":
        this.tb(trigger);
        break;
      case "play":
        this.gc(trigger);
        break;
      case "playProgress":
        this.cj(trigger);
        break;
      case "pause":
        this.ib(trigger);
        break;
      case "loadProgress":
        this.ng(payload.seconds, trigger);
        break;
      case "waiting":
        this.ee(trigger);
        break;
      case "bufferstart":
        this.dj(trigger);
        break;
      case "bufferend":
        this.ej(trigger);
        break;
      case "volumechange":
        this.Na(payload.volume, peek(this.b.$state.muted), trigger);
        break;
      case "durationchange":
        this.Aa = new TimeRange(0, payload.duration);
        this.c("duration-change", payload.duration, trigger);
        break;
      case "playbackratechange":
        this.c("rate-change", payload.playbackRate, trigger);
        break;
      case "qualitychange":
        this.Za(payload, trigger);
        break;
      case "fullscreenchange":
        this.Tn = payload.fullscreen;
        this.c("fullscreen-change", payload.fullscreen, trigger);
        break;
      case "enterpictureinpicture":
        this.c("picture-in-picture-change", true, trigger);
        break;
      case "leavepictureinpicture":
        this.c("picture-in-picture-change", false, trigger);
        break;
      case "ended":
        this.c("end", void 0, trigger);
        break;
      case "error":
        this.Q(payload, trigger);
        break;
      case "seek":
      case "seeked":
        this.ob(payload.seconds, trigger);
        break;
    }
  }
  Q(error, trigger) {
    const { message, method } = error;
    if (method === "setPlaybackRate") {
      this.tc.set(false);
    }
    if (method) {
      this.Sn(method)?.reject(message);
    }
  }
  te(message, event) {
    if (message.event) {
      this.fj(message.event, message.data, event);
    } else if (message.method) {
      this.$i(message.method, message.value, event);
    }
  }
  gd() {
  }
  async t(command, arg) {
    let promise = deferredPromise(), promises = this.Rn.get(command);
    if (!promises) this.Rn.set(command, promises = []);
    promises.push(promise);
    this.se({
      method: command,
      value: arg
    });
    return promise.promise;
  }
  z() {
    this.fa.$();
    this.Aa = new TimeRange(0, 0);
    this.ue = null;
    this.Yi = null;
    this.tc.set(false);
    this.og();
  }
  Sn(command) {
    return this.Rn.get(command)?.shift();
  }
}

export { VimeoProvider };
