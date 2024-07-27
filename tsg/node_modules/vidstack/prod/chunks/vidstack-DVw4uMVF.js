import { ViewController, onDispose, isArray, isString, isNull, effect, peek, listenEvent, ariaBool, isWriteSignal, Component, State, createContext, functionThrottle, hasProvidedContext, useContext, isNumber, signal, animationFrameThrottle, provideContext, isObject, useState, computed, method, setAttribute, r, wasEnterKeyPressed, isKeyboardEvent, tick, prop, setStyle } from './vidstack-C6myozhB.js';
import { useMediaContext } from './vidstack-Cq-GdDcp.js';
import { $ariaBool, sortVideoQualities } from './vidstack-BOTZD4tC.js';
import { hasAnimation, setAttributeIfEmpty, onPress, setARIALabel, isTouchPinchEvent, observeVisibility, isHTMLElement, isElementParent, isEventInside, isElementVisible, requestScopedAnimationFrame, autoPlacement } from './vidstack-BeyDmEgV.js';
import { isTrackCaptionKind } from './vidstack-B97tQYIP.js';
import { FocusVisibleController } from './vidstack-D6_zYTXL.js';
import { assert } from './vidstack-C9vIqaYT.js';
import { getRequestCredentials } from './vidstack-Vi2h5MrZ.js';
import { clampNumber, round, getNumberOfDecimalPlaces } from './vidstack-Dihypf8P.js';
import { watchActiveTextTrack } from './vidstack-D2w309v1.js';

class ARIAKeyShortcuts extends ViewController {
  constructor(_shortcut) {
    super();
    this.$d = _shortcut;
  }
  onAttach(el) {
    const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[this.$d] = keys;
      {
        onDispose(() => {
          delete ariaKeys[this.$d];
        });
      }
      return;
    }
    const shortcuts = $props.keyShortcuts()[this.$d];
    if (shortcuts) {
      const keys2 = isArray(shortcuts) ? shortcuts.join(" ") : isString(shortcuts) ? shortcuts : shortcuts?.keys;
      el.setAttribute("aria-keyshortcuts", isArray(keys2) ? keys2.join(" ") : keys2);
    }
  }
}

