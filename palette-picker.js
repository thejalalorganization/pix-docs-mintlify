// Palette review strip. Written by scripts/palette.mjs; removed by --unpublish.
//
// PURELY ADDITIVE: this appends one fixed-position bar to <body> and never
// reads, clears, or replaces any element Mintlify rendered. An earlier version
// mounted into the banner by clearing its parent's textContent, which on the
// production build also deleted the navigation — the container holding the
// banner text holds the nav too. Nothing here can remove page content.
//
// Colour switching rewrites Mintlify's five CSS custom properties in an
// injected <style>, so it is instant and needs no server.
(function () {
  window.__paletteBar = 'loaded';
  var LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var VARIANTS = [{"name":"A-mint-amber","theme":"mint","accent":"#a8410b","accentLight":"#f0a868","accentDark":"#8e370a","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"B-maple-amber","theme":"maple","accent":"#a8410b","accentLight":"#f0a868","accentDark":"#8e370a","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"C-maple-indigo","theme":"maple","accent":"#4f46e5","accentLight":"#a5b4fc","accentDark":"#4338ca","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"D-almond-terracotta","theme":"almond","accent":"#c2410c","accentLight":"#fdba74","accentDark":"#9a3412","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"E-linden-phosphor","theme":"linden","accent":"#16a34a","accentLight":"#4ade80","accentDark":"#15803d","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"F-palm-teal","theme":"palm","accent":"#0f766e","accentLight":"#5eead4","accentDark":"#115e59","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"G-sindoor-ivory","theme":"mint","accent":"#c43d1c","accentLight":"#f58a6a","accentDark":"#9e2f14","bg":"#f7f2e8","bgDark":"#1a1310"},{"name":"H-haldi-indigo","theme":"mint","accent":"#b07a14","accentLight":"#f2c14e","accentDark":"#8a5e0e","bg":"#fbf7ee","bgDark":"#13162a"},{"name":"I-nila-sandalwood","theme":"mint","accent":"#2f3c8f","accentLight":"#9bb0ff","accentDark":"#243070","bg":"#f7f3ea","bgDark":"#0e1120"},{"name":"J-peacock-saffron","theme":"mint","accent":"#0f6e78","accentLight":"#5fd3d8","accentDark":"#0b5259","bg":"#f4f6f2","bgDark":"#0b1517"},{"name":"K-kumkum-ivory","theme":"mint","accent":"#9b1b30","accentLight":"#f28ba0","accentDark":"#761323","bg":"#f8f3ec","bgDark":"#170e11"},{"name":"L-marigold-charcoal","theme":"mint","accent":"#d98a17","accentLight":"#ffb84d","accentDark":"#a8680f","bg":"#fffaf0","bgDark":"#141414"},{"name":"M-mehndi-rose","theme":"mint","accent":"#5c6a1f","accentLight":"#b9c86a","accentDark":"#454f17","bg":"#f8f6ef","bgDark":"#121408"},{"name":"N-classic-black-beige","theme":"mint","accent":"#1c1c1a","accentLight":"#e8e6e1","accentDark":"#000000","bg":"#f3eee3","bgDark":"#111111"},{"name":"O-navy-cream-gold","theme":"mint","accent":"#1f2a5a","accentLight":"#e2b859","accentDark":"#172046","bg":"#faf6ee","bgDark":"#0d1020"}];
  var CONFIGURED = "N-classic-black-beige";
  var SAVE = 'http://localhost:3334/switch?name=';
  var preview = null;

  function rgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return ((n >> 16) & 255) + ' ' + ((n >> 8) & 255) + ' ' + (n & 255);
  }

  function apply(v) {
    var el = document.getElementById('palette-override');
    if (!el) { el = document.createElement('style'); el.id = 'palette-override'; }
    // Re-append so this rule is always the last stylesheet in <head>, and mark
    // each property !important: Mintlify's own theme CSS loads after us and
    // would otherwise win on source order at equal specificity.
    document.head.appendChild(el);
    if (!v) { el.textContent = ''; return; }
    var imp = function (name, hex) { return '--' + name + ':' + rgb(hex) + ' !important;'; };
    el.textContent = ':root, html, body, .light, .dark {' +
      imp('primary', v.accent) + imp('primary-light', v.accentLight) +
      imp('primary-dark', v.accentDark) + imp('background-light', v.bg) +
      imp('background-dark', v.bgDark) + '}';
  }

  function dark() { return document.documentElement.classList.contains('dark'); }

  function fill(bar) {
    bar.textContent = '';
    var shown = preview || CONFIGURED;
    var isDark = dark();
    var tag = document.createElement('span');
    tag.textContent = 'palette';
    tag.style.cssText = 'font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.55;margin-right:2px;';
    bar.appendChild(tag);
    VARIANTS.forEach(function (v) {
      var a = document.createElement('a');
      a.href = '#'; a.title = v.name + (v.theme !== 'mint' ? ' (theme ' + v.theme + ')' : '');
      a.setAttribute('data-palette', v.name);
      a.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;cursor:pointer;background:' +
        (isDark ? v.bgDark : v.bg) + ';border:1px solid rgba(128,128,128,.5);' +
        (v.name === shown ? 'outline:2px solid currentColor;outline-offset:1px;' : '') +
        (v.theme !== 'mint' ? 'border-style:dashed;' : '');
      var dot = document.createElement('span');
      dot.style.cssText = 'display:block;width:11px;height:11px;border-radius:3px;background:' + (isDark ? v.accentLight : v.accent) + ';';
      a.appendChild(dot);
      a.addEventListener('click', function (e) { e.preventDefault(); preview = v.name; apply(v); fill(bar); });
      bar.appendChild(a);
    });
    var label = document.createElement('span');
    label.textContent = shown;
    label.style.cssText = 'font-size:12px;opacity:.75;margin-left:6px;white-space:nowrap;';
    bar.appendChild(label);
    if (LOCAL && preview && preview !== CONFIGURED) {
      var save = document.createElement('a');
      save.href = '#'; save.textContent = 'save';
      save.style.cssText = 'font-size:12px;margin-left:8px;text-decoration:underline;cursor:pointer;';
      save.addEventListener('click', function (e) {
        e.preventDefault(); save.textContent = 'saving...';
        fetch(SAVE + encodeURIComponent(preview), {mode: 'no-cors'}).catch(function () {});
      });
      bar.appendChild(save);
    }
  }

  function start() {
    if (document.getElementById('palette-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'palette-bar';
    // Bottom rather than top: a fixed top bar would overlap Mintlify's own
    // navbar, and compensating for that means editing its layout. The bottom
    // is always visible and collides with nothing.
    bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:2147483647;' +
      'display:flex;align-items:center;gap:5px;padding:7px 11px;border-radius:10px;' +
      'background:rgba(250,250,250,.94);color:#18181b;border:1px solid rgba(0,0,0,.14);' +
      'box-shadow:0 3px 14px rgba(0,0,0,.16);font-family:ui-sans-serif,system-ui,sans-serif;' +
      'backdrop-filter:blur(8px);max-width:94vw;flex-wrap:wrap;justify-content:center;';
    if (dark()) bar.style.background = 'rgba(24,24,27,.94)', bar.style.color = '#e4e4e7';
    document.documentElement.appendChild(bar);
    fill(bar);
    new MutationObserver(function () {
      if (dark()) { bar.style.background = 'rgba(24,24,27,.94)'; bar.style.color = '#e4e4e7'; }
      else { bar.style.background = 'rgba(250,250,250,.94)'; bar.style.color = '#18181b'; }
      fill(bar);
    }).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  }

  // React hydration replaces <body>'s children and drops anything it did not
  // render, so mounting once is not enough — re-append whenever it vanishes.
  function keep() {
    start();
    new MutationObserver(function () {
      if (!document.getElementById('palette-bar')) start();
    }).observe(document.documentElement, {childList: true, subtree: false});
  }
  if (document.body) keep();
  else document.addEventListener('DOMContentLoaded', keep);
})();
