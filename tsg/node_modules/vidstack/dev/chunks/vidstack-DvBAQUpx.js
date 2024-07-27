import { signal, listenEvent, ViewController, effect, setAttribute } from './vidstack-fG_Sx3Q9.js';

let $keyboard = signal(false);
{
  listenEvent(document, "pointerdown", () => {
    $keyboard.set(false);
  });
  listenEvent(document, "keydown", (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    $keyboard.set(true);
  });
}
class FocusVisibleController extends ViewController {
  constructor() {
    super(...arguments);
    this._focused = signal(false);
  }
  onConnect(el) {
    effect(() => {
      if (!$keyboard()) {
        this._focused.set(false);
        updateFocusAttr(el, false);
        this.listen("pointerenter", this._onPointerEnter.bind(this));
        this.listen("pointerleave", this._onPointerLeave.bind(this));
        return;
      }
      const active = document.activeElement === el;
      this._focused.set(active);
      updateFocusAttr(el, active);
      this.listen("focus", this._onFocus.bind(this));
      this.listen("blur", this._onBlur.bind(this));
    });
  }
  focused() {
    return this._focused();
  }
  _onFocus() {
    this._focused.set(true);
    updateFocusAttr(this.el, true);
  }
  _onBlur() {
    this._focused.set(false);
    updateFocusAttr(this.el, false);
  }
  _onPointerEnter() {
    updateHoverAttr(this.el, true);
  }
  _onPointerLeave() {
    updateHoverAttr(this.el, false);
  }
}
function updateFocusAttr(el, isFocused) {
  setAttribute(el, "data-focus", isFocused);
  setAttribute(el, "data-hocus", isFocused);
}
function updateHoverAttr(el, isHovering) {
  setAttribute(el, "data-hocus", isHovering);
  setAttribute(el, "data-hover", isHovering);
}

export { $keyboard, FocusVisibleController };
