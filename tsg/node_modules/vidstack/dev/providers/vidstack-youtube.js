import { createScope, signal, effect, isString, deferredPromise, isUndefined, isObject, isNumber, isBoolean } from '../chunks/vidstack-fG_Sx3Q9.js';
import { TimeRange } from '../chunks/vidstack-CLRUrTzh.js';
import { preconnect } from '../chunks/vidstack-n2fuk8wF.js';
import { EmbedProvider } from '../chunks/vidstack-BnfcPk2H.js';
import { resolveYouTubeVideoId } from '../chunks/vidstack-Zc3I7oOd.js';
import '../chunks/vidstack-C7y2WK8R.js';

const YouTubePlayerState = {
  _Unstarted: -1,
  _Ended: 0,
  _Playing: 1,
  _Paused: 2,
  _Buffering: 3,
  _Cued: 5
};

class YouTubeProvider extends EmbedProvider {
  constructor(iframe, _ctx) {
    super(iframe);
    this._ctx = _ctx;
    this.$$PROVIDER_TYPE = "YOUTUBE";
    this.scope = createScope();
    this._videoId = signal("");
    this._state = -1;
    this._currentSrc = null;
    this._seekingTimer = -1;
    this._pausedSeeking = false;
    this._promises = /* @__PURE__ */ new Map();
    /**
     * Sets the player's interface language. The parameter value is an ISO 639-1 two-letter
     * language code or a fully specified locale. For example, fr and fr-ca are both valid values.
     * Other language input codes, such as IETF language tags (BCP 47) might also be handled properly.
     *
     * The interface language is used for tooltips in the player and also affects the default caption
     * track. Note that YouTube might select a different caption track language for a particular
     * user based on the user's individual language preferences and the availability of caption tracks.
     *
     * @defaultValue 'en'
     */
    this.language = "en";
    this.color = "red";
    /**
     * Whether cookies should be enabled on the embed. This is turned off by default to be
     * GDPR-compliant.
     *
     * @defaultValue `false`
     */
    this.cookies = false;
  }
  get _notify() {
    return this._ctx.delegate._notify;
  }
  get currentSrc() {
    return this._currentSrc;
  }
  get type() {
    return "youtube";
  }
  get videoId() {
    return this._videoId();
  }
  preconnect() {
    preconnect(this._getOrigin());
  }
  setup() {
    super.setup();
    effect(this._watchVideoId.bind(this));
    this._notify("provider-setup", this);
  }
  destroy() {
    this._reset();
    const message = "provider destroyed";
    for (const promises of this._promises.values()) {
      for (const { reject } of promises) reject(message);
    }
    this._promises.clear();
  }
  async play() {
    return this._remote("playVideo");
  }
  _playFail(message) {
    this._getPromise("playVideo")?.reject(message);
  }
  async pause() {
    return this._remote("pauseVideo");
  }
  _pauseFail(message) {
    this._getPromise("pauseVideo")?.reject(message);
  }
  setMuted(muted) {
    if (muted) this._remote("mute");
    else this._remote("unMute");
  }
  setCurrentTime(time) {
    this._pausedSeeking = this._ctx.$state.paused();
    this._remote("seekTo", time);
    this._notify("seeking", time);
  }
  setVolume(volume) {
    this._remote("setVolume", volume * 100);
  }
  setPlaybackRate(rate) {
    this._remote("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._videoId.set("");
      return;
    }
    const videoId = resolveYouTubeVideoId(src.src);
    this._videoId.set(videoId ?? "");
    this._currentSrc = src;
  }
  _getOrigin() {
    return !this.cookies ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  }
  _watchVideoId() {
    this._reset();
    const videoId = this._videoId();
    if (!videoId) {
      this._src.set("");
      return;
    }
    this._src.set(`${this._getOrigin()}/embed/${videoId}`);
    this._notify("load-start");
  }
  _buildParams() {
    const { keyDisabled } = this._ctx.$props, { muted, playsInline, nativeControls } = this._ctx.$state, showControls = nativeControls();
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
  _remote(command, arg) {
    let promise = deferredPromise(), promises = this._promises.get(command);
    if (!promises) this._promises.set(command, promises = []);
    promises.push(promise);
    this._postMessage({
      event: "command",
      func: command,
      args: arg ? [arg] : void 0
    });
    return promise.promise;
  }
  _onLoad() {
    window.setTimeout(() => this._postMessage({ event: "listening" }), 100);
  }
  _onReady(trigger) {
    this._notify("loaded-metadata");
    this._notify("loaded-data");
    this._ctx.delegate._ready(void 0, trigger);
  }
  _onPause(trigger) {
    this._getPromise("pauseVideo")?.resolve();
    this._notify("pause", void 0, trigger);
  }
  _onTimeUpdate(time, trigger) {
    const { duration, realCurrentTime } = this._ctx.$state, hasEnded = this._state === YouTubePlayerState._Ended, boundTime = hasEnded ? duration() : time;
    this._notify("time-change", boundTime, trigger);
    if (!hasEnded && Math.abs(boundTime - realCurrentTime()) > 1) {
      this._notify("seeking", boundTime, trigger);
    }
  }
  _onProgress(buffered, seekable, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable
    };
    this._notify("progress", detail, trigger);
    const { seeking, realCurrentTime } = this._ctx.$state;
    if (seeking() && buffered > realCurrentTime()) {
      this._onSeeked(trigger);
    }
  }
  _onSeeked(trigger) {
    const { paused, realCurrentTime } = this._ctx.$state;
    window.clearTimeout(this._seekingTimer);
    this._seekingTimer = window.setTimeout(
      () => {
        this._notify("seeked", realCurrentTime(), trigger);
        this._seekingTimer = -1;
      },
      paused() ? 100 : 0
    );
    this._pausedSeeking = false;
  }
  _onEnded(trigger) {
    const { seeking } = this._ctx.$state;
    if (seeking()) this._onSeeked(trigger);
    this._notify("pause", void 0, trigger);
    this._notify("end", void 0, trigger);
  }
  _onStateChange(state, trigger) {
    const { started, paused, seeking } = this._ctx.$state, isPlaying = state === YouTubePlayerState._Playing, isBuffering = state === YouTubePlayerState._Buffering, isPendingPlay = !isUndefined(this._getPromise("playVideo")), isPlay = (paused() || isPendingPlay) && (isBuffering || isPlaying);
    if (isBuffering) this._notify("waiting", void 0, trigger);
    if (seeking() && isPlaying) {
      this._onSeeked(trigger);
    }
    if (!started() && isPlay && this._pausedSeeking) {
      this._playFail("invalid internal play operation");
      if (isPlaying) {
        this.pause();
        this._pausedSeeking = false;
      }
      return;
    }
    if (isPlay) {
      this._getPromise("playVideo")?.resolve();
      this._notify("play", void 0, trigger);
    }
    switch (state) {
      case YouTubePlayerState._Unstarted:
        this._playFail("provider rejected");
        this._pauseFail("provider rejected");
        this._notify("pause", void 0, trigger);
        break;
      case YouTubePlayerState._Cued:
        this._onReady(trigger);
        break;
      case YouTubePlayerState._Playing:
        this._notify("playing", void 0, trigger);
        break;
      case YouTubePlayerState._Paused:
        this._onPause(trigger);
        break;
      case YouTubePlayerState._Ended:
        this._onEnded(trigger);
        break;
    }
    this._state = state;
  }
  _onMessage({ info }, event) {
    if (!info) return;
    const { title, intrinsicDuration, playbackRate } = this._ctx.$state;
    if (isObject(info.videoData) && info.videoData.title !== title()) {
      this._notify("title-change", info.videoData.title, event);
    }
    if (isNumber(info.duration) && info.duration !== intrinsicDuration()) {
      if (isNumber(info.videoLoadedFraction)) {
        const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration, seekable = new TimeRange(0, info.duration);
        this._onProgress(buffered, seekable, event);
      }
      this._notify("duration-change", info.duration, event);
    }
    if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
      this._notify("rate-change", info.playbackRate, event);
    }
    if (info.progressState) {
      const {
        current,
        seekableStart,
        seekableEnd,
        loaded,
        duration: _duration
      } = info.progressState;
      this._onTimeUpdate(current, event);
      this._onProgress(loaded, new TimeRange(seekableStart, seekableEnd), event);
      if (_duration !== intrinsicDuration()) {
        this._notify("duration-change", _duration, event);
      }
    }
    if (isNumber(info.volume) && isBoolean(info.muted)) {
      const detail = {
        muted: info.muted,
        volume: info.volume / 100
      };
      this._notify("volume-change", detail, event);
    }
    if (isNumber(info.playerState) && info.playerState !== this._state) {
      this._onStateChange(info.playerState, event);
    }
  }
  _reset() {
    this._state = -1;
    this._seekingTimer = -1;
    this._pausedSeeking = false;
  }
  _getPromise(command) {
    return this._promises.get(command)?.shift();
  }
}

export { YouTubeProvider };