function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, { padHrs = null, padMins = null, showHrs = false, showMs = false } = {}) {
  const { hours, minutes, seconds, fraction } = parseTime(duration), paddedHours = padHrs ? padNumberWithZeroes(hours, 2) : hours, paddedMinutes = padMins || isNull(padMins) && duration >= 3600 ? padNumberWithZeroes(minutes, 2) : minutes, paddedSeconds = padNumberWithZeroes(seconds, 2), paddedMs = showMs && fraction > 0 ? `.${String(fraction).replace(/^0?\./, "")}` : "", time = `${paddedMinutes}:${paddedSeconds}${paddedMs}`;
  return hours > 0 || showHrs ? `${paddedHours}:${time}` : time;
}
function formatSpokenTime(duration) {
  const spokenParts = [];
  const { hours, minutes, seconds } = parseTime(duration);
  if (hours > 0) {
    spokenParts.push(`${hours} hour`);
  }
  if (minutes > 0) {
    spokenParts.push(`${minutes} min`);
  }
  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} sec`);
  }
  return spokenParts.join(" ");
}

class Popper extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    this.zd = -1;
    this.Ad = -1;
    this.wb = null;
    effect(this.Ok.bind(this));
  }
  onDestroy() {
    this.wb?.();
    this.wb = null;
  }
  Ok() {
    const trigger = this.j.M();
    if (!trigger) {
      this.hide();
      return;
    }
    const show = this.show.bind(this), hide = this.hide.bind(this);
    this.j.yd(trigger, show, hide);
  }
  show(trigger) {
    this.Ye();
    window.cancelAnimationFrame(this.Ad);
    this.Ad = -1;
    this.wb?.();
    this.wb = null;
    this.zd = window.setTimeout(() => {
      this.zd = -1;
      const content = this.j.q();
      if (content) content.style.removeProperty("display");
      peek(() => this.j.E(true, trigger));
    }, this.j.ih?.() ?? 0);
  }
  hide(trigger) {
    this.Ye();
    peek(() => this.j.E(false, trigger));
    this.Ad = requestAnimationFrame(() => {
      this.Ye();
      this.Ad = -1;
      const content = this.j.q();
      if (content) {
        const onHide = () => {
          content.style.display = "none";
          this.wb = null;
        };
        const isAnimated = hasAnimation(content);
        if (isAnimated) {
          this.wb?.();
          const stop = listenEvent(content, "animationend", onHide, { once: true });
          this.wb = stop;
        } else {
          onHide();
        }
      }
    });
  }
  Ye() {
    window.clearTimeout(this.zd);
    this.zd = -1;
  }
}

class ToggleButtonController extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    new FocusVisibleController();
    if (_delegate.Sb) {
      new ARIAKeyShortcuts(_delegate.Sb);
    }
  }
  static {
    this.props = {
      disabled: false
    };
  }
  onSetup() {
    const { disabled } = this.$props;
    this.setAttributes({
      "data-pressed": this.j.o,
      "aria-pressed": this.Rk.bind(this),
      "aria-disabled": () => disabled() ? "true" : null
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    onPress(el, this.Sk.bind(this));
    for (const type of ["click", "touchstart"]) {
      this.listen(type, this.Tk.bind(this), {
        passive: true
      });
    }
  }
  Rk() {
    return ariaBool(this.j.o());
  }
  Uk(event) {
    if (isWriteSignal(this.j.o)) {
      this.j.o.set((p) => !p);
    }
  }
  Sk(event) {
    const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (this.j.r ?? this.Uk).call(this, event);
  }
  Tk(event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

class AirPlayButton extends Component {
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
    const { canAirPlay, isAirPlayConnected } = this.a.$state;
    this.setAttributes({
      "data-active": isAirPlayConnected,
      "data-supported": canAirPlay,
      "data-state": this.Ic.bind(this),
      "aria-hidden": $ariaBool(() => !canAirPlay())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "airplay");
    setARIALabel(el, this.Jc.bind(this));
  }
  r(event) {
    const remote = this.a.remote;
    remote.requestAirPlay(event);
  }
  o() {
    const { remotePlaybackType, remotePlaybackState } = this.a.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState() !== "disconnected";
  }
  Ic() {
    const { remotePlaybackType, remotePlaybackState } = this.a.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState();
  }
  Jc() {
    const { remotePlaybackState } = this.a.$state;
    return `AirPlay ${remotePlaybackState()}`;
  }
}

class PlayButton extends Component {
  static {
    this.props = ToggleButtonController.props;
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      Sb: "togglePaused",
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    const { paused, ended } = this.a.$state;
    this.setAttributes({
      "data-paused": paused,
      "data-ended": ended
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "play");
    setARIALabel(el, "Play");
  }
  r(event) {
    const remote = this.a.remote;
    this.o() ? remote.pause(event) : remote.play(event);
  }
  o() {
    const { paused } = this.a.$state;
    return !paused();
  }
}

class CaptionButton extends Component {
  static {
    this.props = ToggleButtonController.props;
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      Sb: "toggleCaptions",
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "data-active": this.o.bind(this),
      "data-supported": () => !this.Tb(),
      "aria-hidden": $ariaBool(this.Tb.bind(this))
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "caption");
    setARIALabel(el, "Captions");
  }
  r(event) {
    this.a.remote.toggleCaptions(event);
  }
  o() {
    const { textTrack } = this.a.$state, track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }
  Tb() {
    const { hasCaptions } = this.a.$state;
    return !hasCaptions();
  }
}

class FullscreenButton extends Component {
  static {
    this.props = {
      ...ToggleButtonController.props,
      target: "prefer-media"
    };
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      Sb: "toggleFullscreen",
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    const { fullscreen } = this.a.$state, isSupported = this.Kc.bind(this);
    this.setAttributes({
      "data-active": fullscreen,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "fullscreen");
    setARIALabel(el, "Fullscreen");
  }
  r(event) {
    const remote = this.a.remote, target = this.$props.target();
    this.o() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }
  o() {
    const { fullscreen } = this.a.$state;
    return fullscreen();
  }
  Kc() {
    const { canFullscreen } = this.a.$state;
    return canFullscreen();
  }
}

class MuteButton extends Component {
  static {
    this.props = ToggleButtonController.props;
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      Sb: "toggleMuted",
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "data-muted": this.o.bind(this),
      "data-state": this.Ic.bind(this)
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-mute-button", "");
    el.setAttribute("data-media-tooltip", "mute");
    setARIALabel(el, "Mute");
  }
  r(event) {
    const remote = this.a.remote;
    this.o() ? remote.unmute(event) : remote.mute(event);
  }
  o() {
    const { muted, volume } = this.a.$state;
    return muted() || volume() === 0;
  }
  Ic() {
    const { muted, volume } = this.a.$state, $volume = volume();
    if (muted() || $volume === 0) return "muted";
    else if ($volume >= 0.5) return "high";
    else if ($volume < 0.5) return "low";
  }
}

class PIPButton extends Component {
  static {
    this.props = ToggleButtonController.props;
  }
  constructor() {
    super();
    new ToggleButtonController({
      o: this.o.bind(this),
      Sb: "togglePictureInPicture",
      r: this.r.bind(this)
    });
  }
  onSetup() {
    this.a = useMediaContext();
    const { pictureInPicture } = this.a.$state, isSupported = this.Kc.bind(this);
    this.setAttributes({
      "data-active": pictureInPicture,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "pip");
    setARIALabel(el, "PiP");
  }
  r(event) {
    const remote = this.a.remote;
    this.o() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }
  o() {
    const { pictureInPicture } = this.a.$state;
    return pictureInPicture();
  }
  Kc() {
    const { canPictureInPicture } = this.a.$state;
    return canPictureInPicture();
  }
}

class SeekButton extends Component {
  static {
    this.props = {
      disabled: false,
      seconds: 30
    };
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.a = useMediaContext();
    const { seeking } = this.a.$state, { seconds } = this.$props, isSupported = this.Kc.bind(this);
    this.setAttributes({
      seconds,
      "data-seeking": seeking,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "seek");
    setARIALabel(el, this.Jc.bind(this));
  }
  onConnect(el) {
    onPress(el, this.r.bind(this));
  }
  Kc() {
    const { canSeek } = this.a.$state;
    return canSeek();
  }
  Jc() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
  }
  r(event) {
    const { seconds, disabled } = this.$props;
    if (disabled()) return;
    const { currentTime } = this.a.$state, seekTo = currentTime() + seconds();
    this.a.remote.seek(seekTo, event);
  }
}

class LiveButton extends Component {
  static {
    this.props = {
      disabled: false
    };
  }
  constructor() {
    super();
    new FocusVisibleController();
  }
  onSetup() {
    this.a = useMediaContext();
    const { disabled } = this.$props, { live, liveEdge } = this.a.$state, isHidden = () => !live();
    this.setAttributes({
      "data-edge": liveEdge,
      "data-hidden": isHidden,
      "aria-disabled": $ariaBool(() => disabled() || liveEdge()),
      "aria-hidden": $ariaBool(isHidden)
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "live");
  }
  onConnect(el) {
    onPress(el, this.r.bind(this));
  }
  r(event) {
    const { disabled } = this.$props, { liveEdge } = this.a.$state;
    if (disabled() || liveEdge()) return;
    this.a.remote.seekToLiveEdge(event);
  }
}

const sliderState = new State({
  min: 0,
  max: 100,
  value: 0,
  step: 1,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  hidden: false,
  get active() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}

class IntersectionObserverController extends ViewController {
  constructor(_init) {
    super();
    this.Hb = _init;
  }
  onConnect(el) {
    this.Ra = new IntersectionObserver((entries) => {
      this.Hb.callback?.(entries, this.Ra);
    }, this.Hb);
    this.Ra.observe(el);
    onDispose(this.Fa.bind(this));
  }
  /**
   * Disconnect any active intersection observers.
   */
  Fa() {
    this.Ra?.disconnect();
    this.Ra = void 0;
  }
}

const sliderContext = createContext();
const sliderObserverContext = createContext();

function getClampedValue(min, max, value, step) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}
function getValueFromRate(min, max, rate, step) {
  const boundRate = clampNumber(0, rate, 1), range = max - min, fill = range * boundRate, stepRatio = fill / step, steps = step * Math.round(stepRatio);
  return min + steps;
}

const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1
};
class SliderEventsController extends ViewController {
  constructor(_delegate, _media) {
    super();
    this.j = _delegate;
    this.a = _media;
    this.p = null;
    this.cb = null;
    this.Ub = null;
    this.Bn = false;
    this.cl = functionThrottle(
      (event) => {
        this.db(this.Cd(event), event);
      },
      20,
      { leading: true }
    );
  }
  onSetup() {
    if (hasProvidedContext(sliderObserverContext)) {
      this.Ra = useContext(sliderObserverContext);
    }
  }
  onConnect() {
    effect(this.Wk.bind(this));
    effect(this.Xk.bind(this));
    if (this.j.kh) effect(this.Yk.bind(this));
  }
  Yk() {
    const { pointer } = this.a.$state;
    if (pointer() !== "coarse" || !this.j.kh()) {
      this.p = null;
      return;
    }
    this.p = this.a.player.el?.querySelector(
      "media-provider,[data-media-provider]"
    );
    if (!this.p) return;
    listenEvent(this.p, "touchstart", this.Zk.bind(this), {
      passive: true
    });
    listenEvent(this.p, "touchmove", this._k.bind(this), {
      passive: false
    });
  }
  Zk(event) {
    this.cb = event.touches[0];
  }
  _k(event) {
    if (isNull(this.cb) || isTouchPinchEvent(event)) return;
    const touch = event.touches[0], xDiff = touch.clientX - this.cb.clientX, yDiff = touch.clientY - this.cb.clientY, isDragging = this.$state.dragging();
    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }
    if (isDragging) return;
    event.preventDefault();
    if (Math.abs(xDiff) > 20) {
      this.cb = touch;
      this.Ub = this.$state.value();
      this.cf(this.Ub, event);
    }
  }
  Wk() {
    const { hidden } = this.$props;
    this.listen("focus", this.Ec.bind(this));
    this.listen("keydown", this.ic.bind(this));
    this.listen("keyup", this.hc.bind(this));
    if (hidden() || this.j.v()) return;
    this.listen("pointerenter", this.Oe.bind(this));
    this.listen("pointermove", this.$k.bind(this));
    this.listen("pointerleave", this.Pe.bind(this));
    this.listen("pointerdown", this.al.bind(this));
  }
  Xk() {
    if (this.j.v() || !this.$state.dragging()) return;
    listenEvent(document, "pointerup", this.bl.bind(this), { capture: true });
    listenEvent(document, "pointermove", this.cl.bind(this));
    listenEvent(document, "touchmove", this.dl.bind(this), {
      passive: false
    });
  }
  Ec() {
    this.db(this.$state.value());
  }
  df(newValue, trigger) {
    const { value, min, max, dragging } = this.$state;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);
    const event = this.createEvent("value-change", { detail: clampedValue, trigger });
    this.dispatch(event);
    this.j.l?.(event);
    if (dragging()) {
      const event2 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
      this.dispatch(event2);
      this.j.S?.(event2);
    }
  }
  db(value, trigger) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch("pointer-value-change", { detail: value, trigger });
    if (dragging()) {
      this.df(value, trigger);
    }
  }
  Cd(event) {
    let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min, max } = this.$state;
    if (this.$props.orientation() === "vertical") {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this.cb && isNumber(this.Ub)) {
        const { width } = this.p.getBoundingClientRect(), rate = (event.clientX - this.cb.clientX) / width, range = max() - min(), diff = range * Math.abs(rate);
        thumbPositionRate = (rate < 0 ? this.Ub - diff : this.Ub + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }
    return Math.max(
      min(),
      Math.min(
        max(),
        this.j.Da(
          getValueFromRate(min(), max(), thumbPositionRate, this.j.qa())
        )
      )
    );
  }
  Oe(event) {
    this.$state.pointing.set(true);
  }
  $k(event) {
    const { dragging } = this.$state;
    if (dragging()) return;
    this.db(this.Cd(event), event);
  }
  Pe(event) {
    this.$state.pointing.set(false);
  }
  al(event) {
    if (event.button !== 0) return;
    const value = this.Cd(event);
    this.cf(value, event);
    this.db(value, event);
  }
  cf(value, trigger) {
    const { dragging } = this.$state;
    if (dragging()) return;
    dragging.set(true);
    this.a.remote.pauseControls(trigger);
    const event = this.createEvent("drag-start", { detail: value, trigger });
    this.dispatch(event);
    this.j.ef?.(event);
    this.Ra?.onDragStart?.();
  }
  lh(value, trigger) {
    const { dragging } = this.$state;
    if (!dragging()) return;
    dragging.set(false);
    this.a.remote.resumeControls(trigger);
    const event = this.createEvent("drag-end", { detail: value, trigger });
    this.dispatch(event);
    this.j.Dd?.(event);
    this.cb = null;
    this.Ub = null;
    this.Ra?.onDragEnd?.();
  }
  ic(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey) return;
    const { key } = event, jumpValue = this.Cn(event);
    if (!isNull(jumpValue)) {
      this.db(jumpValue, event);
      this.df(jumpValue, event);
      return;
    }
    const newValue = this.Dn(event);
    if (!this.Bn) {
      this.Bn = key === this.ff;
      if (!this.$state.dragging() && this.Bn) {
        this.cf(newValue, event);
      }
    }
    this.db(newValue, event);
    this.ff = key;
  }
  hc(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey || !isNull(this.Cn(event))) return;
    const newValue = this.Bn ? this.$state.pointerValue() : this.Dn(event);
    this.df(newValue, event);
    this.lh(newValue, event);
    this.ff = "";
    this.Bn = false;
  }
  Cn(event) {
    let key = event.key, { min, max } = this.$state;
    if (key === "Home" || key === "PageUp") {
      return min();
    } else if (key === "End" || key === "PageDown") {
      return max();
    } else if (!event.metaKey && /^[0-9]$/.test(key)) {
      return (max() - min()) / 10 * Number(key);
    }
    return null;
  }
  Dn(event) {
    const { key, shiftKey } = event;
    event.preventDefault();
    event.stopPropagation();
    const { shiftKeyMultiplier } = this.$props;
    const { min, max, value, pointerValue } = this.$state, step = this.j.qa(), keyStep = this.j.eb();
    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, currentValue = this.Bn ? pointerValue() : this.j.Y?.() ?? value(), steps = (currentValue + diff) / step;
    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }
  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------
  bl(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const value = this.Cd(event);
    this.db(value, event);
    this.lh(value, event);
  }
  dl(event) {
    event.preventDefault();
  }
}

const sliderValueFormatContext = createContext(() => ({}));

class SliderController extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    this.Lc = signal(true);
    this.Mc = signal(true);
    this.jl = animationFrameThrottle(
      (fillPercent, pointerPercent) => {
        this.el?.style.setProperty("--slider-fill", fillPercent + "%");
        this.el?.style.setProperty("--slider-pointer", pointerPercent + "%");
      }
    );
  }
  static {
    this.props = {
      hidden: false,
      disabled: false,
      step: 1,
      keyStep: 1,
      orientation: "horizontal",
      shiftKeyMultiplier: 5
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const focus = new FocusVisibleController();
    focus.attach(this);
    this.$state.focused = focus.focused.bind(focus);
    if (!hasProvidedContext(sliderValueFormatContext)) {
      provideContext(sliderValueFormatContext, {
        default: "value"
      });
    }
    provideContext(sliderContext, {
      bb: this.$props.orientation,
      Ed: this.j.v,
      nh: signal(null)
    });
    effect(this.N.bind(this));
    effect(this.fl.bind(this));
    effect(this.Nc.bind(this));
    this.gl();
    new SliderEventsController(this.j, this.a).attach(this);
    new IntersectionObserverController({
      callback: this.gf.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "role", "slider");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "autocomplete", "off");
    effect(this.oh.bind(this));
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this.Lc.set));
    effect(this.Ea.bind(this));
  }
  gf(entries) {
    this.Mc.set(entries[0].isIntersecting);
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  Ea() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.Lc() || !this.Mc.bind(this));
  }
  N() {
    const { dragging, value, min, max } = this.$state;
    if (peek(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this.j.qa()));
  }
  fl() {
    this.$state.step.set(this.j.qa());
  }
  Nc() {
    if (!this.j.v()) return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  il() {
    return ariaBool(this.j.v());
  }
  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------
  gl() {
    const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
    this.setAttributes({
      "data-dragging": dragging,
      "data-pointing": pointing,
      "data-active": active,
      "aria-disabled": this.il.bind(this),
      "aria-valuemin": this.j.Tm ?? this.$state.min,
      "aria-valuemax": this.j.hf ?? this.$state.max,
      "aria-valuenow": this.j.O,
      "aria-valuetext": this.j.P,
      "aria-orientation": orientation
    });
  }
  oh() {
    const { fillPercent, pointerPercent } = this.$state;
    this.jl(round(fillPercent(), 3), round(pointerPercent(), 3));
  }
}

class Slider extends Component {
  static {
    this.props = {
      ...SliderController.props,
      min: 0,
      max: 100,
      value: 0
    };
  }
  static {
    this.state = sliderState;
  }
  constructor() {
    super();
    new SliderController({
      qa: this.$props.step,
      eb: this.$props.keyStep,
      Da: Math.round,
      v: this.$props.disabled,
      O: this.O.bind(this),
      P: this.P.bind(this)
    });
  }
  onSetup() {
    effect(this.N.bind(this));
    effect(this.Oc.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  O() {
    const { value } = this.$state;
    return Math.round(value());
  }
  P() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  N() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }
  Oc() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

const cache = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map();
class ThumbnailsLoader {
  constructor($src, $crossOrigin, _media) {
    this.$src = $src;
    this.$crossOrigin = $crossOrigin;
    this.a = _media;
    this.$images = signal([]);
    effect(this.kl.bind(this));
  }
  static create($src, $crossOrigin) {
    const media = useMediaContext();
    return new ThumbnailsLoader($src, $crossOrigin, media);
  }
  kl() {
    const { canLoad } = this.a.$state;
    if (!canLoad()) return;
    const src = this.$src();
    if (!src) return;
    if (isString(src) && cache.has(src)) {
      const cues = cache.get(src);
      cache.delete(src);
      cache.set(src, cues);
      if (cache.size > 99) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      this.$images.set(cache.get(src));
    } else if (isString(src)) {
      const crossOrigin = this.$crossOrigin(), currentKey = src + "::" + crossOrigin;
      if (!pending.has(currentKey)) {
        const promise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(src, {
              credentials: getRequestCredentials(crossOrigin)
            }), isJSON = response.headers.get("content-type") === "application/json";
            if (isJSON) {
              const json = await response.json();
              if (isArray(json)) {
                if (json[0] && "text" in json[0]) {
                  resolve(this.ph(json));
                } else {
                  for (let i = 0; i < json.length; i++) {
                    const image = json[i];
                    assert(isObject(image), false);
                    assert(
                      "url" in image && isString(image.url),
                      false
                    );
                    assert(
                      "startTime" in image && isNumber(image.startTime),
                      false
                    );
                  }
                  resolve(json);
                }
              } else {
                resolve(this.qh(json));
              }
              return;
            }
            import('media-captions').then(async ({ parseResponse }) => {
              try {
                const { cues } = await parseResponse(response);
                resolve(this.ph(cues));
              } catch (e) {
                reject(e);
              }
            });
          } catch (e) {
            reject(e);
          }
        }).then((images) => {
          cache.set(currentKey, images);
          return images;
        }).catch((error) => {
          this.Q(src, error);
        }).finally(() => {
          if (isString(currentKey)) pending.delete(currentKey);
        });
        pending.set(currentKey, promise);
      }
      pending.get(currentKey)?.then((images) => {
        this.$images.set(images || []);
      });
    } else if (isArray(src)) {
      try {
        this.$images.set(this.ll(src));
      } catch (error) {
        this.Q(src, error);
      }
    } else {
      try {
        this.$images.set(this.qh(src));
      } catch (error) {
        this.Q(src, error);
      }
    }
    return () => {
      this.$images.set([]);
    };
  }
  ll(images) {
    const baseURL = this.rh();
    return images.map((img, i) => {
      assert(
        img.url && isString(img.url));
      assert(
        "startTime" in img && isNumber(img.startTime));
      return {
        ...img,
        url: isString(img.url) ? this.sh(img.url, baseURL) : img.url
      };
    });
  }
  qh(board) {
    assert(isString(board.url));
    assert(isArray(board.tiles) && board.tiles?.length);
    const url = new URL(board.url), images = [];
    const tileWidth = "tile_width" in board ? board.tile_width : board.tileWidth, tileHeight = "tile_height" in board ? board.tile_height : board.tileHeight;
    for (const tile of board.tiles) {
      images.push({
        url,
        startTime: "start" in tile ? tile.start : tile.startTime,
        width: tileWidth,
        height: tileHeight,
        coords: { x: tile.x, y: tile.y }
      });
    }
    return images;
  }
  ph(cues) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      assert(
        "startTime" in cue && isNumber(cue.startTime));
      assert(
        "text" in cue && isString(cue.text));
    }
    const images = [], baseURL = this.rh();
    for (const cue of cues) {
      const [url, hash] = cue.text.split("#"), data = this.ml(hash);
      images.push({
        url: this.sh(url, baseURL),
        startTime: cue.startTime,
        endTime: cue.endTime,
        width: data?.w,
        height: data?.h,
        coords: data && isNumber(data.x) && isNumber(data.y) ? { x: data.x, y: data.y } : void 0
      });
    }
    return images;
  }
  rh() {
    let baseURL = peek(this.$src);
    if (!isString(baseURL) || !/^https?:/.test(baseURL)) {
      return location.href;
    }
    return baseURL;
  }
  sh(src, baseURL) {
    return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
  }
  ml(hash) {
    if (!hash) return {};
    const [hashProps, values] = hash.split("="), hashValues = values?.split(","), data = {};
    if (!hashProps || !hashValues) {
      return null;
    }
    for (let i = 0; i < hashProps.length; i++) {
      const value = +hashValues[i];
      if (!isNaN(value)) data[hashProps[i]] = value;
    }
    return data;
  }
  Q(src, error) {
    return;
  }
}

class Thumbnail extends Component {
  constructor() {
    super(...arguments);
    this.jf = [];
  }
  static {
    this.props = {
      src: null,
      time: 0,
      crossOrigin: null
    };
  }
  static {
    this.state = new State({
      src: "",
      img: null,
      thumbnails: [],
      activeThumbnail: null,
      crossOrigin: null,
      loading: false,
      error: null,
      hidden: false
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.X = ThumbnailsLoader.create(this.$props.src, this.$state.crossOrigin);
    this.Ca();
    this.setAttributes({
      "data-loading": this.Pc.bind(this),
      "data-error": this.fb.bind(this),
      "data-hidden": this.$state.hidden,
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onConnect(el) {
    effect(this.kf.bind(this));
    effect(this.Ea.bind(this));
    effect(this.Ca.bind(this));
    effect(this.Ma.bind(this));
    effect(this.nl.bind(this));
    effect(this.th.bind(this));
  }
  kf() {
    const img = this.$state.img();
    if (!img) return;
    listenEvent(img, "load", this.tb.bind(this));
    listenEvent(img, "error", this.Q.bind(this));
  }
  Ca() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this.a.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  Ma() {
    const { src, loading, error } = this.$state;
    if (src()) {
      loading.set(true);
      error.set(null);
    }
    return () => {
      this.ol();
      loading.set(false);
      error.set(null);
    };
  }
  tb() {
    const { loading, error } = this.$state;
    this.th();
    loading.set(false);
    error.set(null);
  }
  Q(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
  Pc() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  fb() {
    const { error } = this.$state;
    return !isNull(error());
  }
  Ea() {
    const { hidden } = this.$state, { duration } = this.a.$state, images = this.X.$images();
    hidden.set(this.fb() || !Number.isFinite(duration()) || images.length === 0);
  }
  uh() {
    return this.$props.time();
  }
  nl() {
    let images = this.X.$images();
    if (!images.length) return;
    let time = this.uh(), { src, activeThumbnail } = this.$state, activeIndex = -1, activeImage = null;
    for (let i = images.length - 1; i >= 0; i--) {
      const image = images[i];
      if (time >= image.startTime && (!image.endTime || time < image.endTime)) {
        activeIndex = i;
        break;
      }
    }
    if (images[activeIndex]) {
      activeImage = images[activeIndex];
    }
    activeThumbnail.set(activeImage);
    src.set(activeImage?.url.href || "");
  }
  th() {
    if (!this.scope || this.$state.hidden()) return;
    const rootEl = this.el, imgEl = this.$state.img(), thumbnail = this.$state.activeThumbnail();
    if (!imgEl || !thumbnail || !rootEl) return;
    let width = thumbnail.width ?? imgEl.naturalWidth, height = thumbnail?.height ?? imgEl.naturalHeight, {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      width: elWidth,
      height: elHeight
    } = getComputedStyle(this.el);
    if (minWidth === "100%") minWidth = parseFloat(elWidth) + "";
    if (minHeight === "100%") minHeight = parseFloat(elHeight) + "";
    let minRatio = Math.max(parseInt(minWidth) / width, parseInt(minHeight) / height), maxRatio = Math.min(
      Math.max(parseInt(minWidth), parseInt(maxWidth)) / width,
      Math.max(parseInt(minHeight), parseInt(maxHeight)) / height
    ), scale = !isNaN(maxRatio) && maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
    this.Vb(rootEl, "--thumbnail-width", `${width * scale}px`);
    this.Vb(rootEl, "--thumbnail-height", `${height * scale}px`);
    this.Vb(imgEl, "width", `${imgEl.naturalWidth * scale}px`);
    this.Vb(imgEl, "height", `${imgEl.naturalHeight * scale}px`);
    this.Vb(
      imgEl,
      "transform",
      thumbnail.coords ? `translate(-${thumbnail.coords.x * scale}px, -${thumbnail.coords.y * scale}px)` : ""
    );
    this.Vb(imgEl, "max-width", "none");
  }
  Vb(el, name, value) {
    el.style.setProperty(name, value);
    this.jf.push(() => el.style.removeProperty(name));
  }
  ol() {
    for (const reset of this.jf) reset();
    this.jf = [];
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
class SliderValue extends Component {
  static {
    this.props = {
      type: "pointer",
      format: null,
      showHours: false,
      showMs: false,
      padHours: null,
      padMinutes: null,
      decimalPlaces: 2
    };
  }
  onSetup() {
    this.ia = useState(Slider.state);
    this.Qc = useContext(sliderValueFormatContext);
    this.sl = computed(this.getValueText.bind(this));
  }
  getValueText() {
    const { type, format, decimalPlaces, padHours, padMinutes, showHours, showMs } = this.$props, { value: sliderValue, pointerValue, min, max } = this.ia, _format = format?.() ?? this.Qc.default;
    const value = type() === "current" ? sliderValue() : pointerValue();
    if (_format === "percent") {
      const range = max() - min();
      const percent = value / range * 100;
      return (this.Qc.percent ?? round)(percent, decimalPlaces()) + "%";
    } else if (_format === "time") {
      return (this.Qc.time ?? formatTime)(value, {
        padHrs: padHours(),
        padMins: padMinutes(),
        showHrs: showHours(),
        showMs: showMs()
      });
    } else {
      return (this.Qc.value?.(value) ?? value.toFixed(2)) + "";
    }
  }
}
__decorateClass$6([
  method
], SliderValue.prototype, "getValueText");

class SliderPreview extends Component {
  constructor() {
    super(...arguments);
    this.vh = animationFrameThrottle(() => {
      const { Ed: _disabled, bb: _orientation } = this.ia;
      if (_disabled()) return;
      const el = this.el, { offset, noClamp } = this.$props;
      if (!el) return;
      updateSliderPreviewPlacement(el, {
        clamp: !noClamp(),
        offset: offset(),
        orientation: _orientation()
      });
    });
  }
  static {
    this.props = {
      offset: 0,
      noClamp: false
    };
  }
  onSetup() {
    this.ia = useContext(sliderContext);
    const { active } = useState(Slider.state);
    this.setAttributes({
      "data-visible": active
    });
  }
  onAttach(el) {
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    const { nh: _preview } = this.ia;
    _preview.set(el);
    onDispose(() => _preview.set(null));
    effect(this.vh.bind(this));
    const resize = new ResizeObserver(this.vh.bind(this));
    resize.observe(el);
    onDispose(() => resize.disconnect());
  }
}
function updateSliderPreviewPlacement(el, {
  clamp,
  offset,
  orientation
}) {
  const computedStyle = getComputedStyle(el), width = parseFloat(computedStyle.width), height = parseFloat(computedStyle.height), styles = {
    top: null,
    right: null,
    bottom: null,
    left: null
  };
  styles[orientation === "horizontal" ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${offset}px))`;
  if (orientation === "horizontal") {
    const widthHalf = width / 2;
    if (!clamp) {
      styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
    } else {
      const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`, rightClamp = `calc(100% - ${width}px)`;
      styles.left = `min(${leftClamp}, ${rightClamp})`;
    }
  } else {
    const heightHalf = height / 2;
    if (!clamp) {
      styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
    } else {
      const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`, bottomClamp = `calc(100% - ${height}px)`;
      styles.bottom = `min(${topClamp}, ${bottomClamp})`;
    }
  }
  Object.assign(el.style, styles);
}

