import { Component, State, effect, tick, peek, setAttribute, isString, setStyle, createContext, signal, listenEvent, provideContext, onDispose, useContext, prop, useState, isNull, functionThrottle, computed, animationFrameThrottle, functionDebounce, scoped, createScope, method, hasProvidedContext, isNumber, isPointerEvent, isTouchEvent, isMouseEvent, DOMEvent, kebabToCamelCase, createDisposalBin } from './vidstack-C6myozhB.js';
import { useMediaContext } from './vidstack-Cq-GdDcp.js';
import { setAttributeIfEmpty, requestScopedAnimationFrame, autoPlacement, setARIALabel, onPress, isTouchPinchEvent } from './vidstack-BeyDmEgV.js';
import { formatSpokenTime, Popper, ToggleButtonController, Slider, SliderController, sliderState, sliderValueFormatContext, TimeSlider, RadioGroupController, menuContext, radioControllerContext, formatTime } from './vidstack-DVw4uMVF.js';
import { FocusVisibleController, $keyboard } from './vidstack-D6_zYTXL.js';
import { $ariaBool, sortVideoQualities } from './vidstack-BOTZD4tC.js';
import { round } from './vidstack-Dihypf8P.js';
import { watchActiveTextTrack, isCueActive } from './vidstack-D2w309v1.js';
import { isTrackCaptionKind } from './vidstack-B97tQYIP.js';

