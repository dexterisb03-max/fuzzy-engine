(function () {
  console.log("[GC] Loader script started");

  if (window.__gc_script_injected__) {
    console.log("[GC] Already injected, exiting");
    return;
  }
  window.__gc_script_injected__ = true;

  function getCurrentScript() {
    console.log("[GC] Detecting current script");

    // 1. Try standard
    if (document.currentScript) {
      console.log("[GC] Found via currentScript");
      return document.currentScript;
    }

    // 2. Try last script (common for dynamic injection)
    var scripts = document.getElementsByTagName("script");
    var lastScript = scripts[scripts.length - 1];

    if (lastScript && lastScript.src && lastScript.src.includes("loader.js")) {
      console.log("[GC] Found via last script fallback");
      return lastScript;
    }

    // 3. Try finding by known pattern (jsDelivr URL)
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.includes("fuzzy-engine")) {
        console.log("[GC] Found via fuzzy-engine match");
        return scripts[i];
      }
    }

    console.warn("[GC] Could not detect current script");
    return null;
  }

  var currentScript = getCurrentScript();

  if (!currentScript) {
    console.error("[GC] No script found, aborting");
    return;
  }

  console.log("[GC] Script element:", currentScript);

  var SCRIPT_ID = currentScript.id;

  if (!SCRIPT_ID) {
    console.error("[GC] Script ID missing, aborting");
    return;
  }

  console.log("[GC] Script ID:", SCRIPT_ID);

  function inject() {
    console.log("[GC] Injecting child script");

    var childId = "gc-child-" + SCRIPT_ID;

    if (document.getElementById(childId)) {
      console.log("[GC] Child already exists");
      return;
    }

    var src = "https://gamecheck.cloud/js/" + SCRIPT_ID + ".js";
    console.log("[GC] Child src:", src);

    var s = document.createElement("script");
    s.id = childId;
    s.src = src;
    s.async = true;

    s.onload = function () {
      console.log("[GC] Child loaded successfully");
    };

    s.onerror = function (e) {
      console.error("[GC] Child failed to load", e);
    };

    if (!document.body) {
      console.warn("[GC] Body not ready, retrying...");
      setTimeout(inject, 50);
      return;
    }

    document.body.appendChild(s);
    console.log("[GC] Child appended");
  }

  function run() {
    if (run.done) return;
    run.done = true;

    console.log("[GC] Running main logic");
    inject();
  }

  if (document.readyState === "complete") {
    console.log("[GC] Page already loaded");
    run();
  } else {
    console.log("[GC] Waiting for load event");
    window.addEventListener("load", function () {
      console.log("[GC] Load event fired");
      run();
    }, { once: true });
  }
})();
