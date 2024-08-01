import { Host, effect, setAttribute, isString, useState, BOOLEAN } from './vidstack-fG_Sx3Q9.js';
import { Thumbnail, Time, AirPlayButton, CaptionButton, FullscreenButton, LiveButton, MuteButton, PIPButton, PlayButton, SeekButton, AudioRadioGroup, CaptionsRadioGroup, Menu, MenuButton, MenuItem, MenuItems, SpeedRadioGroup, QualityRadioGroup, Slider, SliderValue, TimeSlider, SliderPreview, VolumeSlider } from './vidstack-CHkmotlb.js';
import { cloneTemplateContent, createTemplate, requestScopedAnimationFrame, cloneTemplate } from './vidstack-DdUZGy1h.js';
import { useMediaContext } from './vidstack-DQ4Fz5gz.js';

const imgTemplate = /* @__PURE__ */ createTemplate(
  '<img loading="eager" decoding="async" aria-hidden="true">'
);
class MediaThumbnailElement extends Host(HTMLElement, Thumbnail) {
  constructor() {
    super(...arguments);
    this._img = this._createImg();
  }
  static {
    this.tagName = "media-thumbnail";
  }
  static {
    this.attrs = {
      crossOrigin: "crossorigin"
    };
  }
  onSetup() {
    this._media = useMediaContext();
    this.$state.img.set(this._img);
  }
  onConnect() {
    const { src, crossOrigin } = this.$state;
    if (this._img.parentNode !== this) {
      this.prepend(this._img);
    }
    effect(() => {
      setAttribute(this._img, "src", src());
      setAttribute(this._img, "crossorigin", crossOrigin());
    });
  }
  _createImg() {
    return cloneTemplateContent(imgTemplate);
  }
}

class MediaTimeElement extends Host(HTMLElement, Time) {
  static {
    this.tagName = "media-time";
  }
  onConnect() {
    effect(() => {
      this.textContent = this.$state.timeText();
    });
  }
}

class MediaAirPlayButtonElement extends Host(HTMLElement, AirPlayButton) {
  static {
    this.tagName = "media-airplay-button";
  }
}

class MediaCaptionButtonElement extends Host(HTMLElement, CaptionButton) {
  static {
    this.tagName = "media-caption-button";
  }
}

class MediaFullscreenButtonElement extends Host(HTMLElement, FullscreenButton) {
  static {
    this.tagName = "media-fullscreen-button";
  }
}

class MediaLiveButtonElement extends Host(HTMLElement, LiveButton) {
  static {
    this.tagName = "media-live-button";
  }
}

class MediaMuteButtonElement extends Host(HTMLElement, MuteButton) {
  static {
    this.tagName = "media-mute-button";
  }
}

class MediaPIPButtonElement extends Host(HTMLElement, PIPButton) {
  static {
    this.tagName = "media-pip-button";
  }
}

class MediaPlayButtonElement extends Host(HTMLElement, PlayButton) {
  static {
    this.tagName = "media-play-button";
  }
}

class MediaSeekButtonElement extends Host(HTMLElement, SeekButton) {
  static {
    this.tagName = "media-seek-button";
  }
}

function renderMenuItemsTemplate(el, onCreate) {
  requestScopedAnimationFrame(() => {
    if (!el.connectScope) return;
    const template = el.querySelector("template");
    if (!template) return;
    effect(() => {
      if (!template.content.firstElementChild?.localName && !template.firstElementChild) {
        throw Error("[vidstack] menu items template requires root element");
      }
      const options = el.getOptions();
      cloneTemplate(template, options.length, (radio, i) => {
        const { label, value } = options[i], labelEl = radio.querySelector(`[data-part="label"]`);
        radio.setAttribute("value", value);
        if (labelEl) {
          if (isString(label)) {
            labelEl.textContent = label;
          } else {
            effect(() => {
              labelEl.textContent = label();
            });
          }
        }
        onCreate?.(radio, options[i], i);
      });
    });
  });
}

class MediaAudioRadioGroupElement extends Host(HTMLElement, AudioRadioGroup) {
  static {
    this.tagName = "media-audio-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaCaptionsRadioGroupElement extends Host(HTMLElement, CaptionsRadioGroup) {
  static {
    this.tagName = "media-captions-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaMenuElement extends Host(HTMLElement, Menu) {
  static {
    this.tagName = "media-menu";
  }
}

class MediaMenuButtonElement extends Host(HTMLElement, MenuButton) {
  static {
    this.tagName = "media-menu-button";
  }
}

class MediaMenuItemElement extends Host(HTMLElement, MenuItem) {
  static {
    this.tagName = "media-menu-item";
  }
}

class MediaMenuItemsElement extends Host(HTMLElement, MenuItems) {
  static {
    this.tagName = "media-menu-items";
  }
}

class MediaSpeedRadioGroupElement extends Host(HTMLElement, SpeedRadioGroup) {
  static {
    this.tagName = "media-speed-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaQualityRadioGroupElement extends Host(HTMLElement, QualityRadioGroup) {
  static {
    this.tagName = "media-quality-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this, (el, option) => {
      const bitrate = option.bitrate, bitrateEl = el.querySelector('[data-part="bitrate"]');
      if (bitrate && bitrateEl) {
        effect(() => {
          bitrateEl.textContent = bitrate() || "";
        });
      }
    });
  }
}

class MediaSliderThumbnailElement extends MediaThumbnailElement {
  static {
    this.tagName = "media-slider-thumbnail";
  }
  onSetup() {
    super.onSetup();
    this._slider = useState(Slider.state);
  }
  onConnect() {
    super.onConnect();
    effect(this._watchTime.bind(this));
  }
  _watchTime() {
    const { duration, clipStartTime } = this._media.$state;
    this.time = clipStartTime() + this._slider.pointerRate() * duration();
  }
}

class MediaSliderValueElement extends Host(HTMLElement, SliderValue) {
  static {
    this.tagName = "media-slider-value";
  }
  static {
    this.attrs = {
      padMinutes: {
        converter: BOOLEAN
      }
    };
  }
  onConnect() {
    effect(() => {
      this.textContent = this.getValueText();
    });
  }
}

class MediaTimeSliderElement extends Host(HTMLElement, TimeSlider) {
  static {
    this.tagName = "media-time-slider";
  }
}

class MediaSliderPreviewElement extends Host(HTMLElement, SliderPreview) {
  static {
    this.tagName = "media-slider-preview";
  }
}

class MediaVolumeSliderElement extends Host(HTMLElement, VolumeSlider) {
  static {
    this.tagName = "media-volume-slider";
  }
}

export { MediaAirPlayButtonElement, MediaAudioRadioGroupElement, MediaCaptionButtonElement, MediaCaptionsRadioGroupElement, MediaFullscreenButtonElement, MediaLiveButtonElement, MediaMenuButtonElement, MediaMenuElement, MediaMenuItemElement, MediaMenuItemsElement, MediaMuteButtonElement, MediaPIPButtonElement, MediaPlayButtonElement, MediaQualityRadioGroupElement, MediaSeekButtonElement, MediaSliderPreviewElement, MediaSliderThumbnailElement, MediaSliderValueElement, MediaSpeedRadioGroupElement, MediaThumbnailElement, MediaTimeElement, MediaTimeSliderElement, MediaVolumeSliderElement, renderMenuItemsTemplate };
