import { Component, State, effect, tick, peek, setAttribute, isString, setStyle, createContext, signal, listenEvent, provideContext, onDispose, useContext, prop, useState, isNull, functionThrottle, computed, animationFrameThrottle, functionDebounce, scoped, createScope, method, hasProvidedContext, isNumber, isPointerEvent, isTouchEvent, isMouseEvent, DOMEvent, kebabToCamelCase, createDisposalBin } from './vidstack-fG_Sx3Q9.js';
import { useMediaContext } from './vidstack-DQ4Fz5gz.js';
import { setAttributeIfEmpty, requestScopedAnimationFrame, autoPlacement, setARIALabel, onPress, isTouchPinchEvent } from './vidstack-DdUZGy1h.js';
import { formatSpokenTime, Popper, ToggleButtonController, Slider, SliderController, sliderState, sliderValueFormatContext, TimeSlider, RadioGroupController, menuContext, radioControllerContext, formatTime } from './vidstack-CHkmotlb.js';
import { FocusVisibleController, $keyboard } from './vidstack-DvBAQUpx.js';
import { $ariaBool, sortVideoQualities } from './vidstack-BOTZD4tC.js';
import { round } from './vidstack-Dihypf8P.js';
import { watchActiveTextTrack, isCueActive } from './vidstack-C_9SlM6s.js';
import { isTrackCaptionKind } from './vidstack-C_Q-YmHq.js';