class MediaAnnouncer extends Component {
  constructor() {
    super(...arguments);
    this.Ve = false;
    this.Hc = -1;
    this.Xe = -1;
  }
  static {
    this.props = {
      translations: null
    };
  }
  static {
    this.state = new State({
      label: null,
      busy: false
    });
  }
  onSetup() {
    this.a = useMediaContext();
  }
  onAttach(el) {
    el.style.display = "contents";
  }
  onConnect(el) {
    el.setAttribute("data-media-announcer", "");
    setAttributeIfEmpty(el, "role", "status");
    setAttributeIfEmpty(el, "aria-live", "polite");
    const { busy } = this.$state;
    this.setAttributes({
      "aria-busy": () => busy() ? "true" : null
    });
    this.Ve = true;
    effect(this.fc.bind(this));
    effect(this.Fc.bind(this));
    effect(this.Hk.bind(this));
    effect(this.Ik.bind(this));
    effect(this.Jk.bind(this));
    effect(this.Kk.bind(this));
    effect(this.Lk.bind(this));
    tick();
    this.Ve = false;
  }
  fc() {
    const { paused } = this.a.$state;
    this.Rb(!paused() ? "Play" : "Pause");
  }
  Ik() {
    const { fullscreen } = this.a.$state;
    this.Rb(fullscreen() ? "Enter Fullscreen" : "Exit Fullscreen");
  }
  Jk() {
    const { pictureInPicture } = this.a.$state;
    this.Rb(pictureInPicture() ? "Enter PiP" : "Exit PiP");
  }
  Hk() {
    const { textTrack } = this.a.$state;
    this.Rb(textTrack() ? "Closed-Captions On" : "Closed-Captions Off");
  }
  Fc() {
    const { muted, volume, audioGain } = this.a.$state;
    this.Rb(
      muted() || volume() === 0 ? "Mute" : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this.We("Volume")}`
    );
  }
  Kk() {
    const { seeking, currentTime } = this.a.$state, isSeeking = seeking();
    if (this.Hc > 0) {
      window.clearTimeout(this.Xe);
      this.Xe = window.setTimeout(() => {
        if (!this.scope) return;
        const newTime = peek(currentTime), seconds = Math.abs(newTime - this.Hc);
        if (seconds >= 1) {
          const isForward = newTime >= this.Hc, spokenTime = formatSpokenTime(seconds);
          this.Rb(
            `${this.We(isForward ? "Seek Forward" : "Seek Backward")} ${spokenTime}`
          );
        }
        this.Hc = -1;
        this.Xe = -1;
      }, 300);
    } else if (isSeeking) {
      this.Hc = peek(currentTime);
    }
  }
  We(word) {
    const { translations } = this.$props;
    return translations?.()?.[word || ""] ?? word;
  }
  Lk() {
    const { label, busy } = this.$state, $label = this.We(label());
    if (this.Ve) return;
    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);
    this.el && setAttribute(this.el, "aria-label", $label);
    if (isString($label)) {
      this.dispatch("change", { detail: $label });
    }
    return () => window.clearTimeout(id);
  }
  Rb(word) {
    const { label } = this.$state;
    label.set(word);
  }
}

class Controls extends Component {
  static {
    this.props = {
      hideDelay: 2e3,
      hideOnMouseLeave: false
    };
  }
  onSetup() {
    this.a = useMediaContext();
    effect(this.Mk.bind(this));
  }
  onAttach(el) {
    const { pictureInPicture, fullscreen } = this.a.$state;
    setStyle(el, "pointer-events", "none");
    setAttributeIfEmpty(el, "role", "group");
    this.setAttributes({
      "data-visible": this.hh.bind(this),
      "data-fullscreen": fullscreen,
      "data-pip": pictureInPicture
    });
    effect(() => {
      this.dispatch("change", { detail: this.hh() });
    });
    effect(this.Nk.bind(this));
    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ["top", "right", "bottom", "left"]) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }
  Nk() {
    if (!this.el) return;
    const { nativeControls } = this.a.$state, isHidden = nativeControls();
    setAttribute(this.el, "aria-hidden", isHidden ? "true" : null);
    setStyle(this.el, "display", isHidden ? "none" : null);
  }
  Mk() {
    const { controls } = this.a.player, { hideDelay, hideOnMouseLeave } = this.$props;
    controls.defaultDelay = hideDelay() === 2e3 ? this.a.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }
  hh() {
    const { controlsVisible } = this.a.$state;
    return controlsVisible();
  }
}

class ControlsGroup extends Component {
  onAttach(el) {
    if (!el.style.pointerEvents) setStyle(el, "pointer-events", "auto");
  }
}

const tooltipContext = createContext();

let id = 0;
class Tooltip extends Component {
  constructor() {
    super();
    this.ya = `media-tooltip-${++id}`;
    this.M = signal(null);
    this.q = signal(null);
    new FocusVisibleController();
    const { showDelay } = this.$props;
    new Popper({
      M: this.M,
      q: this.q,
      ih: showDelay,
      yd(trigger, show, hide) {
        listenEvent(trigger, "touchstart", (e) => e.preventDefault(), {
          passive: false
        });
        effect(() => {
          if ($keyboard()) listenEvent(trigger, "focus", show);
          listenEvent(trigger, "blur", hide);
        });
        listenEvent(trigger, "mouseenter", show);
        listenEvent(trigger, "mouseleave", hide);
      },
      E: this.Pk.bind(this)
    });
  }
  static {
    this.props = {
      showDelay: 700
    };
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onSetup() {
    provideContext(tooltipContext, {
      M: this.M,
      q: this.q,
      Ze: this.Ze.bind(this),
      _e: this._e.bind(this),
      $e: this.$e.bind(this),
      af: this.af.bind(this)
    });
  }
  Ze(el) {
    this.M.set(el);
    let tooltipName = el.getAttribute("data-media-tooltip");
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
    }
    setAttribute(el, "data-describedby", this.ya);
  }
  _e(el) {
    el.removeAttribute("data-describedby");
    el.removeAttribute("aria-describedby");
    this.M.set(null);
  }
  $e(el) {
    el.setAttribute("id", this.ya);
    el.style.display = "none";
    setAttributeIfEmpty(el, "role", "tooltip");
    this.q.set(el);
  }
  af(el) {
    el.removeAttribute("id");
    el.removeAttribute("role");
    this.q.set(null);
  }
  Pk(isShowing) {
    const trigger = this.M(), content = this.q();
    if (trigger) {
      setAttribute(trigger, "aria-describedby", isShowing ? this.ya : null);
    }
    for (const el of [this.el, trigger, content]) {
      el && setAttribute(el, "data-visible", isShowing);
    }
  }
}

class TooltipTrigger extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  onConnect(el) {
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        this.xb();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this.Bd();
          button && tooltip._e(button);
        });
      })
    );
  }
  xb() {
    const button = this.Bd(), tooltip = useContext(tooltipContext);
    button && tooltip.Ze(button);
  }
  Bd() {
    const candidate = this.el.firstElementChild;
    return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
  }
}

class TooltipContent extends Component {
  static {
    this.props = {
      placement: "top center",
      offset: 0,
      alignOffset: 0
    };
  }
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.xb(el);
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    this.xb(el);
    const tooltip = useContext(tooltipContext);
    onDispose(() => tooltip.af(el));
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.bf.bind(this));
      })
    );
  }
  xb(el) {
    const tooltip = useContext(tooltipContext);
    tooltip.$e(el);
  }
  bf() {
    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this.Qk(), placement(), {
      offsetVarName: "media-tooltip",
      xOffset: alignOffset(),
      yOffset: mainOffset()
    });
  }
  Qk() {
    return useContext(tooltipContext).M();
  }
}

var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$6(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$6(target, key, result);
  return result;
};
class ToggleButton extends Component {
  constructor() {
    super();
    this.jh = signal(false);
    new ToggleButtonController({
      o: this.jh
    });
  }
  static {
    this.props = {
      disabled: false,
      defaultPressed: false
    };
  }
  get pressed() {
    return this.jh();
  }
}
__decorateClass$6([
  prop
], ToggleButton.prototype, "pressed");

class GoogleCastButton extends Component {
  static {
    this.props = ToggleButtonController.props;
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    const { canGoogleCast, isGoogleCastConnected } = this.a.$state;
    this.setAttributes({
      "data-active": isGoogleCastConnected,
      "data-supported": canGoogleCast,
      "data-state": this.Ic.bind(this),
      "aria-hidden": $ariaBool(() => !canGoogleCast())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "google-cast");
    setARIALabel(el, this.Jc.bind(this));
  }
  r(event) {
    const remote = this.a.remote;
    remote.requestGoogleCast(event);
  }
  o() {
    const { remotePlaybackType, remotePlaybackState } = this.a.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState() !== "disconnected";
  }
  Ic() {
    const { remotePlaybackType, remotePlaybackState } = this.a.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState();
  }
  Jc() {
    const { remotePlaybackState } = this.a.$state;
    return `Google Cast ${remotePlaybackState()}`;
  }
}

var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$5(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$5(target, key, result);
  return result;
};
class SliderVideo extends Component {
  static {
    this.props = {
      src: null,
      crossOrigin: null
    };
  }
  static {
    this.state = new State({
      video: null,
      src: null,
      crossOrigin: null,
      canPlay: false,
      error: null,
      hidden: false
    });
  }
  get video() {
    return this.$state.video();
  }
  onSetup() {
    this.a = useMediaContext();
    this.ia = useState(Slider.state);
    this.Ca();
    this.setAttributes({
      "data-loading": this.Pc.bind(this),
      "data-hidden": this.$state.hidden,
      "data-error": this.fb.bind(this),
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onAttach(el) {
    effect(this.pl.bind(this));
    effect(this.Mb.bind(this));
    effect(this.Ca.bind(this));
    effect(this.Ea.bind(this));
    effect(this.ql.bind(this));
    effect(this.rl.bind(this));
  }
  pl() {
    const video = this.$state.video();
    if (!video) return;
    if (video.readyState >= 2) this.ed();
    listenEvent(video, "canplay", this.ed.bind(this));
    listenEvent(video, "error", this.Q.bind(this));
  }
  Mb() {
    const { src } = this.$state, { canLoad } = this.a.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }
  Ca() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.a.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  Pc() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }
  fb() {
    const { error } = this.$state;
    return !isNull(error);
  }
  Ea() {
    const { src, hidden } = this.$state, { canLoad, duration } = this.a.$state;
    hidden.set(canLoad() && (!src() || this.fb() || !Number.isFinite(duration())));
  }
  ql() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }
  ed(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch("can-play", { trigger: event });
  }
  Q(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch("error", { trigger: event });
  }
  rl() {
    const { video, canPlay } = this.$state, { duration } = this.a.$state, { pointerRate } = this.ia, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
    if (canUpdate) {
      media.currentTime = pointerRate() * duration();
    }
  }
}
__decorateClass$5([
  prop
], SliderVideo.prototype, "video");

class AudioGainSlider extends Component {
  static {
    this.props = {
      ...SliderController.props,
      step: 25,
      keyStep: 25,
      shiftKeyMultiplier: 2,
      min: 0,
      max: 300
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "percent",
      percent: (_, decimalPlaces) => {
        return round(this.$state.value(), decimalPlaces) + "%";
      }
    });
    new SliderController({
      qa: this.$props.step,
      eb: this.$props.keyStep,
      Da: Math.round,
      v: this.v.bind(this),
      O: this.O.bind(this),
      P: this.P.bind(this),
      S: this.S.bind(this),
      l: this.l.bind(this)
    }).attach(this);
    effect(this.Oc.bind(this));
    effect(this.tl.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-audio-gain-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Audio Boost");
    const { canSetAudioGain } = this.a.$state;
    this.setAttributes({
      "data-supported": canSetAudioGain,
      "aria-hidden": $ariaBool(() => !canSetAudioGain())
    });
  }
  O() {
    const { value } = this.$state;
    return Math.round(value());
  }
  P() {
    const { value } = this.$state;
    return value() + "%";
  }
  Oc() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  tl() {
    const { audioGain } = this.a.$state, value = ((audioGain() ?? 1) - 1) * 100;
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  v() {
    const { disabled } = this.$props, { canSetAudioGain } = this.a.$state;
    return disabled() || !canSetAudioGain();
  }
  xh(event) {
    if (!event.trigger) return;
    const gain = round(1 + event.detail / 100, 2);
    this.a.remote.changeAudioGain(gain, event);
  }
  l(event) {
    this.xh(event);
  }
  S(event) {
    this.xh(event);
  }
}

class SpeedSlider extends Component {
  constructor() {
    super(...arguments);
    this.yh = functionThrottle(this.ul.bind(this), 25);
  }
  static {
    this.props = {
      ...SliderController.props,
      step: 0.25,
      keyStep: 0.25,
      shiftKeyMultiplier: 2,
      min: 0,
      max: 2
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    new SliderController({
      qa: this.$props.step,
      eb: this.$props.keyStep,
      Da: this.Da,
      v: this.v.bind(this),
      O: this.O.bind(this),
      P: this.P.bind(this),
      S: this.S.bind(this),
      l: this.l.bind(this)
    }).attach(this);
    effect(this.Oc.bind(this));
    effect(this.Qe.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-speed-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Speed");
    const { canSetPlaybackRate } = this.a.$state;
    this.setAttributes({
      "data-supported": canSetPlaybackRate,
      "aria-hidden": $ariaBool(() => !canSetPlaybackRate())
    });
  }
  O() {
    const { value } = this.$state;
    return value();
  }
  P() {
    const { value } = this.$state;
    return value() + "x";
  }
  Oc() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  Qe() {
    const { playbackRate } = this.a.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  Da(value) {
    return round(value, 2);
  }
  v() {
    const { disabled } = this.$props, { canSetPlaybackRate } = this.a.$state;
    return disabled() || !canSetPlaybackRate();
  }
  ul(event) {
    if (!event.trigger) return;
    const rate = event.detail;
    this.a.remote.changePlaybackRate(rate, event);
  }
  l(event) {
    this.yh(event);
  }
  S(event) {
    this.yh(event);
  }
}

class QualitySlider extends Component {
  constructor() {
    super(...arguments);
    this.Rc = computed(() => {
      const { qualities } = this.a.$state;
      return sortVideoQualities(qualities());
    });
    this.zh = functionThrottle(this.Za.bind(this), 25);
  }
  static {
    this.props = {
      ...SliderController.props,
      step: 1,
      keyStep: 1,
      shiftKeyMultiplier: 1
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    new SliderController({
      qa: this.$props.step,
      eb: this.$props.keyStep,
      Da: Math.round,
      v: this.v.bind(this),
      O: this.O.bind(this),
      P: this.P.bind(this),
      S: this.S.bind(this),
      l: this.l.bind(this)
    }).attach(this);
    effect(this.vl.bind(this));
    effect(this.wl.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-quality-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Video Quality");
    const { qualities, canSetQuality } = this.a.$state, $supported = computed(() => canSetQuality() && qualities().length > 0);
    this.setAttributes({
      "data-supported": $supported,
      "aria-hidden": $ariaBool(() => !$supported())
    });
  }
  O() {
    const { value } = this.$state;
    return value();
  }
  P() {
    const { quality } = this.a.$state;
    if (!quality()) return "";
    const { height, bitrate } = quality(), bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null;
    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : "Auto";
  }
  vl() {
    const $qualities = this.Rc();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }
  wl() {
    let { quality } = this.a.$state, $qualities = this.Rc(), value = Math.max(0, $qualities.indexOf(quality()));
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  v() {
    const { disabled } = this.$props, { canSetQuality, qualities } = this.a.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }
  Za(event) {
    if (!event.trigger) return;
    const { qualities } = this.a, quality = peek(this.Rc)[event.detail];
    this.a.remote.changeQuality(qualities.indexOf(quality), event);
  }
  l(event) {
    this.zh(event);
  }
  S(event) {
    this.zh(event);
  }
}

var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$4(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$4(target, key, result);
  return result;
};
class SliderChapters extends Component {
  constructor() {
    super(...arguments);
    this.yb = null;
    this.ja = [];
    this.Gd = signal(null);
    this.ka = signal([]);
    this.Xb = signal(-1);
    this.Hd = signal(-1);
    this.Sc = 0;
    this.Ml = animationFrameThrottle((bufferedPercent) => {
      let percent, cues = this.ka(), { clipStartTime } = this.a.$state, startTime = clipStartTime(), endTime = this.qf(cues);
      for (let i = this.Sc; i < this.ja.length; i++) {
        percent = this.pf(cues[i], bufferedPercent, startTime, endTime);
        this.ja[i]?.style.setProperty("--chapter-progress", percent + "%");
        if (percent < 100) {
          this.Sc = i;
          break;
        }
      }
    });
    this.Nl = computed(this.Ol.bind(this));
    this.Id = functionDebounce(
      () => {
        const track = peek(this.Gd);
        if (!this.scope || !track || !track.cues.length) return;
        this.ka.set(this.Pl(track.cues));
        this.Xb.set(0);
        this.Sc = 0;
      },
      150,
      true
    );
  }
  static {
    this.props = {
      disabled: false
    };
  }
  get cues() {
    return this.ka();
  }
  get activeCue() {
    return this.ka()[this.Xb()] || null;
  }
  get activePointerCue() {
    return this.ka()[this.Hd()] || null;
  }
  onSetup() {
    this.a = useMediaContext();
    this.Fd = useState(TimeSlider.state);
  }
  onAttach(el) {
    watchActiveTextTrack(this.a.textTracks, "chapters", this.Bh.bind(this));
    effect(this.Fl.bind(this));
  }
  onConnect() {
    onDispose(() => this.z.bind(this));
  }
  onDestroy() {
    this.Bh(null);
  }
  setRefs(refs) {
    this.ja = refs;
    this.nf?.dispose();
    if (this.ja.length === 1) {
      const el = this.ja[0];
      el.style.width = "100%";
      el.style.setProperty("--chapter-fill", "var(--slider-fill)");
      el.style.setProperty("--chapter-progress", "var(--slider-progress)");
    } else if (this.ja.length > 0) {
      scoped(() => this.Gl(), this.nf = createScope());
    }
  }
  Bh(track) {
    if (peek(this.Gd) === track) return;
    this.z();
    this.Gd.set(track);
  }
  z() {
    this.ja = [];
    this.ka.set([]);
    this.Xb.set(-1);
    this.Hd.set(-1);
    this.Sc = 0;
    this.nf?.dispose();
  }
  Gl() {
    if (!this.ja.length) return;
    effect(this.Hl.bind(this));
  }
  Hl() {
    const { hidden } = this.Fd;
    if (hidden()) return;
    effect(this.Il.bind(this));
    effect(this.Jl.bind(this));
    effect(this.Kl.bind(this));
    effect(this.Ll.bind(this));
  }
  Il() {
    const cues = this.ka();
    if (!cues.length) return;
    let cue, { clipStartTime, clipEndTime } = this.a.$state, startTime = clipStartTime(), endTime = clipEndTime() || cues[cues.length - 1].endTime, duration = endTime - startTime, remainingWidth = 100;
    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this.ja[i]) {
        const width = i === cues.length - 1 ? remainingWidth : round((cue.endTime - Math.max(startTime, cue.startTime)) / duration * 100, 3);
        this.ja[i].style.width = width + "%";
        remainingWidth -= width;
      }
    }
  }
  Jl() {
    let { liveEdge, clipStartTime, duration } = this.a.$state, { fillPercent, value } = this.Fd, cues = this.ka(), isLiveEdge = liveEdge(), prevActiveIndex = peek(this.Xb), currentChapter = cues[prevActiveIndex];
    let currentActiveIndex = isLiveEdge ? this.ka.length - 1 : this.Ch(
      currentChapter ? currentChapter.startTime / duration() * 100 <= peek(value) ? prevActiveIndex : 0 : 0,
      fillPercent()
    );
    if (isLiveEdge || !currentChapter) {
      this.of(0, cues.length, 100);
    } else if (currentActiveIndex > prevActiveIndex) {
      this.of(prevActiveIndex, currentActiveIndex, 100);
    } else if (currentActiveIndex < prevActiveIndex) {
      this.of(currentActiveIndex + 1, prevActiveIndex + 1, 0);
    }
    const percent = isLiveEdge ? 100 : this.pf(
      cues[currentActiveIndex],
      fillPercent(),
      clipStartTime(),
      this.qf(cues)
    );
    this.Dh(this.ja[currentActiveIndex], percent);
    this.Xb.set(currentActiveIndex);
  }
  Kl() {
    let { pointing, pointerPercent } = this.Fd;
    if (!pointing()) {
      this.Hd.set(-1);
      return;
    }
    const activeIndex = this.Ch(0, pointerPercent());
    this.Hd.set(activeIndex);
  }
  of(start, end, percent) {
    for (let i = start; i < end; i++) this.Dh(this.ja[i], percent);
  }
  Dh(ref, percent) {
    if (!ref) return;
    ref.style.setProperty("--chapter-fill", percent + "%");
    setAttribute(ref, "data-active", percent > 0 && percent < 100);
    setAttribute(ref, "data-ended", percent === 100);
  }
  Ch(startIndex, percent) {
    let chapterPercent = 0, cues = this.ka();
    if (percent === 0) return 0;
    else if (percent === 100) return cues.length - 1;
    let { clipStartTime } = this.a.$state, startTime = clipStartTime(), endTime = this.qf(cues);
    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this.pf(cues[i], percent, startTime, endTime);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }
    return 0;
  }
  Ll() {
    this.Ml(this.Nl());
  }
  Ol() {
    const { bufferedEnd, duration } = this.a.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }
  qf(cues) {
    const { clipEndTime } = this.a.$state, endTime = clipEndTime();
    return endTime > 0 ? endTime : cues[cues.length - 1]?.endTime || 0;
  }
  pf(cue, percent, startTime, endTime) {
    const cues = this.ka();
    if (cues.length === 0) return 0;
    const duration = endTime - startTime, cueStartTime = Math.max(0, cue.startTime - startTime), cueEndTime = Math.min(endTime, cue.endTime) - startTime;
    const startRatio = cueStartTime / duration, startPercent = startRatio * 100, endPercent = Math.min(1, startRatio + (cueEndTime - cueStartTime) / duration) * 100;
    return Math.max(
      0,
      round(
        percent >= endPercent ? 100 : (percent - startPercent) / (endPercent - startPercent) * 100,
        3
      )
    );
  }
  Pl(cues) {
    let chapters = [], { clipStartTime, clipEndTime, duration } = this.a.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
    cues = cues.filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime);
    const firstCue = cues[0];
    if (firstCue && firstCue.startTime > startTime) {
      chapters.push(new window.VTTCue(startTime, firstCue.startTime, ""));
    }
    for (let i = 0; i < cues.length - 1; i++) {
      const currentCue = cues[i], nextCue = cues[i + 1];
      chapters.push(currentCue);
      if (nextCue) {
        const timeDiff = nextCue.startTime - currentCue.endTime;
        if (timeDiff > 0) {
          chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ""));
        }
      }
    }
    const lastCue = cues[cues.length - 1];
    if (lastCue) {
      chapters.push(lastCue);
      const endTime2 = duration();
      if (endTime2 >= 0 && endTime2 - lastCue.endTime > 1) {
        chapters.push(new window.VTTCue(lastCue.endTime, duration(), ""));
      }
    }
    return chapters;
  }
  Fl() {
    const { source } = this.a.$state;
    source();
    this.pc();
  }
  pc() {
    if (!this.scope) return;
    const { disabled } = this.$props;
    if (disabled()) {
      this.ka.set([]);
      this.Xb.set(0);
      this.Sc = 0;
      return;
    }
    const track = this.Gd();
    if (track) {
      const onCuesChange = this.Id.bind(this);
      onCuesChange();
      onDispose(listenEvent(track, "add-cue", onCuesChange));
      onDispose(listenEvent(track, "remove-cue", onCuesChange));
      effect(this.Ql.bind(this));
    }
    this.yb = this.Rl();
    if (this.yb) effect(this.Sl.bind(this));
    return () => {
      if (this.yb) {
        this.yb.textContent = "";
        this.yb = null;
      }
    };
  }
  Ql() {
    this.a.$state.duration();
    this.Id();
  }
  Sl() {
    const cue = this.activePointerCue || this.activeCue;
    if (this.yb) this.yb.textContent = cue?.text || "";
  }
  Tl() {
    let node = this.el;
    while (node && node.getAttribute("role") !== "slider") {
      node = node.parentElement;
    }
    return node;
  }
  Rl() {
    const slider = this.Tl();
    return slider ? slider.querySelector('[data-part="chapter-title"]') : null;
  }
}
__decorateClass$4([
  prop
], SliderChapters.prototype, "cues");
__decorateClass$4([
  prop
], SliderChapters.prototype, "activeCue");
__decorateClass$4([
  prop
], SliderChapters.prototype, "activePointerCue");
__decorateClass$4([
  method
], SliderChapters.prototype, "setRefs");

var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$3(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$3(target, key, result);
  return result;
};
class RadioGroup extends Component {
  static {
    this.props = {
      value: ""
    };
  }
  get values() {
    return this.e.pm;
  }
  get value() {
    return this.e.value;
  }
  set value(newValue) {
    this.e.value = newValue;
  }
  constructor() {
    super();
    this.e = new RadioGroupController();
    this.e.l = this.l.bind(this);
  }
  onSetup() {
    effect(this.N.bind(this));
  }
  N() {
    this.e.value = this.$props.value();
  }
  l(value, trigger) {
    const event = this.createEvent("change", { detail: value, trigger });
    this.dispatch(event);
  }
}
__decorateClass$3([
  prop
], RadioGroup.prototype, "values");
__decorateClass$3([
  prop
], RadioGroup.prototype, "value");

var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$2(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$2(target, key, result);
  return result;
};
class Radio extends Component {
  constructor() {
    super();
    this.zb = signal(false);
    this.e = {
      Ta: this.$props.value,
      Wc: this.Wc.bind(this),
      Nd: null
    };
    new FocusVisibleController();
  }
  static {
    this.props = {
      value: ""
    };
  }
  get checked() {
    return this.zb();
  }
  onSetup() {
    this.setAttributes({
      value: this.$props.value,
      "data-checked": this.zb,
      "aria-checked": $ariaBool(this.zb)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
    effect(this.N.bind(this));
  }
  onConnect(el) {
    this.tm();
    onPress(el, this.r.bind(this));
    onDispose(this.Fa.bind(this));
  }
  Fa() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this.e);
    }, this.connectScope);
  }
  tm() {
    const group = useContext(radioControllerContext);
    group.add(this.e);
  }
  N() {
    const { value } = this.$props, newValue = value();
    if (peek(this.zb)) {
      this.e.Nd?.(newValue);
    }
  }
  r(event) {
    if (peek(this.zb)) return;
    this.E(true, event);
    this.um(event);
    this.e.Nd?.(peek(this.$props.value), event);
  }
  Wc(value, trigger) {
    if (peek(this.zb) === value) return;
    this.E(value, trigger);
  }
  E(value, trigger) {
    this.zb.set(value);
    this.dispatch("change", { detail: value, trigger });
  }
  um(trigger) {
    this.dispatch("select", { trigger });
  }
}
__decorateClass$2([
  prop
], Radio.prototype, "checked");

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc$1(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$1(target, key, result);
  return result;
};
class ChaptersRadioGroup extends Component {
  constructor() {
    super();
    this.J = signal(null);
    this.B = signal([]);
    this.e = new RadioGroupController();
    this.e.l = this.l.bind(this);
  }
  static {
    this.props = {
      thumbnails: null
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    return !this.B()?.length;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.n = useContext(menuContext);
    }
    const { thumbnails } = this.$props;
    this.setAttributes({
      "data-thumbnails": () => !!thumbnails()
    });
  }
  onAttach(el) {
    this.n?.wf({
      Af: this.Af.bind(this)
    });
  }
  getOptions() {
    const { clipStartTime, clipEndTime } = this.a.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
    return this.B().map((cue, i) => ({
      cue,
      value: i.toString(),
      label: cue.text,
      startTime: formatTime(Math.max(0, cue.startTime - startTime)),
      duration: formatSpokenTime(
        Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime)
      )
    }));
  }
  Af() {
    peek(() => this.Qb());
  }
  onConnect(el) {
    effect(this.Qb.bind(this));
    effect(this.sa.bind(this));
    effect(this.vm.bind(this));
    watchActiveTextTrack(this.a.textTracks, "chapters", this.J.set);
  }
  vm() {
    const track = this.J();
    if (!track) return;
    const onCuesChange = this.Id.bind(this, track);
    onCuesChange();
    listenEvent(track, "add-cue", onCuesChange);
    listenEvent(track, "remove-cue", onCuesChange);
    return () => {
      this.B.set([]);
    };
  }
  Id(track) {
    const { clipStartTime, clipEndTime } = this.a.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
    this.B.set(
      [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime)
    );
  }
  Qb() {
    if (!this.n?.T()) return;
    const track = this.J();
    if (!track) {
      this.e.value = "-1";
      return;
    }
    const { realCurrentTime, clipStartTime, clipEndTime } = this.a.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity, time = realCurrentTime(), activeCueIndex = this.B().findIndex((cue) => isCueActive(cue, time));
    this.e.value = activeCueIndex.toString();
    if (activeCueIndex >= 0) {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        const cue = this.B()[activeCueIndex], radio = this.el.querySelector(`[aria-checked='true']`), cueStartTime = Math.max(startTime, cue.startTime), duration = Math.min(endTime, cue.endTime) - cueStartTime, playedPercent = Math.max(0, time - cueStartTime) / duration * 100;
        radio && setStyle(radio, "--progress", round(playedPercent, 3) + "%");
      });
    }
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  l(value, trigger) {
    if (this.disabled || !trigger) return;
    const index = +value, cues = this.B(), { clipStartTime } = this.a.$state;
    if (isNumber(index) && cues?.[index]) {
      this.e.value = index.toString();
      this.a.remote.seek(cues[index].startTime - clipStartTime(), trigger);
      this.dispatch("change", { detail: cues[index], trigger });
    }
  }
}
__decorateClass$1([
  prop
], ChaptersRadioGroup.prototype, "value");
__decorateClass$1([
  prop
], ChaptersRadioGroup.prototype, "disabled");
__decorateClass$1([
  method
], ChaptersRadioGroup.prototype, "getOptions");

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = __getOwnPropDesc(target, key) ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp(target, key, result);
  return result;
};
const DEFAULT_AUDIO_GAINS = [1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
class AudioGainRadioGroup extends Component {
  static {
    this.props = {
      normalLabel: "Disabled",
      gains: DEFAULT_AUDIO_GAINS
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    const { gains } = this.$props, { canSetAudioGain } = this.a.$state;
    return !canSetAudioGain() || gains().length === 0;
  }
  constructor() {
    super();
    this.e = new RadioGroupController();
    this.e.l = this.l.bind(this);
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.n = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.N.bind(this));
    effect(this.Ua.bind(this));
    effect(this.sa.bind(this));
  }
  getOptions() {
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + "%",
      value: gain.toString()
    }));
  }
  N() {
    this.e.value = this.Y();
  }
  Ua() {
    const { normalLabel } = this.$props, { audioGain } = this.a.$state, gain = audioGain();
    this.n?._b.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + "%");
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  Y() {
    const { audioGain } = this.a.$state;
    return audioGain()?.toString() ?? "1";
  }
  l(value, trigger) {
    if (this.disabled) return;
    const gain = +value;
    this.a.remote.changeAudioGain(gain, trigger);
    this.dispatch("change", { detail: gain, trigger });
  }
}
__decorateClass([
  prop
], AudioGainRadioGroup.prototype, "value");
__decorateClass([
  prop
], AudioGainRadioGroup.prototype, "disabled");
__decorateClass([
  method
], AudioGainRadioGroup.prototype, "getOptions");

class Gesture extends Component {
  constructor() {
    super(...arguments);
    this.p = null;
    this.Ab = 0;
    this.Oh = -1;
  }
  static {
    this.props = {
      disabled: false,
      event: void 0,
      action: void 0
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-gesture", "");
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    this.p = this.a.player.el?.querySelector(
      "[data-media-provider]"
    );
    effect(this.wm.bind(this));
  }
  wm() {
    let eventType = this.$props.event(), disabled = this.$props.disabled();
    if (!this.p || !eventType || disabled) return;
    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1];
    }
    if (eventType === "pointerup" || eventType === "pointerdown") {
      const pointer = this.a.$state.pointer();
      if (pointer === "coarse") {
        eventType = eventType === "pointerup" ? "touchend" : "touchstart";
      }
    }
    listenEvent(
      this.p,
      eventType,
      this.xm.bind(this),
      { passive: false }
    );
  }
  xm(event) {
    if (this.$props.disabled() || isPointerEvent(event) && (event.button !== 0 || this.a.activeMenu) || isTouchEvent(event) && this.a.activeMenu || isTouchPinchEvent(event) || !this.ym(event)) {
      return;
    }
    event.MEDIA_GESTURE = true;
    event.preventDefault();
    const eventType = peek(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
    if (!isDblEvent) {
      if (this.Ab === 0) {
        setTimeout(() => {
          if (this.Ab === 1) this.Ph(event);
        }, 250);
      }
    } else if (this.Ab === 1) {
      queueMicrotask(() => this.Ph(event));
      clearTimeout(this.Oh);
      this.Ab = 0;
      return;
    }
    if (this.Ab === 0) {
      this.Oh = window.setTimeout(() => {
        this.Ab = 0;
      }, 275);
    }
    this.Ab++;
  }
  Ph(event) {
    this.el.setAttribute("data-triggered", "");
    requestAnimationFrame(() => {
      if (this.zm()) {
        this.Am(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el.removeAttribute("data-triggered");
      });
    });
  }
  /** Validate event occurred in gesture bounds. */
  ym(event) {
    if (!this.el) return false;
    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? event.changedTouches[0] ?? event.touches[0] : void 0;
      const clientX = touch?.clientX ?? event.clientX;
      const clientY = touch?.clientY ?? event.clientY;
      const rect = this.el.getBoundingClientRect();
      const inBounds = clientY >= rect.top && clientY <= rect.bottom && clientX >= rect.left && clientX <= rect.right;
      return event.type.includes("leave") ? !inBounds : inBounds;
    }
    return true;
  }
  /** Validate gesture has the highest z-index in this triggered group. */
  zm() {
    const gestures = this.a.player.el.querySelectorAll(
      "[data-media-gesture][data-triggered]"
    );
    return Array.from(gestures).sort(
      (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex
    )[0] === this.el;
  }
  Am(action, trigger) {
    if (!action) return;
    const willTriggerEvent = new DOMEvent("will-trigger", {
      detail: action,
      cancelable: true,
      trigger
    });
    this.dispatchEvent(willTriggerEvent);
    if (willTriggerEvent.defaultPrevented) return;
    const [method, value] = action.replace(/:([a-z])/, "-$1").split(":");
    if (action.includes(":fullscreen")) {
      this.a.remote.toggleFullscreen("prefer-media", trigger);
    } else if (action.includes("seek:")) {
      this.a.remote.seek(peek(this.a.$state.currentTime) + (+value || 0), trigger);
    } else {
      this.a.remote[kebabToCamelCase(method)](trigger);
    }
    this.dispatch("trigger", {
      detail: action,
      trigger
    });
  }
}

class CaptionsTextRenderer {
  constructor(_renderer) {
    this.ca = _renderer;
    this.priority = 10;
    this.J = null;
    this.Ya = createDisposalBin();
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this.Ya.empty();
    this.ca.reset();
    this.J = null;
  }
  changeTrack(track) {
    if (!track || this.J === track) return;
    this.Ya.empty();
    if (track.readyState < 2) {
      this.ca.reset();
      this.Ya.add(
        listenEvent(track, "load", () => this.Qh(track), { once: true })
      );
    } else {
      this.Qh(track);
    }
    this.Ya.add(
      listenEvent(track, "add-cue", (event) => {
        this.ca.addCue(event.detail);
      }),
      listenEvent(track, "remove-cue", (event) => {
        this.ca.removeCue(event.detail);
      })
    );
    this.J = track;
  }
  Qh(track) {
    this.ca.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
}

class Captions extends Component {
  constructor() {
    super(...arguments);
    this.ac = -1;
  }
  static {
    this.props = {
      textDir: "ltr",
      exampleText: "Captions look like this."
    };
  }
  static {
    this.L = signal(null);
  }
  get L() {
    return Captions.L;
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "aria-hidden": $ariaBool(this.Tb.bind(this))
    });
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    if (!this.L()) {
      import('media-captions').then((lib) => this.L.set(lib));
    }
    effect(this.Rh.bind(this));
  }
  Tb() {
    const { textTrack, remotePlaybackState, iOSControls } = this.a.$state, track = textTrack();
    return iOSControls() || remotePlaybackState() === "connected" || !track || !isTrackCaptionKind(track);
  }
  Rh() {
    if (!this.L()) return;
    const { viewType } = this.a.$state;
    if (viewType() === "audio") {
      return this.Cm();
    } else {
      return this.Dm();
    }
  }
  Cm() {
    effect(this.pc.bind(this));
    this.Gn(null);
    return () => {
      this.el.textContent = "";
    };
  }
  pc() {
    if (this.Tb()) return;
    this.Sh();
    const { textTrack } = this.a.$state;
    listenEvent(textTrack(), "cue-change", this.Sh.bind(this));
    effect(this.Em.bind(this));
  }
  Sh() {
    this.el.textContent = "";
    if (this.ac >= 0) {
      this.Ff();
    }
    const { realCurrentTime, textTrack } = this.a.$state, { renderVTTCueString } = this.L(), time = peek(realCurrentTime), activeCues = peek(textTrack).activeCues;
    for (const cue of activeCues) {
      const displayEl = this.Th(), cueEl = this.Uh();
      cueEl.innerHTML = renderVTTCueString(cue, time);
      displayEl.append(cueEl);
      this.el.append(cueEl);
    }
  }
  Em() {
    const { realCurrentTime } = this.a.$state, { updateTimedVTTCueNodes } = this.L();
    updateTimedVTTCueNodes(this.el, realCurrentTime());
  }
  Dm() {
    const { CaptionsRenderer } = this.L(), renderer = new CaptionsRenderer(this.el), textRenderer = new CaptionsTextRenderer(renderer);
    this.a.textRenderers.add(textRenderer);
    effect(this.Fm.bind(this, renderer));
    effect(this.Gm.bind(this, renderer));
    this.Gn(renderer);
    return () => {
      this.el.textContent = "";
      this.a.textRenderers.remove(textRenderer);
      renderer.destroy();
    };
  }
  Fm(renderer) {
    renderer.dir = this.$props.textDir();
  }
  Gm(renderer) {
    if (this.Tb()) return;
    const { realCurrentTime, textTrack } = this.a.$state;
    renderer.currentTime = realCurrentTime();
    if (this.ac >= 0 && textTrack()?.activeCues[0]) {
      this.Ff();
    }
  }
  Gn(renderer) {
    const player = this.a.player;
    if (!player) return;
    const onChange = this.Bm.bind(this, renderer);
    listenEvent(player, "vds-font-change", onChange);
  }
  Bm(renderer) {
    if (this.ac >= 0) {
      this.Vh();
      return;
    }
    const { textTrack } = this.a.$state;
    if (!textTrack()?.activeCues[0]) {
      this.Hm();
    } else {
      renderer?.update(true);
    }
  }
  Hm() {
    const display = this.Th();
    setAttribute(display, "data-example", "");
    const cue = this.Uh();
    setAttribute(cue, "data-example", "");
    cue.textContent = this.$props.exampleText();
    display?.append(cue);
    this.el?.append(display);
    this.el?.setAttribute("data-example", "");
    this.Vh();
  }
  Vh() {
    window.clearTimeout(this.ac);
    this.ac = window.setTimeout(this.Ff.bind(this), 2500);
  }
  Ff() {
    this.el?.removeAttribute("data-example");
    if (this.el?.querySelector("[data-example]")) this.el.textContent = "";
    this.ac = -1;
  }
  Th() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue-display");
    return el;
  }
  Uh() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue");
    return el;
  }
}

export { AudioGainRadioGroup, AudioGainSlider, Captions, ChaptersRadioGroup, Controls, ControlsGroup, DEFAULT_AUDIO_GAINS, Gesture, GoogleCastButton, MediaAnnouncer, QualitySlider, Radio, RadioGroup, SliderChapters, SliderVideo, SpeedSlider, ToggleButton, Tooltip, TooltipContent, TooltipTrigger };
