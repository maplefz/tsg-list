import { computed, peek, effect, animationFrameThrottle, onDispose, isDOMNode, isString } from './vidstack-C6myozhB.js';
import { nothing, render, html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg.js';
import { directive, AsyncDirective, PartType } from 'lit-html/async-directive.js';
import { useMediaContext } from './vidstack-Cq-GdDcp.js';

class SignalDirective extends AsyncDirective {
  constructor(part) {
    super(part);
    this.h = null;
    this.w = false;
    this.$ = null;
    this.w = part.type === PartType.ATTRIBUTE || part.type === PartType.BOOLEAN_ATTRIBUTE;
  }
  render(signal) {
    if (signal !== this.h) {
      this.disconnected();
      this.h = signal;
      if (this.isConnected) this.Gl();
    }
    return this.h ? this.x(peek(this.h)) : nothing;
  }
  reconnected() {
    this.Gl();
  }
  disconnected() {
    this.$?.();
    this.$ = null;
  }
  Gl() {
    if (!this.h) return;
    this.$ = effect(this.l.bind(this));
  }
  x(value) {
    return this.w ? ifDefined(value) : value;
  }
  y(value) {
    this.setValue(this.x(value));
  }
  l() {
    {
      this.y(this.h?.());
    }
  }
}
function $signal(compute) {
  return directive(SignalDirective)(computed(compute));
}

class SlotObserver {
  constructor(_roots, _callback) {
    this._m = _roots;
    this.La = _callback;
    this.elements = /* @__PURE__ */ new Set();
    this.Gc = animationFrameThrottle(this.Ha.bind(this));
  }
  connect() {
    this.Ha();
    const observer = new MutationObserver(this.Gc);
    for (const root of this._m) observer.observe(root, { childList: true, subtree: true });
    onDispose(() => observer.disconnect());
    onDispose(this.disconnect.bind(this));
  }
  disconnect() {
    this.elements.clear();
  }
  assign(template, slot) {
    if (isDOMNode(template)) {
      slot.textContent = "";
      slot.append(template);
    } else {
      render(null, slot);
      render(template, slot);
    }
    if (!slot.style.display) {
      slot.style.display = "contents";
    }
    const el = slot.firstElementChild;
    if (!el) return;
    const classList = slot.getAttribute("data-class");
    if (classList) el.classList.add(...classList.split(" "));
  }
  Ha(entries) {
    if (entries && !entries.some((e) => e.addedNodes.length)) return;
    let changed = false, slots = this._m.flatMap((root) => [...root.querySelectorAll("slot")]);
    for (const slot of slots) {
      if (!slot.hasAttribute("name") || this.elements.has(slot)) continue;
      this.elements.add(slot);
      changed = true;
    }
    if (changed) this.La(this.elements);
  }
}

let id = 0, slotIdAttr = "data-slot-id";
class SlotManager {
  constructor(_roots) {
    this._m = _roots;
    this.Gc = animationFrameThrottle(this.Ha.bind(this));
    this.slots = new SlotObserver(_roots, this.Ha.bind(this));
  }
  connect() {
    this.slots.connect();
    this.Ha();
    const mutations = new MutationObserver(this.Gc);
    for (const root of this._m) mutations.observe(root, { childList: true });
    onDispose(() => mutations.disconnect());
  }
  Ha() {
    for (const root of this._m) {
      for (const node of root.children) {
        if (node.nodeType !== 1) continue;
        const name = node.getAttribute("slot");
        if (!name) continue;
        node.style.display = "none";
        let slotId = node.getAttribute(slotIdAttr);
        if (!slotId) {
          node.setAttribute(slotIdAttr, slotId = ++id + "");
        }
        for (const slot of this.slots.elements) {
          if (slot.getAttribute("name") !== name || slot.getAttribute(slotIdAttr) === slotId) {
            continue;
          }
          const clone = document.importNode(node, true);
          if (name.includes("-icon")) clone.classList.add("vds-icon");
          clone.style.display = "";
          clone.removeAttribute("slot");
          this.slots.assign(clone, slot);
          slot.setAttribute(slotIdAttr, slotId);
        }
      }
    }
  }
}

function Icon({ name, class: _class, state, paths, viewBox = "0 0 32 32" }) {
  return html`<svg
    class="${"vds-icon" + (_class ? ` ${_class}` : "")}"
    viewBox="${viewBox}"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${ifDefined(name ?? state)}
  >
    ${!isString(paths) ? $signal(paths) : unsafeSVG(paths)}
  </svg>`;
}

class IconsLoader {
  constructor(_roots) {
    this._m = _roots;
    this.dn = {};
    this.gn = false;
    this.slots = new SlotObserver(_roots, this.hn.bind(this));
  }
  connect() {
    this.slots.connect();
  }
  load() {
    this.Pf().then((icons) => {
      this.dn = icons;
      this.gn = true;
      this.hn();
    });
  }
  *jn() {
    for (const iconName of Object.keys(this.dn)) {
      const slotName = `${iconName}-icon`;
      for (const slot of this.slots.elements) {
        if (slot.name !== slotName) continue;
        yield { icon: this.dn[iconName], slot };
      }
    }
  }
  hn() {
    if (!this.gn) return;
    for (const { icon, slot } of this.jn()) {
      this.slots.assign(icon, slot);
    }
  }
}

class LayoutIconsLoader extends IconsLoader {
  connect() {
    super.connect();
    const { player } = useMediaContext();
    if (!player.el) return;
    let dispose, observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      dispose?.();
      dispose = void 0;
      this.load();
    });
    observer.observe(player.el);
    dispose = onDispose(() => observer.disconnect());
  }
}

export { $signal, Icon, LayoutIconsLoader, SlotManager };