class MediaAnnouncer extends Component {
  constructor() {
    super(...arguments);
    this._initializing = false;
    this._startedSeekingAt = -1;
    this._seekTimer = -1;
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
    this._media = useMediaContext();
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
    this._initializing = true;
    effect(this._watchPaused.bind(this));
    effect(this._watchVolume.bind(this));
    effect(this._watchCaptions.bind(this));
    effect(this._watchFullscreen.bind(this));
    effect(this._watchPiP.bind(this));
    effect(this._watchSeeking.bind(this));
    effect(this._watchLabel.bind(this));
    tick();
    this._initializing = false;
  }
  _watchPaused() {
    const { paused } = this._media.$state;
    this._setLabel(!paused() ? "Play" : "Pause");
  }
  _watchFullscreen() {
    const { fullscreen } = this._media.$state;
    this._setLabel(fullscreen() ? "Enter Fullscreen" : "Exit Fullscreen");
  }
  _watchPiP() {
    const { pictureInPicture } = this._media.$state;
    this._setLabel(pictureInPicture() ? "Enter PiP" : "Exit PiP");
  }
  _watchCaptions() {
    const { textTrack } = this._media.$state;
    this._setLabel(textTrack() ? "Closed-Captions On" : "Closed-Captions Off");
  }
  _watchVolume() {
    const { muted, volume, audioGain } = this._media.$state;
    this._setLabel(
      muted() || volume() === 0 ? "Mute" : `${Math.round(volume() * (audioGain() ?? 1) * 100)}% ${this._translate("Volume")}`
    );
  }
  _watchSeeking() {
    const { seeking, currentTime } = this._media.$state, isSeeking = seeking();
    if (this._startedSeekingAt > 0) {
      window.clearTimeout(this._seekTimer);
      this._seekTimer = window.setTimeout(() => {
        if (!this.scope) return;
        const newTime = peek(currentTime), seconds = Math.abs(newTime - this._startedSeekingAt);
        if (seconds >= 1) {
          const isForward = newTime >= this._startedSeekingAt, spokenTime = formatSpokenTime(seconds);
          this._setLabel(
            `${this._translate(isForward ? "Seek Forward" : "Seek Backward")} ${spokenTime}`
          );
        }
        this._startedSeekingAt = -1;
        this._seekTimer = -1;
      }, 300);
    } else if (isSeeking) {
      this._startedSeekingAt = peek(currentTime);
    }
  }
  _translate(word) {
    const { translations } = this.$props;
    return translations?.()?.[word || ""] ?? word;
  }
  _watchLabel() {
    const { label, busy } = this.$state, $label = this._translate(label());
    if (this._initializing) return;
    busy.set(true);
    const id = window.setTimeout(() => void busy.set(false), 150);
    this.el && setAttribute(this.el, "aria-label", $label);
    if (isString($label)) {
      this.dispatch("change", { detail: $label });
    }
    return () => window.clearTimeout(id);
  }
  _setLabel(word) {
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
    this._media = useMediaContext();
    effect(this._watchProps.bind(this));
  }
  onAttach(el) {
    const { pictureInPicture, fullscreen } = this._media.$state;
    setStyle(el, "pointer-events", "none");
    setAttributeIfEmpty(el, "role", "group");
    this.setAttributes({
      "data-visible": this._isShowing.bind(this),
      "data-fullscreen": fullscreen,
      "data-pip": pictureInPicture
    });
    effect(() => {
      this.dispatch("change", { detail: this._isShowing() });
    });
    effect(this._hideControls.bind(this));
    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ["top", "right", "bottom", "left"]) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }
  _hideControls() {
    if (!this.el) return;
    const { nativeControls } = this._media.$state, isHidden = nativeControls();
    setAttribute(this.el, "aria-hidden", isHidden ? "true" : null);
    setStyle(this.el, "display", isHidden ? "none" : null);
  }
  _watchProps() {
    const { controls } = this._media.player, { hideDelay, hideOnMouseLeave } = this.$props;
    controls.defaultDelay = hideDelay() === 2e3 ? this._media.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }
  _isShowing() {
    const { controlsVisible } = this._media.$state;
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
    this._id = `media-tooltip-${++id}`;
    this._trigger = signal(null);
    this._content = signal(null);
    new FocusVisibleController();
    const { showDelay } = this.$props;
    new Popper({
      _trigger: this._trigger,
      _content: this._content,
      _showDelay: showDelay,
      _listen(trigger, show, hide) {
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
      _onChange: this._onShowingChange.bind(this)
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
      _trigger: this._trigger,
      _content: this._content,
      _attachTrigger: this._attachTrigger.bind(this),
      _detachTrigger: this._detachTrigger.bind(this),
      _attachContent: this._attachContent.bind(this),
      _detachContent: this._detachContent.bind(this)
    });
  }
  _attachTrigger(el) {
    this._trigger.set(el);
    let tooltipName = el.getAttribute("data-media-tooltip");
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
    }
    setAttribute(el, "data-describedby", this._id);
  }
  _detachTrigger(el) {
    el.removeAttribute("data-describedby");
    el.removeAttribute("aria-describedby");
    this._trigger.set(null);
  }
  _attachContent(el) {
    el.setAttribute("id", this._id);
    el.style.display = "none";
    setAttributeIfEmpty(el, "role", "tooltip");
    this._content.set(el);
  }
  _detachContent(el) {
    el.removeAttribute("id");
    el.removeAttribute("role");
    this._content.set(null);
  }
  _onShowingChange(isShowing) {
    const trigger = this._trigger(), content = this._content();
    if (trigger) {
      setAttribute(trigger, "aria-describedby", isShowing ? this._id : null);
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
        this._attach();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this._getButton();
          button && tooltip._detachTrigger(button);
        });
      })
    );
  }
  _attach() {
    const button = this._getButton(), tooltip = useContext(tooltipContext);
    button && tooltip._attachTrigger(button);
  }
  _getButton() {
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
    this._attach(el);
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    this._attach(el);
    const tooltip = useContext(tooltipContext);
    onDispose(() => tooltip._detachContent(el));
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        effect(this._watchPlacement.bind(this));
      })
    );
  }
  _attach(el) {
    const tooltip = useContext(tooltipContext);
    tooltip._attachContent(el);
  }
  _watchPlacement() {
    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this._getTrigger(), placement(), {
      offsetVarName: "media-tooltip",
      xOffset: alignOffset(),
      yOffset: mainOffset()
    });
  }
  _getTrigger() {
    return useContext(tooltipContext)._trigger();
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
    this._pressed = signal(false);
    new ToggleButtonController({
      _isPressed: this._pressed
    });
  }
  static {
    this.props = {
      disabled: false,
      defaultPressed: false
    };
  }
  get pressed() {
    return this._pressed();
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
      _isPressed: this._isPressed.bind(this),
      _onPress: this._onPress.bind(this)
    });
  }
  onSetup() {
    this._media = useMediaContext();
    const { canGoogleCast, isGoogleCastConnected } = this._media.$state;
    this.setAttributes({
      "data-active": isGoogleCastConnected,
      "data-supported": canGoogleCast,
      "data-state": this._getState.bind(this),
      "aria-hidden": $ariaBool(() => !canGoogleCast())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "google-cast");
    setARIALabel(el, this._getDefaultLabel.bind(this));
  }
  _onPress(event) {
    const remote = this._media.remote;
    remote.requestGoogleCast(event);
  }
  _isPressed() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState() !== "disconnected";
  }
  _getState() {
    const { remotePlaybackType, remotePlaybackState } = this._media.$state;
    return remotePlaybackType() === "google-cast" && remotePlaybackState();
  }
  _getDefaultLabel() {
    const { remotePlaybackState } = this._media.$state;
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
    this._media = useMediaContext();
    this._slider = useState(Slider.state);
    this._watchCrossOrigin();
    this.setAttributes({
      "data-loading": this._isLoading.bind(this),
      "data-hidden": this.$state.hidden,
      "data-error": this._hasError.bind(this),
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onAttach(el) {
    effect(this._watchVideo.bind(this));
    effect(this._watchSrc.bind(this));
    effect(this._watchCrossOrigin.bind(this));
    effect(this._watchHidden.bind(this));
    effect(this._onSrcChange.bind(this));
    effect(this._onUpdateTime.bind(this));
  }
  _watchVideo() {
    const video = this.$state.video();
    if (!video) return;
    if (video.readyState >= 2) this._onCanPlay();
    listenEvent(video, "canplay", this._onCanPlay.bind(this));
    listenEvent(video, "error", this._onError.bind(this));
  }
  _watchSrc() {
    const { src } = this.$state, { canLoad } = this._media.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }
  _watchCrossOrigin() {
    const { crossOrigin: crossOriginProp } = this.$props, { crossOrigin: crossOriginState } = this.$state, { crossOrigin: mediaCrossOrigin } = this._media.$state, crossOrigin = crossOriginProp() !== null ? crossOriginProp() : mediaCrossOrigin();
    crossOriginState.set(crossOrigin === true ? "anonymous" : crossOrigin);
  }
  _isLoading() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }
  _hasError() {
    const { error } = this.$state;
    return !isNull(error);
  }
  _watchHidden() {
    const { src, hidden } = this.$state, { canLoad, duration } = this._media.$state;
    hidden.set(canLoad() && (!src() || this._hasError() || !Number.isFinite(duration())));
  }
  _onSrcChange() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }
  _onCanPlay(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch("can-play", { trigger: event });
  }
  _onError(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch("error", { trigger: event });
  }
  _onUpdateTime() {
    const { video, canPlay } = this.$state, { duration } = this._media.$state, { pointerRate } = this._slider, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
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
    this._media = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "percent",
      percent: (_, decimalPlaces) => {
        return round(this.$state.value(), decimalPlaces) + "%";
      }
    });
    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this)
    }).attach(this);
    effect(this._watchMinMax.bind(this));
    effect(this._watchAudioGain.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-audio-gain-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Audio Boost");
    const { canSetAudioGain } = this._media.$state;
    this.setAttributes({
      "data-supported": canSetAudioGain,
      "aria-hidden": $ariaBool(() => !canSetAudioGain())
    });
  }
  _getARIAValueNow() {
    const { value } = this.$state;
    return Math.round(value());
  }
  _getARIAValueText() {
    const { value } = this.$state;
    return value() + "%";
  }
  _watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  _watchAudioGain() {
    const { audioGain } = this._media.$state, value = ((audioGain() ?? 1) - 1) * 100;
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  _isDisabled() {
    const { disabled } = this.$props, { canSetAudioGain } = this._media.$state;
    return disabled() || !canSetAudioGain();
  }
  _onAudioGainChange(event) {
    if (!event.trigger) return;
    const gain = round(1 + event.detail / 100, 2);
    this._media.remote.changeAudioGain(gain, event);
  }
  _onValueChange(event) {
    this._onAudioGainChange(event);
  }
  _onDragValueChange(event) {
    this._onAudioGainChange(event);
  }
}

