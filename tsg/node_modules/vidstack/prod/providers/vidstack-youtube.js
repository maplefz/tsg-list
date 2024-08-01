import { createScope, signal, effect, isString, deferredPromise, isUndefined, isObject, isNumber, isBoolean } from '../chunks/vidstack-C6myozhB.js';
import { TimeRange } from '../chunks/vidstack-Dy-iOvF5.js';
import { preconnect } from '../chunks/vidstack-Vi2h5MrZ.js';
import { EmbedProvider } from '../chunks/vidstack-DBsjVADd.js';
import { resolveYouTubeVideoId } from '../chunks/vidstack-Zc3I7oOd.js';
import '../chunks/vidstack-B9TAFm_g.js';

const YouTubePlayerState = {
  Om: -1,
  pg: 0,
  qg: 1,
  gj: 2,
  hj: 3,
  ij: 5
};

class YouTubeProvider extends EmbedProvider {
  constructor(iframe, _ctx) {
    super(iframe);
    this.b = _ctx;
    this.$$PROVIDER_TYPE = "YOUTUBE";
    this.scope = createScope();
    this.ha = signal("");
    this.za = -1;
    this.K = null;
    this.md = -1;
    this.vc = false;
    this.Rn = /* @__PURE__ */ new Map();
    this.language = "en";
    this.color = "red";
    this.cookies = false;
  }
  get c() {
    return this.b.delegate.c;
  }
  get currentSrc() {
    return this.K;
  }
  get type() {
    return "youtube";
  }
  get videoId() {
    return this.ha();
  }
  preconnect() {
    preconnect(this.Nb());
  }
  setup() {
    super.setup();
    effect(this.we.bind(this));
    this.c("provider-setup", this);
  }
  destroy() {
    this.z();
    const message = "provider destroyed";
    for (const promises of this.Rn.values()) {
      for (const { reject } of promises) reject(message);
    }
    this.Rn.clear();
  }
  async play() {
    return this.t("playVideo");
  }
  Hn(message) {
    this.Sn("playVideo")?.reject(message);
  }
  async pause() {
    return this.t("pauseVideo");
  }
  In(message) {
    this.Sn("pauseVideo")?.reject(message);
  }
  setMuted(muted) {
    if (muted) this.t("mute");
    else this.t("unMute");
  }
  setCurrentTime(time) {
    this.vc = this.b.$state.paused();
    this.t("seekTo", time);
    this.c("seeking", time);
  }
  setVolume(volume) {
    this.t("setVolume", volume * 100);
  }
  setPlaybackRate(rate) {
    this.t("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this.K = null;
      this.ha.set("");
      return;
    }
    const videoId = resolveYouTubeVideoId(src.src);
    this.ha.set(videoId ?? "");
    this.K = src;
  }
  Nb() {
    return !this.cookies ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  }
  we() {
    this.z();
    const videoId = this.ha();
    if (!videoId) {
      this.sc.set("");
      return;
    }
    this.sc.set(`${this.Nb()}/embed/${videoId}`);
    this.c("load-start");
  }
  mg() {
    const { keyDisabled } = this.b.$props, { muted, playsInline, nativeControls } = this.b.$state, showControls = nativeControls();
    return {
      autoplay: 0,
      cc_lang_pref: this.language,
      cc_load_policy: showControls ? 1 : void 0,
      color: this.color,
      controls: showControls ? 1 : 0,
      disablekb: !showControls || keyDisabled() ? 1 : 0,
      enablejsapi: 1,
      fs: 1,
      hl: this.language,
      iv_load_policy: showControls ? 1 : 3,
      mute: muted() ? 1 : 0,
      playsinline: playsInline() ? 1 : 0
    };
  }
  t(command, arg) {
    let promise = deferredPromise(), promises = this.Rn.get(command);
    if (!promises) this.Rn.set(command, promises = []);
    promises.push(promise);
    this.se({
      event: "command",
      func: command,
      args: arg ? [arg] : void 0
    });
    return promise.promise;
  }
  gd() {
    window.setTimeout(() => this.se({ event: "listening" }), 100);
  }
  kd(trigger) {
    this.c("loaded-metadata");
    this.c("loaded-data");
    this.b.delegate.Ga(void 0, trigger);
  }
  ib(trigger) {
    this.Sn("pauseVideo")?.resolve();
    this.c("pause", void 0, trigger);
  }
  mc(time, trigger) {
    const { duration, realCurrentTime } = this.b.$state, hasEnded = this.za === YouTubePlayerState.pg, boundTime = hasEnded ? duration() : time;
    this.c("time-change", boundTime, trigger);
    if (!hasEnded && Math.abs(boundTime - realCurrentTime()) > 1) {
      this.c("seeking", boundTime, trigger);
    }
  }
  nb(buffered, seekable, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable
    };
    this.c("progress", detail, trigger);
    const { seeking, realCurrentTime } = this.b.$state;
    if (seeking() && buffered > realCurrentTime()) {
      this.ob(trigger);
    }
  }
  ob(trigger) {
    const { paused, realCurrentTime } = this.b.$state;
    window.clearTimeout(this.md);
    this.md = window.setTimeout(
      () => {
        this.c("seeked", realCurrentTime(), trigger);
        this.md = -1;
      },
      paused() ? 100 : 0
    );
    this.vc = false;
  }
  lc(trigger) {
    const { seeking } = this.b.$state;
    if (seeking()) this.ob(trigger);
    this.c("pause", void 0, trigger);
    this.c("end", void 0, trigger);
  }
  ie(state, trigger) {
    const { started, paused, seeking } = this.b.$state, isPlaying = state === YouTubePlayerState.qg, isBuffering = state === YouTubePlayerState.hj, isPendingPlay = !isUndefined(this.Sn("playVideo")), isPlay = (paused() || isPendingPlay) && (isBuffering || isPlaying);
    if (isBuffering) this.c("waiting", void 0, trigger);
    if (seeking() && isPlaying) {
      this.ob(trigger);
    }
    if (!started() && isPlay && this.vc) {
      this.Hn("invalid internal play operation");
      if (isPlaying) {
        this.pause();
        this.vc = false;
      }
      return;
    }
    if (isPlay) {
      this.Sn("playVideo")?.resolve();
      this.c("play", void 0, trigger);
    }
    switch (state) {
      case YouTubePlayerState.Om:
        this.Hn("provider rejected");
        this.In("provider rejected");
        this.c("pause", void 0, trigger);
        break;
      case YouTubePlayerState.ij:
        this.kd(trigger);
        break;
      case YouTubePlayerState.qg:
        this.c("playing", void 0, trigger);
        break;
      case YouTubePlayerState.gj:
        this.ib(trigger);
        break;
      case YouTubePlayerState.pg:
        this.lc(trigger);
        break;
    }
    this.za = state;
  }
  te({ info }, event) {
    if (!info) return;
    const { title, intrinsicDuration, playbackRate } = this.b.$state;
    if (isObject(info.videoData) && info.videoData.title !== title()) {
      this.c("title-change", info.videoData.title, event);
    }
    if (isNumber(info.duration) && info.duration !== intrinsicDuration()) {
      if (isNumber(info.videoLoadedFraction)) {
        const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration, seekable = new TimeRange(0, info.duration);
        this.nb(buffered, seekable, event);
      }
      this.c("duration-change", info.duration, event);
    }
    if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
      this.c("rate-change", info.playbackRate, event);
    }
    if (info.progressState) {
      const {
        current,
        seekableStart,
        seekableEnd,
        loaded,
        duration: _duration
      } = info.progressState;
      this.mc(current, event);
      this.nb(loaded, new TimeRange(seekableStart, seekableEnd), event);
      if (_duration !== intrinsicDuration()) {
        this.c("duration-change", _duration, event);
      }
    }
    if (isNumber(info.volume) && isBoolean(info.muted)) {
      const detail = {
        muted: info.muted,
        volume: info.volume / 100
      };
      this.c("volume-change", detail, event);
    }
    if (isNumber(info.playerState) && info.playerState !== this.za) {
      this.ie(info.playerState, event);
    }
  }
  z() {
    this.za = -1;
    this.md = -1;
    this.vc = false;
  }
  Sn(command) {
    return this.Rn.get(command)?.shift();
  }
}

export { YouTubeProvider };
