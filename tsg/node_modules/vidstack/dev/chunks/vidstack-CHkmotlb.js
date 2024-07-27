import { ViewController, onDispose, isArray, isString, isNull, effect, peek, listenEvent, ariaBool, isWriteSignal, Component, State, createContext, functionThrottle, hasProvidedContext, useContext, isNumber, signal, animationFrameThrottle, provideContext, isObject, useState, computed, method, setAttribute, r, wasEnterKeyPressed, isKeyboardEvent, tick, prop, setStyle } from './vidstack-fG_Sx3Q9.js';
import { useMediaContext } from './vidstack-DQ4Fz5gz.js';
import { $ariaBool, sortVideoQualities } from './vidstack-BOTZD4tC.js';
import { hasAnimation, setAttributeIfEmpty, onPress, setARIALabel, isTouchPinchEvent, observeVisibility, isHTMLElement, isElementParent, isEventInside, isElementVisible, requestScopedAnimationFrame, autoPlacement } from './vidstack-DdUZGy1h.js';
import { isTrackCaptionKind } from './vidstack-C_Q-YmHq.js';
import { FocusVisibleController } from './vidstack-DvBAQUpx.js';
import { assert } from './vidstack-DbBJlz7I.js';
import { getRequestCredentials } from './vidstack-n2fuk8wF.js';
import { clampNumber, round, getNumberOfDecimalPlaces } from './vidstack-Dihypf8P.js';
import { watchActiveTextTrack } from './vidstack-C_9SlM6s.js';

class ARIAKeyShortcuts extends ViewController {
  constructor(_shortcut) {
    super();
    this._shortcut = _shortcut;
  }
  onAttach(el) {
    const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[this._shortcut] = keys;
      {
        onDispose(() => {
          delete ariaKeys[this._shortcut];
        });
      }
      return;
    }
    const shortcuts = $props.keyShortcuts()[this._shortcut];
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
    this._delegate = _delegate;
    this._showTimerId = -1;
    this._hideRafId = -1;
    this._stopAnimationEndListener = null;
    effect(this._watchTrigger.bind(this));
  }
  onDestroy() {
    this._stopAnimationEndListener?.();
    this._stopAnimationEndListener = null;
  }
  _watchTrigger() {
    const trigger = this._delegate._trigger();
    if (!trigger) {
      this.hide();
      return;
    }
    const show = this.show.bind(this), hide = this.hide.bind(this);
    this._delegate._listen(trigger, show, hide);
  }
  show(trigger) {
    this._cancelShowing();
    window.cancelAnimationFrame(this._hideRafId);
    this._hideRafId = -1;
    this._stopAnimationEndListener?.();
    this._stopAnimationEndListener = null;
    this._showTimerId = window.setTimeout(() => {
      this._showTimerId = -1;
      const content = this._delegate._content();
      if (content) content.style.removeProperty("display");
      peek(() => this._delegate._onChange(true, trigger));
    }, this._delegate._showDelay?.() ?? 0);
  }
  hide(trigger) {
    this._cancelShowing();
    peek(() => this._delegate._onChange(false, trigger));
    this._hideRafId = requestAnimationFrame(() => {
      this._cancelShowing();
      this._hideRafId = -1;
      const content = this._delegate._content();
      if (content) {
        const onHide = () => {
          content.style.display = "none";
          this._stopAnimationEndListener = null;
        };
        const isAnimated = hasAnimation(content);
        if (isAnimated) {
          this._stopAnimationEndListener?.();
          const stop = listenEvent(content, "animationend", onHide, { once: true });
          this._stopAnimationEndListener = stop;
        } else {
          onHide();
        }
      }
    });
  }
  _cancelShowing() {
    window.clearTimeout(this._showTimerId);
    this._showTimerId = -1;
  }
}