class SpeedSlider extends Component {
  constructor() {
    super(...arguments);
    this._throttledSpeedChange = functionThrottle(this._onPlaybackRateChange.bind(this), 25);
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
    this._media = useMediaContext();
    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: this._roundValue,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this)
    }).attach(this);
    effect(this._watchMinMax.bind(this));
    effect(this._watchPlaybackRate.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-speed-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Speed");
    const { canSetPlaybackRate } = this._media.$state;
    this.setAttributes({
      "data-supported": canSetPlaybackRate,
      "aria-hidden": $ariaBool(() => !canSetPlaybackRate())
    });
  }
  _getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  _getARIAValueText() {
    const { value } = this.$state;
    return value() + "x";
  }
  _watchMinMax() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
  _watchPlaybackRate() {
    const { playbackRate } = this._media.$state;
    const newValue = playbackRate();
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  _roundValue(value) {
    return round(value, 2);
  }
  _isDisabled() {
    const { disabled } = this.$props, { canSetPlaybackRate } = this._media.$state;
    return disabled() || !canSetPlaybackRate();
  }
  _onPlaybackRateChange(event) {
    if (!event.trigger) return;
    const rate = event.detail;
    this._media.remote.changePlaybackRate(rate, event);
  }
  _onValueChange(event) {
    this._throttledSpeedChange(event);
  }
  _onDragValueChange(event) {
    this._throttledSpeedChange(event);
  }
}

