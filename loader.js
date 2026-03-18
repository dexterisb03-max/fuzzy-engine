(function () {
  // Prevent duplicate execution
  if (window.__gc_script_injected__) return;
  window.__gc_script_injected__ = true;
  console.log('adding new script');
  // Get current script tag
  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  if (!currentScript || !currentScript.id) {
    console.warn("No script ID found");
    return;
  }
console.log('passsed through currentScript scripts')
  var SCRIPT_ID = currentScript.id;
console.log(SCRIPT_ID, 'got the id');
  // Fallback sources
  var SCRIPT_SOURCES = [
    "https://gamecheck.cloud/",
    "https://gamecheck.tech/",
  ];

  function injectWithFallback(index) {
    if (index >= SCRIPT_SOURCES.length) {
      console.warn("All script sources failed");
      return;
    }

    // Prevent duplicate injection
    if (document.getElementById("gc-child-" + SCRIPT_ID)) return;

    var s = document.createElement("script");
    s.id = "gc-child-" + SCRIPT_ID;
    s.src = SCRIPT_SOURCES[index] + SCRIPT_ID + ".js";
    s.async = true;
    
    s.onload = function () {
      console.log('success')
      // success
    };

    s.onerror = function () {
      s.remove();
      console.log('error')
      injectWithFallback(index + 1);
    };

    document.body.appendChild(s);
  }

  function onPageLoaded() {
    if (onPageLoaded.done) return;
    onPageLoaded.done = true;

    injectWithFallback(0);
  }

  if (document.readyState === "complete") {
    onPageLoaded();
  } else {
    window.addEventListener("load", onPageLoaded, { once: true });
  }
})();