class VolumeSlider extends Component {
  constructor() {
    super(...arguments);
    this.wh = functionThrottle(this.Na.bind(this), 25);
  }
  static {
    this.props = {
      ...SliderController.props,
      keyStep: 5,
      shiftKeyMultiplier: 2
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    const { audioGain } = this.a.$state;
    provideContext(sliderValueFormatContext, {
      default: "percent",
      value(value) {
        return (value * (audioGain() ?? 1)).toFixed(2);
      },
      percent(value) {
        return Math.round(value * (audioGain() ?? 1));
      }
    });
    new SliderController({
      qa: this.$props.step,
      eb: this.$props.keyStep,
      Da: Math.round,
      v: this.v.bind(this),
      hf: this.hf.bind(this),
      O: this.O.bind(this),
      P: this.P.bind(this),
      S: this.S.bind(this),
      l: this.l.bind(this)
    }).attach(this);
    effect(this.Fc.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-volume-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Volume");
    const { canSetVolume } = this.a.$state;
    this.setAttributes({
      "data-supported": canSetVolume,
      "aria-hidden": $ariaBool(() => !canSetVolume())
    });
  }
  O() {
    const { value } = this.$state, { audioGain } = this.a.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }
  P() {
    const { value, max } = this.$state, { audioGain } = this.a.$state;
    return round(value() / max() * (audioGain() ?? 1) * 100, 2) + "%";
  }
  hf() {
    const { audioGain } = this.a.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }
  v() {
    const { disabled } = this.$props, { canSetVolume } = this.a.$state;
    return disabled() || !canSetVolume();
  }
  Fc() {
    const { muted, volume } = this.a.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  Na(event) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this.a.remote.changeVolume(mediaVolume, event);
  }
  l(event) {
    this.wh(event);
  }
  S(event) {
    this.wh(event);
  }
}

class TimeSlider extends Component {
  constructor() {
    super();
    this.Ah = signal(null);
    this.mf = false;
    const { noSwipeGesture } = this.$props;
    new SliderController({
      kh: () => !noSwipeGesture(),
      Y: this.Y.bind(this),
      qa: this.qa.bind(this),
      eb: this.eb.bind(this),
      Da: this.Da,
      v: this.v.bind(this),
      O: this.O.bind(this),
      P: this.P.bind(this),
      ef: this.ef.bind(this),
      S: this.S.bind(this),
      Dd: this.Dd.bind(this),
      l: this.l.bind(this)
    });
  }
  static {
    this.props = {
      ...SliderController.props,
      step: 0.1,
      keyStep: 5,
      shiftKeyMultiplier: 2,
      pauseWhileDragging: false,
      noSwipeGesture: false,
      seekingRequestThrottle: 100
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "time",
      value: this.xl.bind(this),
      time: this.yl.bind(this)
    });
    this.setAttributes({
      "data-chapters": this.zl.bind(this)
    });
    this.setStyles({
      "--slider-progress": this.Al.bind(this)
    });
    effect(this.Qb.bind(this));
    effect(this.Bl.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-time-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Seek");
  }
  onConnect(el) {
    effect(this.Cl.bind(this));
    watchActiveTextTrack(this.a.textTracks, "chapters", this.Ah.set);
  }
  Al() {
    const { bufferedEnd, duration } = this.a.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
  }
  zl() {
    const { duration } = this.a.$state;
    return this.Ah()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }
  Bl() {
    this.lf = functionThrottle(
      this.Ja.bind(this),
      this.$props.seekingRequestThrottle()
    );
  }
  Qb() {
    if (this.$state.hidden()) return;
    const { value, dragging } = this.$state, newValue = this.Y();
    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch("value-change", { detail: newValue });
    }
  }
  Cl() {
    const player = this.a.player.el, { nh: _preview } = useContext(sliderContext);
    player && _preview() && setAttribute(player, "data-preview", this.$state.active());
  }
  Ja(time, event) {
    this.a.remote.seeking(time, event);
  }
  Dl(time, percent, event) {
    this.lf.cancel();
    const { live } = this.a.$state;
    if (live() && percent >= 99) {
      this.a.remote.seekToLiveEdge(event);
      return;
    }
    this.a.remote.seek(time, event);
  }
  ef(event) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this.a.$state;
      this.mf = !paused();
      this.a.remote.pause(event);
    }
  }
  S(event) {
    this.lf(this.Wb(event.detail), event);
  }
  Dd(event) {
    const { seeking } = this.a.$state;
    if (!peek(seeking)) this.Ja(this.Wb(event.detail), event);
    const percent = event.detail;
    this.Dl(this.Wb(percent), percent, event);
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this.mf) {
      this.a.remote.play(event);
      this.mf = false;
    }
  }
  l(event) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this.Dd(event);
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  Y() {
    const { currentTime } = this.a.$state;
    return this.El(currentTime());
  }
  qa() {
    const value = this.$props.step() / this.a.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  eb() {
    const value = this.$props.keyStep() / this.a.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  Da(value) {
    return round(value, 3);
  }
  v() {
    const { disabled } = this.$props, { canSeek } = this.a.$state;
    return disabled() || !canSeek();
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  O() {
    const { value } = this.$state;
    return Math.round(value());
  }
  P() {
    const time = this.Wb(this.$state.value()), { duration } = this.a.$state;
    return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
  }
  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------
  Wb(percent) {
    const { duration } = this.a.$state;
    return round(percent / 100 * duration(), 5);
  }
  El(time) {
    const { liveEdge, duration } = this.a.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }
  xl(percent) {
    const time = this.Wb(percent), { live, duration } = this.a.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
  }
  yl(percent, options) {
    const time = this.Wb(percent), { live, duration } = this.a.$state, value = live() ? time - duration() : time;
    return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), options)}` : "LIVE";
  }
}

const menuContext = createContext();

function scrollIntoView(el, options) {
  const scrolls = r(el, options);
  for (const { el: el2, top, left } of scrolls) {
    el2.scroll({ top, left, behavior: options.behavior });
  }
}
function scrollIntoCenter(el, options = {}) {
  scrollIntoView(el, {
    scrollMode: "if-needed",
    block: "center",
    inline: "center",
    ...options
  });
}

const FOCUSABLE_ELEMENTS_SELECTOR = /* @__PURE__ */ [
  "a[href]",
  "[tabindex]",
  "input",
  "select",
  "button"
].map((selector) => `${selector}:not([aria-hidden='true'])`).join(",");
const VALID_KEYS = /* @__PURE__ */ new Set([
  "Escape",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "PageUp",
  "End",
  "PageDown",
  "Enter",
  " "
]);
class MenuFocusController {
  constructor(_delegate) {
    this.j = _delegate;
    this.Tc = -1;
    this.Sa = null;
    this.ra = [];
  }
  get A() {
    return this.ra;
  }
  Ul(el) {
    listenEvent(el, "focus", this.Ec.bind(this));
    this.Sa = el;
    onDispose(() => {
      this.Sa = null;
    });
  }
  yd() {
    if (!this.Sa) return;
    this.Ha();
    listenEvent(this.Sa, "keyup", this.hc.bind(this));
    listenEvent(this.Sa, "keydown", this.ic.bind(this));
    onDispose(() => {
      this.Tc = -1;
      this.ra = [];
    });
  }
  Ha() {
    this.Tc = 0;
    this.ra = this.Vl();
  }
  Eh(index = this.Fh()) {
    const element = this.ra[index];
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollIntoCenter(element, {
            behavior: "smooth",
            boundary: (el) => {
              return !el.hasAttribute("data-root");
            }
          });
        });
      });
    }
  }
  Gh(scroll = true) {
    const index = this.Fh();
    this.Yb(index >= 0 ? index : 0, scroll);
  }
  Yb(index, scroll = true) {
    this.Tc = index;
    if (this.ra[index]) {
      this.ra[index].focus({ preventScroll: true });
      if (scroll) this.Eh(index);
    } else {
      this.Sa?.focus({ preventScroll: true });
    }
  }
  Fh() {
    return this.ra.findIndex(
      (el) => document.activeElement === el || el.getAttribute("role") === "menuitemradio" && el.getAttribute("aria-checked") === "true"
    );
  }
  Ec() {
    if (this.Tc >= 0) return;
    this.Ha();
    this.Gh();
  }
  Hh(event) {
    const el = event.target;
    if (wasEnterKeyPressed(event) && el instanceof Element) {
      const role = el.getAttribute("role");
      return !/a|input|select|button/.test(el.localName) && !role;
    }
    return VALID_KEYS.has(event.key);
  }
  hc(event) {
    if (!this.Hh(event)) return;
    event.stopPropagation();
    event.preventDefault();
  }
  ic(event) {
    if (!this.Hh(event)) return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case "Escape":
        this.j.Wl(event);
        break;
      case "Tab":
        this.Yb(this.rf(event.shiftKey ? -1 : 1));
        break;
      case "ArrowUp":
        this.Yb(this.rf(-1));
        break;
      case "ArrowDown":
        this.Yb(this.rf(1));
        break;
      case "Home":
      case "PageUp":
        this.Yb(0);
        break;
      case "End":
      case "PageDown":
        this.Yb(this.ra.length - 1);
        break;
    }
  }
  rf(delta) {
    let index = this.Tc;
    do {
      index = (index + delta + this.ra.length) % this.ra.length;
    } while (this.ra[index]?.offsetParent === null);
    return index;
  }
  Vl() {
    if (!this.Sa) return [];
    const focusableElements = this.Sa.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
    const is = (node) => {
      return node.getAttribute("role") === "menu";
    };
    for (const el of focusableElements) {
      if (isHTMLElement(el) && el.offsetParent !== null && // does not have display: none
      isElementParent(this.Sa, el, is)) {
        elements.push(el);
      }
    }
    return elements;
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
let idCount = 0;
class Menu extends Component {
  constructor() {
    super();
    this.T = signal(false);
    this.Ed = signal(false);
    this.M = signal(null);
    this.q = signal(null);
    this.Vc = /* @__PURE__ */ new Set();
    this.Jd = null;
    this.Ld = false;
    this.Ih = signal(false);
    this.Md = /* @__PURE__ */ new Set();
    this.zf = false;
    this.im = this.jm.bind(this);
    this.Cf = false;
    this.gm = this.km.bind(this);
    this.hm = this.lm.bind(this);
    this.pa = animationFrameThrottle(() => {
      const content = peek(this.q);
      if (!content || false) return;
      let height = 0, styles = getComputedStyle(content), children = [...content.children];
      for (const prop2 of ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]) {
        height += parseFloat(styles[prop2]) || 0;
      }
      for (const child of children) {
        if (isHTMLElement(child) && child.style.display === "contents") {
          children.push(...child.children);
        } else if (child.nodeType === 3) {
          height += parseFloat(getComputedStyle(child).fontSize);
        } else if (isHTMLElement(child)) {
          if (!isElementVisible(child)) continue;
          const style = getComputedStyle(child);
          height += child.offsetHeight + (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
        }
      }
      setStyle(content, "--menu-height", height + "px");
    });
    this.Bf = false;
    const { showDelay } = this.$props;
    this.Kd = new Popper({
      M: this.M,
      q: this.q,
      ih: showDelay,
      yd: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this.T()) hide(event);
          else show(event);
        });
        const closeTarget = this.Xl();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      E: this.Yl.bind(this)
    });
  }
  static {
    this.props = {
      showDelay: 0
    };
  }
  get triggerElement() {
    return this.M();
  }
  get contentElement() {
    return this.q();
  }
  get isSubmenu() {
    return !!this.Uc;
  }
  onSetup() {
    this.a = useMediaContext();
    const currentIdCount = ++idCount;
    this.sf = `media-menu-${currentIdCount}`;
    this.tf = `media-menu-button-${currentIdCount}`;
    this.Zb = new MenuFocusController({
      Wl: this.close.bind(this)
    });
    if (hasProvidedContext(menuContext)) {
      this.Uc = useContext(menuContext);
    }
    this.Zl();
    this.setAttributes({
      "data-open": this.T,
      "data-root": !this.isSubmenu,
      "data-submenu": this.isSubmenu,
      "data-disabled": this.v.bind(this)
    });
    provideContext(menuContext, {
      _l: this.M,
      q: this.q,
      T: this.T,
      _b: signal(""),
      Um: !!this.Uc,
      gb: this.gb.bind(this),
      uf: this.uf.bind(this),
      vf: this.vf.bind(this),
      wf: this.wf.bind(this),
      xf: this.xf.bind(this),
      yf: this.yf.bind(this),
      $l: (callback) => {
        this.Md.add(callback);
        onDispose(() => {
          this.Md.delete(callback);
        });
      }
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onConnect(el) {
    effect(this.am.bind(this));
    if (this.isSubmenu) {
      this.Uc?.yf(this);
    }
  }
  onDestroy() {
    this.M.set(null);
    this.q.set(null);
    this.Jd = null;
    this.Md.clear();
  }
  Zl() {
    let sliderActiveTimer = -1, parentSliderObserver = hasProvidedContext(sliderObserverContext) ? useContext(sliderObserverContext) : null;
    provideContext(sliderObserverContext, {
      onDragStart: () => {
        parentSliderObserver?.onDragStart?.();
        window.clearTimeout(sliderActiveTimer);
        sliderActiveTimer = -1;
        this.Ld = true;
      },
      onDragEnd: () => {
        parentSliderObserver?.onDragEnd?.();
        sliderActiveTimer = window.setTimeout(() => {
          this.Ld = false;
          sliderActiveTimer = -1;
        }, 300);
      }
    });
  }
  am() {
    const expanded = this.bm();
    if (!this.isSubmenu) this.pa();
    this.Jh(expanded);
    if (!expanded) return;
    effect(() => {
      const { height } = this.a.$state, content = this.q();
      content && setStyle(content, "--player-height", height() + "px");
    });
    this.Zb.yd();
    this.listen("pointerup", this.cm.bind(this));
    listenEvent(window, "pointerup", this.dm.bind(this));
  }
  uf(button) {
    const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this.v.bind(this));
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
    setAttribute(el, "id", this.tf);
    setAttribute(el, "aria-haspopup", "menu");
    setAttribute(el, "aria-expanded", "false");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    const watchAttrs = () => {
      setAttribute(el, "data-open", this.T());
      setAttribute(el, "aria-disabled", isARIADisabled());
    };
    effect(watchAttrs);
    this.M.set(el);
    onDispose(() => {
      this.M.set(null);
    });
  }
  vf(items) {
    const el = items.el;
    el.style.setProperty("display", "none");
    setAttribute(el, "id", this.sf);
    setAttributeIfEmpty(el, "role", "menu");
    setAttributeIfEmpty(el, "tabindex", "-1");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    this.q.set(el);
    onDispose(() => this.q.set(null));
    const watchAttrs = () => setAttribute(el, "data-open", this.T());
    effect(watchAttrs);
    this.Zb.Ul(el);
    this.Jh(false);
    const onTransition = this.em.bind(this);
    if (!this.isSubmenu) {
      items.listen("transitionstart", onTransition);
      items.listen("transitionend", onTransition);
      items.listen("animationend", this.pa);
      items.listen("vds-menu-resize", this.pa);
    } else {
      this.Uc?.$l(onTransition);
    }
  }
  wf(observer) {
    this.Jd = observer;
  }
  Jh(expanded) {
    const content = peek(this.q);
    if (content) setAttribute(content, "aria-hidden", ariaBool(!expanded));
  }
  xf(disabled) {
    this.Ih.set(disabled);
  }
  Yl(isExpanded, event) {
    this.zf = isKeyboardEvent(event);
    event?.stopPropagation();
    if (this.T() === isExpanded) return;
    if (this.v()) {
      if (isExpanded) this.Kd.hide(event);
      return;
    }
    this.el?.dispatchEvent(
      new Event("vds-menu-resize", {
        bubbles: true,
        composed: true
      })
    );
    const trigger = this.M(), content = this.q();
    if (trigger) {
      setAttribute(trigger, "aria-controls", isExpanded && this.sf);
      setAttribute(trigger, "aria-expanded", ariaBool(isExpanded));
    }
    if (content) setAttribute(content, "aria-labelledby", isExpanded && this.tf);
    this.T.set(isExpanded);
    this.fm(event);
    tick();
    if (this.zf) {
      if (isExpanded) content?.focus();
      else trigger?.focus();
      for (const el of [this.el, content]) {
        el && el.setAttribute("data-keyboard", "");
      }
    } else {
      for (const el of [this.el, content]) {
        el && el.removeAttribute("data-keyboard");
      }
    }
    this.dispatch(isExpanded ? "open" : "close", { trigger: event });
    if (isExpanded) {
      if (!this.isSubmenu && this.a.activeMenu !== this) {
        this.a.activeMenu?.close(event);
        this.a.activeMenu = this;
      }
      this.Jd?.Af?.(event);
    } else {
      if (this.isSubmenu) {
        for (const el of this.Vc) el.close(event);
      } else {
        this.a.activeMenu = null;
      }
      this.Jd?.Vm?.(event);
    }
    if (isExpanded) {
      requestAnimationFrame(this.Kh.bind(this));
    }
  }
  Kh() {
    if (this.Bf || this.Cf) return;
    this.Zb.Ha();
    requestAnimationFrame(() => {
      if (this.zf) {
        this.Zb.Gh();
      } else {
        this.Zb.Eh();
      }
    });
  }
  bm() {
    return !this.v() && this.T();
  }
  v() {
    return this.Ed() || this.Ih();
  }
  gb(disabled) {
    this.Ed.set(disabled);
  }
  cm(event) {
    const content = this.q();
    if (this.Ld || content && isEventInside(content, event)) {
      return;
    }
    event.stopPropagation();
  }
  dm(event) {
    const content = this.q();
    if (this.Ld || content && isEventInside(content, event)) {
      return;
    }
    this.close(event);
  }
  Xl() {
    const target = this.el?.querySelector('[data-part="close-target"]');
    return this.el && target && isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
  }
  fm(trigger) {
    if (this.isSubmenu) return;
    if (this.T()) this.a.remote.pauseControls(trigger);
    else this.a.remote.resumeControls(trigger);
  }
  yf(menu) {
    this.Vc.add(menu);
    listenEvent(menu, "open", this.gm);
    listenEvent(menu, "close", this.hm);
    onDispose(this.im);
  }
  jm(menu) {
    this.Vc.delete(menu);
  }
  km(event) {
    this.Cf = true;
    const content = this.q();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "true");
    }
    for (const target of this.Vc) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute("aria-hidden", "true");
        }
      }
    }
    if (content) {
      const el = event.target.el;
      for (const child of content.children) {
        if (child.contains(el)) {
          child.setAttribute("data-open", "");
        } else if (child !== el) {
          child.setAttribute("data-hidden", "");
        }
      }
    }
  }
  lm(event) {
    this.Cf = false;
    const content = this.q();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "false");
    }
    for (const target of this.Vc) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute("aria-hidden", "false");
      }
    }
    if (content) {
      for (const child of content.children) {
        child.removeAttribute("data-open");
        child.removeAttribute("data-hidden");
      }
    }
  }
  em(event) {
    const content = this.q();
    if (content && event.propertyName === "height") {
      this.Bf = event.type === "transitionstart";
      setAttribute(content, "data-transition", this.Bf ? "height" : null);
      if (this.T()) this.Kh();
    }
    for (const callback of this.Md) callback(event);
  }
  open(trigger) {
    if (peek(this.T)) return;
    this.Kd.show(trigger);
    tick();
  }
  close(trigger) {
    if (!peek(this.T)) return;
    this.Kd.hide(trigger);
    tick();
  }
}
__decorateClass$5([
  prop
], Menu.prototype, "triggerElement");
__decorateClass$5([
  prop
], Menu.prototype, "contentElement");
__decorateClass$5([
  prop
], Menu.prototype, "isSubmenu");
__decorateClass$5([
  method
], Menu.prototype, "open");
__decorateClass$5([
  method
], Menu.prototype, "close");

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
class MenuButton extends Component {
  constructor() {
    super();
    this.Lh = signal(null);
    new FocusVisibleController();
  }
  static {
    this.props = {
      disabled: false
    };
  }
  get expanded() {
    return this.n?.T() ?? false;
  }
  onSetup() {
    this.n = useContext(menuContext);
  }
  onAttach(el) {
    this.n.uf(this);
    effect(this.Nc.bind(this));
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    effect(this.mm.bind(this));
    this.Gc();
    const mutations = new MutationObserver(this.Gc.bind(this));
    mutations.observe(el, { attributeFilter: ["data-part"], childList: true, subtree: true });
    onDispose(() => mutations.disconnect());
    onPress(el, (trigger) => {
      this.dispatch("select", { trigger });
    });
  }
  Nc() {
    this.n.xf(this.$props.disabled());
  }
  mm() {
    const el = this.Lh();
    if (!el) return;
    effect(() => {
      const text = this.n._b();
      if (text) el.textContent = text;
    });
  }
  Gc() {
    const hintEl = this.el?.querySelector('[data-part="hint"]');
    this.Lh.set(hintEl ?? null);
  }
}
__decorateClass$4([
  prop
], MenuButton.prototype, "expanded");

class MenuItem extends MenuButton {
}

class MenuPortal extends Component {
  constructor() {
    super(...arguments);
    this.G = null;
  }
  static {
    this.props = {
      container: null,
      disabled: false
    };
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(menuPortalContext, {
      xb: this.nm.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  // Need this so connect scope is defined.
  onConnect(el) {
  }
  onDestroy() {
    this.G?.remove();
    this.G = null;
  }
  nm(el) {
    this.Mh(false);
    this.G = el;
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this.Nc.bind(this));
      });
    });
  }
  Nc() {
    const { fullscreen } = this.a.$state, { disabled } = this.$props, _disabled = disabled();
    this.Mh(_disabled === "fullscreen" ? !fullscreen() : !_disabled);
  }
  Mh(shouldPortal) {
    if (!this.G) return;
    let container = this.om(this.$props.container());
    if (!container) return;
    const isPortalled = this.G.parentElement === container;
    setAttribute(this.G, "data-portal", shouldPortal);
    if (shouldPortal) {
      if (!isPortalled) {
        this.G.remove();
        container.append(this.G);
      }
    } else if (isPortalled && this.G.parentElement === container) {
      this.G.remove();
      this.el?.append(this.G);
    }
  }
  om(selector) {
    if (isHTMLElement(selector)) return selector;
    return selector ? document.querySelector(selector) : document.body;
  }
}
const menuPortalContext = createContext();

class MenuItems extends Component {
  static {
    this.props = {
      placement: null,
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
    this.n = useContext(menuContext);
    this.n.vf(this);
    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        provideContext(menuPortalContext, null);
        portal.xb(el);
        onDispose(() => portal.xb(null));
      }
    }
  }
  onConnect(el) {
    effect(this.bf.bind(this));
  }
  bf() {
    if (!this.el) return;
    const placement = this.$props.placement();
    if (placement) {
      Object.assign(this.el.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "max-content"
      });
      const { offset: mainOffset, alignOffset } = this.$props;
      return autoPlacement(this.el, this.Bd(), placement, {
        offsetVarName: "media-menu",
        xOffset: alignOffset(),
        yOffset: mainOffset()
      });
    } else {
      this.el.removeAttribute("style");
      this.el.style.display = "none";
    }
  }
  Bd() {
    return this.n._l();
  }
}

const radioControllerContext = createContext();

class RadioGroupController extends ViewController {
  constructor() {
    super(...arguments);
    this.$b = /* @__PURE__ */ new Set();
    this.Ta = signal("");
    this.e = null;
    this.sm = this.E.bind(this);
  }
  get pm() {
    return Array.from(this.$b).map((radio) => radio.Ta());
  }
  get value() {
    return this.Ta();
  }
  set value(value) {
    this.E(value);
  }
  onSetup() {
    provideContext(radioControllerContext, {
      add: this.qm.bind(this),
      remove: this.rm.bind(this)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, "role", "radiogroup");
    this.setAttributes({ value: this.Ta });
  }
  onDestroy() {
    this.$b.clear();
  }
  qm(radio) {
    if (this.$b.has(radio)) return;
    this.$b.add(radio);
    radio.Nd = this.sm;
    radio.Wc(radio.Ta() === this.Ta());
  }
  rm(radio) {
    radio.Nd = null;
    this.$b.delete(radio);
  }
  E(newValue, trigger) {
    const currentValue = peek(this.Ta);
    if (!newValue || newValue === currentValue) return;
    const currentRadio = this.Nh(currentValue), newRadio = this.Nh(newValue);
    currentRadio?.Wc(false, trigger);
    newRadio?.Wc(true, trigger);
    this.Ta.set(newValue);
    this.l?.(newValue, trigger);
  }
  Nh(newValue) {
    for (const radio of this.$b) {
      if (newValue === peek(radio.Ta)) return radio;
    }
    return null;
  }
}

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
class AudioRadioGroup extends Component {
  static {
    this.props = {
      emptyLabel: "Default"
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    const { audioTracks } = this.a.$state;
    return audioTracks().length <= 1;
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
    effect(this.sa.bind(this));
    effect(this.Ua.bind(this));
  }
  getOptions() {
    const { audioTracks } = this.a.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase()
    }));
  }
  N() {
    this.e.value = this.Y();
  }
  Ua() {
    const { emptyLabel } = this.$props, { audioTrack } = this.a.$state, track = audioTrack();
    this.n?._b.set(track?.label ?? emptyLabel());
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  Y() {
    const { audioTrack } = this.a.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : "";
  }
  l(value, trigger) {
    if (this.disabled) return;
    const index = this.a.audioTracks.toArray().findIndex((track) => track.label.toLowerCase() === value);
    if (index >= 0) {
      const track = this.a.audioTracks[index];
      this.a.remote.changeAudioTrack(index, trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
}
__decorateClass$3([
  prop
], AudioRadioGroup.prototype, "value");
__decorateClass$3([
  prop
], AudioRadioGroup.prototype, "disabled");
__decorateClass$3([
  method
], AudioRadioGroup.prototype, "getOptions");

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
class CaptionsRadioGroup extends Component {
  static {
    this.props = {
      offLabel: "Off"
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    const { hasCaptions } = this.a.$state;
    return !hasCaptions();
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
    super.onConnect?.(el);
    effect(this.N.bind(this));
    effect(this.sa.bind(this));
    effect(this.Ua.bind(this));
  }
  getOptions() {
    const { offLabel } = this.$props, { textTracks } = this.a.$state;
    return [
      { value: "off", label: offLabel },
      ...textTracks().filter(isTrackCaptionKind).map((track) => ({
        track,
        label: track.label,
        value: this.Df(track)
      }))
    ];
  }
  N() {
    this.e.value = this.Y();
  }
  Ua() {
    const { offLabel } = this.$props, { textTrack } = this.a.$state, track = textTrack();
    this.n?._b.set(
      track && isTrackCaptionKind(track) && track.mode === "showing" ? track.label : offLabel()
    );
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  Y() {
    const { textTrack } = this.a.$state, track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === "showing" ? this.Df(track) : "off";
  }
  l(value, trigger) {
    if (this.disabled) return;
    if (value === "off") {
      const track = this.a.textTracks.selected;
      if (track) {
        const index2 = this.a.textTracks.indexOf(track);
        this.a.remote.changeTextTrackMode(index2, "disabled", trigger);
        this.dispatch("change", { detail: null, trigger });
      }
      return;
    }
    const index = this.a.textTracks.toArray().findIndex((track) => this.Df(track) === value);
    if (index >= 0) {
      const track = this.a.textTracks[index];
      this.a.remote.changeTextTrackMode(index, "showing", trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
  Df(track) {
    return track.id + ":" + track.kind + "-" + track.label.toLowerCase();
  }
}
__decorateClass$2([
  prop
], CaptionsRadioGroup.prototype, "value");
__decorateClass$2([
  prop
], CaptionsRadioGroup.prototype, "disabled");
__decorateClass$2([
  method
], CaptionsRadioGroup.prototype, "getOptions");

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
const DEFAULT_PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
class SpeedRadioGroup extends Component {
  static {
    this.props = {
      normalLabel: "Normal",
      rates: DEFAULT_PLAYBACK_RATES
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    const { rates } = this.$props, { canSetPlaybackRate } = this.a.$state;
    return !canSetPlaybackRate() || rates().length === 0;
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
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + "\xD7",
      value: rate.toString()
    }));
  }
  N() {
    this.e.value = this.Y();
  }
  Ua() {
    const { normalLabel } = this.$props, { playbackRate } = this.a.$state, rate = playbackRate();
    this.n?._b.set(rate === 1 ? normalLabel() : rate + "\xD7");
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  Y() {
    const { playbackRate } = this.a.$state;
    return playbackRate().toString();
  }
  l(value, trigger) {
    if (this.disabled) return;
    const rate = +value;
    this.a.remote.changePlaybackRate(rate, trigger);
    this.dispatch("change", { detail: rate, trigger });
  }
}
__decorateClass$1([
  prop
], SpeedRadioGroup.prototype, "value");
__decorateClass$1([
  prop
], SpeedRadioGroup.prototype, "disabled");
__decorateClass$1([
  method
], SpeedRadioGroup.prototype, "getOptions");

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
class QualityRadioGroup extends Component {
  constructor() {
    super();
    this.Rc = computed(() => {
      const { sort } = this.$props, { qualities } = this.a.$state;
      return sortVideoQualities(qualities(), sort() === "descending");
    });
    this.e = new RadioGroupController();
    this.e.l = this.l.bind(this);
  }
  static {
    this.props = {
      autoLabel: "Auto",
      hideBitrate: false,
      sort: "descending"
    };
  }
  get value() {
    return this.e.value;
  }
  get disabled() {
    const { canSetQuality, qualities } = this.a.$state;
    return !canSetQuality() || qualities().length <= 1;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.n = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.N.bind(this));
    effect(this.sa.bind(this));
    effect(this.Ua.bind(this));
  }
  getOptions() {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: "auto", label: autoLabel },
      ...this.Rc().map((quality) => {
        const bitrate = quality.bitrate && quality.bitrate >= 0 ? `${round(quality.bitrate / 1e6, 2)} Mbps` : null;
        return {
          quality,
          label: quality.height + "p",
          value: this.Ef(quality),
          bitrate: () => !hideBitrate() ? bitrate : null
        };
      })
    ];
  }
  N() {
    this.e.value = this.Y();
  }
  Ua() {
    const { autoLabel } = this.$props, { autoQuality, quality } = this.a.$state, qualityText = quality() ? quality().height + "p" : "";
    this.n?._b.set(
      !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : "")
    );
  }
  sa() {
    this.n?.gb(this.disabled);
  }
  l(value, trigger) {
    if (this.disabled) return;
    if (value === "auto") {
      this.a.remote.changeQuality(-1, trigger);
      this.dispatch("change", { detail: "auto", trigger });
      return;
    }
    const { qualities } = this.a.$state, index = peek(qualities).findIndex((quality) => this.Ef(quality) === value);
    if (index >= 0) {
      const quality = peek(qualities)[index];
      this.a.remote.changeQuality(index, trigger);
      this.dispatch("change", { detail: quality, trigger });
    }
  }
  Y() {
    const { quality, autoQuality } = this.a.$state;
    if (autoQuality()) return "auto";
    const currentQuality = quality();
    return currentQuality ? this.Ef(currentQuality) : "auto";
  }
  Ef(quality) {
    return quality.height + "_" + quality.bitrate;
  }
}
__decorateClass([
  prop
], QualityRadioGroup.prototype, "value");
__decorateClass([
  prop
], QualityRadioGroup.prototype, "disabled");
__decorateClass([
  method
], QualityRadioGroup.prototype, "getOptions");

class Time extends Component {
  constructor() {
    super(...arguments);
    this.Xc = signal(null);
    this.Lc = signal(true);
    this.Mc = signal(true);
  }
  static {
    this.props = {
      type: "current",
      showHours: false,
      padHours: null,
      padMinutes: null,
      remainder: false,
      toggle: false,
      hidden: false
    };
  }
  static {
    this.state = new State({
      timeText: "",
      hidden: false
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.Yh();
    const { type } = this.$props;
    this.setAttributes({
      "data-type": type,
      "data-remainder": this.Zh.bind(this)
    });
    new IntersectionObserverController({
      callback: this.gf.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    if (!el.hasAttribute("role")) effect(this.Jm.bind(this));
    effect(this.Yh.bind(this));
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this.Lc.set));
    effect(this.Ea.bind(this));
    effect(this.Km.bind(this));
  }
  gf(entries) {
    this.Mc.set(entries[0].isIntersecting);
  }
  Ea() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this.Lc() || !this.Mc());
  }
  Km() {
    if (!this.$props.toggle()) {
      this.Xc.set(null);
      return;
    }
    if (this.el) {
      onPress(this.el, this.Lm.bind(this));
    }
  }
  Yh() {
    const { hidden, timeText } = this.$state, { duration } = this.a.$state;
    if (hidden()) return;
    const { type, padHours, padMinutes, showHours } = this.$props, seconds = this.Mm(type()), $duration = duration(), shouldInvert = this.Zh();
    if (!Number.isFinite(seconds + $duration)) {
      timeText.set("LIVE");
      return;
    }
    const time = shouldInvert ? Math.max(0, $duration - seconds) : seconds, formattedTime = formatTime(time, {
      padHrs: padHours(),
      padMins: padMinutes(),
      showHrs: showHours()
    });
    timeText.set((shouldInvert ? "-" : "") + formattedTime);
  }
  Jm() {
    if (!this.el) return;
    const { toggle } = this.$props;
    setAttribute(this.el, "role", toggle() ? "timer" : null);
    setAttribute(this.el, "tabindex", toggle() ? 0 : null);
  }
  Mm(type) {
    const { bufferedEnd, duration, currentTime } = this.a.$state;
    switch (type) {
      case "buffered":
        return bufferedEnd();
      case "duration":
        return duration();
      default:
        return currentTime();
    }
  }
  Zh() {
    return this.$props.remainder() && this.Xc() !== false;
  }
  Lm(event) {
    event.preventDefault();
    if (this.Xc() === null) {
      this.Xc.set(!this.$props.remainder());
      return;
    }
    this.Xc.set((v) => !v);
  }
}

export { ARIAKeyShortcuts, AirPlayButton, AudioRadioGroup, CaptionButton, CaptionsRadioGroup, DEFAULT_PLAYBACK_RATES, FullscreenButton, LiveButton, Menu, MenuButton, MenuItem, MenuItems, MenuPortal, MuteButton, PIPButton, PlayButton, Popper, QualityRadioGroup, RadioGroupController, SeekButton, Slider, SliderController, SliderPreview, SliderValue, SpeedRadioGroup, Thumbnail, ThumbnailsLoader, Time, TimeSlider, ToggleButtonController, VolumeSlider, formatSpokenTime, formatTime, menuContext, menuPortalContext, radioControllerContext, sliderContext, sliderState, sliderValueFormatContext, updateSliderPreviewPlacement };
