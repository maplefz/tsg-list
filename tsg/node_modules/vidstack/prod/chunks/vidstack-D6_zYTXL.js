import { signal, listenEvent, ViewController, effect, setAttribute } from './vidstack-C6myozhB.js';

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
    this.Dc = signal(false);
  }
  onConnect(el) {
    effect(() => {
      if (!$keyboard()) {
        this.Dc.set(false);
        updateFocusAttr(el, false);
        this.listen("pointerenter", this.Oe.bind(this));
        this.listen("pointerleave", this.Pe.bind(this));
        return;
      }
      const active = document.activeElement === el;
      this.Dc.set(active);
      updateFocusAttr(el, active);
      this.listen("focus", this.Ec.bind(this));
      this.listen("blur", this.qk.bind(this));
    });
  }
  focused() {
    return this.Dc();
  }
  Ec() {
    this.Dc.set(true);
    updateFocusAttr(this.el, true);
  }
  qk() {
    this.Dc.set(false);
    updateFocusAttr(this.el, false);
  }
  Oe() {
    updateHoverAttr(this.el, true);
  }
  Pe() {
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
