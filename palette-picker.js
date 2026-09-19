// Palette review strip. Written by scripts/palette.mjs; removed by --reset.
// Switches colours client-side via Mintlify's CSS variables: instant, and the
// strip never unmounts. Stateless — current variant is read from the banner.
(function () {
  var LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var VARIANTS = [{"name":"A-mint-amber","theme":"mint","accent":"#a8410b","accentLight":"#f0a868","accentDark":"#8e370a","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"B-maple-amber","theme":"maple","accent":"#a8410b","accentLight":"#f0a868","accentDark":"#8e370a","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"C-maple-indigo","theme":"maple","accent":"#4f46e5","accentLight":"#a5b4fc","accentDark":"#4338ca","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"D-almond-terracotta","theme":"almond","accent":"#c2410c","accentLight":"#fdba74","accentDark":"#9a3412","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"E-linden-phosphor","theme":"linden","accent":"#16a34a","accentLight":"#4ade80","accentDark":"#15803d","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"F-palm-teal","theme":"palm","accent":"#0f766e","accentLight":"#5eead4","accentDark":"#115e59","bg":"#ffffff","bgDark":"#0b0b0b"},{"name":"G-sindoor-ivory","theme":"mint","accent":"#c43d1c","accentLight":"#f58a6a","accentDark":"#9e2f14","bg":"#f7f2e8","bgDark":"#1a1310"},{"name":"H-haldi-indigo","theme":"mint","accent":"#b07a14","accentLight":"#f2c14e","accentDark":"#8a5e0e","bg":"#fbf7ee","bgDark":"#13162a"},{"name":"I-nila-sandalwood","theme":"mint","accent":"#2f3c8f","accentLight":"#9bb0ff","accentDark":"#243070","bg":"#f7f3ea","bgDark":"#0e1120"},{"name":"J-peacock-saffron","theme":"mint","accent":"#0f6e78","accentLight":"#5fd3d8","accentDark":"#0b5259","bg":"#f4f6f2","bgDark":"#0b1517"},{"name":"K-kumkum-ivory","theme":"mint","accent":"#9b1b30","accentLight":"#f28ba0","accentDark":"#761323","bg":"#f8f3ec","bgDark":"#170e11"},{"name":"L-marigold-charcoal","theme":"mint","accent":"#d98a17","accentLight":"#ffb84d","accentDark":"#a8680f","bg":"#fffaf0","bgDark":"#141414"},{"name":"M-mehndi-rose","theme":"mint","accent":"#5c6a1f","accentLight":"#b9c86a","accentDark":"#454f17","bg":"#f8f6ef","bgDark":"#121408"},{"name":"N-classic-black-beige","theme":"mint","accent":"#1c1c1a","accentLight":"#e8e6e1","accentDark":"#000000","bg":"#f3eee3","bgDark":"#111111"},{"name":"O-navy-cream-gold","theme":"mint","accent":"#1f2a5a","accentLight":"#e2b859","accentDark":"#172046","bg":"#faf6ee","bgDark":"#0d1020"}];
  var SAVE = 'http://localhost:3334/switch?name=';
  var MARKER = /Palette:\s*([A-Za-z0-9._-]+)/;
  var STYLE_ID = 'palette-override';
  var preview = null;       // variant being previewed, null = as configured
  var configured = null;    // what docs.json actually says

  function rgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return ((n >> 16) & 255) + ' ' + ((n >> 8) & 255) + ' ' + (n & 255);
  }

  function apply(v) {
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    if (!v) { el.textContent = ''; return; }
    el.textContent = ':root, html, body, .light, .dark {' +
      '--primary:' + rgb(v.accent) + ';' +
      '--primary-light:' + rgb(v.accentLight) + ';' +
      '--primary-dark:' + rgb(v.accentDark) + ';' +
      '--background-light:' + rgb(v.bg) + ';' +
      '--background-dark:' + rgb(v.bgDark) + ';' +
      '}';
  }

  function isDark() { return document.documentElement.classList.contains('dark'); }

  function build() {
    var shown = preview || configured;
    var strip = document.createElement('span');
    strip.className = 'palette-strip';
    strip.style.cssText = 'display:inline-flex;align-items:center;gap:5px;vertical-align:middle;flex-wrap:wrap;';
    var dark = isDark();
    VARIANTS.forEach(function (v) {
      var a = document.createElement('a');
      a.href = '#';
      a.title = v.name + (v.theme !== 'mint' ? ' (theme ' + v.theme + ' — save to see layout)' : '');
      a.setAttribute('data-palette', v.name);
      a.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:5px;border:1px solid rgba(128,128,128,.45);background:' +
        (dark ? v.bgDark : v.bg) + ';cursor:pointer;' +
        (v.name === shown ? 'outline:2px solid currentColor;outline-offset:1px;' : '') +
        (v.theme !== 'mint' ? 'border-style:dashed;' : '');
      var dot = document.createElement('span');
      dot.style.cssText = 'display:block;width:11px;height:11px;border-radius:3px;background:' + (dark ? v.accentLight : v.accent) + ';';
      a.appendChild(dot);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        preview = v.name;
        apply(v);
        render();
      });
      strip.appendChild(a);
    });

    var label = document.createElement('span');
    label.textContent = shown + (preview && preview !== configured ? ' (preview)' : '');
    label.style.cssText = 'margin-left:8px;opacity:.75;font-size:.85em;white-space:nowrap;';
    strip.appendChild(label);

    // "save" writes docs.json through the local switch server, so it is
    // meaningless on the deployed site.
    if (LOCAL && preview && preview !== configured) {
      var save = document.createElement('a');
      save.href = '#';
      save.textContent = 'save';
      save.title = 'Write this variant to docs.json (slow: the dev server rebuilds)';
      save.style.cssText = 'margin-left:8px;font-size:.8em;opacity:.8;text-decoration:underline;cursor:pointer;';
      save.addEventListener('click', function (e) {
        e.preventDefault();
        save.textContent = 'saving...';
        fetch(SAVE + encodeURIComponent(preview), {mode: 'no-cors'}).catch(function () {});
      });
      strip.appendChild(save);

      var rev = document.createElement('a');
      rev.href = '#';
      rev.textContent = 'revert';
      rev.style.cssText = save.style.cssText;
      rev.addEventListener('click', function (e) {
        e.preventDefault();
        preview = null;
        apply(null);
        render();
      });
      strip.appendChild(rev);
    }
    return strip;
  }

  function render() {
    document.querySelectorAll('.palette-strip').forEach(function (s) { s.replaceWith(build()); });
  }

  function mount() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var node, found = [];
    while ((node = walker.nextNode())) {
      var m = node.nodeValue && node.nodeValue.match(MARKER);
      if (m) found.push({host: node.parentElement, name: m[1]});
    }
    if (!found.length) return;
    configured = found[0].name;
    // docs.json caught up with the preview — clear the override so the real
    // config renders, including any theme change.
    if (preview && preview === configured) { preview = null; apply(null); }
    found.forEach(function (f) { if (f.host) { f.host.textContent = ''; f.host.appendChild(build()); } });
    if (preview) { var v = VARIANTS.find(function (x) { return x.name === preview; }); if (v) apply(v); }
  }

  function start() {
    mount();
    new MutationObserver(mount).observe(document.body, {childList: true, subtree: true});
    new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