class ToggleButtonController extends ViewController {
  constructor(_delegate) {
    super();
    this._delegate = _delegate;
    new FocusVisibleController();
    if (_delegate._keyShortcut) {
      new ARIAKeyShortcuts(_delegate._keyShortcut);
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
      "data-pressed": this._delegate._isPressed,
      "aria-pressed": this._isARIAPressed.bind(this),
      "aria-disabled": () => disabled() ? "true" : null
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    onPress(el, this._onMaybePress.bind(this));
    for (const type of ["click", "touchstart"]) {
      this.listen(type, this._onInteraction.bind(this), {
        passive: true
      });
    }
  }
  _isARIAPressed() {
    return ariaBool(this._delegate._isPressed());
  }
  _onPressed(event) {
    if (isWriteSignal(this._delegate._isPressed)) {
      this._delegate._isPressed.set((p) => !p);
    }
  }
  _onMaybePress(event) {
    const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (this._delegate._onPress ?? this._onPressed).call(this, event);
  }
  _onInteraction(event) {
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
      _isPressed: this._isPressed.bind(this),
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    const { canAirPlay, isAirPlayConnected } = this._media.$state;
    this.setAttributes({
      "data-active": isAirPlayConnected,
      "data-supported": canAirPlay,
      "data-state": this._getState.bind(this),
      "aria-hidden": $ariaBool(() => !canAirPlay())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "airplay");
    setARIALabel(el, this._getDefaultLabel.bind(this));
  }
  _onPress(event) {
    const remote = this._media.remote;
    remote.requestAirPlay(event);
  }
  _isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState() !== "disconnected";
  }
  _getState() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === "airplay" && remotePlaybackState();
  }
  _getDefaultLabel() {
    const { remotePlaybackState } = this._media.$state;
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
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: "togglePaused",
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    const { paused, ended } = this._media.$state;
    this.setAttributes({
      "data-paused": paused,
      "data-ended": ended
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "play");
    setARIALabel(el, "Play");
  }
  _onPress(event) {
    const remote = this._media.remote;
    this._isPressed() ? remote.pause(event) : remote.play(event);
  }
  _isPressed() {
    const { paused } = this._media.$state;
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
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: "toggleCaptions",
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    this.setAttributes({
      "data-active": this._isPressed.bind(this),
      "data-supported": () => !this._isHidden(),
      "aria-hidden": $ariaBool(this._isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "caption");
    setARIALabel(el, "Captions");
  }
  _onPress(event) {
    this._media.remote.toggleCaptions(event);
  }
  _isPressed() {
    const { textTrack } = this._media.$state, track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }
  _isHidden() {
    const { hasCaptions } = this._media.$state;
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
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: "toggleFullscreen",
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    const { fullscreen } = this._media.$state, isSupported = this._isSupported.bind(this);
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
  _onPress(event) {
    const remote = this._media.remote, target = this.$props.target();
    this._isPressed() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }
  _isPressed() {
    const { fullscreen } = this._media.$state;
    return fullscreen();
  }
  _isSupported() {
    const { canFullscreen } = this._media.$state;
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
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: "toggleMuted",
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    this.setAttributes({
      "data-muted": this._isPressed.bind(this),
      "data-state": this._getState.bind(this)
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-mute-button", "");
    el.setAttribute("data-media-tooltip", "mute");
    setARIALabel(el, "Mute");
  }
  _onPress(event) {
    const remote = this._media.remote;
    this._isPressed() ? remote.unmute(event) : remote.mute(event);
  }
  _isPressed() {
    const { muted, volume } = this._media.$state;
    return muted() || volume() === 0;
  }
  _getState() {
    const { muted, volume } = this._media.$state, $volume = volume();
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
      _isPressed: this._isPressed.bind(this),
      _keyShortcut: "togglePictureInPicture",
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    const { pictureInPicture } = this._media.$state, isSupported = this._isSupported.bind(this);
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
  _onPress(event) {
    const remote = this._media.remote;
    this._isPressed() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }
  _isPressed() {
    const { pictureInPicture } = this._media.$state;
    return pictureInPicture();
  }
  _isSupported() {
    const { canPictureInPicture } = this._media.$state;
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
    this._media = useMediaContext();
    const { seeking } = this._media.$state, { seconds } = this.$props, isSupported = this._isSupported.bind(this);
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
    setARIALabel(el, this._getDefaultLabel.bind(this));
  }
  onConnect(el) {
    onPress(el, this._onPress.bind(this));
  }
  _isSupported() {
    const { canSeek } = this._media.$state;
    return canSeek();
  }
  _getDefaultLabel() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
  }
  _onPress(event) {
    const { seconds, disabled } = this.$props;
    if (disabled()) return;
    const { currentTime } = this._media.$state, seekTo = currentTime() + seconds();
    this._media.remote.seek(seekTo, event);
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
    this._media = useMediaContext();
    const { disabled } = this.$props, { live, liveEdge } = this._media.$state, isHidden = () => !live();
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
    onPress(el, this._onPress.bind(this));
  }
  _onPress(event) {
    const { disabled } = this.$props, { liveEdge } = this._media.$state;
    if (disabled() || liveEdge()) return;
    this._media.remote.seekToLiveEdge(event);
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
    this._init = _init;
  }
  onConnect(el) {
    this._observer = new IntersectionObserver((entries) => {
      this._init.callback?.(entries, this._observer);
    }, this._init);
    this._observer.observe(el);
    onDispose(this._onDisconnect.bind(this));
  }
  /**
   * Disconnect any active intersection observers.
   */
  _onDisconnect() {
    this._observer?.disconnect();
    this._observer = void 0;
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
    this._delegate = _delegate;
    this._media = _media;
    this._provider = null;
    this._touch = null;
    this._touchStartValue = null;
    this._repeatedKeys = false;
    this._onDocumentPointerMove = functionThrottle(
      (event) => {
        this._updatePointerValue(this._getPointerValue(event), event);
      },
      20,
      { leading: true }
    );
  }
  onSetup() {
    if (hasProvidedContext(sliderObserverContext)) {
      this._observer = useContext(sliderObserverContext);
    }
  }
  onConnect() {
    effect(this._attachEventListeners.bind(this));
    effect(this._attachPointerListeners.bind(this));
    if (this._delegate._swipeGesture) effect(this._watchSwipeGesture.bind(this));
  }
  _watchSwipeGesture() {
    const { pointer } = this._media.$state;
    if (pointer() !== "coarse" || !this._delegate._swipeGesture()) {
      this._provider = null;
      return;
    }
    this._provider = this._media.player.el?.querySelector(
      "media-provider,[data-media-provider]"
    );
    if (!this._provider) return;
    listenEvent(this._provider, "touchstart", this._onTouchStart.bind(this), {
      passive: true
    });
    listenEvent(this._provider, "touchmove", this._onTouchMove.bind(this), {
      passive: false
    });
  }
  _onTouchStart(event) {
    this._touch = event.touches[0];
  }
  _onTouchMove(event) {
    if (isNull(this._touch) || isTouchPinchEvent(event)) return;
    const touch = event.touches[0], xDiff = touch.clientX - this._touch.clientX, yDiff = touch.clientY - this._touch.clientY, isDragging = this.$state.dragging();
    if (!isDragging && Math.abs(yDiff) > 5) {
      return;
    }
    if (isDragging) return;
    event.preventDefault();
    if (Math.abs(xDiff) > 20) {
      this._touch = touch;
      this._touchStartValue = this.$state.value();
      this._onStartDragging(this._touchStartValue, event);
    }
  }
  _attachEventListeners() {
    const { hidden } = this.$props;
    this.listen("focus", this._onFocus.bind(this));
    this.listen("keydown", this._onKeyDown.bind(this));
    this.listen("keyup", this._onKeyUp.bind(this));
    if (hidden() || this._delegate._isDisabled()) return;
    this.listen("pointerenter", this._onPointerEnter.bind(this));
    this.listen("pointermove", this._onPointerMove.bind(this));
    this.listen("pointerleave", this._onPointerLeave.bind(this));
    this.listen("pointerdown", this._onPointerDown.bind(this));
  }
  _attachPointerListeners() {
    if (this._delegate._isDisabled() || !this.$state.dragging()) return;
    listenEvent(document, "pointerup", this._onDocumentPointerUp.bind(this), { capture: true });
    listenEvent(document, "pointermove", this._onDocumentPointerMove.bind(this));
    listenEvent(document, "touchmove", this._onDocumentTouchMove.bind(this), {
      passive: false
    });
  }
  _onFocus() {
    this._updatePointerValue(this.$state.value());
  }
  _updateValue(newValue, trigger) {
    const { value, min, max, dragging } = this.$state;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);
    const event = this.createEvent("value-change", { detail: clampedValue, trigger });
    this.dispatch(event);
    this._delegate._onValueChange?.(event);
    if (dragging()) {
      const event2 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
      this.dispatch(event2);
      this._delegate._onDragValueChange?.(event2);
    }
  }
  _updatePointerValue(value, trigger) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch("pointer-value-change", { detail: value, trigger });
    if (dragging()) {
      this._updateValue(value, trigger);
    }
  }
  _getPointerValue(event) {
    let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min, max } = this.$state;
    if (this.$props.orientation() === "vertical") {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this._touch && isNumber(this._touchStartValue)) {
        const { width } = this._provider.getBoundingClientRect(), rate = (event.clientX - this._touch.clientX) / width, range = max() - min(), diff = range * Math.abs(rate);
        thumbPositionRate = (rate < 0 ? this._touchStartValue - diff : this._touchStartValue + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }
    return Math.max(
      min(),
      Math.min(
        max(),
        this._delegate._roundValue(
          getValueFromRate(min(), max(), thumbPositionRate, this._delegate._getStep())
        )
      )
    );
  }
  _onPointerEnter(event) {
    this.$state.pointing.set(true);
  }
  _onPointerMove(event) {
    const { dragging } = this.$state;
    if (dragging()) return;
    this._updatePointerValue(this._getPointerValue(event), event);
  }
  _onPointerLeave(event) {
    this.$state.pointing.set(false);
  }
  _onPointerDown(event) {
    if (event.button !== 0) return;
    const value = this._getPointerValue(event);
    this._onStartDragging(value, event);
    this._updatePointerValue(value, event);
  }
  _onStartDragging(value, trigger) {
    const { dragging } = this.$state;
    if (dragging()) return;
    dragging.set(true);
    this._media.remote.pauseControls(trigger);
    const event = this.createEvent("drag-start", { detail: value, trigger });
    this.dispatch(event);
    this._delegate._onDragStart?.(event);
    this._observer?.onDragStart?.();
  }
  _onStopDragging(value, trigger) {
    const { dragging } = this.$state;
    if (!dragging()) return;
    dragging.set(false);
    this._media.remote.resumeControls(trigger);
    const event = this.createEvent("drag-end", { detail: value, trigger });
    this.dispatch(event);
    this._delegate._onDragEnd?.(event);
    this._touch = null;
    this._touchStartValue = null;
    this._observer?.onDragEnd?.();
  }
  _onKeyDown(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey) return;
    const { key } = event, jumpValue = this._calcJumpValue(event);
    if (!isNull(jumpValue)) {
      this._updatePointerValue(jumpValue, event);
      this._updateValue(jumpValue, event);
      return;
    }
    const newValue = this._calcNewKeyValue(event);
    if (!this._repeatedKeys) {
      this._repeatedKeys = key === this._lastDownKey;
      if (!this.$state.dragging() && this._repeatedKeys) {
        this._onStartDragging(newValue, event);
      }
    }
    this._updatePointerValue(newValue, event);
    this._lastDownKey = key;
  }
  _onKeyUp(event) {
    const isValidKey = Object.keys(SliderKeyDirection).includes(event.key);
    if (!isValidKey || !isNull(this._calcJumpValue(event))) return;
    const newValue = this._repeatedKeys ? this.$state.pointerValue() : this._calcNewKeyValue(event);
    this._updateValue(newValue, event);
    this._onStopDragging(newValue, event);
    this._lastDownKey = "";
    this._repeatedKeys = false;
  }
  _calcJumpValue(event) {
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
  _calcNewKeyValue(event) {
    const { key, shiftKey } = event;
    event.preventDefault();
    event.stopPropagation();
    const { shiftKeyMultiplier } = this.$props;
    const { min, max, value, pointerValue } = this.$state, step = this._delegate._getStep(), keyStep = this._delegate._getKeyStep();
    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, currentValue = this._repeatedKeys ? pointerValue() : this._delegate._getValue?.() ?? value(), steps = (currentValue + diff) / step;
    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }
  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------
  _onDocumentPointerUp(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const value = this._getPointerValue(event);
    this._updatePointerValue(value, event);
    this._onStopDragging(value, event);
  }
  _onDocumentTouchMove(event) {
    event.preventDefault();
  }
}

const sliderValueFormatContext = createContext(() => ({}));

class SliderController extends ViewController {
  constructor(_delegate) {
    super();
    this._delegate = _delegate;
    this._isVisible = signal(true);
    this._isIntersecting = signal(true);
    this._updateSliderVars = animationFrameThrottle(
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
    this._media = useMediaContext();
    const focus = new FocusVisibleController();
    focus.attach(this);
    this.$state.focused = focus.focused.bind(focus);
    if (!hasProvidedContext(sliderValueFormatContext)) {
      provideContext(sliderValueFormatContext, {
        default: "value"
      });
    }
    provideContext(sliderContext, {
      _orientation: this.$props.orientation,
      _disabled: this._delegate._isDisabled,
      _preview: signal(null)
    });
    effect(this._watchValue.bind(this));
    effect(this._watchStep.bind(this));
    effect(this._watchDisabled.bind(this));
    this._setupAttrs();
    new SliderEventsController(this._delegate, this._media).attach(this);
    new IntersectionObserverController({
      callback: this._onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "role", "slider");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "autocomplete", "off");
    effect(this._watchCSSVars.bind(this));
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this._isVisible.set));
    effect(this._watchHidden.bind(this));
  }
  _onIntersectionChange(entries) {
    this._isIntersecting.set(entries[0].isIntersecting);
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  _watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this._isVisible() || !this._isIntersecting.bind(this));
  }
  _watchValue() {
    const { dragging, value, min, max } = this.$state;
    if (peek(dragging)) return;
    value.set(getClampedValue(min(), max(), value(), this._delegate._getStep()));
  }
  _watchStep() {
    this.$state.step.set(this._delegate._getStep());
  }
  _watchDisabled() {
    if (!this._delegate._isDisabled()) return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  _getARIADisabled() {
    return ariaBool(this._delegate._isDisabled());
  }
  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------
  _setupAttrs() {
    const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
    this.setAttributes({
      "data-dragging": dragging,
      "data-pointing": pointing,
      "data-active": active,
      "aria-disabled": this._getARIADisabled.bind(this),
      "aria-valuemin": this._delegate._getARIAValueMin ?? this.$state.min,
      "aria-valuemax": this._delegate._getARIAValueMax ?? this.$state.max,
      "aria-valuenow": this._delegate._getARIAValueNow,
      "aria-valuetext": this._delegate._getARIAValueText,
      "aria-orientation": orientation
    });
  }
  _watchCSSVars() {
    const { fillPercent, pointerPercent } = this.$state;
    this._updateSliderVars(round(fillPercent(), 3), round(pointerPercent(), 3));
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
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this.$props.disabled,
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this)
    });
  }
  onSetup() {
    effect(this._watchValue.bind(this));
    effect(this._watchMinMax.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  _getARIAValueText() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  _watchValue() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }
  _watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

const cache = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map(), warned = /* @__PURE__ */ new Set() ;
class ThumbnailsLoader {
  constructor($src, $crossOrigin, _media) {
    this.$src = $src;
    this.$crossOrigin = $crossOrigin;
    this._media = _media;
    this.$images = signal([]);
    effect(this._onLoadCues.bind(this));
  }
  static create($src, $crossOrigin) {
    const media = useMediaContext();
    return new ThumbnailsLoader($src, $crossOrigin, media);
  }
  _onLoadCues() {
    const { canLoad } = this._media.$state;
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
                  resolve(this._processVTTCues(json));
                } else {
                  for (let i = 0; i < json.length; i++) {
                    const image = json[i];
                    assert(isObject(image), `Item not an object at index ${i}`);
                    assert(
                      "url" in image && isString(image.url),
                      `Invalid or missing \`url\` property at index ${i}`
                    );
                    assert(
                      "startTime" in image && isNumber(image.startTime),
                      `Invalid or missing \`startTime\` property at index ${i}`
                    );
                  }
                  resolve(json);
                }
              } else {
                resolve(this._processStoryboard(json));
              }
              return;
            }
            import('media-captions').then(async ({ parseResponse }) => {
              try {
                const { cues } = await parseResponse(response);
                resolve(this._processVTTCues(cues));
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
          this._onError(src, error);
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
        this.$images.set(this._processImages(src));
      } catch (error) {
        this._onError(src, error);
      }
    } else {
      try {
        this.$images.set(this._processStoryboard(src));
      } catch (error) {
        this._onError(src, error);
      }
    }
    return () => {
      this.$images.set([]);
    };
  }
  _processImages(images) {
    const baseURL = this._resolveBaseUrl();
    return images.map((img, i) => {
      assert(
        img.url && isString(img.url),
        `Invalid or missing \`url\` property at index ${i}`
      );
      assert(
        "startTime" in img && isNumber(img.startTime),
        `Invalid or missing \`startTime\` property at index ${i}`
      );
      return {
        ...img,
        url: isString(img.url) ? this._resolveURL(img.url, baseURL) : img.url
      };
    });
  }
  _processStoryboard(board) {
    assert(isString(board.url), "Missing `url` in storyboard object");
    assert(isArray(board.tiles) && board.tiles?.length, `Empty tiles in storyboard`);
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
  _processVTTCues(cues) {
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      assert(
        "startTime" in cue && isNumber(cue.startTime),
        `Invalid or missing \`startTime\` property at index ${i}`
      );
      assert(
        "text" in cue && isString(cue.text),
        `Invalid or missing \`text\` property at index ${i}`
      );
    }
    const images = [], baseURL = this._resolveBaseUrl();
    for (const cue of cues) {
      const [url, hash] = cue.text.split("#"), data = this._resolveData(hash);
      images.push({
        url: this._resolveURL(url, baseURL),
        startTime: cue.startTime,
        endTime: cue.endTime,
        width: data?.w,
        height: data?.h,
        coords: data && isNumber(data.x) && isNumber(data.y) ? { x: data.x, y: data.y } : void 0
      });
    }
    return images;
  }
  _resolveBaseUrl() {
    let baseURL = peek(this.$src);
    if (!isString(baseURL) || !/^https?:/.test(baseURL)) {
      return location.href;
    }
    return baseURL;
  }
  _resolveURL(src, baseURL) {
    return /^https?:/.test(src) ? new URL(src) : new URL(src, baseURL);
  }
  _resolveData(hash) {
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
  _onError(src, error) {
    if (warned?.has(src)) return;
    this._media.logger?.errorGroup("[vidstack] failed to load thumbnails").labelledLog("Src", src).labelledLog("Error", error).dispatch();
    warned?.add(src);
  }
}

class Thumbnail extends Component {
  constructor() {
    super(...arguments);
    this._styleResets = [];
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
    this._media = useMediaContext();
    this._loader = ThumbnailsLoader.create(this.$props.src, this.$state.crossOrigin);
    this._watchCrossOrigin();
    this.setAttributes({
      "data-loading": this._isLoading.bind(this),
      "data-error": this._hasError.bind(this),
      "data-hidden": this.$state.hidden,
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onConnect(el) {
    effect(this._watchImg.bind(this));
    effect(this._watchHidden.bind(this));
    effect(this._watchCrossOrigin.bind(this));
    effect(this._onLoadStart.bind(this));
    effect(this._onFindActiveThumbnail.bind(this));
    effect(this._resize.bind(this));
  }
  _watchImg() {
    const img = this.$state.img();
    if (!img) return;
    listenEvent(img, "load", this._onLoaded.bind(this));
    listenEvent(img, "error", this._onError.bind(this));
  }
  _watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this._media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  _onLoadStart() {
    const { src, loading, error } = this.$state;
    if (src()) {
      loading.set(true);
      error.set(null);
    }
    return () => {
      this._resetStyles();
      loading.set(false);
      error.set(null);
    };
  }
  _onLoaded() {
    const { loading, error } = this.$state;
    this._resize();
    loading.set(false);
    error.set(null);
  }
  _onError(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
  _isLoading() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  _hasError() {
    const { error } = this.$state;
    return !isNull(error());
  }
  _watchHidden() {
    const { hidden } = this.$state, { duration } = this._media.$state, images = this._loader.$images();
    hidden.set(this._hasError() || !Number.isFinite(duration()) || images.length === 0);
  }
  _getTime() {
    return this.$props.time();
  }
  _onFindActiveThumbnail() {
    let images = this._loader.$images();
    if (!images.length) return;
    let time = this._getTime(), { src, activeThumbnail } = this.$state, activeIndex = -1, activeImage = null;
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
  _resize() {
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
    this._style(rootEl, "--thumbnail-width", `${width * scale}px`);
    this._style(rootEl, "--thumbnail-height", `${height * scale}px`);
    this._style(imgEl, "width", `${imgEl.naturalWidth * scale}px`);
    this._style(imgEl, "height", `${imgEl.naturalHeight * scale}px`);
    this._style(
      imgEl,
      "transform",
      thumbnail.coords ? `translate(-${thumbnail.coords.x * scale}px, -${thumbnail.coords.y * scale}px)` : ""
    );
    this._style(imgEl, "max-width", "none");
  }
  _style(el, name, value) {
    el.style.setProperty(name, value);
    this._styleResets.push(() => el.style.removeProperty(name));
  }
  _resetStyles() {
    for (const reset of this._styleResets) reset();
    this._styleResets = [];
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
    this._slider = useState(Slider.state);
    this._format = useContext(sliderValueFormatContext);
    this._text = computed(this.getValueText.bind(this));
  }
  getValueText() {
    const { type, format, decimalPlaces, padHours, padMinutes, showHours, showMs } = this.$props, { value: sliderValue, pointerValue, min, max } = this._slider, _format = format?.() ?? this._format.default;
    const value = type() === "current" ? sliderValue() : pointerValue();
    if (_format === "percent") {
      const range = max() - min();
      const percent = value / range * 100;
      return (this._format.percent ?? round)(percent, decimalPlaces()) + "%";
    } else if (_format === "time") {
      return (this._format.time ?? formatTime)(value, {
        padHrs: padHours(),
        padMins: padMinutes(),
        showHrs: showHours(),
        showMs: showMs()
      });
    } else {
      return (this._format.value?.(value) ?? value.toFixed(2)) + "";
    }
  }
}
__decorateClass$6([
  method
], SliderValue.prototype, "getValueText");

class SliderPreview extends Component {
  constructor() {
    super(...arguments);
    this._updatePlacement = animationFrameThrottle(() => {
      const { _disabled, _orientation } = this._slider;
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
    this._slider = useContext(sliderContext);
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
    const { _preview } = this._slider;
    _preview.set(el);
    onDispose(() => _preview.set(null));
    effect(this._updatePlacement.bind(this));
    const resize = new ResizeObserver(this._updatePlacement.bind(this));
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
    this._throttleVolumeChange = functionThrottle(this._onVolumeChange.bind(this), 25);
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
    this._media = useMediaContext();
    const { audioGain } = this._media.$state;
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
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueMax: this._getARIAValueMax.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this)
    }).attach(this);
    effect(this._watchVolume.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-volume-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Volume");
    const { canSetVolume } = this._media.$state;
    this.setAttributes({
      "data-supported": canSetVolume,
      "aria-hidden": $ariaBool(() => !canSetVolume())
    });
  }
  _getARIAValueNow() {
    const { value } = this.$state, { audioGain } = this._media.$state;
    return Math.round(value() * (audioGain() ?? 1));
  }
  _getARIAValueText() {
    const { value, max } = this.$state, { audioGain } = this._media.$state;
    return round(value() / max() * (audioGain() ?? 1) * 100, 2) + "%";
  }
  _getARIAValueMax() {
    const { audioGain } = this._media.$state;
    return this.$state.max() * (audioGain() ?? 1);
  }
  _isDisabled() {
    const { disabled } = this.$props, { canSetVolume } = this._media.$state;
    return disabled() || !canSetVolume();
  }
  _watchVolume() {
    const { muted, volume } = this._media.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  _onVolumeChange(event) {
    if (!event.trigger) return;
    const mediaVolume = round(event.detail / 100, 3);
    this._media.remote.changeVolume(mediaVolume, event);
  }
  _onValueChange(event) {
    this._throttleVolumeChange(event);
  }
  _onDragValueChange(event) {
    this._throttleVolumeChange(event);
  }
}

class TimeSlider extends Component {
  constructor() {
    super();
    this._chapter = signal(null);
    this._playingBeforeDragStart = false;
    const { noSwipeGesture } = this.$props;
    new SliderController({
      _swipeGesture: () => !noSwipeGesture(),
      _getValue: this._getValue.bind(this),
      _getStep: this._getStep.bind(this),
      _getKeyStep: this._getKeyStep.bind(this),
      _roundValue: this._roundValue,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragStart: this._onDragStart.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onDragEnd: this._onDragEnd.bind(this),
      _onValueChange: this._onValueChange.bind(this)
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
    this._media = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "time",
      value: this._formatValue.bind(this),
      time: this._formatTime.bind(this)
    });
    this.setAttributes({
      "data-chapters": this._hasChapters.bind(this)
    });
    this.setStyles({
      "--slider-progress": this._calcBufferedPercent.bind(this)
    });
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchSeekingThrottle.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-time-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Seek");
  }
  onConnect(el) {
    effect(this._watchPreviewing.bind(this));
    watchActiveTextTrack(this._media.textTracks, "chapters", this._chapter.set);
  }
  _calcBufferedPercent() {
    const { bufferedEnd, duration } = this._media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
  }
  _hasChapters() {
    const { duration } = this._media.$state;
    return this._chapter()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }
  _watchSeekingThrottle() {
    this._dispatchSeeking = functionThrottle(
      this._seeking.bind(this),
      this.$props.seekingRequestThrottle()
    );
  }
  _watchCurrentTime() {
    if (this.$state.hidden()) return;
    const { value, dragging } = this.$state, newValue = this._getValue();
    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch("value-change", { detail: newValue });
    }
  }
  _watchPreviewing() {
    const player = this._media.player.el, { _preview } = useContext(sliderContext);
    player && _preview() && setAttribute(player, "data-preview", this.$state.active());
  }
  _seeking(time, event) {
    this._media.remote.seeking(time, event);
  }
  _seek(time, percent, event) {
    this._dispatchSeeking.cancel();
    const { live } = this._media.$state;
    if (live() && percent >= 99) {
      this._media.remote.seekToLiveEdge(event);
      return;
    }
    this._media.remote.seek(time, event);
  }
  _onDragStart(event) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this._media.$state;
      this._playingBeforeDragStart = !paused();
      this._media.remote.pause(event);
    }
  }
  _onDragValueChange(event) {
    this._dispatchSeeking(this._percentToTime(event.detail), event);
  }
  _onDragEnd(event) {
    const { seeking } = this._media.$state;
    if (!peek(seeking)) this._seeking(this._percentToTime(event.detail), event);
    const percent = event.detail;
    this._seek(this._percentToTime(percent), percent, event);
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this._playingBeforeDragStart) {
      this._media.remote.play(event);
      this._playingBeforeDragStart = false;
    }
  }
  _onValueChange(event) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger) return;
    this._onDragEnd(event);
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  _getValue() {
    const { currentTime } = this._media.$state;
    return this._timeToPercent(currentTime());
  }
  _getStep() {
    const value = this.$props.step() / this._media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  _getKeyStep() {
    const value = this.$props.keyStep() / this._media.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  _roundValue(value) {
    return round(value, 3);
  }
  _isDisabled() {
    const { disabled } = this.$props, { canSeek } = this._media.$state;
    return disabled() || !canSeek();
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  _getARIAValueText() {
    const time = this._percentToTime(this.$state.value()), { duration } = this._media.$state;
    return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
  }
  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------
  _percentToTime(percent) {
    const { duration } = this._media.$state;
    return round(percent / 100 * duration(), 5);
  }
  _timeToPercent(time) {
    const { liveEdge, duration } = this._media.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }
  _formatValue(percent) {
    const time = this._percentToTime(percent), { live, duration } = this._media.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
  }
  _formatTime(percent, options) {
    const time = this._percentToTime(percent), { live, duration } = this._media.$state, value = live() ? time - duration() : time;
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
    this._delegate = _delegate;
    this._index = -1;
    this._el = null;
    this._elements = [];
  }
  get _items() {
    return this._elements;
  }
  _attachMenu(el) {
    listenEvent(el, "focus", this._onFocus.bind(this));
    this._el = el;
    onDispose(() => {
      this._el = null;
    });
  }
  _listen() {
    if (!this._el) return;
    this._update();
    listenEvent(this._el, "keyup", this._onKeyUp.bind(this));
    listenEvent(this._el, "keydown", this._onKeyDown.bind(this));
    onDispose(() => {
      this._index = -1;
      this._elements = [];
    });
  }
  _update() {
    this._index = 0;
    this._elements = this._getFocusableElements();
  }
  _scroll(index = this._findActiveIndex()) {
    const element = this._elements[index];
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
  _focusActive(scroll = true) {
    const index = this._findActiveIndex();
    this._focusAt(index >= 0 ? index : 0, scroll);
  }
  _focusAt(index, scroll = true) {
    this._index = index;
    if (this._elements[index]) {
      this._elements[index].focus({ preventScroll: true });
      if (scroll) this._scroll(index);
    } else {
      this._el?.focus({ preventScroll: true });
    }
  }
  _findActiveIndex() {
    return this._elements.findIndex(
      (el) => document.activeElement === el || el.getAttribute("role") === "menuitemradio" && el.getAttribute("aria-checked") === "true"
    );
  }
  _onFocus() {
    if (this._index >= 0) return;
    this._update();
    this._focusActive();
  }
  _validateKeyEvent(event) {
    const el = event.target;
    if (wasEnterKeyPressed(event) && el instanceof Element) {
      const role = el.getAttribute("role");
      return !/a|input|select|button/.test(el.localName) && !role;
    }
    return VALID_KEYS.has(event.key);
  }
  _onKeyUp(event) {
    if (!this._validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
  }
  _onKeyDown(event) {
    if (!this._validateKeyEvent(event)) return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case "Escape":
        this._delegate._closeMenu(event);
        break;
      case "Tab":
        this._focusAt(this._nextIndex(event.shiftKey ? -1 : 1));
        break;
      case "ArrowUp":
        this._focusAt(this._nextIndex(-1));
        break;
      case "ArrowDown":
        this._focusAt(this._nextIndex(1));
        break;
      case "Home":
      case "PageUp":
        this._focusAt(0);
        break;
      case "End":
      case "PageDown":
        this._focusAt(this._elements.length - 1);
        break;
    }
  }
  _nextIndex(delta) {
    let index = this._index;
    do {
      index = (index + delta + this._elements.length) % this._elements.length;
    } while (this._elements[index]?.offsetParent === null);
    return index;
  }
  _getFocusableElements() {
    if (!this._el) return [];
    const focusableElements = this._el.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
    const is = (node) => {
      return node.getAttribute("role") === "menu";
    };
    for (const el of focusableElements) {
      if (isHTMLElement(el) && el.offsetParent !== null && // does not have display: none
      isElementParent(this._el, el, is)) {
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
    this._expanded = signal(false);
    this._disabled = signal(false);
    this._trigger = signal(null);
    this._content = signal(null);
    this._submenus = /* @__PURE__ */ new Set();
    this._menuObserver = null;
    this._isSliderActive = false;
    this._isTriggerDisabled = signal(false);
    this._transitionCallbacks = /* @__PURE__ */ new Set();
    this._wasKeyboardExpand = false;
    this._removeSubmenuBind = this._removeSubmenu.bind(this);
    this._isSubmenuOpen = false;
    this._onSubmenuOpenBind = this._onSubmenuOpen.bind(this);
    this._onSubmenuCloseBind = this._onSubmenuClose.bind(this);
    this._onResize = animationFrameThrottle(() => {
      const content = peek(this._content);
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
    this._isTransitionActive = false;
    const { showDelay } = this.$props;
    this._popper = new Popper({
      _trigger: this._trigger,
      _content: this._content,
      _showDelay: showDelay,
      _listen: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this._expanded()) hide(event);
          else show(event);
        });
        const closeTarget = this._getCloseTarget();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      _onChange: this._onExpandedChange.bind(this)
    });
  }
  static {
    this.props = {
      showDelay: 0
    };
  }
  get triggerElement() {
    return this._trigger();
  }
  get contentElement() {
    return this._content();
  }
  get isSubmenu() {
    return !!this._parentMenu;
  }
  onSetup() {
    this._media = useMediaContext();
    const currentIdCount = ++idCount;
    this._menuId = `media-menu-${currentIdCount}`;
    this._menuButtonId = `media-menu-button-${currentIdCount}`;
    this._focus = new MenuFocusController({
      _closeMenu: this.close.bind(this)
    });
    if (hasProvidedContext(menuContext)) {
      this._parentMenu = useContext(menuContext);
    }
    this._observeSliders();
    this.setAttributes({
      "data-open": this._expanded,
      "data-root": !this.isSubmenu,
      "data-submenu": this.isSubmenu,
      "data-disabled": this._isDisabled.bind(this)
    });
    provideContext(menuContext, {
      _button: this._trigger,
      _content: this._content,
      _expanded: this._expanded,
      _hint: signal(""),
      _submenu: !!this._parentMenu,
      _disable: this._disable.bind(this),
      _attachMenuButton: this._attachMenuButton.bind(this),
      _attachMenuItems: this._attachMenuItems.bind(this),
      _attachObserver: this._attachObserver.bind(this),
      _disableMenuButton: this._disableMenuButton.bind(this),
      _addSubmenu: this._addSubmenu.bind(this),
      _onTransitionEvent: (callback) => {
        this._transitionCallbacks.add(callback);
        onDispose(() => {
          this._transitionCallbacks.delete(callback);
        });
      }
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onConnect(el) {
    effect(this._watchExpanded.bind(this));
    if (this.isSubmenu) {
      this._parentMenu?._addSubmenu(this);
    }
  }
  onDestroy() {
    this._trigger.set(null);
    this._content.set(null);
    this._menuObserver = null;
    this._transitionCallbacks.clear();
  }
  _observeSliders() {
    let sliderActiveTimer = -1, parentSliderObserver = hasProvidedContext(sliderObserverContext) ? useContext(sliderObserverContext) : null;
    provideContext(sliderObserverContext, {
      onDragStart: () => {
        parentSliderObserver?.onDragStart?.();
        window.clearTimeout(sliderActiveTimer);
        sliderActiveTimer = -1;
        this._isSliderActive = true;
      },
      onDragEnd: () => {
        parentSliderObserver?.onDragEnd?.();
        sliderActiveTimer = window.setTimeout(() => {
          this._isSliderActive = false;
          sliderActiveTimer = -1;
        }, 300);
      }
    });
  }
  _watchExpanded() {
    const expanded = this._isExpanded();
    if (!this.isSubmenu) this._onResize();
    this._updateMenuItemsHidden(expanded);
    if (!expanded) return;
    effect(() => {
      const { height } = this._media.$state, content = this._content();
      content && setStyle(content, "--player-height", height() + "px");
    });
    this._focus._listen();
    this.listen("pointerup", this._onPointerUp.bind(this));
    listenEvent(window, "pointerup", this._onWindowPointerUp.bind(this));
  }
  _attachMenuButton(button) {
    const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this._isDisabled.bind(this));
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
    setAttribute(el, "id", this._menuButtonId);
    setAttribute(el, "aria-haspopup", "menu");
    setAttribute(el, "aria-expanded", "false");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    const watchAttrs = () => {
      setAttribute(el, "data-open", this._expanded());
      setAttribute(el, "aria-disabled", isARIADisabled());
    };
    effect(watchAttrs);
    this._trigger.set(el);
    onDispose(() => {
      this._trigger.set(null);
    });
  }
  _attachMenuItems(items) {
    const el = items.el;
    el.style.setProperty("display", "none");
    setAttribute(el, "id", this._menuId);
    setAttributeIfEmpty(el, "role", "menu");
    setAttributeIfEmpty(el, "tabindex", "-1");
    setAttribute(el, "data-root", !this.isSubmenu);
    setAttribute(el, "data-submenu", this.isSubmenu);
    this._content.set(el);
    onDispose(() => this._content.set(null));
    const watchAttrs = () => setAttribute(el, "data-open", this._expanded());
    effect(watchAttrs);
    this._focus._attachMenu(el);
    this._updateMenuItemsHidden(false);
    const onTransition = this._onResizeTransition.bind(this);
    if (!this.isSubmenu) {
      items.listen("transitionstart", onTransition);
      items.listen("transitionend", onTransition);
      items.listen("animationend", this._onResize);
      items.listen("vds-menu-resize", this._onResize);
    } else {
      this._parentMenu?._onTransitionEvent(onTransition);
    }
  }
  _attachObserver(observer) {
    this._menuObserver = observer;
  }
  _updateMenuItemsHidden(expanded) {
    const content = peek(this._content);
    if (content) setAttribute(content, "aria-hidden", ariaBool(!expanded));
  }
  _disableMenuButton(disabled) {
    this._isTriggerDisabled.set(disabled);
  }
  _onExpandedChange(isExpanded, event) {
    this._wasKeyboardExpand = isKeyboardEvent(event);
    event?.stopPropagation();
    if (this._expanded() === isExpanded) return;
    if (this._isDisabled()) {
      if (isExpanded) this._popper.hide(event);
      return;
    }
    this.el?.dispatchEvent(
      new Event("vds-menu-resize", {
        bubbles: true,
        composed: true
      })
    );
    const trigger = this._trigger(), content = this._content();
    if (trigger) {
      setAttribute(trigger, "aria-controls", isExpanded && this._menuId);
      setAttribute(trigger, "aria-expanded", ariaBool(isExpanded));
    }
    if (content) setAttribute(content, "aria-labelledby", isExpanded && this._menuButtonId);
    this._expanded.set(isExpanded);
    this._toggleMediaControls(event);
    tick();
    if (this._wasKeyboardExpand) {
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
      if (!this.isSubmenu && this._media.activeMenu !== this) {
        this._media.activeMenu?.close(event);
        this._media.activeMenu = this;
      }
      this._menuObserver?._onOpen?.(event);
    } else {
      if (this.isSubmenu) {
        for (const el of this._submenus) el.close(event);
      } else {
        this._media.activeMenu = null;
      }
      this._menuObserver?._onClose?.(event);
    }
    if (isExpanded) {
      requestAnimationFrame(this._updateFocus.bind(this));
    }
  }
  _updateFocus() {
    if (this._isTransitionActive || this._isSubmenuOpen) return;
    this._focus._update();
    requestAnimationFrame(() => {
      if (this._wasKeyboardExpand) {
        this._focus._focusActive();
      } else {
        this._focus._scroll();
      }
    });
  }
  _isExpanded() {
    return !this._isDisabled() && this._expanded();
  }
  _isDisabled() {
    return this._disabled() || this._isTriggerDisabled();
  }
  _disable(disabled) {
    this._disabled.set(disabled);
  }
  _onPointerUp(event) {
    const content = this._content();
    if (this._isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    event.stopPropagation();
  }
  _onWindowPointerUp(event) {
    const content = this._content();
    if (this._isSliderActive || content && isEventInside(content, event)) {
      return;
    }
    this.close(event);
  }
  _getCloseTarget() {
    const target = this.el?.querySelector('[data-part="close-target"]');
    return this.el && target && isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
  }
  _toggleMediaControls(trigger) {
    if (this.isSubmenu) return;
    if (this._expanded()) this._media.remote.pauseControls(trigger);
    else this._media.remote.resumeControls(trigger);
  }
  _addSubmenu(menu) {
    this._submenus.add(menu);
    listenEvent(menu, "open", this._onSubmenuOpenBind);
    listenEvent(menu, "close", this._onSubmenuCloseBind);
    onDispose(this._removeSubmenuBind);
  }
  _removeSubmenu(menu) {
    this._submenus.delete(menu);
  }
  _onSubmenuOpen(event) {
    this._isSubmenuOpen = true;
    const content = this._content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "true");
    }
    for (const target of this._submenus) {
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
  _onSubmenuClose(event) {
    this._isSubmenuOpen = false;
    const content = this._content();
    if (this.isSubmenu) {
      this.triggerElement?.setAttribute("aria-hidden", "false");
    }
    for (const target of this._submenus) {
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
  _onResizeTransition(event) {
    const content = this._content();
    if (content && event.propertyName === "height") {
      this._isTransitionActive = event.type === "transitionstart";
      setAttribute(content, "data-transition", this._isTransitionActive ? "height" : null);
      if (this._expanded()) this._updateFocus();
    }
    for (const callback of this._transitionCallbacks) callback(event);
  }
  open(trigger) {
    if (peek(this._expanded)) return;
    this._popper.show(trigger);
    tick();
  }
  close(trigger) {
    if (!peek(this._expanded)) return;
    this._popper.hide(trigger);
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
    this._hintEl = signal(null);
    new FocusVisibleController();
  }
  static {
    this.props = {
      disabled: false
    };
  }
  get expanded() {
    return this._menu?._expanded() ?? false;
  }
  onSetup() {
    this._menu = useContext(menuContext);
  }
  onAttach(el) {
    this._menu._attachMenuButton(this);
    effect(this._watchDisabled.bind(this));
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    effect(this._watchHintEl.bind(this));
    this._onMutation();
    const mutations = new MutationObserver(this._onMutation.bind(this));
    mutations.observe(el, { attributeFilter: ["data-part"], childList: true, subtree: true });
    onDispose(() => mutations.disconnect());
    onPress(el, (trigger) => {
      this.dispatch("select", { trigger });
    });
  }
  _watchDisabled() {
    this._menu._disableMenuButton(this.$props.disabled());
  }
  _watchHintEl() {
    const el = this._hintEl();
    if (!el) return;
    effect(() => {
      const text = this._menu._hint();
      if (text) el.textContent = text;
    });
  }
  _onMutation() {
    const hintEl = this.el?.querySelector('[data-part="hint"]');
    this._hintEl.set(hintEl ?? null);
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
    this._target = null;
  }
  static {
    this.props = {
      container: null,
      disabled: false
    };
  }
  onSetup() {
    this._media = useMediaContext();
    provideContext(menuPortalContext, {
      _attach: this._attachElement.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  // Need this so connect scope is defined.
  onConnect(el) {
  }
  onDestroy() {
    this._target?.remove();
    this._target = null;
  }
  _attachElement(el) {
    this._portal(false);
    this._target = el;
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this._watchDisabled.bind(this));
      });
    });
  }
  _watchDisabled() {
    const { fullscreen } = this._media.$state, { disabled } = this.$props, _disabled = disabled();
    this._portal(_disabled === "fullscreen" ? !fullscreen() : !_disabled);
  }
  _portal(shouldPortal) {
    if (!this._target) return;
    let container = this._getContainer(this.$props.container());
    if (!container) return;
    const isPortalled = this._target.parentElement === container;
    setAttribute(this._target, "data-portal", shouldPortal);
    if (shouldPortal) {
      if (!isPortalled) {
        this._target.remove();
        container.append(this._target);
      }
    } else if (isPortalled && this._target.parentElement === container) {
      this._target.remove();
      this.el?.append(this._target);
    }
  }
  _getContainer(selector) {
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
    this._menu = useContext(menuContext);
    this._menu._attachMenuItems(this);
    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        provideContext(menuPortalContext, null);
        portal._attach(el);
        onDispose(() => portal._attach(null));
      }
    }
  }
  onConnect(el) {
    effect(this._watchPlacement.bind(this));
  }
  _watchPlacement() {
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
      return autoPlacement(this.el, this._getButton(), placement, {
        offsetVarName: "media-menu",
        xOffset: alignOffset(),
        yOffset: mainOffset()
      });
    } else {
      this.el.removeAttribute("style");
      this.el.style.display = "none";
    }
  }
  _getButton() {
    return this._menu._button();
  }
}

const radioControllerContext = createContext();

class RadioGroupController extends ViewController {
  constructor() {
    super(...arguments);
    this._group = /* @__PURE__ */ new Set();
    this._value = signal("");
    this._controller = null;
    this._onChangeBind = this._onChange.bind(this);
  }
  get _values() {
    return Array.from(this._group).map((radio) => radio._value());
  }
  get value() {
    return this._value();
  }
  set value(value) {
    this._onChange(value);
  }
  onSetup() {
    provideContext(radioControllerContext, {
      add: this._addRadio.bind(this),
      remove: this._removeRadio.bind(this)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem) setAttributeIfEmpty(el, "role", "radiogroup");
    this.setAttributes({ value: this._value });
  }
  onDestroy() {
    this._group.clear();
  }
  _addRadio(radio) {
    if (this._group.has(radio)) return;
    this._group.add(radio);
    radio._onCheck = this._onChangeBind;
    radio._check(radio._value() === this._value());
  }
  _removeRadio(radio) {
    radio._onCheck = null;
    this._group.delete(radio);
  }
  _onChange(newValue, trigger) {
    const currentValue = peek(this._value);
    if (!newValue || newValue === currentValue) return;
    const currentRadio = this._findRadio(currentValue), newRadio = this._findRadio(newValue);
    currentRadio?._check(false, trigger);
    newRadio?._check(true, trigger);
    this._value.set(newValue);
    this._onValueChange?.(newValue, trigger);
  }
  _findRadio(newValue) {
    for (const radio of this._group) {
      if (newValue === peek(radio._value)) return radio;
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
    return this._controller.value;
  }
  get disabled() {
    const { audioTracks } = this._media.$state;
    return audioTracks().length <= 1;
  }
  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  onSetup() {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this._watchValue.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }
  getOptions() {
    const { audioTracks } = this._media.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase()
    }));
  }
  _watchValue() {
    this._controller.value = this._getValue();
  }
  _watchHintText() {
    const { emptyLabel } = this.$props, { audioTrack } = this._media.$state, track = audioTrack();
    this._menu?._hint.set(track?.label ?? emptyLabel());
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _getValue() {
    const { audioTrack } = this._media.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : "";
  }
  _onValueChange(value, trigger) {
    if (this.disabled) return;
    const index = this._media.audioTracks.toArray().findIndex((track) => track.label.toLowerCase() === value);
    if (index >= 0) {
      const track = this._media.audioTracks[index];
      this._media.remote.changeAudioTrack(index, trigger);
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
    return this._controller.value;
  }
  get disabled() {
    const { hasCaptions } = this._media.$state;
    return !hasCaptions();
  }
  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  onSetup() {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    super.onConnect?.(el);
    effect(this._watchValue.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }
  getOptions() {
    const { offLabel } = this.$props, { textTracks } = this._media.$state;
    return [
      { value: "off", label: offLabel },
      ...textTracks().filter(isTrackCaptionKind).map((track) => ({
        track,
        label: track.label,
        value: this._getTrackValue(track)
      }))
    ];
  }
  _watchValue() {
    this._controller.value = this._getValue();
  }
  _watchHintText() {
    const { offLabel } = this.$props, { textTrack } = this._media.$state, track = textTrack();
    this._menu?._hint.set(
      track && isTrackCaptionKind(track) && track.mode === "showing" ? track.label : offLabel()
    );
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _getValue() {
    const { textTrack } = this._media.$state, track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === "showing" ? this._getTrackValue(track) : "off";
  }
  _onValueChange(value, trigger) {
    if (this.disabled) return;
    if (value === "off") {
      const track = this._media.textTracks.selected;
      if (track) {
        const index2 = this._media.textTracks.indexOf(track);
        this._media.remote.changeTextTrackMode(index2, "disabled", trigger);
        this.dispatch("change", { detail: null, trigger });
      }
      return;
    }
    const index = this._media.textTracks.toArray().findIndex((track) => this._getTrackValue(track) === value);
    if (index >= 0) {
      const track = this._media.textTracks[index];
      this._media.remote.changeTextTrackMode(index, "showing", trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
  _getTrackValue(track) {
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
    return this._controller.value;
  }
  get disabled() {
    const { rates } = this.$props, { canSetPlaybackRate } = this._media.$state;
    return !canSetPlaybackRate() || rates().length === 0;
  }
  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  onSetup() {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this._watchValue.bind(this));
    effect(this._watchHintText.bind(this));
    effect(this._watchControllerDisabled.bind(this));
  }
  getOptions() {
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + "\xD7",
      value: rate.toString()
    }));
  }
  _watchValue() {
    this._controller.value = this._getValue();
  }
  _watchHintText() {
    const { normalLabel } = this.$props, { playbackRate } = this._media.$state, rate = playbackRate();
    this._menu?._hint.set(rate === 1 ? normalLabel() : rate + "\xD7");
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _getValue() {
    const { playbackRate } = this._media.$state;
    return playbackRate().toString();
  }
  _onValueChange(value, trigger) {
    if (this.disabled) return;
    const rate = +value;
    this._media.remote.changePlaybackRate(rate, trigger);
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
    this._sortedQualities = computed(() => {
      const { sort } = this.$props, { qualities } = this._media.$state;
      return sortVideoQualities(qualities(), sort() === "descending");
    });
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  static {
    this.props = {
      autoLabel: "Auto",
      hideBitrate: false,
      sort: "descending"
    };
  }
  get value() {
    return this._controller.value;
  }
  get disabled() {
    const { canSetQuality, qualities } = this._media.$state;
    return !canSetQuality() || qualities().length <= 1;
  }
  onSetup() {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this._watchValue.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchHintText.bind(this));
  }
  getOptions() {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: "auto", label: autoLabel },
      ...this._sortedQualities().map((quality) => {
        const bitrate = quality.bitrate && quality.bitrate >= 0 ? `${round(quality.bitrate / 1e6, 2)} Mbps` : null;
        return {
          quality,
          label: quality.height + "p",
          value: this._getQualityId(quality),
          bitrate: () => !hideBitrate() ? bitrate : null
        };
      })
    ];
  }
  _watchValue() {
    this._controller.value = this._getValue();
  }
  _watchHintText() {
    const { autoLabel } = this.$props, { autoQuality, quality } = this._media.$state, qualityText = quality() ? quality().height + "p" : "";
    this._menu?._hint.set(
      !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : "")
    );
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _onValueChange(value, trigger) {
    if (this.disabled) return;
    if (value === "auto") {
      this._media.remote.changeQuality(-1, trigger);
      this.dispatch("change", { detail: "auto", trigger });
      return;
    }
    const { qualities } = this._media.$state, index = peek(qualities).findIndex((quality) => this._getQualityId(quality) === value);
    if (index >= 0) {
      const quality = peek(qualities)[index];
      this._media.remote.changeQuality(index, trigger);
      this.dispatch("change", { detail: quality, trigger });
    }
  }
  _getValue() {
    const { quality, autoQuality } = this._media.$state;
    if (autoQuality()) return "auto";
    const currentQuality = quality();
    return currentQuality ? this._getQualityId(currentQuality) : "auto";
  }
  _getQualityId(quality) {
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
    this._invert = signal(null);
    this._isVisible = signal(true);
    this._isIntersecting = signal(true);
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
    this._media = useMediaContext();
    this._watchTime();
    const { type } = this.$props;
    this.setAttributes({
      "data-type": type,
      "data-remainder": this._shouldInvert.bind(this)
    });
    new IntersectionObserverController({
      callback: this._onIntersectionChange.bind(this)
    }).attach(this);
  }
  onAttach(el) {
    if (!el.hasAttribute("role")) effect(this._watchRole.bind(this));
    effect(this._watchTime.bind(this));
  }
  onConnect(el) {
    onDispose(observeVisibility(el, this._isVisible.set));
    effect(this._watchHidden.bind(this));
    effect(this._watchToggle.bind(this));
  }
  _onIntersectionChange(entries) {
    this._isIntersecting.set(entries[0].isIntersecting);
  }
  _watchHidden() {
    const { hidden } = this.$props;
    this.$state.hidden.set(hidden() || !this._isVisible() || !this._isIntersecting());
  }
  _watchToggle() {
    if (!this.$props.toggle()) {
      this._invert.set(null);
      return;
    }
    if (this.el) {
      onPress(this.el, this._onToggle.bind(this));
    }
  }
  _watchTime() {
    const { hidden, timeText } = this.$state, { duration } = this._media.$state;
    if (hidden()) return;
    const { type, padHours, padMinutes, showHours } = this.$props, seconds = this._getSeconds(type()), $duration = duration(), shouldInvert = this._shouldInvert();
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
  _watchRole() {
    if (!this.el) return;
    const { toggle } = this.$props;
    setAttribute(this.el, "role", toggle() ? "timer" : null);
    setAttribute(this.el, "tabindex", toggle() ? 0 : null);
  }
  _getSeconds(type) {
    const { bufferedEnd, duration, currentTime } = this._media.$state;
    switch (type) {
      case "buffered":
        return bufferedEnd();
      case "duration":
        return duration();
      default:
        return currentTime();
    }
  }
  _shouldInvert() {
    return this.$props.remainder() && this._invert() !== false;
  }
  _onToggle(event) {
    event.preventDefault();
    if (this._invert() === null) {
      this._invert.set(!this.$props.remainder());
      return;
    }
    this._invert.set((v) => !v);
  }
}

export { ARIAKeyShortcuts, AirPlayButton, AudioRadioGroup, CaptionButton, CaptionsRadioGroup, DEFAULT_PLAYBACK_RATES, FullscreenButton, LiveButton, Menu, MenuButton, MenuItem, MenuItems, MenuPortal, MuteButton, PIPButton, PlayButton, Popper, QualityRadioGroup, RadioGroupController, SeekButton, Slider, SliderController, SliderPreview, SliderValue, SpeedRadioGroup, Thumbnail, ThumbnailsLoader, Time, TimeSlider, ToggleButtonController, VolumeSlider, formatSpokenTime, formatTime, menuContext, menuPortalContext, radioControllerContext, sliderContext, sliderState, sliderValueFormatContext, updateSliderPreviewPlacement };