class QualitySlider extends Component {
  constructor() {
    super(...arguments);
    this._sortedQualities = computed(() => {
      const { qualities } = this._media.$state;
      return sortVideoQualities(qualities());
    });
    this._throttledQualityChange = functionThrottle(this._onQualityChange.bind(this), 25);
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
    this._media = useMediaContext();
    new SliderController({
      _getStep: this.$props.step,
      _getKeyStep: this.$props.keyStep,
      _roundValue: Math.round,
      _isDisabled: this._isDisabled.bind(this),
      _getARIAValueNow: this._getARIAValueNow.bind(this),
      _getARIAValueText: this._getARIAValueText.bind(this),
      _onDragValueChange: this._onDragValueChange.bind(this),
      _onValueChange: this._onValueChange.bind(this)
    }).attach(this);
    effect(this._watchMax.bind(this));
    effect(this._watchQuality.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-quality-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Video Quality");
    const { qualities, canSetQuality } = this._media.$state, $supported = computed(() => canSetQuality() && qualities().length > 0);
    this.setAttributes({
      "data-supported": $supported,
      "aria-hidden": $ariaBool(() => !$supported())
    });
  }
  _getARIAValueNow() {
    const { value } = this.$state;
    return value();
  }
  _getARIAValueText() {
    const { quality } = this._media.$state;
    if (!quality()) return "";
    const { height, bitrate } = quality(), bitrateText = bitrate && bitrate > 0 ? `${(bitrate / 1e6).toFixed(2)} Mbps` : null;
    return height ? `${height}p${bitrateText ? ` (${bitrateText})` : ""}` : "Auto";
  }
  _watchMax() {
    const $qualities = this._sortedQualities();
    this.$state.max.set(Math.max(0, $qualities.length - 1));
  }
  _watchQuality() {
    let { quality } = this._media.$state, $qualities = this._sortedQualities(), value = Math.max(0, $qualities.indexOf(quality()));
    this.$state.value.set(value);
    this.dispatch("value-change", { detail: value });
  }
  _isDisabled() {
    const { disabled } = this.$props, { canSetQuality, qualities } = this._media.$state;
    return disabled() || qualities().length <= 1 || !canSetQuality();
  }
  _onQualityChange(event) {
    if (!event.trigger) return;
    const { qualities } = this._media, quality = peek(this._sortedQualities)[event.detail];
    this._media.remote.changeQuality(qualities.indexOf(quality), event);
  }
  _onValueChange(event) {
    this._throttledQualityChange(event);
  }
  _onDragValueChange(event) {
    this._throttledQualityChange(event);
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
    this._titleRef = null;
    this._refs = [];
    this._$track = signal(null);
    this._$cues = signal([]);
    this._activeIndex = signal(-1);
    this._activePointerIndex = signal(-1);
    this._bufferedIndex = 0;
    this._updateBufferedPercent = animationFrameThrottle((bufferedPercent) => {
      let percent, cues = this._$cues(), { clipStartTime } = this._media.$state, startTime = clipStartTime(), endTime = this._getEndTime(cues);
      for (let i = this._bufferedIndex; i < this._refs.length; i++) {
        percent = this._calcPercent(cues[i], bufferedPercent, startTime, endTime);
        this._refs[i]?.style.setProperty("--chapter-progress", percent + "%");
        if (percent < 100) {
          this._bufferedIndex = i;
          break;
        }
      }
    });
    this._bufferedPercent = computed(this._calcMediaBufferedPercent.bind(this));
    this._onCuesChange = functionDebounce(
      () => {
        const track = peek(this._$track);
        if (!this.scope || !track || !track.cues.length) return;
        this._$cues.set(this._fillGaps(track.cues));
        this._activeIndex.set(0);
        this._bufferedIndex = 0;
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
    return this._$cues();
  }
  get activeCue() {
    return this._$cues()[this._activeIndex()] || null;
  }
  get activePointerCue() {
    return this._$cues()[this._activePointerIndex()] || null;
  }
  onSetup() {
    this._media = useMediaContext();
    this._sliderState = useState(TimeSlider.state);
  }
  onAttach(el) {
    watchActiveTextTrack(this._media.textTracks, "chapters", this._setTrack.bind(this));
    effect(this._watchSource.bind(this));
  }
  onConnect() {
    onDispose(() => this._reset.bind(this));
  }
  onDestroy() {
    this._setTrack(null);
  }
  setRefs(refs) {
    this._refs = refs;
    this._updateScope?.dispose();
    if (this._refs.length === 1) {
      const el = this._refs[0];
      el.style.width = "100%";
      el.style.setProperty("--chapter-fill", "var(--slider-fill)");
      el.style.setProperty("--chapter-progress", "var(--slider-progress)");
    } else if (this._refs.length > 0) {
      scoped(() => this._watch(), this._updateScope = createScope());
    }
  }
  _setTrack(track) {
    if (peek(this._$track) === track) return;
    this._reset();
    this._$track.set(track);
  }
  _reset() {
    this._refs = [];
    this._$cues.set([]);
    this._activeIndex.set(-1);
    this._activePointerIndex.set(-1);
    this._bufferedIndex = 0;
    this._updateScope?.dispose();
  }
  _watch() {
    if (!this._refs.length) return;
    effect(this._watchUpdates.bind(this));
  }
  _watchUpdates() {
    const { hidden } = this._sliderState;
    if (hidden()) return;
    effect(this._watchContainerWidths.bind(this));
    effect(this._watchFillPercent.bind(this));
    effect(this._watchPointerPercent.bind(this));
    effect(this._watchBufferedPercent.bind(this));
  }
  _watchContainerWidths() {
    const cues = this._$cues();
    if (!cues.length) return;
    let cue, { clipStartTime, clipEndTime } = this._media.$state, startTime = clipStartTime(), endTime = clipEndTime() || cues[cues.length - 1].endTime, duration = endTime - startTime, remainingWidth = 100;
    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this._refs[i]) {
        const width = i === cues.length - 1 ? remainingWidth : round((cue.endTime - Math.max(startTime, cue.startTime)) / duration * 100, 3);
        this._refs[i].style.width = width + "%";
        remainingWidth -= width;
      }
    }
  }
  _watchFillPercent() {
    let { liveEdge, clipStartTime, duration } = this._media.$state, { fillPercent, value } = this._sliderState, cues = this._$cues(), isLiveEdge = liveEdge(), prevActiveIndex = peek(this._activeIndex), currentChapter = cues[prevActiveIndex];
    let currentActiveIndex = isLiveEdge ? this._$cues.length - 1 : this._findActiveChapterIndex(
      currentChapter ? currentChapter.startTime / duration() * 100 <= peek(value) ? prevActiveIndex : 0 : 0,
      fillPercent()
    );
    if (isLiveEdge || !currentChapter) {
      this._updateFillPercents(0, cues.length, 100);
    } else if (currentActiveIndex > prevActiveIndex) {
      this._updateFillPercents(prevActiveIndex, currentActiveIndex, 100);
    } else if (currentActiveIndex < prevActiveIndex) {
      this._updateFillPercents(currentActiveIndex + 1, prevActiveIndex + 1, 0);
    }
    const percent = isLiveEdge ? 100 : this._calcPercent(
      cues[currentActiveIndex],
      fillPercent(),
      clipStartTime(),
      this._getEndTime(cues)
    );
    this._updateFillPercent(this._refs[currentActiveIndex], percent);
    this._activeIndex.set(currentActiveIndex);
  }
  _watchPointerPercent() {
    let { pointing, pointerPercent } = this._sliderState;
    if (!pointing()) {
      this._activePointerIndex.set(-1);
      return;
    }
    const activeIndex = this._findActiveChapterIndex(0, pointerPercent());
    this._activePointerIndex.set(activeIndex);
  }
  _updateFillPercents(start, end, percent) {
    for (let i = start; i < end; i++) this._updateFillPercent(this._refs[i], percent);
  }
  _updateFillPercent(ref, percent) {
    if (!ref) return;
    ref.style.setProperty("--chapter-fill", percent + "%");
    setAttribute(ref, "data-active", percent > 0 && percent < 100);
    setAttribute(ref, "data-ended", percent === 100);
  }
  _findActiveChapterIndex(startIndex, percent) {
    let chapterPercent = 0, cues = this._$cues();
    if (percent === 0) return 0;
    else if (percent === 100) return cues.length - 1;
    let { clipStartTime } = this._media.$state, startTime = clipStartTime(), endTime = this._getEndTime(cues);
    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this._calcPercent(cues[i], percent, startTime, endTime);
      if (chapterPercent >= 0 && chapterPercent < 100) return i;
    }
    return 0;
  }
  _watchBufferedPercent() {
    this._updateBufferedPercent(this._bufferedPercent());
  }
  _calcMediaBufferedPercent() {
    const { bufferedEnd, duration } = this._media.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }
  _getEndTime(cues) {
    const { clipEndTime } = this._media.$state, endTime = clipEndTime();
    return endTime > 0 ? endTime : cues[cues.length - 1]?.endTime || 0;
  }
  _calcPercent(cue, percent, startTime, endTime) {
    const cues = this._$cues();
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
  _fillGaps(cues) {
    let chapters = [], { clipStartTime, clipEndTime, duration } = this._media.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
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
  _watchSource() {
    const { source } = this._media.$state;
    source();
    this._onTrackChange();
  }
  _onTrackChange() {
    if (!this.scope) return;
    const { disabled } = this.$props;
    if (disabled()) {
      this._$cues.set([]);
      this._activeIndex.set(0);
      this._bufferedIndex = 0;
      return;
    }
    const track = this._$track();
    if (track) {
      const onCuesChange = this._onCuesChange.bind(this);
      onCuesChange();
      onDispose(listenEvent(track, "add-cue", onCuesChange));
      onDispose(listenEvent(track, "remove-cue", onCuesChange));
      effect(this._watchMediaDuration.bind(this));
    }
    this._titleRef = this._findChapterTitleRef();
    if (this._titleRef) effect(this._onChapterTitleChange.bind(this));
    return () => {
      if (this._titleRef) {
        this._titleRef.textContent = "";
        this._titleRef = null;
      }
    };
  }
  _watchMediaDuration() {
    this._media.$state.duration();
    this._onCuesChange();
  }
  _onChapterTitleChange() {
    const cue = this.activePointerCue || this.activeCue;
    if (this._titleRef) this._titleRef.textContent = cue?.text || "";
  }
  _findParentSlider() {
    let node = this.el;
    while (node && node.getAttribute("role") !== "slider") {
      node = node.parentElement;
    }
    return node;
  }
  _findChapterTitleRef() {
    const slider = this._findParentSlider();
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
    return this._controller._values;
  }
  get value() {
    return this._controller.value;
  }
  set value(newValue) {
    this._controller.value = newValue;
  }
  constructor() {
    super();
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  onSetup() {
    effect(this._watchValue.bind(this));
  }
  _watchValue() {
    this._controller.value = this.$props.value();
  }
  _onValueChange(value, trigger) {
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
    this._checked = signal(false);
    this._controller = {
      _value: this.$props.value,
      _check: this._check.bind(this),
      _onCheck: null
    };
    new FocusVisibleController();
  }
  static {
    this.props = {
      value: ""
    };
  }
  get checked() {
    return this._checked();
  }
  onSetup() {
    this.setAttributes({
      value: this.$props.value,
      "data-checked": this._checked,
      "aria-checked": $ariaBool(this._checked)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
    effect(this._watchValue.bind(this));
  }
  onConnect(el) {
    this._addToGroup();
    onPress(el, this._onPress.bind(this));
    onDispose(this._onDisconnect.bind(this));
  }
  _onDisconnect() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this._controller);
    }, this.connectScope);
  }
  _addToGroup() {
    const group = useContext(radioControllerContext);
    group.add(this._controller);
  }
  _watchValue() {
    const { value } = this.$props, newValue = value();
    if (peek(this._checked)) {
      this._controller._onCheck?.(newValue);
    }
  }
  _onPress(event) {
    if (peek(this._checked)) return;
    this._onChange(true, event);
    this._onSelect(event);
    this._controller._onCheck?.(peek(this.$props.value), event);
  }
  _check(value, trigger) {
    if (peek(this._checked) === value) return;
    this._onChange(value, trigger);
  }
  _onChange(value, trigger) {
    this._checked.set(value);
    this.dispatch("change", { detail: value, trigger });
  }
  _onSelect(trigger) {
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
    this._track = signal(null);
    this._cues = signal([]);
    this._controller = new RadioGroupController();
    this._controller._onValueChange = this._onValueChange.bind(this);
  }
  static {
    this.props = {
      thumbnails: null
    };
  }
  get value() {
    return this._controller.value;
  }
  get disabled() {
    return !this._cues()?.length;
  }
  onSetup() {
    this._media = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this._menu = useContext(menuContext);
    }
    const { thumbnails } = this.$props;
    this.setAttributes({
      "data-thumbnails": () => !!thumbnails()
    });
  }
  onAttach(el) {
    this._menu?._attachObserver({
      _onOpen: this._onOpen.bind(this)
    });
  }
  getOptions() {
    const { clipStartTime, clipEndTime } = this._media.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
    return this._cues().map((cue, i) => ({
      cue,
      value: i.toString(),
      label: cue.text,
      startTime: formatTime(Math.max(0, cue.startTime - startTime)),
      duration: formatSpokenTime(
        Math.min(endTime, cue.endTime) - Math.max(startTime, cue.startTime)
      )
    }));
  }
  _onOpen() {
    peek(() => this._watchCurrentTime());
  }
  onConnect(el) {
    effect(this._watchCurrentTime.bind(this));
    effect(this._watchControllerDisabled.bind(this));
    effect(this._watchTrack.bind(this));
    watchActiveTextTrack(this._media.textTracks, "chapters", this._track.set);
  }
  _watchTrack() {
    const track = this._track();
    if (!track) return;
    const onCuesChange = this._onCuesChange.bind(this, track);
    onCuesChange();
    listenEvent(track, "add-cue", onCuesChange);
    listenEvent(track, "remove-cue", onCuesChange);
    return () => {
      this._cues.set([]);
    };
  }
  _onCuesChange(track) {
    const { clipStartTime, clipEndTime } = this._media.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity;
    this._cues.set(
      [...track.cues].filter((cue) => cue.startTime <= endTime && cue.endTime >= startTime)
    );
  }
  _watchCurrentTime() {
    if (!this._menu?._expanded()) return;
    const track = this._track();
    if (!track) {
      this._controller.value = "-1";
      return;
    }
    const { realCurrentTime, clipStartTime, clipEndTime } = this._media.$state, startTime = clipStartTime(), endTime = clipEndTime() || Infinity, time = realCurrentTime(), activeCueIndex = this._cues().findIndex((cue) => isCueActive(cue, time));
    this._controller.value = activeCueIndex.toString();
    if (activeCueIndex >= 0) {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope) return;
        const cue = this._cues()[activeCueIndex], radio = this.el.querySelector(`[aria-checked='true']`), cueStartTime = Math.max(startTime, cue.startTime), duration = Math.min(endTime, cue.endTime) - cueStartTime, playedPercent = Math.max(0, time - cueStartTime) / duration * 100;
        radio && setStyle(radio, "--progress", round(playedPercent, 3) + "%");
      });
    }
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _onValueChange(value, trigger) {
    if (this.disabled || !trigger) return;
    const index = +value, cues = this._cues(), { clipStartTime } = this._media.$state;
    if (isNumber(index) && cues?.[index]) {
      this._controller.value = index.toString();
      this._media.remote.seek(cues[index].startTime - clipStartTime(), trigger);
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
    return this._controller.value;
  }
  get disabled() {
    const { gains } = this.$props, { canSetAudioGain } = this._media.$state;
    return !canSetAudioGain() || gains().length === 0;
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
    const { gains, normalLabel } = this.$props;
    return gains().map((gain) => ({
      label: gain === 1 || gain === null ? normalLabel : String(gain * 100) + "%",
      value: gain.toString()
    }));
  }
  _watchValue() {
    this._controller.value = this._getValue();
  }
  _watchHintText() {
    const { normalLabel } = this.$props, { audioGain } = this._media.$state, gain = audioGain();
    this._menu?._hint.set(gain === 1 || gain == null ? normalLabel() : String(gain * 100) + "%");
  }
  _watchControllerDisabled() {
    this._menu?._disable(this.disabled);
  }
  _getValue() {
    const { audioGain } = this._media.$state;
    return audioGain()?.toString() ?? "1";
  }
  _onValueChange(value, trigger) {
    if (this.disabled) return;
    const gain = +value;
    this._media.remote.changeAudioGain(gain, trigger);
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
    this._provider = null;
    this._presses = 0;
    this._pressTimerId = -1;
  }
  static {
    this.props = {
      disabled: false,
      event: void 0,
      action: void 0
    };
  }
  onSetup() {
    this._media = useMediaContext();
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
    this._provider = this._media.player.el?.querySelector(
      "[data-media-provider]"
    );
    effect(this._attachListener.bind(this));
  }
  _attachListener() {
    let eventType = this.$props.event(), disabled = this.$props.disabled();
    if (!this._provider || !eventType || disabled) return;
    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1];
    }
    if (eventType === "pointerup" || eventType === "pointerdown") {
      const pointer = this._media.$state.pointer();
      if (pointer === "coarse") {
        eventType = eventType === "pointerup" ? "touchend" : "touchstart";
      }
    }
    listenEvent(
      this._provider,
      eventType,
      this._acceptEvent.bind(this),
      { passive: false }
    );
  }
  _acceptEvent(event) {
    if (this.$props.disabled() || isPointerEvent(event) && (event.button !== 0 || this._media.activeMenu) || isTouchEvent(event) && this._media.activeMenu || isTouchPinchEvent(event) || !this._inBounds(event)) {
      return;
    }
    event.MEDIA_GESTURE = true;
    event.preventDefault();
    const eventType = peek(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
    if (!isDblEvent) {
      if (this._presses === 0) {
        setTimeout(() => {
          if (this._presses === 1) this._handleEvent(event);
        }, 250);
      }
    } else if (this._presses === 1) {
      queueMicrotask(() => this._handleEvent(event));
      clearTimeout(this._pressTimerId);
      this._presses = 0;
      return;
    }
    if (this._presses === 0) {
      this._pressTimerId = window.setTimeout(() => {
        this._presses = 0;
      }, 275);
    }
    this._presses++;
  }
  _handleEvent(event) {
    this.el.setAttribute("data-triggered", "");
    requestAnimationFrame(() => {
      if (this._isTopLayer()) {
        this._performAction(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el.removeAttribute("data-triggered");
      });
    });
  }
  /** Validate event occurred in gesture bounds. */
  _inBounds(event) {
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
  _isTopLayer() {
    const gestures = this._media.player.el.querySelectorAll(
      "[data-media-gesture][data-triggered]"
    );
    return Array.from(gestures).sort(
      (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex
    )[0] === this.el;
  }
  _performAction(action, trigger) {
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
      this._media.remote.toggleFullscreen("prefer-media", trigger);
    } else if (action.includes("seek:")) {
      this._media.remote.seek(peek(this._media.$state.currentTime) + (+value || 0), trigger);
    } else {
      this._media.remote[kebabToCamelCase(method)](trigger);
    }
    this.dispatch("trigger", {
      detail: action,
      trigger
    });
  }
}

class CaptionsTextRenderer {
  constructor(_renderer) {
    this._renderer = _renderer;
    this.priority = 10;
    this._track = null;
    this._disposal = createDisposalBin();
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this._disposal.empty();
    this._renderer.reset();
    this._track = null;
  }
  changeTrack(track) {
    if (!track || this._track === track) return;
    this._disposal.empty();
    if (track.readyState < 2) {
      this._renderer.reset();
      this._disposal.add(
        listenEvent(track, "load", () => this._changeTrack(track), { once: true })
      );
    } else {
      this._changeTrack(track);
    }
    this._disposal.add(
      listenEvent(track, "add-cue", (event) => {
        this._renderer.addCue(event.detail);
      }),
      listenEvent(track, "remove-cue", (event) => {
        this._renderer.removeCue(event.detail);
      })
    );
    this._track = track;
  }
  _changeTrack(track) {
    this._renderer.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
}

class Captions extends Component {
  constructor() {
    super(...arguments);
    this._hideExampleTimer = -1;
  }
  static {
    this.props = {
      textDir: "ltr",
      exampleText: "Captions look like this."
    };
  }
  static {
    this._lib = signal(null);
  }
  get _lib() {
    return Captions._lib;
  }
  onSetup() {
    this._media = useMediaContext();
    this.setAttributes({
      "aria-hidden": $ariaBool(this._isHidden.bind(this))
    });
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    if (!this._lib()) {
      import('media-captions').then((lib) => this._lib.set(lib));
    }
    effect(this._watchViewType.bind(this));
  }
  _isHidden() {
    const { textTrack, remotePlaybackState, iOSControls } = this._media.$state, track = textTrack();
    return iOSControls() || remotePlaybackState() === "connected" || !track || !isTrackCaptionKind(track);
  }
  _watchViewType() {
    if (!this._lib()) return;
    const { viewType } = this._media.$state;
    if (viewType() === "audio") {
      return this._setupAudioView();
    } else {
      return this._setupVideoView();
    }
  }
  _setupAudioView() {
    effect(this._onTrackChange.bind(this));
    this._listenToFontStyleChanges(null);
    return () => {
      this.el.textContent = "";
    };
  }
  _onTrackChange() {
    if (this._isHidden()) return;
    this._onCueChange();
    const { textTrack } = this._media.$state;
    listenEvent(textTrack(), "cue-change", this._onCueChange.bind(this));
    effect(this._onUpdateTimedNodes.bind(this));
  }
  _onCueChange() {
    this.el.textContent = "";
    if (this._hideExampleTimer >= 0) {
      this._removeExample();
    }
    const { realCurrentTime, textTrack } = this._media.$state, { renderVTTCueString } = this._lib(), time = peek(realCurrentTime), activeCues = peek(textTrack).activeCues;
    for (const cue of activeCues) {
      const displayEl = this._createCueDisplayElement(), cueEl = this._createCueElement();
      cueEl.innerHTML = renderVTTCueString(cue, time);
      displayEl.append(cueEl);
      this.el.append(cueEl);
    }
  }
  _onUpdateTimedNodes() {
    const { realCurrentTime } = this._media.$state, { updateTimedVTTCueNodes } = this._lib();
    updateTimedVTTCueNodes(this.el, realCurrentTime());
  }
  _setupVideoView() {
    const { CaptionsRenderer } = this._lib(), renderer = new CaptionsRenderer(this.el), textRenderer = new CaptionsTextRenderer(renderer);
    this._media.textRenderers.add(textRenderer);
    effect(this._watchTextDirection.bind(this, renderer));
    effect(this._watchMediaTime.bind(this, renderer));
    this._listenToFontStyleChanges(renderer);
    return () => {
      this.el.textContent = "";
      this._media.textRenderers.remove(textRenderer);
      renderer.destroy();
    };
  }
  _watchTextDirection(renderer) {
    renderer.dir = this.$props.textDir();
  }
  _watchMediaTime(renderer) {
    if (this._isHidden()) return;
    const { realCurrentTime, textTrack } = this._media.$state;
    renderer.currentTime = realCurrentTime();
    if (this._hideExampleTimer >= 0 && textTrack()?.activeCues[0]) {
      this._removeExample();
    }
  }
  _listenToFontStyleChanges(renderer) {
    const player = this._media.player;
    if (!player) return;
    const onChange = this._onFontStyleChange.bind(this, renderer);
    listenEvent(player, "vds-font-change", onChange);
  }
  _onFontStyleChange(renderer) {
    if (this._hideExampleTimer >= 0) {
      this._hideExample();
      return;
    }
    const { textTrack } = this._media.$state;
    if (!textTrack()?.activeCues[0]) {
      this._showExample();
    } else {
      renderer?.update(true);
    }
  }
  _showExample() {
    const display = this._createCueDisplayElement();
    setAttribute(display, "data-example", "");
    const cue = this._createCueElement();
    setAttribute(cue, "data-example", "");
    cue.textContent = this.$props.exampleText();
    display?.append(cue);
    this.el?.append(display);
    this.el?.setAttribute("data-example", "");
    this._hideExample();
  }
  _hideExample() {
    window.clearTimeout(this._hideExampleTimer);
    this._hideExampleTimer = window.setTimeout(this._removeExample.bind(this), 2500);
  }
  _removeExample() {
    this.el?.removeAttribute("data-example");
    if (this.el?.querySelector("[data-example]")) this.el.textContent = "";
    this._hideExampleTimer = -1;
  }
  _createCueDisplayElement() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue-display");
    return el;
  }
  _createCueElement() {
    const el = document.createElement("div");
    setAttribute(el, "data-part", "cue");
    return el;
  }
}

export { AudioGainRadioGroup, AudioGainSlider, Captions, ChaptersRadioGroup, Controls, ControlsGroup, DEFAULT_AUDIO_GAINS, Gesture, GoogleCastButton, MediaAnnouncer, QualitySlider, Radio, RadioGroup, SliderChapters, SliderVideo, SpeedSlider, ToggleButton, Tooltip, TooltipContent, TooltipTrigger };
