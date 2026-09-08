/**
 * HARMONY — Site behavior
 * Vanilla JS, no build step. Every module guards for the presence of its
 * markup so this single file can be shared across all pages.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     Header: glass-on-scroll + mobile nav
     --------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var isTransparentHero = header.hasAttribute("data-transparent-hero");

    function onScroll() {
      if (!isTransparentHero || window.scrollY > 40) {
        header.classList.add("is-solid");
        header.classList.remove("is-transparent");
      } else {
        header.classList.remove("is-solid");
        header.classList.add("is-transparent");
      }
    }

    if (isTransparentHero) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      header.classList.add("is-solid");
    }

    var toggle = document.querySelector(".nav-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var isOpen = mobileNav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      mobileNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          mobileNav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  }

  /* ---------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el, index) {
      el.style.transitionDelay = prefersReducedMotion
        ? "0ms"
        : Math.min(index % 4, 3) * 90 + "ms";
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Hero media slider
     --------------------------------------------------------- */
  function initMediaSliders() {
    document.querySelectorAll("[data-media-slider]").forEach(function (root) {
      var slides = root.querySelectorAll(".media-slide");
      var dotsWrap = root.querySelector(".media-slider__dots");
      if (!slides.length) return;

      var current = 0;
      var timer = null;
      var interval = parseInt(root.getAttribute("data-interval"), 10) || 4500;

      if (dotsWrap) {
        dotsWrap.innerHTML = "";
        slides.forEach(function (_, i) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
          if (i === 0) dot.classList.add("is-active");
          dot.addEventListener("click", function () {
            goTo(i);
            restart();
          });
          dotsWrap.appendChild(dot);
        });
      }

      function goTo(index) {
        slides[current].classList.remove("is-active");
        if (dotsWrap) dotsWrap.children[current].classList.remove("is-active");
        current = (index + slides.length) % slides.length;
        slides[current].classList.add("is-active");
        if (dotsWrap) dotsWrap.children[current].classList.add("is-active");
      }

      function next() {
        goTo(current + 1);
      }

      function start() {
        if (prefersReducedMotion) return;
        stop();
        timer = setInterval(next, interval);
      }
      function stop() {
        if (timer) clearInterval(timer);
      }
      function restart() {
        stop();
        start();
      }

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);

      // Basic swipe support
      var touchStartX = null;
      root.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.touches[0].clientX;
        },
        { passive: true }
      );
      root.addEventListener(
        "touchend",
        function (e) {
          if (touchStartX === null) return;
          var dx = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(dx) > 40) {
            dx < 0 ? next() : goTo(current - 1);
            restart();
          }
          touchStartX = null;
        },
        { passive: true }
      );

      start();
    });
  }

  /* ---------------------------------------------------------
     3D-style Bite Viewer (CSS 3D placeholder, progressive
     enhancement — swap the markup for a real <canvas> / GLB
     viewer later without touching the rest of the page)
     --------------------------------------------------------- */
  function initByteViewer() {
    document.querySelectorAll(".bite-viewer").forEach(function (viewer) {
      var model = viewer.querySelector(".bite-model");
      if (!model || prefersReducedMotion) return;

      var isDragging = false;
      var rotX = 14;
      var rotY = -18;

      function applyManual(rx, ry) {
        model.style.animation = "none";
        model.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      }

      viewer.addEventListener("pointermove", function (e) {
        var rect = viewer.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        applyManual(14 - py * 20, -18 + px * 40);
      });

      viewer.addEventListener("pointerleave", function () {
        model.style.animation = "";
        model.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var btn = item.querySelector(".faq-question");
      var answer = item.querySelector(".faq-answer");
      if (!btn || !answer) return;

      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".faq-item").forEach(function (other) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Dentist Locator (mock data, client-side only)
     --------------------------------------------------------- */
  function toRad(v) {
    return (v * Math.PI) / 180;
  }
  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function initDentistLocator() {
    var root = document.querySelector("[data-dentist-locator]");
    if (!root || !window.HARMONY_DATA) return;

    var input = root.querySelector("[data-locator-input]");
    var geoBtn = root.querySelector("[data-locator-geo]");
    var searchBtn = root.querySelector("[data-locator-search]");
    var resultsWrap = root.querySelector("[data-locator-results]");
    var dentists = window.HARMONY_DATA.dentists;
    var userCoords = null;

    function initials(name) {
      return name
        .split(" ")
        .map(function (w) {
          return w[0];
        })
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }

    function render(list) {
      resultsWrap.innerHTML = "";
      if (!list.length) {
        resultsWrap.innerHTML =
          '<div class="locator-empty">Nessun professionista trovato per questa ricerca. Prova con un\'altra città o CAP.</div>';
        return;
      }
      list.forEach(function (d) {
        var el = document.createElement("article");
        el.className = "dentist-card";
        el.innerHTML =
          '<div class="avatar">' +
          initials(d.city) +
          '</div><div><h4>' +
          d.name +
          '</h4><div class="meta">' +
          d.professional +
          " &middot; " +
          d.address +
          '</div>' +
          (d.distanceKm !== undefined
            ? '<div class="distance">' + d.distanceKm.toFixed(1) + " km da te</div>"
            : "") +
          '<div class="actions"><a href="tel:' +
          d.phone.replace(/\s+/g, "") +
          '" data-analytics="phone_clicked">Chiama</a><a href="#" data-analytics="dentist_profile_opened">Scopri lo studio</a></div></div>';
        resultsWrap.appendChild(el);
      });
    }

    function search(query) {
      trackEvent("dentist_search", { query: query || "geolocation" });
      var list = dentists.slice();

      if (userCoords) {
        list = list
          .map(function (d) {
            return Object.assign({}, d, {
              distanceKm: haversineKm(userCoords.lat, userCoords.lng, d.lat, d.lng),
            });
          })
          .sort(function (a, b) {
            return a.distanceKm - b.distanceKm;
          });
      } else if (query) {
        var q = query.trim().toLowerCase();
        list = list.filter(function (d) {
          return (
            d.city.toLowerCase().indexOf(q) !== -1 ||
            d.postalCode.indexOf(q) !== -1
          );
        });
      }
      render(list);
    }

    if (searchBtn) {
      searchBtn.addEventListener("click", function () {
        userCoords = null;
        search(input ? input.value : "");
      });
    }
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          userCoords = null;
          search(input.value);
        }
      });
    }
    if (geoBtn) {
      geoBtn.addEventListener("click", function () {
        if (!navigator.geolocation) {
          alert("La geolocalizzazione non è disponibile su questo browser.");
          return;
        }
        geoBtn.disabled = true;
        geoBtn.textContent = "Localizzazione…";
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            userCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            geoBtn.disabled = false;
            geoBtn.textContent = "Usa la mia posizione";
            search();
          },
          function () {
            geoBtn.disabled = false;
            geoBtn.textContent = "Usa la mia posizione";
            alert("Non è stato possibile ottenere la posizione. Prova a cercare per città o CAP.");
          }
        );
      });
    }

    render(dentists);
  }

  /* ---------------------------------------------------------
     Forms (client-side validation, mock submit — no backend)
     --------------------------------------------------------- */
  function validateField(field) {
    var input = field.querySelector("input, textarea, select");
    if (!input) return true;
    var valid = input.checkValidity();
    field.classList.toggle("has-error", !valid);
    return valid;
  }

  function initForm(formSelector, successMessage) {
    var form = document.querySelector(formSelector);
    if (!form) return;

    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll(".field");
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      status.classList.remove("is-success", "is-error");

      if (!allValid) {
        status.textContent =
          "Controlla i campi evidenziati e riprova.";
        status.classList.add("is-error");
        return;
      }

      trackEvent(form.getAttribute("data-analytics-submit") || "form_submitted");

      submitBtn.disabled = true;
      submitBtn.textContent = "Invio in corso…";

      // Mock async submission — no backend wired up yet.
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.getAttribute("data-default-label");
        status.textContent = successMessage;
        status.classList.add("is-success");
        form.reset();
      }, 700);
    });

    form.querySelectorAll(".field input, .field textarea, .field select").forEach(
      function (input) {
        input.addEventListener("blur", function () {
          validateField(input.closest(".field"));
        });
      }
    );

    if (submitBtn) {
      submitBtn.setAttribute("data-default-label", submitBtn.textContent);
    }
  }

  /* ---------------------------------------------------------
     Cookie consent banner
     --------------------------------------------------------- */
  function initConsent() {
    var banner = document.querySelector("[data-consent-banner]");
    if (!banner) return;

    var STORAGE_KEY = "harmony_consent";
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch (e) {
      /* localStorage unavailable */
    }

    setTimeout(function () {
      banner.classList.add("is-visible");
    }, 600);

    function setConsent(value) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch (e) {
        /* ignore */
      }
      banner.classList.remove("is-visible");
    }

    var acceptBtn = banner.querySelector("[data-consent-accept]");
    var rejectBtn = banner.querySelector("[data-consent-reject]");
    if (acceptBtn)
      acceptBtn.addEventListener("click", function () {
        setConsent({ necessary: true, analytics: true, marketing: true });
      });
    if (rejectBtn)
      rejectBtn.addEventListener("click", function () {
        setConsent({ necessary: true, analytics: false, marketing: false });
      });
  }

  /* ---------------------------------------------------------
     Analytics abstraction (no vendor wired up yet)
     --------------------------------------------------------- */
  function trackEvent(name, payload) {
    window.HARMONY_ANALYTICS_QUEUE = window.HARMONY_ANALYTICS_QUEUE || [];
    window.HARMONY_ANALYTICS_QUEUE.push({ name: name, payload: payload || {}, ts: Date.now() });
    if (window.location.hostname === "localhost" || window.location.hash === "#debug") {
      console.log("[analytics]", name, payload || {});
    }
  }
  window.harmonyTrackEvent = trackEvent;

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-analytics]");
    if (el) trackEvent(el.getAttribute("data-analytics"));
  });

  /* ---------------------------------------------------------
     Set active nav link based on current path
     --------------------------------------------------------- */
  function initActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".main-nav a, .mobile-nav a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initReveal();
    initMediaSliders();
    initByteViewer();
    initFaq();
    initDentistLocator();
    initForm('[data-form="patient"]', "Richiesta ricevuta. Un professionista HARMONY ti contatterà a breve.");
    initForm('[data-form="partner"]', "Richiesta ricevuta. Il team HARMONY ti risponderà a breve.");
    initConsent();
    initActiveNav();
  });
})();
