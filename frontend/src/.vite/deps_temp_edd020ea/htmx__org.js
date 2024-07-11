var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// ../node_modules/htmx.org/dist/htmx.min.js
var require_htmx_min = __commonJS({
  "../node_modules/htmx.org/dist/htmx.min.js"(exports, module) {
    (function(e2, t2) {
      if (typeof define === "function" && define.amd) {
        define([], t2);
      } else if (typeof module === "object" && module.exports) {
        module.exports = t2();
      } else {
        e2.htmx = e2.htmx || t2();
      }
    })(typeof self !== "undefined" ? self : exports, function() {
      return function() {
        "use strict";
        var Q = { onLoad: F, process: zt, on: de, off: ge, trigger: ce, ajax: Nr, find: C, findAll: f, closest: v, values: function(e2, t2) {
          var r2 = dr(e2, t2 || "post");
          return r2.values;
        }, remove: _, addClass: z, removeClass: n, toggleClass: $, takeClass: W, defineExtension: Ur, removeExtension: Br, logAll: V, logNone: j, logger: null, config: { historyEnabled: true, historyCacheSize: 10, refreshOnHistoryMiss: false, defaultSwapStyle: "innerHTML", defaultSwapDelay: 0, defaultSettleDelay: 20, includeIndicatorStyles: true, indicatorClass: "htmx-indicator", requestClass: "htmx-request", addedClass: "htmx-added", settlingClass: "htmx-settling", swappingClass: "htmx-swapping", allowEval: true, allowScriptTags: true, inlineScriptNonce: "", attributesToSettle: ["class", "style", "width", "height"], withCredentials: false, timeout: 0, wsReconnectDelay: "full-jitter", wsBinaryType: "blob", disableSelector: "[hx-disable], [data-hx-disable]", useTemplateFragments: false, scrollBehavior: "smooth", defaultFocusScroll: false, getCacheBusterParam: false, globalViewTransitions: false, methodsThatUseUrlParams: ["get"], selfRequestsOnly: false, ignoreTitle: false, scrollIntoViewOnBoost: true, triggerSpecsCache: null }, parseInterval: d, _: t, createEventSource: function(e2) {
          return new EventSource(e2, { withCredentials: true });
        }, createWebSocket: function(e2) {
          var t2 = new WebSocket(e2, []);
          t2.binaryType = Q.config.wsBinaryType;
          return t2;
        }, version: "1.9.12" };
        var r = { addTriggerHandler: Lt, bodyContains: se, canAccessLocalStorage: U, findThisElement: xe, filterValues: yr, hasAttribute: o, getAttributeValue: te, getClosestAttributeValue: ne, getClosestMatch: c, getExpressionVars: Hr, getHeaders: xr, getInputValues: dr, getInternalData: ae, getSwapSpecification: wr, getTriggerSpecs: it, getTarget: ye, makeFragment: l, mergeObjects: le, makeSettleInfo: T, oobSwap: Ee, querySelectorExt: ue, selectAndSwap: je, settleImmediately: nr, shouldCancel: ut, triggerEvent: ce, triggerErrorEvent: fe, withExtensions: R };
        var w = ["get", "post", "put", "delete", "patch"];
        var i = w.map(function(e2) {
          return "[hx-" + e2 + "], [data-hx-" + e2 + "]";
        }).join(", ");
        var S = e("head"), q = e("title"), H = e("svg", true);
        function e(e2, t2) {
          return new RegExp("<" + e2 + "(\\s[^>]*>|>)([\\s\\S]*?)<\\/" + e2 + ">", !!t2 ? "gim" : "im");
        }
        function d(e2) {
          if (e2 == void 0) {
            return void 0;
          }
          let t2 = NaN;
          if (e2.slice(-2) == "ms") {
            t2 = parseFloat(e2.slice(0, -2));
          } else if (e2.slice(-1) == "s") {
            t2 = parseFloat(e2.slice(0, -1)) * 1e3;
          } else if (e2.slice(-1) == "m") {
            t2 = parseFloat(e2.slice(0, -1)) * 1e3 * 60;
          } else {
            t2 = parseFloat(e2);
          }
          return isNaN(t2) ? void 0 : t2;
        }
        function ee(e2, t2) {
          return e2.getAttribute && e2.getAttribute(t2);
        }
        function o(e2, t2) {
          return e2.hasAttribute && (e2.hasAttribute(t2) || e2.hasAttribute("data-" + t2));
        }
        function te(e2, t2) {
          return ee(e2, t2) || ee(e2, "data-" + t2);
        }
        function u(e2) {
          return e2.parentElement;
        }
        function re() {
          return document;
        }
        function c(e2, t2) {
          while (e2 && !t2(e2)) {
            e2 = u(e2);
          }
          return e2 ? e2 : null;
        }
        function L(e2, t2, r2) {
          var n2 = te(t2, r2);
          var i2 = te(t2, "hx-disinherit");
          if (e2 !== t2 && i2 && (i2 === "*" || i2.split(" ").indexOf(r2) >= 0)) {
            return "unset";
          } else {
            return n2;
          }
        }
        function ne(t2, r2) {
          var n2 = null;
          c(t2, function(e2) {
            return n2 = L(t2, e2, r2);
          });
          if (n2 !== "unset") {
            return n2;
          }
        }
        function h(e2, t2) {
          var r2 = e2.matches || e2.matchesSelector || e2.msMatchesSelector || e2.mozMatchesSelector || e2.webkitMatchesSelector || e2.oMatchesSelector;
          return r2 && r2.call(e2, t2);
        }
        function A(e2) {
          var t2 = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
          var r2 = t2.exec(e2);
          if (r2) {
            return r2[1].toLowerCase();
          } else {
            return "";
          }
        }
        function s(e2, t2) {
          var r2 = new DOMParser();
          var n2 = r2.parseFromString(e2, "text/html");
          var i2 = n2.body;
          while (t2 > 0) {
            t2--;
            i2 = i2.firstChild;
          }
          if (i2 == null) {
            i2 = re().createDocumentFragment();
          }
          return i2;
        }
        function N(e2) {
          return /<body/.test(e2);
        }
        function l(e2) {
          var t2 = !N(e2);
          var r2 = A(e2);
          var n2 = e2;
          if (r2 === "head") {
            n2 = n2.replace(S, "");
          }
          if (Q.config.useTemplateFragments && t2) {
            var i2 = s("<body><template>" + n2 + "</template></body>", 0);
            var a2 = i2.querySelector("template").content;
            if (Q.config.allowScriptTags) {
              oe(a2.querySelectorAll("script"), function(e3) {
                if (Q.config.inlineScriptNonce) {
                  e3.nonce = Q.config.inlineScriptNonce;
                }
                e3.htmxExecuted = navigator.userAgent.indexOf("Firefox") === -1;
              });
            } else {
              oe(a2.querySelectorAll("script"), function(e3) {
                _(e3);
              });
            }
            return a2;
          }
          switch (r2) {
            case "thead":
            case "tbody":
            case "tfoot":
            case "colgroup":
            case "caption":
              return s("<table>" + n2 + "</table>", 1);
            case "col":
              return s("<table><colgroup>" + n2 + "</colgroup></table>", 2);
            case "tr":
              return s("<table><tbody>" + n2 + "</tbody></table>", 2);
            case "td":
            case "th":
              return s("<table><tbody><tr>" + n2 + "</tr></tbody></table>", 3);
            case "script":
            case "style":
              return s("<div>" + n2 + "</div>", 1);
            default:
              return s(n2, 0);
          }
        }
        function ie(e2) {
          if (e2) {
            e2();
          }
        }
        function I(e2, t2) {
          return Object.prototype.toString.call(e2) === "[object " + t2 + "]";
        }
        function k(e2) {
          return I(e2, "Function");
        }
        function P(e2) {
          return I(e2, "Object");
        }
        function ae(e2) {
          var t2 = "htmx-internal-data";
          var r2 = e2[t2];
          if (!r2) {
            r2 = e2[t2] = {};
          }
          return r2;
        }
        function M(e2) {
          var t2 = [];
          if (e2) {
            for (var r2 = 0; r2 < e2.length; r2++) {
              t2.push(e2[r2]);
            }
          }
          return t2;
        }
        function oe(e2, t2) {
          if (e2) {
            for (var r2 = 0; r2 < e2.length; r2++) {
              t2(e2[r2]);
            }
          }
        }
        function X(e2) {
          var t2 = e2.getBoundingClientRect();
          var r2 = t2.top;
          var n2 = t2.bottom;
          return r2 < window.innerHeight && n2 >= 0;
        }
        function se(e2) {
          if (e2.getRootNode && e2.getRootNode() instanceof window.ShadowRoot) {
            return re().body.contains(e2.getRootNode().host);
          } else {
            return re().body.contains(e2);
          }
        }
        function D(e2) {
          return e2.trim().split(/\s+/);
        }
        function le(e2, t2) {
          for (var r2 in t2) {
            if (t2.hasOwnProperty(r2)) {
              e2[r2] = t2[r2];
            }
          }
          return e2;
        }
        function E(e2) {
          try {
            return JSON.parse(e2);
          } catch (e3) {
            b(e3);
            return null;
          }
        }
        function U() {
          var e2 = "htmx:localStorageTest";
          try {
            localStorage.setItem(e2, e2);
            localStorage.removeItem(e2);
            return true;
          } catch (e3) {
            return false;
          }
        }
        function B(t2) {
          try {
            var e2 = new URL(t2);
            if (e2) {
              t2 = e2.pathname + e2.search;
            }
            if (!/^\/$/.test(t2)) {
              t2 = t2.replace(/\/+$/, "");
            }
            return t2;
          } catch (e3) {
            return t2;
          }
        }
        function t(e) {
          return Tr(re().body, function() {
            return eval(e);
          });
        }
        function F(t2) {
          var e2 = Q.on("htmx:load", function(e3) {
            t2(e3.detail.elt);
          });
          return e2;
        }
        function V() {
          Q.logger = function(e2, t2, r2) {
            if (console) {
              console.log(t2, e2, r2);
            }
          };
        }
        function j() {
          Q.logger = null;
        }
        function C(e2, t2) {
          if (t2) {
            return e2.querySelector(t2);
          } else {
            return C(re(), e2);
          }
        }
        function f(e2, t2) {
          if (t2) {
            return e2.querySelectorAll(t2);
          } else {
            return f(re(), e2);
          }
        }
        function _(e2, t2) {
          e2 = p(e2);
          if (t2) {
            setTimeout(function() {
              _(e2);
              e2 = null;
            }, t2);
          } else {
            e2.parentElement.removeChild(e2);
          }
        }
        function z(e2, t2, r2) {
          e2 = p(e2);
          if (r2) {
            setTimeout(function() {
              z(e2, t2);
              e2 = null;
            }, r2);
          } else {
            e2.classList && e2.classList.add(t2);
          }
        }
        function n(e2, t2, r2) {
          e2 = p(e2);
          if (r2) {
            setTimeout(function() {
              n(e2, t2);
              e2 = null;
            }, r2);
          } else {
            if (e2.classList) {
              e2.classList.remove(t2);
              if (e2.classList.length === 0) {
                e2.removeAttribute("class");
              }
            }
          }
        }
        function $(e2, t2) {
          e2 = p(e2);
          e2.classList.toggle(t2);
        }
        function W(e2, t2) {
          e2 = p(e2);
          oe(e2.parentElement.children, function(e3) {
            n(e3, t2);
          });
          z(e2, t2);
        }
        function v(e2, t2) {
          e2 = p(e2);
          if (e2.closest) {
            return e2.closest(t2);
          } else {
            do {
              if (e2 == null || h(e2, t2)) {
                return e2;
              }
            } while (e2 = e2 && u(e2));
            return null;
          }
        }
        function g(e2, t2) {
          return e2.substring(0, t2.length) === t2;
        }
        function G(e2, t2) {
          return e2.substring(e2.length - t2.length) === t2;
        }
        function J(e2) {
          var t2 = e2.trim();
          if (g(t2, "<") && G(t2, "/>")) {
            return t2.substring(1, t2.length - 2);
          } else {
            return t2;
          }
        }
        function Z(e2, t2) {
          if (t2.indexOf("closest ") === 0) {
            return [v(e2, J(t2.substr(8)))];
          } else if (t2.indexOf("find ") === 0) {
            return [C(e2, J(t2.substr(5)))];
          } else if (t2 === "next") {
            return [e2.nextElementSibling];
          } else if (t2.indexOf("next ") === 0) {
            return [K(e2, J(t2.substr(5)))];
          } else if (t2 === "previous") {
            return [e2.previousElementSibling];
          } else if (t2.indexOf("previous ") === 0) {
            return [Y(e2, J(t2.substr(9)))];
          } else if (t2 === "document") {
            return [document];
          } else if (t2 === "window") {
            return [window];
          } else if (t2 === "body") {
            return [document.body];
          } else {
            return re().querySelectorAll(J(t2));
          }
        }
        var K = function(e2, t2) {
          var r2 = re().querySelectorAll(t2);
          for (var n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2];
            if (i2.compareDocumentPosition(e2) === Node.DOCUMENT_POSITION_PRECEDING) {
              return i2;
            }
          }
        };
        var Y = function(e2, t2) {
          var r2 = re().querySelectorAll(t2);
          for (var n2 = r2.length - 1; n2 >= 0; n2--) {
            var i2 = r2[n2];
            if (i2.compareDocumentPosition(e2) === Node.DOCUMENT_POSITION_FOLLOWING) {
              return i2;
            }
          }
        };
        function ue(e2, t2) {
          if (t2) {
            return Z(e2, t2)[0];
          } else {
            return Z(re().body, e2)[0];
          }
        }
        function p(e2) {
          if (I(e2, "String")) {
            return C(e2);
          } else {
            return e2;
          }
        }
        function ve(e2, t2, r2) {
          if (k(t2)) {
            return { target: re().body, event: e2, listener: t2 };
          } else {
            return { target: p(e2), event: t2, listener: r2 };
          }
        }
        function de(t2, r2, n2) {
          jr(function() {
            var e3 = ve(t2, r2, n2);
            e3.target.addEventListener(e3.event, e3.listener);
          });
          var e2 = k(r2);
          return e2 ? r2 : n2;
        }
        function ge(t2, r2, n2) {
          jr(function() {
            var e2 = ve(t2, r2, n2);
            e2.target.removeEventListener(e2.event, e2.listener);
          });
          return k(r2) ? r2 : n2;
        }
        var pe = re().createElement("output");
        function me(e2, t2) {
          var r2 = ne(e2, t2);
          if (r2) {
            if (r2 === "this") {
              return [xe(e2, t2)];
            } else {
              var n2 = Z(e2, r2);
              if (n2.length === 0) {
                b('The selector "' + r2 + '" on ' + t2 + " returned no matches!");
                return [pe];
              } else {
                return n2;
              }
            }
          }
        }
        function xe(e2, t2) {
          return c(e2, function(e3) {
            return te(e3, t2) != null;
          });
        }
        function ye(e2) {
          var t2 = ne(e2, "hx-target");
          if (t2) {
            if (t2 === "this") {
              return xe(e2, "hx-target");
            } else {
              return ue(e2, t2);
            }
          } else {
            var r2 = ae(e2);
            if (r2.boosted) {
              return re().body;
            } else {
              return e2;
            }
          }
        }
        function be(e2) {
          var t2 = Q.config.attributesToSettle;
          for (var r2 = 0; r2 < t2.length; r2++) {
            if (e2 === t2[r2]) {
              return true;
            }
          }
          return false;
        }
        function we(t2, r2) {
          oe(t2.attributes, function(e2) {
            if (!r2.hasAttribute(e2.name) && be(e2.name)) {
              t2.removeAttribute(e2.name);
            }
          });
          oe(r2.attributes, function(e2) {
            if (be(e2.name)) {
              t2.setAttribute(e2.name, e2.value);
            }
          });
        }
        function Se(e2, t2) {
          var r2 = Fr(t2);
          for (var n2 = 0; n2 < r2.length; n2++) {
            var i2 = r2[n2];
            try {
              if (i2.isInlineSwap(e2)) {
                return true;
              }
            } catch (e3) {
              b(e3);
            }
          }
          return e2 === "outerHTML";
        }
        function Ee(e2, i2, a2) {
          var t2 = "#" + ee(i2, "id");
          var o2 = "outerHTML";
          if (e2 === "true") {
          } else if (e2.indexOf(":") > 0) {
            o2 = e2.substr(0, e2.indexOf(":"));
            t2 = e2.substr(e2.indexOf(":") + 1, e2.length);
          } else {
            o2 = e2;
          }
          var r2 = re().querySelectorAll(t2);
          if (r2) {
            oe(r2, function(e3) {
              var t3;
              var r3 = i2.cloneNode(true);
              t3 = re().createDocumentFragment();
              t3.appendChild(r3);
              if (!Se(o2, e3)) {
                t3 = r3;
              }
              var n2 = { shouldSwap: true, target: e3, fragment: t3 };
              if (!ce(e3, "htmx:oobBeforeSwap", n2)) return;
              e3 = n2.target;
              if (n2["shouldSwap"]) {
                Fe(o2, e3, e3, t3, a2);
              }
              oe(a2.elts, function(e4) {
                ce(e4, "htmx:oobAfterSwap", n2);
              });
            });
            i2.parentNode.removeChild(i2);
          } else {
            i2.parentNode.removeChild(i2);
            fe(re().body, "htmx:oobErrorNoTarget", { content: i2 });
          }
          return e2;
        }
        function Ce(e2, t2, r2) {
          var n2 = ne(e2, "hx-select-oob");
          if (n2) {
            var i2 = n2.split(",");
            for (var a2 = 0; a2 < i2.length; a2++) {
              var o2 = i2[a2].split(":", 2);
              var s2 = o2[0].trim();
              if (s2.indexOf("#") === 0) {
                s2 = s2.substring(1);
              }
              var l2 = o2[1] || "true";
              var u2 = t2.querySelector("#" + s2);
              if (u2) {
                Ee(l2, u2, r2);
              }
            }
          }
          oe(f(t2, "[hx-swap-oob], [data-hx-swap-oob]"), function(e3) {
            var t3 = te(e3, "hx-swap-oob");
            if (t3 != null) {
              Ee(t3, e3, r2);
            }
          });
        }
        function Re(e2) {
          oe(f(e2, "[hx-preserve], [data-hx-preserve]"), function(e3) {
            var t2 = te(e3, "id");
            var r2 = re().getElementById(t2);
            if (r2 != null) {
              e3.parentNode.replaceChild(r2, e3);
            }
          });
        }
        function Te(o2, e2, s2) {
          oe(e2.querySelectorAll("[id]"), function(e3) {
            var t2 = ee(e3, "id");
            if (t2 && t2.length > 0) {
              var r2 = t2.replace("'", "\\'");
              var n2 = e3.tagName.replace(":", "\\:");
              var i2 = o2.querySelector(n2 + "[id='" + r2 + "']");
              if (i2 && i2 !== o2) {
                var a2 = e3.cloneNode();
                we(e3, i2);
                s2.tasks.push(function() {
                  we(e3, a2);
                });
              }
            }
          });
        }
        function Oe(e2) {
          return function() {
            n(e2, Q.config.addedClass);
            zt(e2);
            Nt(e2);
            qe(e2);
            ce(e2, "htmx:load");
          };
        }
        function qe(e2) {
          var t2 = "[autofocus]";
          var r2 = h(e2, t2) ? e2 : e2.querySelector(t2);
          if (r2 != null) {
            r2.focus();
          }
        }
        function a(e2, t2, r2, n2) {
          Te(e2, r2, n2);
          while (r2.childNodes.length > 0) {
            var i2 = r2.firstChild;
            z(i2, Q.config.addedClass);
            e2.insertBefore(i2, t2);
            if (i2.nodeType !== Node.TEXT_NODE && i2.nodeType !== Node.COMMENT_NODE) {
              n2.tasks.push(Oe(i2));
            }
          }
        }
        function He(e2, t2) {
          var r2 = 0;
          while (r2 < e2.length) {
            t2 = (t2 << 5) - t2 + e2.charCodeAt(r2++) | 0;
          }
          return t2;
        }
        function Le(e2) {
          var t2 = 0;
          if (e2.attributes) {
            for (var r2 = 0; r2 < e2.attributes.length; r2++) {
              var n2 = e2.attributes[r2];
              if (n2.value) {
                t2 = He(n2.name, t2);
                t2 = He(n2.value, t2);
              }
            }
          }
          return t2;
        }
        function Ae(e2) {
          var t2 = ae(e2);
          if (t2.onHandlers) {
            for (var r2 = 0; r2 < t2.onHandlers.length; r2++) {
              const n2 = t2.onHandlers[r2];
              e2.removeEventListener(n2.event, n2.listener);
            }
            delete t2.onHandlers;
          }
        }
        function Ne(e2) {
          var t2 = ae(e2);
          if (t2.timeout) {
            clearTimeout(t2.timeout);
          }
          if (t2.webSocket) {
            t2.webSocket.close();
          }
          if (t2.sseEventSource) {
            t2.sseEventSource.close();
          }
          if (t2.listenerInfos) {
            oe(t2.listenerInfos, function(e3) {
              if (e3.on) {
                e3.on.removeEventListener(e3.trigger, e3.listener);
              }
            });
          }
          Ae(e2);
          oe(Object.keys(t2), function(e3) {
            delete t2[e3];
          });
        }
        function m(e2) {
          ce(e2, "htmx:beforeCleanupElement");
          Ne(e2);
          if (e2.children) {
            oe(e2.children, function(e3) {
              m(e3);
            });
          }
        }
        function Ie(t2, e2, r2) {
          if (t2.tagName === "BODY") {
            return Ue(t2, e2, r2);
          } else {
            var n2;
            var i2 = t2.previousSibling;
            a(u(t2), t2, e2, r2);
            if (i2 == null) {
              n2 = u(t2).firstChild;
            } else {
              n2 = i2.nextSibling;
            }
            r2.elts = r2.elts.filter(function(e3) {
              return e3 != t2;
            });
            while (n2 && n2 !== t2) {
              if (n2.nodeType === Node.ELEMENT_NODE) {
                r2.elts.push(n2);
              }
              n2 = n2.nextElementSibling;
            }
            m(t2);
            u(t2).removeChild(t2);
          }
        }
        function ke(e2, t2, r2) {
          return a(e2, e2.firstChild, t2, r2);
        }
        function Pe(e2, t2, r2) {
          return a(u(e2), e2, t2, r2);
        }
        function Me(e2, t2, r2) {
          return a(e2, null, t2, r2);
        }
        function Xe(e2, t2, r2) {
          return a(u(e2), e2.nextSibling, t2, r2);
        }
        function De(e2, t2, r2) {
          m(e2);
          return u(e2).removeChild(e2);
        }
        function Ue(e2, t2, r2) {
          var n2 = e2.firstChild;
          a(e2, n2, t2, r2);
          if (n2) {
            while (n2.nextSibling) {
              m(n2.nextSibling);
              e2.removeChild(n2.nextSibling);
            }
            m(n2);
            e2.removeChild(n2);
          }
        }
        function Be(e2, t2, r2) {
          var n2 = r2 || ne(e2, "hx-select");
          if (n2) {
            var i2 = re().createDocumentFragment();
            oe(t2.querySelectorAll(n2), function(e3) {
              i2.appendChild(e3);
            });
            t2 = i2;
          }
          return t2;
        }
        function Fe(e2, t2, r2, n2, i2) {
          switch (e2) {
            case "none":
              return;
            case "outerHTML":
              Ie(r2, n2, i2);
              return;
            case "afterbegin":
              ke(r2, n2, i2);
              return;
            case "beforebegin":
              Pe(r2, n2, i2);
              return;
            case "beforeend":
              Me(r2, n2, i2);
              return;
            case "afterend":
              Xe(r2, n2, i2);
              return;
            case "delete":
              De(r2, n2, i2);
              return;
            default:
              var a2 = Fr(t2);
              for (var o2 = 0; o2 < a2.length; o2++) {
                var s2 = a2[o2];
                try {
                  var l2 = s2.handleSwap(e2, r2, n2, i2);
                  if (l2) {
                    if (typeof l2.length !== "undefined") {
                      for (var u2 = 0; u2 < l2.length; u2++) {
                        var f2 = l2[u2];
                        if (f2.nodeType !== Node.TEXT_NODE && f2.nodeType !== Node.COMMENT_NODE) {
                          i2.tasks.push(Oe(f2));
                        }
                      }
                    }
                    return;
                  }
                } catch (e3) {
                  b(e3);
                }
              }
              if (e2 === "innerHTML") {
                Ue(r2, n2, i2);
              } else {
                Fe(Q.config.defaultSwapStyle, t2, r2, n2, i2);
              }
          }
        }
        function Ve(e2) {
          if (e2.indexOf("<title") > -1) {
            var t2 = e2.replace(H, "");
            var r2 = t2.match(q);
            if (r2) {
              return r2[2];
            }
          }
        }
        function je(e2, t2, r2, n2, i2, a2) {
          i2.title = Ve(n2);
          var o2 = l(n2);
          if (o2) {
            Ce(r2, o2, i2);
            o2 = Be(r2, o2, a2);
            Re(o2);
            return Fe(e2, r2, t2, o2, i2);
          }
        }
        function _e(e2, t2, r2) {
          var n2 = e2.getResponseHeader(t2);
          if (n2.indexOf("{") === 0) {
            var i2 = E(n2);
            for (var a2 in i2) {
              if (i2.hasOwnProperty(a2)) {
                var o2 = i2[a2];
                if (!P(o2)) {
                  o2 = { value: o2 };
                }
                ce(r2, a2, o2);
              }
            }
          } else {
            var s2 = n2.split(",");
            for (var l2 = 0; l2 < s2.length; l2++) {
              ce(r2, s2[l2].trim(), []);
            }
          }
        }
        var ze = /\s/;
        var x = /[\s,]/;
        var $e = /[_$a-zA-Z]/;
        var We = /[_$a-zA-Z0-9]/;
        var Ge = ['"', "'", "/"];
        var Je = /[^\s]/;
        var Ze = /[{(]/;
        var Ke = /[})]/;
        function Ye(e2) {
          var t2 = [];
          var r2 = 0;
          while (r2 < e2.length) {
            if ($e.exec(e2.charAt(r2))) {
              var n2 = r2;
              while (We.exec(e2.charAt(r2 + 1))) {
                r2++;
              }
              t2.push(e2.substr(n2, r2 - n2 + 1));
            } else if (Ge.indexOf(e2.charAt(r2)) !== -1) {
              var i2 = e2.charAt(r2);
              var n2 = r2;
              r2++;
              while (r2 < e2.length && e2.charAt(r2) !== i2) {
                if (e2.charAt(r2) === "\\") {
                  r2++;
                }
                r2++;
              }
              t2.push(e2.substr(n2, r2 - n2 + 1));
            } else {
              var a2 = e2.charAt(r2);
              t2.push(a2);
            }
            r2++;
          }
          return t2;
        }
        function Qe(e2, t2, r2) {
          return $e.exec(e2.charAt(0)) && e2 !== "true" && e2 !== "false" && e2 !== "this" && e2 !== r2 && t2 !== ".";
        }
        function et(e2, t2, r2) {
          if (t2[0] === "[") {
            t2.shift();
            var n2 = 1;
            var i2 = " return (function(" + r2 + "){ return (";
            var a2 = null;
            while (t2.length > 0) {
              var o2 = t2[0];
              if (o2 === "]") {
                n2--;
                if (n2 === 0) {
                  if (a2 === null) {
                    i2 = i2 + "true";
                  }
                  t2.shift();
                  i2 += ")})";
                  try {
                    var s2 = Tr(e2, function() {
                      return Function(i2)();
                    }, function() {
                      return true;
                    });
                    s2.source = i2;
                    return s2;
                  } catch (e3) {
                    fe(re().body, "htmx:syntax:error", { error: e3, source: i2 });
                    return null;
                  }
                }
              } else if (o2 === "[") {
                n2++;
              }
              if (Qe(o2, a2, r2)) {
                i2 += "((" + r2 + "." + o2 + ") ? (" + r2 + "." + o2 + ") : (window." + o2 + "))";
              } else {
                i2 = i2 + o2;
              }
              a2 = t2.shift();
            }
          }
        }
        function y(e2, t2) {
          var r2 = "";
          while (e2.length > 0 && !t2.test(e2[0])) {
            r2 += e2.shift();
          }
          return r2;
        }
        function tt(e2) {
          var t2;
          if (e2.length > 0 && Ze.test(e2[0])) {
            e2.shift();
            t2 = y(e2, Ke).trim();
            e2.shift();
          } else {
            t2 = y(e2, x);
          }
          return t2;
        }
        var rt = "input, textarea, select";
        function nt(e2, t2, r2) {
          var n2 = [];
          var i2 = Ye(t2);
          do {
            y(i2, Je);
            var a2 = i2.length;
            var o2 = y(i2, /[,\[\s]/);
            if (o2 !== "") {
              if (o2 === "every") {
                var s2 = { trigger: "every" };
                y(i2, Je);
                s2.pollInterval = d(y(i2, /[,\[\s]/));
                y(i2, Je);
                var l2 = et(e2, i2, "event");
                if (l2) {
                  s2.eventFilter = l2;
                }
                n2.push(s2);
              } else if (o2.indexOf("sse:") === 0) {
                n2.push({ trigger: "sse", sseEvent: o2.substr(4) });
              } else {
                var u2 = { trigger: o2 };
                var l2 = et(e2, i2, "event");
                if (l2) {
                  u2.eventFilter = l2;
                }
                while (i2.length > 0 && i2[0] !== ",") {
                  y(i2, Je);
                  var f2 = i2.shift();
                  if (f2 === "changed") {
                    u2.changed = true;
                  } else if (f2 === "once") {
                    u2.once = true;
                  } else if (f2 === "consume") {
                    u2.consume = true;
                  } else if (f2 === "delay" && i2[0] === ":") {
                    i2.shift();
                    u2.delay = d(y(i2, x));
                  } else if (f2 === "from" && i2[0] === ":") {
                    i2.shift();
                    if (Ze.test(i2[0])) {
                      var c2 = tt(i2);
                    } else {
                      var c2 = y(i2, x);
                      if (c2 === "closest" || c2 === "find" || c2 === "next" || c2 === "previous") {
                        i2.shift();
                        var h2 = tt(i2);
                        if (h2.length > 0) {
                          c2 += " " + h2;
                        }
                      }
                    }
                    u2.from = c2;
                  } else if (f2 === "target" && i2[0] === ":") {
                    i2.shift();
                    u2.target = tt(i2);
                  } else if (f2 === "throttle" && i2[0] === ":") {
                    i2.shift();
                    u2.throttle = d(y(i2, x));
                  } else if (f2 === "queue" && i2[0] === ":") {
                    i2.shift();
                    u2.queue = y(i2, x);
                  } else if (f2 === "root" && i2[0] === ":") {
                    i2.shift();
                    u2[f2] = tt(i2);
                  } else if (f2 === "threshold" && i2[0] === ":") {
                    i2.shift();
                    u2[f2] = y(i2, x);
                  } else {
                    fe(e2, "htmx:syntax:error", { token: i2.shift() });
                  }
                }
                n2.push(u2);
              }
            }
            if (i2.length === a2) {
              fe(e2, "htmx:syntax:error", { token: i2.shift() });
            }
            y(i2, Je);
          } while (i2[0] === "," && i2.shift());
          if (r2) {
            r2[t2] = n2;
          }
          return n2;
        }
        function it(e2) {
          var t2 = te(e2, "hx-trigger");
          var r2 = [];
          if (t2) {
            var n2 = Q.config.triggerSpecsCache;
            r2 = n2 && n2[t2] || nt(e2, t2, n2);
          }
          if (r2.length > 0) {
            return r2;
          } else if (h(e2, "form")) {
            return [{ trigger: "submit" }];
          } else if (h(e2, 'input[type="button"], input[type="submit"]')) {
            return [{ trigger: "click" }];
          } else if (h(e2, rt)) {
            return [{ trigger: "change" }];
          } else {
            return [{ trigger: "click" }];
          }
        }
        function at(e2) {
          ae(e2).cancelled = true;
        }
        function ot(e2, t2, r2) {
          var n2 = ae(e2);
          n2.timeout = setTimeout(function() {
            if (se(e2) && n2.cancelled !== true) {
              if (!ct(r2, e2, Wt("hx:poll:trigger", { triggerSpec: r2, target: e2 }))) {
                t2(e2);
              }
              ot(e2, t2, r2);
            }
          }, r2.pollInterval);
        }
        function st(e2) {
          return location.hostname === e2.hostname && ee(e2, "href") && ee(e2, "href").indexOf("#") !== 0;
        }
        function lt(t2, r2, e2) {
          if (t2.tagName === "A" && st(t2) && (t2.target === "" || t2.target === "_self") || t2.tagName === "FORM") {
            r2.boosted = true;
            var n2, i2;
            if (t2.tagName === "A") {
              n2 = "get";
              i2 = ee(t2, "href");
            } else {
              var a2 = ee(t2, "method");
              n2 = a2 ? a2.toLowerCase() : "get";
              if (n2 === "get") {
              }
              i2 = ee(t2, "action");
            }
            e2.forEach(function(e3) {
              ht(t2, function(e4, t3) {
                if (v(e4, Q.config.disableSelector)) {
                  m(e4);
                  return;
                }
                he(n2, i2, e4, t3);
              }, r2, e3, true);
            });
          }
        }
        function ut(e2, t2) {
          if (e2.type === "submit" || e2.type === "click") {
            if (t2.tagName === "FORM") {
              return true;
            }
            if (h(t2, 'input[type="submit"], button') && v(t2, "form") !== null) {
              return true;
            }
            if (t2.tagName === "A" && t2.href && (t2.getAttribute("href") === "#" || t2.getAttribute("href").indexOf("#") !== 0)) {
              return true;
            }
          }
          return false;
        }
        function ft(e2, t2) {
          return ae(e2).boosted && e2.tagName === "A" && t2.type === "click" && (t2.ctrlKey || t2.metaKey);
        }
        function ct(e2, t2, r2) {
          var n2 = e2.eventFilter;
          if (n2) {
            try {
              return n2.call(t2, r2) !== true;
            } catch (e3) {
              fe(re().body, "htmx:eventFilter:error", { error: e3, source: n2.source });
              return true;
            }
          }
          return false;
        }
        function ht(a2, o2, e2, s2, l2) {
          var u2 = ae(a2);
          var t2;
          if (s2.from) {
            t2 = Z(a2, s2.from);
          } else {
            t2 = [a2];
          }
          if (s2.changed) {
            t2.forEach(function(e3) {
              var t3 = ae(e3);
              t3.lastValue = e3.value;
            });
          }
          oe(t2, function(n2) {
            var i2 = function(e3) {
              if (!se(a2)) {
                n2.removeEventListener(s2.trigger, i2);
                return;
              }
              if (ft(a2, e3)) {
                return;
              }
              if (l2 || ut(e3, a2)) {
                e3.preventDefault();
              }
              if (ct(s2, a2, e3)) {
                return;
              }
              var t3 = ae(e3);
              t3.triggerSpec = s2;
              if (t3.handledFor == null) {
                t3.handledFor = [];
              }
              if (t3.handledFor.indexOf(a2) < 0) {
                t3.handledFor.push(a2);
                if (s2.consume) {
                  e3.stopPropagation();
                }
                if (s2.target && e3.target) {
                  if (!h(e3.target, s2.target)) {
                    return;
                  }
                }
                if (s2.once) {
                  if (u2.triggeredOnce) {
                    return;
                  } else {
                    u2.triggeredOnce = true;
                  }
                }
                if (s2.changed) {
                  var r2 = ae(n2);
                  if (r2.lastValue === n2.value) {
                    return;
                  }
                  r2.lastValue = n2.value;
                }
                if (u2.delayed) {
                  clearTimeout(u2.delayed);
                }
                if (u2.throttle) {
                  return;
                }
                if (s2.throttle > 0) {
                  if (!u2.throttle) {
                    o2(a2, e3);
                    u2.throttle = setTimeout(function() {
                      u2.throttle = null;
                    }, s2.throttle);
                  }
                } else if (s2.delay > 0) {
                  u2.delayed = setTimeout(function() {
                    o2(a2, e3);
                  }, s2.delay);
                } else {
                  ce(a2, "htmx:trigger");
                  o2(a2, e3);
                }
              }
            };
            if (e2.listenerInfos == null) {
              e2.listenerInfos = [];
            }
            e2.listenerInfos.push({ trigger: s2.trigger, listener: i2, on: n2 });
            n2.addEventListener(s2.trigger, i2);
          });
        }
        var vt = false;
        var dt = null;
        function gt() {
          if (!dt) {
            dt = function() {
              vt = true;
            };
            window.addEventListener("scroll", dt);
            setInterval(function() {
              if (vt) {
                vt = false;
                oe(re().querySelectorAll("[hx-trigger='revealed'],[data-hx-trigger='revealed']"), function(e2) {
                  pt(e2);
                });
              }
            }, 200);
          }
        }
        function pt(t2) {
          if (!o(t2, "data-hx-revealed") && X(t2)) {
            t2.setAttribute("data-hx-revealed", "true");
            var e2 = ae(t2);
            if (e2.initHash) {
              ce(t2, "revealed");
            } else {
              t2.addEventListener("htmx:afterProcessNode", function(e3) {
                ce(t2, "revealed");
              }, { once: true });
            }
          }
        }
        function mt(e2, t2, r2) {
          var n2 = D(r2);
          for (var i2 = 0; i2 < n2.length; i2++) {
            var a2 = n2[i2].split(/:(.+)/);
            if (a2[0] === "connect") {
              xt(e2, a2[1], 0);
            }
            if (a2[0] === "send") {
              bt(e2);
            }
          }
        }
        function xt(s2, r2, n2) {
          if (!se(s2)) {
            return;
          }
          if (r2.indexOf("/") == 0) {
            var e2 = location.hostname + (location.port ? ":" + location.port : "");
            if (location.protocol == "https:") {
              r2 = "wss://" + e2 + r2;
            } else if (location.protocol == "http:") {
              r2 = "ws://" + e2 + r2;
            }
          }
          var t2 = Q.createWebSocket(r2);
          t2.onerror = function(e3) {
            fe(s2, "htmx:wsError", { error: e3, socket: t2 });
            yt(s2);
          };
          t2.onclose = function(e3) {
            if ([1006, 1012, 1013].indexOf(e3.code) >= 0) {
              var t3 = wt(n2);
              setTimeout(function() {
                xt(s2, r2, n2 + 1);
              }, t3);
            }
          };
          t2.onopen = function(e3) {
            n2 = 0;
          };
          ae(s2).webSocket = t2;
          t2.addEventListener("message", function(e3) {
            if (yt(s2)) {
              return;
            }
            var t3 = e3.data;
            R(s2, function(e4) {
              t3 = e4.transformResponse(t3, null, s2);
            });
            var r3 = T(s2);
            var n3 = l(t3);
            var i2 = M(n3.children);
            for (var a2 = 0; a2 < i2.length; a2++) {
              var o2 = i2[a2];
              Ee(te(o2, "hx-swap-oob") || "true", o2, r3);
            }
            nr(r3.tasks);
          });
        }
        function yt(e2) {
          if (!se(e2)) {
            ae(e2).webSocket.close();
            return true;
          }
        }
        function bt(u2) {
          var f2 = c(u2, function(e2) {
            return ae(e2).webSocket != null;
          });
          if (f2) {
            u2.addEventListener(it(u2)[0].trigger, function(e2) {
              var t2 = ae(f2).webSocket;
              var r2 = xr(u2, f2);
              var n2 = dr(u2, "post");
              var i2 = n2.errors;
              var a2 = n2.values;
              var o2 = Hr(u2);
              var s2 = le(a2, o2);
              var l2 = yr(s2, u2);
              l2["HEADERS"] = r2;
              if (i2 && i2.length > 0) {
                ce(u2, "htmx:validation:halted", i2);
                return;
              }
              t2.send(JSON.stringify(l2));
              if (ut(e2, u2)) {
                e2.preventDefault();
              }
            });
          } else {
            fe(u2, "htmx:noWebSocketSourceError");
          }
        }
        function wt(e2) {
          var t2 = Q.config.wsReconnectDelay;
          if (typeof t2 === "function") {
            return t2(e2);
          }
          if (t2 === "full-jitter") {
            var r2 = Math.min(e2, 6);
            var n2 = 1e3 * Math.pow(2, r2);
            return n2 * Math.random();
          }
          b('htmx.config.wsReconnectDelay must either be a function or the string "full-jitter"');
        }
        function St(e2, t2, r2) {
          var n2 = D(r2);
          for (var i2 = 0; i2 < n2.length; i2++) {
            var a2 = n2[i2].split(/:(.+)/);
            if (a2[0] === "connect") {
              Et(e2, a2[1]);
            }
            if (a2[0] === "swap") {
              Ct(e2, a2[1]);
            }
          }
        }
        function Et(t2, e2) {
          var r2 = Q.createEventSource(e2);
          r2.onerror = function(e3) {
            fe(t2, "htmx:sseError", { error: e3, source: r2 });
            Tt(t2);
          };
          ae(t2).sseEventSource = r2;
        }
        function Ct(a2, o2) {
          var s2 = c(a2, Ot);
          if (s2) {
            var l2 = ae(s2).sseEventSource;
            var u2 = function(e2) {
              if (Tt(s2)) {
                return;
              }
              if (!se(a2)) {
                l2.removeEventListener(o2, u2);
                return;
              }
              var t2 = e2.data;
              R(a2, function(e3) {
                t2 = e3.transformResponse(t2, null, a2);
              });
              var r2 = wr(a2);
              var n2 = ye(a2);
              var i2 = T(a2);
              je(r2.swapStyle, n2, a2, t2, i2);
              nr(i2.tasks);
              ce(a2, "htmx:sseMessage", e2);
            };
            ae(a2).sseListener = u2;
            l2.addEventListener(o2, u2);
          } else {
            fe(a2, "htmx:noSSESourceError");
          }
        }
        function Rt(e2, t2, r2) {
          var n2 = c(e2, Ot);
          if (n2) {
            var i2 = ae(n2).sseEventSource;
            var a2 = function() {
              if (!Tt(n2)) {
                if (se(e2)) {
                  t2(e2);
                } else {
                  i2.removeEventListener(r2, a2);
                }
              }
            };
            ae(e2).sseListener = a2;
            i2.addEventListener(r2, a2);
          } else {
            fe(e2, "htmx:noSSESourceError");
          }
        }
        function Tt(e2) {
          if (!se(e2)) {
            ae(e2).sseEventSource.close();
            return true;
          }
        }
        function Ot(e2) {
          return ae(e2).sseEventSource != null;
        }
        function qt(e2, t2, r2, n2) {
          var i2 = function() {
            if (!r2.loaded) {
              r2.loaded = true;
              t2(e2);
            }
          };
          if (n2 > 0) {
            setTimeout(i2, n2);
          } else {
            i2();
          }
        }
        function Ht(t2, i2, e2) {
          var a2 = false;
          oe(w, function(r2) {
            if (o(t2, "hx-" + r2)) {
              var n2 = te(t2, "hx-" + r2);
              a2 = true;
              i2.path = n2;
              i2.verb = r2;
              e2.forEach(function(e3) {
                Lt(t2, e3, i2, function(e4, t3) {
                  if (v(e4, Q.config.disableSelector)) {
                    m(e4);
                    return;
                  }
                  he(r2, n2, e4, t3);
                });
              });
            }
          });
          return a2;
        }
        function Lt(n2, e2, t2, r2) {
          if (e2.sseEvent) {
            Rt(n2, r2, e2.sseEvent);
          } else if (e2.trigger === "revealed") {
            gt();
            ht(n2, r2, t2, e2);
            pt(n2);
          } else if (e2.trigger === "intersect") {
            var i2 = {};
            if (e2.root) {
              i2.root = ue(n2, e2.root);
            }
            if (e2.threshold) {
              i2.threshold = parseFloat(e2.threshold);
            }
            var a2 = new IntersectionObserver(function(e3) {
              for (var t3 = 0; t3 < e3.length; t3++) {
                var r3 = e3[t3];
                if (r3.isIntersecting) {
                  ce(n2, "intersect");
                  break;
                }
              }
            }, i2);
            a2.observe(n2);
            ht(n2, r2, t2, e2);
          } else if (e2.trigger === "load") {
            if (!ct(e2, n2, Wt("load", { elt: n2 }))) {
              qt(n2, r2, t2, e2.delay);
            }
          } else if (e2.pollInterval > 0) {
            t2.polling = true;
            ot(n2, r2, e2);
          } else {
            ht(n2, r2, t2, e2);
          }
        }
        function At(e2) {
          if (!e2.htmxExecuted && Q.config.allowScriptTags && (e2.type === "text/javascript" || e2.type === "module" || e2.type === "")) {
            var t2 = re().createElement("script");
            oe(e2.attributes, function(e3) {
              t2.setAttribute(e3.name, e3.value);
            });
            t2.textContent = e2.textContent;
            t2.async = false;
            if (Q.config.inlineScriptNonce) {
              t2.nonce = Q.config.inlineScriptNonce;
            }
            var r2 = e2.parentElement;
            try {
              r2.insertBefore(t2, e2);
            } catch (e3) {
              b(e3);
            } finally {
              if (e2.parentElement) {
                e2.parentElement.removeChild(e2);
              }
            }
          }
        }
        function Nt(e2) {
          if (h(e2, "script")) {
            At(e2);
          }
          oe(f(e2, "script"), function(e3) {
            At(e3);
          });
        }
        function It(e2) {
          var t2 = e2.attributes;
          if (!t2) {
            return false;
          }
          for (var r2 = 0; r2 < t2.length; r2++) {
            var n2 = t2[r2].name;
            if (g(n2, "hx-on:") || g(n2, "data-hx-on:") || g(n2, "hx-on-") || g(n2, "data-hx-on-")) {
              return true;
            }
          }
          return false;
        }
        function kt(e2) {
          var t2 = null;
          var r2 = [];
          if (It(e2)) {
            r2.push(e2);
          }
          if (document.evaluate) {
            var n2 = document.evaluate('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]', e2);
            while (t2 = n2.iterateNext()) r2.push(t2);
          } else if (typeof e2.getElementsByTagName === "function") {
            var i2 = e2.getElementsByTagName("*");
            for (var a2 = 0; a2 < i2.length; a2++) {
              if (It(i2[a2])) {
                r2.push(i2[a2]);
              }
            }
          }
          return r2;
        }
        function Pt(e2) {
          if (e2.querySelectorAll) {
            var t2 = ", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]";
            var r2 = e2.querySelectorAll(i + t2 + ", form, [type='submit'], [hx-sse], [data-hx-sse], [hx-ws], [data-hx-ws], [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger], [hx-on], [data-hx-on]");
            return r2;
          } else {
            return [];
          }
        }
        function Mt(e2) {
          var t2 = v(e2.target, "button, input[type='submit']");
          var r2 = Dt(e2);
          if (r2) {
            r2.lastButtonClicked = t2;
          }
        }
        function Xt(e2) {
          var t2 = Dt(e2);
          if (t2) {
            t2.lastButtonClicked = null;
          }
        }
        function Dt(e2) {
          var t2 = v(e2.target, "button, input[type='submit']");
          if (!t2) {
            return;
          }
          var r2 = p("#" + ee(t2, "form")) || v(t2, "form");
          if (!r2) {
            return;
          }
          return ae(r2);
        }
        function Ut(e2) {
          e2.addEventListener("click", Mt);
          e2.addEventListener("focusin", Mt);
          e2.addEventListener("focusout", Xt);
        }
        function Bt(e2) {
          var t2 = Ye(e2);
          var r2 = 0;
          for (var n2 = 0; n2 < t2.length; n2++) {
            const i2 = t2[n2];
            if (i2 === "{") {
              r2++;
            } else if (i2 === "}") {
              r2--;
            }
          }
          return r2;
        }
        function Ft(t2, e2, r2) {
          var n2 = ae(t2);
          if (!Array.isArray(n2.onHandlers)) {
            n2.onHandlers = [];
          }
          var i2;
          var a2 = function(e3) {
            return Tr(t2, function() {
              if (!i2) {
                i2 = new Function("event", r2);
              }
              i2.call(t2, e3);
            });
          };
          t2.addEventListener(e2, a2);
          n2.onHandlers.push({ event: e2, listener: a2 });
        }
        function Vt(e2) {
          var t2 = te(e2, "hx-on");
          if (t2) {
            var r2 = {};
            var n2 = t2.split("\n");
            var i2 = null;
            var a2 = 0;
            while (n2.length > 0) {
              var o2 = n2.shift();
              var s2 = o2.match(/^\s*([a-zA-Z:\-\.]+:)(.*)/);
              if (a2 === 0 && s2) {
                o2.split(":");
                i2 = s2[1].slice(0, -1);
                r2[i2] = s2[2];
              } else {
                r2[i2] += o2;
              }
              a2 += Bt(o2);
            }
            for (var l2 in r2) {
              Ft(e2, l2, r2[l2]);
            }
          }
        }
        function jt(e2) {
          Ae(e2);
          for (var t2 = 0; t2 < e2.attributes.length; t2++) {
            var r2 = e2.attributes[t2].name;
            var n2 = e2.attributes[t2].value;
            if (g(r2, "hx-on") || g(r2, "data-hx-on")) {
              var i2 = r2.indexOf("-on") + 3;
              var a2 = r2.slice(i2, i2 + 1);
              if (a2 === "-" || a2 === ":") {
                var o2 = r2.slice(i2 + 1);
                if (g(o2, ":")) {
                  o2 = "htmx" + o2;
                } else if (g(o2, "-")) {
                  o2 = "htmx:" + o2.slice(1);
                } else if (g(o2, "htmx-")) {
                  o2 = "htmx:" + o2.slice(5);
                }
                Ft(e2, o2, n2);
              }
            }
          }
        }
        function _t(t2) {
          if (v(t2, Q.config.disableSelector)) {
            m(t2);
            return;
          }
          var r2 = ae(t2);
          if (r2.initHash !== Le(t2)) {
            Ne(t2);
            r2.initHash = Le(t2);
            Vt(t2);
            ce(t2, "htmx:beforeProcessNode");
            if (t2.value) {
              r2.lastValue = t2.value;
            }
            var e2 = it(t2);
            var n2 = Ht(t2, r2, e2);
            if (!n2) {
              if (ne(t2, "hx-boost") === "true") {
                lt(t2, r2, e2);
              } else if (o(t2, "hx-trigger")) {
                e2.forEach(function(e3) {
                  Lt(t2, e3, r2, function() {
                  });
                });
              }
            }
            if (t2.tagName === "FORM" || ee(t2, "type") === "submit" && o(t2, "form")) {
              Ut(t2);
            }
            var i2 = te(t2, "hx-sse");
            if (i2) {
              St(t2, r2, i2);
            }
            var a2 = te(t2, "hx-ws");
            if (a2) {
              mt(t2, r2, a2);
            }
            ce(t2, "htmx:afterProcessNode");
          }
        }
        function zt(e2) {
          e2 = p(e2);
          if (v(e2, Q.config.disableSelector)) {
            m(e2);
            return;
          }
          _t(e2);
          oe(Pt(e2), function(e3) {
            _t(e3);
          });
          oe(kt(e2), jt);
        }
        function $t(e2) {
          return e2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        }
        function Wt(e2, t2) {
          var r2;
          if (window.CustomEvent && typeof window.CustomEvent === "function") {
            r2 = new CustomEvent(e2, { bubbles: true, cancelable: true, detail: t2 });
          } else {
            r2 = re().createEvent("CustomEvent");
            r2.initCustomEvent(e2, true, true, t2);
          }
          return r2;
        }
        function fe(e2, t2, r2) {
          ce(e2, t2, le({ error: t2 }, r2));
        }
        function Gt(e2) {
          return e2 === "htmx:afterProcessNode";
        }
        function R(e2, t2) {
          oe(Fr(e2), function(e3) {
            try {
              t2(e3);
            } catch (e4) {
              b(e4);
            }
          });
        }
        function b(e2) {
          if (console.error) {
            console.error(e2);
          } else if (console.log) {
            console.log("ERROR: ", e2);
          }
        }
        function ce(e2, t2, r2) {
          e2 = p(e2);
          if (r2 == null) {
            r2 = {};
          }
          r2["elt"] = e2;
          var n2 = Wt(t2, r2);
          if (Q.logger && !Gt(t2)) {
            Q.logger(e2, t2, r2);
          }
          if (r2.error) {
            b(r2.error);
            ce(e2, "htmx:error", { errorInfo: r2 });
          }
          var i2 = e2.dispatchEvent(n2);
          var a2 = $t(t2);
          if (i2 && a2 !== t2) {
            var o2 = Wt(a2, n2.detail);
            i2 = i2 && e2.dispatchEvent(o2);
          }
          R(e2, function(e3) {
            i2 = i2 && (e3.onEvent(t2, n2) !== false && !n2.defaultPrevented);
          });
          return i2;
        }
        var Jt = location.pathname + location.search;
        function Zt() {
          var e2 = re().querySelector("[hx-history-elt],[data-hx-history-elt]");
          return e2 || re().body;
        }
        function Kt(e2, t2, r2, n2) {
          if (!U()) {
            return;
          }
          if (Q.config.historyCacheSize <= 0) {
            localStorage.removeItem("htmx-history-cache");
            return;
          }
          e2 = B(e2);
          var i2 = E(localStorage.getItem("htmx-history-cache")) || [];
          for (var a2 = 0; a2 < i2.length; a2++) {
            if (i2[a2].url === e2) {
              i2.splice(a2, 1);
              break;
            }
          }
          var o2 = { url: e2, content: t2, title: r2, scroll: n2 };
          ce(re().body, "htmx:historyItemCreated", { item: o2, cache: i2 });
          i2.push(o2);
          while (i2.length > Q.config.historyCacheSize) {
            i2.shift();
          }
          while (i2.length > 0) {
            try {
              localStorage.setItem("htmx-history-cache", JSON.stringify(i2));
              break;
            } catch (e3) {
              fe(re().body, "htmx:historyCacheError", { cause: e3, cache: i2 });
              i2.shift();
            }
          }
        }
        function Yt(e2) {
          if (!U()) {
            return null;
          }
          e2 = B(e2);
          var t2 = E(localStorage.getItem("htmx-history-cache")) || [];
          for (var r2 = 0; r2 < t2.length; r2++) {
            if (t2[r2].url === e2) {
              return t2[r2];
            }
          }
          return null;
        }
        function Qt(e2) {
          var t2 = Q.config.requestClass;
          var r2 = e2.cloneNode(true);
          oe(f(r2, "." + t2), function(e3) {
            n(e3, t2);
          });
          return r2.innerHTML;
        }
        function er() {
          var e2 = Zt();
          var t2 = Jt || location.pathname + location.search;
          var r2;
          try {
            r2 = re().querySelector('[hx-history="false" i],[data-hx-history="false" i]');
          } catch (e3) {
            r2 = re().querySelector('[hx-history="false"],[data-hx-history="false"]');
          }
          if (!r2) {
            ce(re().body, "htmx:beforeHistorySave", { path: t2, historyElt: e2 });
            Kt(t2, Qt(e2), re().title, window.scrollY);
          }
          if (Q.config.historyEnabled) history.replaceState({ htmx: true }, re().title, window.location.href);
        }
        function tr(e2) {
          if (Q.config.getCacheBusterParam) {
            e2 = e2.replace(/org\.htmx\.cache-buster=[^&]*&?/, "");
            if (G(e2, "&") || G(e2, "?")) {
              e2 = e2.slice(0, -1);
            }
          }
          if (Q.config.historyEnabled) {
            history.pushState({ htmx: true }, "", e2);
          }
          Jt = e2;
        }
        function rr(e2) {
          if (Q.config.historyEnabled) history.replaceState({ htmx: true }, "", e2);
          Jt = e2;
        }
        function nr(e2) {
          oe(e2, function(e3) {
            e3.call();
          });
        }
        function ir(a2) {
          var e2 = new XMLHttpRequest();
          var o2 = { path: a2, xhr: e2 };
          ce(re().body, "htmx:historyCacheMiss", o2);
          e2.open("GET", a2, true);
          e2.setRequestHeader("HX-Request", "true");
          e2.setRequestHeader("HX-History-Restore-Request", "true");
          e2.setRequestHeader("HX-Current-URL", re().location.href);
          e2.onload = function() {
            if (this.status >= 200 && this.status < 400) {
              ce(re().body, "htmx:historyCacheMissLoad", o2);
              var e3 = l(this.response);
              e3 = e3.querySelector("[hx-history-elt],[data-hx-history-elt]") || e3;
              var t2 = Zt();
              var r2 = T(t2);
              var n2 = Ve(this.response);
              if (n2) {
                var i2 = C("title");
                if (i2) {
                  i2.innerHTML = n2;
                } else {
                  window.document.title = n2;
                }
              }
              Ue(t2, e3, r2);
              nr(r2.tasks);
              Jt = a2;
              ce(re().body, "htmx:historyRestore", { path: a2, cacheMiss: true, serverResponse: this.response });
            } else {
              fe(re().body, "htmx:historyCacheMissLoadError", o2);
            }
          };
          e2.send();
        }
        function ar(e2) {
          er();
          e2 = e2 || location.pathname + location.search;
          var t2 = Yt(e2);
          if (t2) {
            var r2 = l(t2.content);
            var n2 = Zt();
            var i2 = T(n2);
            Ue(n2, r2, i2);
            nr(i2.tasks);
            document.title = t2.title;
            setTimeout(function() {
              window.scrollTo(0, t2.scroll);
            }, 0);
            Jt = e2;
            ce(re().body, "htmx:historyRestore", { path: e2, item: t2 });
          } else {
            if (Q.config.refreshOnHistoryMiss) {
              window.location.reload(true);
            } else {
              ir(e2);
            }
          }
        }
        function or(e2) {
          var t2 = me(e2, "hx-indicator");
          if (t2 == null) {
            t2 = [e2];
          }
          oe(t2, function(e3) {
            var t3 = ae(e3);
            t3.requestCount = (t3.requestCount || 0) + 1;
            e3.classList["add"].call(e3.classList, Q.config.requestClass);
          });
          return t2;
        }
        function sr(e2) {
          var t2 = me(e2, "hx-disabled-elt");
          if (t2 == null) {
            t2 = [];
          }
          oe(t2, function(e3) {
            var t3 = ae(e3);
            t3.requestCount = (t3.requestCount || 0) + 1;
            e3.setAttribute("disabled", "");
          });
          return t2;
        }
        function lr(e2, t2) {
          oe(e2, function(e3) {
            var t3 = ae(e3);
            t3.requestCount = (t3.requestCount || 0) - 1;
            if (t3.requestCount === 0) {
              e3.classList["remove"].call(e3.classList, Q.config.requestClass);
            }
          });
          oe(t2, function(e3) {
            var t3 = ae(e3);
            t3.requestCount = (t3.requestCount || 0) - 1;
            if (t3.requestCount === 0) {
              e3.removeAttribute("disabled");
            }
          });
        }
        function ur(e2, t2) {
          for (var r2 = 0; r2 < e2.length; r2++) {
            var n2 = e2[r2];
            if (n2.isSameNode(t2)) {
              return true;
            }
          }
          return false;
        }
        function fr(e2) {
          if (e2.name === "" || e2.name == null || e2.disabled || v(e2, "fieldset[disabled]")) {
            return false;
          }
          if (e2.type === "button" || e2.type === "submit" || e2.tagName === "image" || e2.tagName === "reset" || e2.tagName === "file") {
            return false;
          }
          if (e2.type === "checkbox" || e2.type === "radio") {
            return e2.checked;
          }
          return true;
        }
        function cr(e2, t2, r2) {
          if (e2 != null && t2 != null) {
            var n2 = r2[e2];
            if (n2 === void 0) {
              r2[e2] = t2;
            } else if (Array.isArray(n2)) {
              if (Array.isArray(t2)) {
                r2[e2] = n2.concat(t2);
              } else {
                n2.push(t2);
              }
            } else {
              if (Array.isArray(t2)) {
                r2[e2] = [n2].concat(t2);
              } else {
                r2[e2] = [n2, t2];
              }
            }
          }
        }
        function hr(t2, r2, n2, e2, i2) {
          if (e2 == null || ur(t2, e2)) {
            return;
          } else {
            t2.push(e2);
          }
          if (fr(e2)) {
            var a2 = ee(e2, "name");
            var o2 = e2.value;
            if (e2.multiple && e2.tagName === "SELECT") {
              o2 = M(e2.querySelectorAll("option:checked")).map(function(e3) {
                return e3.value;
              });
            }
            if (e2.files) {
              o2 = M(e2.files);
            }
            cr(a2, o2, r2);
            if (i2) {
              vr(e2, n2);
            }
          }
          if (h(e2, "form")) {
            var s2 = e2.elements;
            oe(s2, function(e3) {
              hr(t2, r2, n2, e3, i2);
            });
          }
        }
        function vr(e2, t2) {
          if (e2.willValidate) {
            ce(e2, "htmx:validation:validate");
            if (!e2.checkValidity()) {
              t2.push({ elt: e2, message: e2.validationMessage, validity: e2.validity });
              ce(e2, "htmx:validation:failed", { message: e2.validationMessage, validity: e2.validity });
            }
          }
        }
        function dr(e2, t2) {
          var r2 = [];
          var n2 = {};
          var i2 = {};
          var a2 = [];
          var o2 = ae(e2);
          if (o2.lastButtonClicked && !se(o2.lastButtonClicked)) {
            o2.lastButtonClicked = null;
          }
          var s2 = h(e2, "form") && e2.noValidate !== true || te(e2, "hx-validate") === "true";
          if (o2.lastButtonClicked) {
            s2 = s2 && o2.lastButtonClicked.formNoValidate !== true;
          }
          if (t2 !== "get") {
            hr(r2, i2, a2, v(e2, "form"), s2);
          }
          hr(r2, n2, a2, e2, s2);
          if (o2.lastButtonClicked || e2.tagName === "BUTTON" || e2.tagName === "INPUT" && ee(e2, "type") === "submit") {
            var l2 = o2.lastButtonClicked || e2;
            var u2 = ee(l2, "name");
            cr(u2, l2.value, i2);
          }
          var f2 = me(e2, "hx-include");
          oe(f2, function(e3) {
            hr(r2, n2, a2, e3, s2);
            if (!h(e3, "form")) {
              oe(e3.querySelectorAll(rt), function(e4) {
                hr(r2, n2, a2, e4, s2);
              });
            }
          });
          n2 = le(n2, i2);
          return { errors: a2, values: n2 };
        }
        function gr(e2, t2, r2) {
          if (e2 !== "") {
            e2 += "&";
          }
          if (String(r2) === "[object Object]") {
            r2 = JSON.stringify(r2);
          }
          var n2 = encodeURIComponent(r2);
          e2 += encodeURIComponent(t2) + "=" + n2;
          return e2;
        }
        function pr(e2) {
          var t2 = "";
          for (var r2 in e2) {
            if (e2.hasOwnProperty(r2)) {
              var n2 = e2[r2];
              if (Array.isArray(n2)) {
                oe(n2, function(e3) {
                  t2 = gr(t2, r2, e3);
                });
              } else {
                t2 = gr(t2, r2, n2);
              }
            }
          }
          return t2;
        }
        function mr(e2) {
          var t2 = new FormData();
          for (var r2 in e2) {
            if (e2.hasOwnProperty(r2)) {
              var n2 = e2[r2];
              if (Array.isArray(n2)) {
                oe(n2, function(e3) {
                  t2.append(r2, e3);
                });
              } else {
                t2.append(r2, n2);
              }
            }
          }
          return t2;
        }
        function xr(e2, t2, r2) {
          var n2 = { "HX-Request": "true", "HX-Trigger": ee(e2, "id"), "HX-Trigger-Name": ee(e2, "name"), "HX-Target": te(t2, "id"), "HX-Current-URL": re().location.href };
          Rr(e2, "hx-headers", false, n2);
          if (r2 !== void 0) {
            n2["HX-Prompt"] = r2;
          }
          if (ae(e2).boosted) {
            n2["HX-Boosted"] = "true";
          }
          return n2;
        }
        function yr(t2, e2) {
          var r2 = ne(e2, "hx-params");
          if (r2) {
            if (r2 === "none") {
              return {};
            } else if (r2 === "*") {
              return t2;
            } else if (r2.indexOf("not ") === 0) {
              oe(r2.substr(4).split(","), function(e3) {
                e3 = e3.trim();
                delete t2[e3];
              });
              return t2;
            } else {
              var n2 = {};
              oe(r2.split(","), function(e3) {
                e3 = e3.trim();
                n2[e3] = t2[e3];
              });
              return n2;
            }
          } else {
            return t2;
          }
        }
        function br(e2) {
          return ee(e2, "href") && ee(e2, "href").indexOf("#") >= 0;
        }
        function wr(e2, t2) {
          var r2 = t2 ? t2 : ne(e2, "hx-swap");
          var n2 = { swapStyle: ae(e2).boosted ? "innerHTML" : Q.config.defaultSwapStyle, swapDelay: Q.config.defaultSwapDelay, settleDelay: Q.config.defaultSettleDelay };
          if (Q.config.scrollIntoViewOnBoost && ae(e2).boosted && !br(e2)) {
            n2["show"] = "top";
          }
          if (r2) {
            var i2 = D(r2);
            if (i2.length > 0) {
              for (var a2 = 0; a2 < i2.length; a2++) {
                var o2 = i2[a2];
                if (o2.indexOf("swap:") === 0) {
                  n2["swapDelay"] = d(o2.substr(5));
                } else if (o2.indexOf("settle:") === 0) {
                  n2["settleDelay"] = d(o2.substr(7));
                } else if (o2.indexOf("transition:") === 0) {
                  n2["transition"] = o2.substr(11) === "true";
                } else if (o2.indexOf("ignoreTitle:") === 0) {
                  n2["ignoreTitle"] = o2.substr(12) === "true";
                } else if (o2.indexOf("scroll:") === 0) {
                  var s2 = o2.substr(7);
                  var l2 = s2.split(":");
                  var u2 = l2.pop();
                  var f2 = l2.length > 0 ? l2.join(":") : null;
                  n2["scroll"] = u2;
                  n2["scrollTarget"] = f2;
                } else if (o2.indexOf("show:") === 0) {
                  var c2 = o2.substr(5);
                  var l2 = c2.split(":");
                  var h2 = l2.pop();
                  var f2 = l2.length > 0 ? l2.join(":") : null;
                  n2["show"] = h2;
                  n2["showTarget"] = f2;
                } else if (o2.indexOf("focus-scroll:") === 0) {
                  var v2 = o2.substr("focus-scroll:".length);
                  n2["focusScroll"] = v2 == "true";
                } else if (a2 == 0) {
                  n2["swapStyle"] = o2;
                } else {
                  b("Unknown modifier in hx-swap: " + o2);
                }
              }
            }
          }
          return n2;
        }
        function Sr(e2) {
          return ne(e2, "hx-encoding") === "multipart/form-data" || h(e2, "form") && ee(e2, "enctype") === "multipart/form-data";
        }
        function Er(t2, r2, n2) {
          var i2 = null;
          R(r2, function(e2) {
            if (i2 == null) {
              i2 = e2.encodeParameters(t2, n2, r2);
            }
          });
          if (i2 != null) {
            return i2;
          } else {
            if (Sr(r2)) {
              return mr(n2);
            } else {
              return pr(n2);
            }
          }
        }
        function T(e2) {
          return { tasks: [], elts: [e2] };
        }
        function Cr(e2, t2) {
          var r2 = e2[0];
          var n2 = e2[e2.length - 1];
          if (t2.scroll) {
            var i2 = null;
            if (t2.scrollTarget) {
              i2 = ue(r2, t2.scrollTarget);
            }
            if (t2.scroll === "top" && (r2 || i2)) {
              i2 = i2 || r2;
              i2.scrollTop = 0;
            }
            if (t2.scroll === "bottom" && (n2 || i2)) {
              i2 = i2 || n2;
              i2.scrollTop = i2.scrollHeight;
            }
          }
          if (t2.show) {
            var i2 = null;
            if (t2.showTarget) {
              var a2 = t2.showTarget;
              if (t2.showTarget === "window") {
                a2 = "body";
              }
              i2 = ue(r2, a2);
            }
            if (t2.show === "top" && (r2 || i2)) {
              i2 = i2 || r2;
              i2.scrollIntoView({ block: "start", behavior: Q.config.scrollBehavior });
            }
            if (t2.show === "bottom" && (n2 || i2)) {
              i2 = i2 || n2;
              i2.scrollIntoView({ block: "end", behavior: Q.config.scrollBehavior });
            }
          }
        }
        function Rr(e2, t2, r2, n2) {
          if (n2 == null) {
            n2 = {};
          }
          if (e2 == null) {
            return n2;
          }
          var i2 = te(e2, t2);
          if (i2) {
            var a2 = i2.trim();
            var o2 = r2;
            if (a2 === "unset") {
              return null;
            }
            if (a2.indexOf("javascript:") === 0) {
              a2 = a2.substr(11);
              o2 = true;
            } else if (a2.indexOf("js:") === 0) {
              a2 = a2.substr(3);
              o2 = true;
            }
            if (a2.indexOf("{") !== 0) {
              a2 = "{" + a2 + "}";
            }
            var s2;
            if (o2) {
              s2 = Tr(e2, function() {
                return Function("return (" + a2 + ")")();
              }, {});
            } else {
              s2 = E(a2);
            }
            for (var l2 in s2) {
              if (s2.hasOwnProperty(l2)) {
                if (n2[l2] == null) {
                  n2[l2] = s2[l2];
                }
              }
            }
          }
          return Rr(u(e2), t2, r2, n2);
        }
        function Tr(e2, t2, r2) {
          if (Q.config.allowEval) {
            return t2();
          } else {
            fe(e2, "htmx:evalDisallowedError");
            return r2;
          }
        }
        function Or(e2, t2) {
          return Rr(e2, "hx-vars", true, t2);
        }
        function qr(e2, t2) {
          return Rr(e2, "hx-vals", false, t2);
        }
        function Hr(e2) {
          return le(Or(e2), qr(e2));
        }
        function Lr(t2, r2, n2) {
          if (n2 !== null) {
            try {
              t2.setRequestHeader(r2, n2);
            } catch (e2) {
              t2.setRequestHeader(r2, encodeURIComponent(n2));
              t2.setRequestHeader(r2 + "-URI-AutoEncoded", "true");
            }
          }
        }
        function Ar(t2) {
          if (t2.responseURL && typeof URL !== "undefined") {
            try {
              var e2 = new URL(t2.responseURL);
              return e2.pathname + e2.search;
            } catch (e3) {
              fe(re().body, "htmx:badResponseUrl", { url: t2.responseURL });
            }
          }
        }
        function O(e2, t2) {
          return t2.test(e2.getAllResponseHeaders());
        }
        function Nr(e2, t2, r2) {
          e2 = e2.toLowerCase();
          if (r2) {
            if (r2 instanceof Element || I(r2, "String")) {
              return he(e2, t2, null, null, { targetOverride: p(r2), returnPromise: true });
            } else {
              return he(e2, t2, p(r2.source), r2.event, { handler: r2.handler, headers: r2.headers, values: r2.values, targetOverride: p(r2.target), swapOverride: r2.swap, select: r2.select, returnPromise: true });
            }
          } else {
            return he(e2, t2, null, null, { returnPromise: true });
          }
        }
        function Ir(e2) {
          var t2 = [];
          while (e2) {
            t2.push(e2);
            e2 = e2.parentElement;
          }
          return t2;
        }
        function kr(e2, t2, r2) {
          var n2;
          var i2;
          if (typeof URL === "function") {
            i2 = new URL(t2, document.location.href);
            var a2 = document.location.origin;
            n2 = a2 === i2.origin;
          } else {
            i2 = t2;
            n2 = g(t2, document.location.origin);
          }
          if (Q.config.selfRequestsOnly) {
            if (!n2) {
              return false;
            }
          }
          return ce(e2, "htmx:validateUrl", le({ url: i2, sameHost: n2 }, r2));
        }
        function he(t2, r2, n2, i2, a2, e2) {
          var o2 = null;
          var s2 = null;
          a2 = a2 != null ? a2 : {};
          if (a2.returnPromise && typeof Promise !== "undefined") {
            var l2 = new Promise(function(e3, t3) {
              o2 = e3;
              s2 = t3;
            });
          }
          if (n2 == null) {
            n2 = re().body;
          }
          var M2 = a2.handler || Mr;
          var X2 = a2.select || null;
          if (!se(n2)) {
            ie(o2);
            return l2;
          }
          var u2 = a2.targetOverride || ye(n2);
          if (u2 == null || u2 == pe) {
            fe(n2, "htmx:targetError", { target: te(n2, "hx-target") });
            ie(s2);
            return l2;
          }
          var f2 = ae(n2);
          var c2 = f2.lastButtonClicked;
          if (c2) {
            var h2 = ee(c2, "formaction");
            if (h2 != null) {
              r2 = h2;
            }
            var v2 = ee(c2, "formmethod");
            if (v2 != null) {
              if (v2.toLowerCase() !== "dialog") {
                t2 = v2;
              }
            }
          }
          var d2 = ne(n2, "hx-confirm");
          if (e2 === void 0) {
            var D2 = function(e3) {
              return he(t2, r2, n2, i2, a2, !!e3);
            };
            var U2 = { target: u2, elt: n2, path: r2, verb: t2, triggeringEvent: i2, etc: a2, issueRequest: D2, question: d2 };
            if (ce(n2, "htmx:confirm", U2) === false) {
              ie(o2);
              return l2;
            }
          }
          var g2 = n2;
          var p2 = ne(n2, "hx-sync");
          var m2 = null;
          var x2 = false;
          if (p2) {
            var B2 = p2.split(":");
            var F2 = B2[0].trim();
            if (F2 === "this") {
              g2 = xe(n2, "hx-sync");
            } else {
              g2 = ue(n2, F2);
            }
            p2 = (B2[1] || "drop").trim();
            f2 = ae(g2);
            if (p2 === "drop" && f2.xhr && f2.abortable !== true) {
              ie(o2);
              return l2;
            } else if (p2 === "abort") {
              if (f2.xhr) {
                ie(o2);
                return l2;
              } else {
                x2 = true;
              }
            } else if (p2 === "replace") {
              ce(g2, "htmx:abort");
            } else if (p2.indexOf("queue") === 0) {
              var V2 = p2.split(" ");
              m2 = (V2[1] || "last").trim();
            }
          }
          if (f2.xhr) {
            if (f2.abortable) {
              ce(g2, "htmx:abort");
            } else {
              if (m2 == null) {
                if (i2) {
                  var y2 = ae(i2);
                  if (y2 && y2.triggerSpec && y2.triggerSpec.queue) {
                    m2 = y2.triggerSpec.queue;
                  }
                }
                if (m2 == null) {
                  m2 = "last";
                }
              }
              if (f2.queuedRequests == null) {
                f2.queuedRequests = [];
              }
              if (m2 === "first" && f2.queuedRequests.length === 0) {
                f2.queuedRequests.push(function() {
                  he(t2, r2, n2, i2, a2);
                });
              } else if (m2 === "all") {
                f2.queuedRequests.push(function() {
                  he(t2, r2, n2, i2, a2);
                });
              } else if (m2 === "last") {
                f2.queuedRequests = [];
                f2.queuedRequests.push(function() {
                  he(t2, r2, n2, i2, a2);
                });
              }
              ie(o2);
              return l2;
            }
          }
          var b2 = new XMLHttpRequest();
          f2.xhr = b2;
          f2.abortable = x2;
          var w2 = function() {
            f2.xhr = null;
            f2.abortable = false;
            if (f2.queuedRequests != null && f2.queuedRequests.length > 0) {
              var e3 = f2.queuedRequests.shift();
              e3();
            }
          };
          var j2 = ne(n2, "hx-prompt");
          if (j2) {
            var S2 = prompt(j2);
            if (S2 === null || !ce(n2, "htmx:prompt", { prompt: S2, target: u2 })) {
              ie(o2);
              w2();
              return l2;
            }
          }
          if (d2 && !e2) {
            if (!confirm(d2)) {
              ie(o2);
              w2();
              return l2;
            }
          }
          var E2 = xr(n2, u2, S2);
          if (t2 !== "get" && !Sr(n2)) {
            E2["Content-Type"] = "application/x-www-form-urlencoded";
          }
          if (a2.headers) {
            E2 = le(E2, a2.headers);
          }
          var _2 = dr(n2, t2);
          var C2 = _2.errors;
          var R2 = _2.values;
          if (a2.values) {
            R2 = le(R2, a2.values);
          }
          var z2 = Hr(n2);
          var $2 = le(R2, z2);
          var T2 = yr($2, n2);
          if (Q.config.getCacheBusterParam && t2 === "get") {
            T2["org.htmx.cache-buster"] = ee(u2, "id") || "true";
          }
          if (r2 == null || r2 === "") {
            r2 = re().location.href;
          }
          var O2 = Rr(n2, "hx-request");
          var W2 = ae(n2).boosted;
          var q2 = Q.config.methodsThatUseUrlParams.indexOf(t2) >= 0;
          var H2 = { boosted: W2, useUrlParams: q2, parameters: T2, unfilteredParameters: $2, headers: E2, target: u2, verb: t2, errors: C2, withCredentials: a2.credentials || O2.credentials || Q.config.withCredentials, timeout: a2.timeout || O2.timeout || Q.config.timeout, path: r2, triggeringEvent: i2 };
          if (!ce(n2, "htmx:configRequest", H2)) {
            ie(o2);
            w2();
            return l2;
          }
          r2 = H2.path;
          t2 = H2.verb;
          E2 = H2.headers;
          T2 = H2.parameters;
          C2 = H2.errors;
          q2 = H2.useUrlParams;
          if (C2 && C2.length > 0) {
            ce(n2, "htmx:validation:halted", H2);
            ie(o2);
            w2();
            return l2;
          }
          var G2 = r2.split("#");
          var J2 = G2[0];
          var L2 = G2[1];
          var A2 = r2;
          if (q2) {
            A2 = J2;
            var Z2 = Object.keys(T2).length !== 0;
            if (Z2) {
              if (A2.indexOf("?") < 0) {
                A2 += "?";
              } else {
                A2 += "&";
              }
              A2 += pr(T2);
              if (L2) {
                A2 += "#" + L2;
              }
            }
          }
          if (!kr(n2, A2, H2)) {
            fe(n2, "htmx:invalidPath", H2);
            ie(s2);
            return l2;
          }
          b2.open(t2.toUpperCase(), A2, true);
          b2.overrideMimeType("text/html");
          b2.withCredentials = H2.withCredentials;
          b2.timeout = H2.timeout;
          if (O2.noHeaders) {
          } else {
            for (var N2 in E2) {
              if (E2.hasOwnProperty(N2)) {
                var K2 = E2[N2];
                Lr(b2, N2, K2);
              }
            }
          }
          var I2 = { xhr: b2, target: u2, requestConfig: H2, etc: a2, boosted: W2, select: X2, pathInfo: { requestPath: r2, finalRequestPath: A2, anchor: L2 } };
          b2.onload = function() {
            try {
              var e3 = Ir(n2);
              I2.pathInfo.responsePath = Ar(b2);
              M2(n2, I2);
              lr(k2, P2);
              ce(n2, "htmx:afterRequest", I2);
              ce(n2, "htmx:afterOnLoad", I2);
              if (!se(n2)) {
                var t3 = null;
                while (e3.length > 0 && t3 == null) {
                  var r3 = e3.shift();
                  if (se(r3)) {
                    t3 = r3;
                  }
                }
                if (t3) {
                  ce(t3, "htmx:afterRequest", I2);
                  ce(t3, "htmx:afterOnLoad", I2);
                }
              }
              ie(o2);
              w2();
            } catch (e4) {
              fe(n2, "htmx:onLoadError", le({ error: e4 }, I2));
              throw e4;
            }
          };
          b2.onerror = function() {
            lr(k2, P2);
            fe(n2, "htmx:afterRequest", I2);
            fe(n2, "htmx:sendError", I2);
            ie(s2);
            w2();
          };
          b2.onabort = function() {
            lr(k2, P2);
            fe(n2, "htmx:afterRequest", I2);
            fe(n2, "htmx:sendAbort", I2);
            ie(s2);
            w2();
          };
          b2.ontimeout = function() {
            lr(k2, P2);
            fe(n2, "htmx:afterRequest", I2);
            fe(n2, "htmx:timeout", I2);
            ie(s2);
            w2();
          };
          if (!ce(n2, "htmx:beforeRequest", I2)) {
            ie(o2);
            w2();
            return l2;
          }
          var k2 = or(n2);
          var P2 = sr(n2);
          oe(["loadstart", "loadend", "progress", "abort"], function(t3) {
            oe([b2, b2.upload], function(e3) {
              e3.addEventListener(t3, function(e4) {
                ce(n2, "htmx:xhr:" + t3, { lengthComputable: e4.lengthComputable, loaded: e4.loaded, total: e4.total });
              });
            });
          });
          ce(n2, "htmx:beforeSend", I2);
          var Y2 = q2 ? null : Er(b2, n2, T2);
          b2.send(Y2);
          return l2;
        }
        function Pr(e2, t2) {
          var r2 = t2.xhr;
          var n2 = null;
          var i2 = null;
          if (O(r2, /HX-Push:/i)) {
            n2 = r2.getResponseHeader("HX-Push");
            i2 = "push";
          } else if (O(r2, /HX-Push-Url:/i)) {
            n2 = r2.getResponseHeader("HX-Push-Url");
            i2 = "push";
          } else if (O(r2, /HX-Replace-Url:/i)) {
            n2 = r2.getResponseHeader("HX-Replace-Url");
            i2 = "replace";
          }
          if (n2) {
            if (n2 === "false") {
              return {};
            } else {
              return { type: i2, path: n2 };
            }
          }
          var a2 = t2.pathInfo.finalRequestPath;
          var o2 = t2.pathInfo.responsePath;
          var s2 = ne(e2, "hx-push-url");
          var l2 = ne(e2, "hx-replace-url");
          var u2 = ae(e2).boosted;
          var f2 = null;
          var c2 = null;
          if (s2) {
            f2 = "push";
            c2 = s2;
          } else if (l2) {
            f2 = "replace";
            c2 = l2;
          } else if (u2) {
            f2 = "push";
            c2 = o2 || a2;
          }
          if (c2) {
            if (c2 === "false") {
              return {};
            }
            if (c2 === "true") {
              c2 = o2 || a2;
            }
            if (t2.pathInfo.anchor && c2.indexOf("#") === -1) {
              c2 = c2 + "#" + t2.pathInfo.anchor;
            }
            return { type: f2, path: c2 };
          } else {
            return {};
          }
        }
        function Mr(l2, u2) {
          var f2 = u2.xhr;
          var c2 = u2.target;
          var e2 = u2.etc;
          var t2 = u2.requestConfig;
          var h2 = u2.select;
          if (!ce(l2, "htmx:beforeOnLoad", u2)) return;
          if (O(f2, /HX-Trigger:/i)) {
            _e(f2, "HX-Trigger", l2);
          }
          if (O(f2, /HX-Location:/i)) {
            er();
            var r2 = f2.getResponseHeader("HX-Location");
            var v2;
            if (r2.indexOf("{") === 0) {
              v2 = E(r2);
              r2 = v2["path"];
              delete v2["path"];
            }
            Nr("GET", r2, v2).then(function() {
              tr(r2);
            });
            return;
          }
          var n2 = O(f2, /HX-Refresh:/i) && "true" === f2.getResponseHeader("HX-Refresh");
          if (O(f2, /HX-Redirect:/i)) {
            location.href = f2.getResponseHeader("HX-Redirect");
            n2 && location.reload();
            return;
          }
          if (n2) {
            location.reload();
            return;
          }
          if (O(f2, /HX-Retarget:/i)) {
            if (f2.getResponseHeader("HX-Retarget") === "this") {
              u2.target = l2;
            } else {
              u2.target = ue(l2, f2.getResponseHeader("HX-Retarget"));
            }
          }
          var d2 = Pr(l2, u2);
          var i2 = f2.status >= 200 && f2.status < 400 && f2.status !== 204;
          var g2 = f2.response;
          var a2 = f2.status >= 400;
          var p2 = Q.config.ignoreTitle;
          var o2 = le({ shouldSwap: i2, serverResponse: g2, isError: a2, ignoreTitle: p2 }, u2);
          if (!ce(c2, "htmx:beforeSwap", o2)) return;
          c2 = o2.target;
          g2 = o2.serverResponse;
          a2 = o2.isError;
          p2 = o2.ignoreTitle;
          u2.target = c2;
          u2.failed = a2;
          u2.successful = !a2;
          if (o2.shouldSwap) {
            if (f2.status === 286) {
              at(l2);
            }
            R(l2, function(e3) {
              g2 = e3.transformResponse(g2, f2, l2);
            });
            if (d2.type) {
              er();
            }
            var s2 = e2.swapOverride;
            if (O(f2, /HX-Reswap:/i)) {
              s2 = f2.getResponseHeader("HX-Reswap");
            }
            var v2 = wr(l2, s2);
            if (v2.hasOwnProperty("ignoreTitle")) {
              p2 = v2.ignoreTitle;
            }
            c2.classList.add(Q.config.swappingClass);
            var m2 = null;
            var x2 = null;
            var y2 = function() {
              try {
                var e3 = document.activeElement;
                var t3 = {};
                try {
                  t3 = { elt: e3, start: e3 ? e3.selectionStart : null, end: e3 ? e3.selectionEnd : null };
                } catch (e4) {
                }
                var r3;
                if (h2) {
                  r3 = h2;
                }
                if (O(f2, /HX-Reselect:/i)) {
                  r3 = f2.getResponseHeader("HX-Reselect");
                }
                if (d2.type) {
                  ce(re().body, "htmx:beforeHistoryUpdate", le({ history: d2 }, u2));
                  if (d2.type === "push") {
                    tr(d2.path);
                    ce(re().body, "htmx:pushedIntoHistory", { path: d2.path });
                  } else {
                    rr(d2.path);
                    ce(re().body, "htmx:replacedInHistory", { path: d2.path });
                  }
                }
                var n3 = T(c2);
                je(v2.swapStyle, c2, l2, g2, n3, r3);
                if (t3.elt && !se(t3.elt) && ee(t3.elt, "id")) {
                  var i3 = document.getElementById(ee(t3.elt, "id"));
                  var a3 = { preventScroll: v2.focusScroll !== void 0 ? !v2.focusScroll : !Q.config.defaultFocusScroll };
                  if (i3) {
                    if (t3.start && i3.setSelectionRange) {
                      try {
                        i3.setSelectionRange(t3.start, t3.end);
                      } catch (e4) {
                      }
                    }
                    i3.focus(a3);
                  }
                }
                c2.classList.remove(Q.config.swappingClass);
                oe(n3.elts, function(e4) {
                  if (e4.classList) {
                    e4.classList.add(Q.config.settlingClass);
                  }
                  ce(e4, "htmx:afterSwap", u2);
                });
                if (O(f2, /HX-Trigger-After-Swap:/i)) {
                  var o3 = l2;
                  if (!se(l2)) {
                    o3 = re().body;
                  }
                  _e(f2, "HX-Trigger-After-Swap", o3);
                }
                var s3 = function() {
                  oe(n3.tasks, function(e5) {
                    e5.call();
                  });
                  oe(n3.elts, function(e5) {
                    if (e5.classList) {
                      e5.classList.remove(Q.config.settlingClass);
                    }
                    ce(e5, "htmx:afterSettle", u2);
                  });
                  if (u2.pathInfo.anchor) {
                    var e4 = re().getElementById(u2.pathInfo.anchor);
                    if (e4) {
                      e4.scrollIntoView({ block: "start", behavior: "auto" });
                    }
                  }
                  if (n3.title && !p2) {
                    var t4 = C("title");
                    if (t4) {
                      t4.innerHTML = n3.title;
                    } else {
                      window.document.title = n3.title;
                    }
                  }
                  Cr(n3.elts, v2);
                  if (O(f2, /HX-Trigger-After-Settle:/i)) {
                    var r4 = l2;
                    if (!se(l2)) {
                      r4 = re().body;
                    }
                    _e(f2, "HX-Trigger-After-Settle", r4);
                  }
                  ie(m2);
                };
                if (v2.settleDelay > 0) {
                  setTimeout(s3, v2.settleDelay);
                } else {
                  s3();
                }
              } catch (e4) {
                fe(l2, "htmx:swapError", u2);
                ie(x2);
                throw e4;
              }
            };
            var b2 = Q.config.globalViewTransitions;
            if (v2.hasOwnProperty("transition")) {
              b2 = v2.transition;
            }
            if (b2 && ce(l2, "htmx:beforeTransition", u2) && typeof Promise !== "undefined" && document.startViewTransition) {
              var w2 = new Promise(function(e3, t3) {
                m2 = e3;
                x2 = t3;
              });
              var S2 = y2;
              y2 = function() {
                document.startViewTransition(function() {
                  S2();
                  return w2;
                });
              };
            }
            if (v2.swapDelay > 0) {
              setTimeout(y2, v2.swapDelay);
            } else {
              y2();
            }
          }
          if (a2) {
            fe(l2, "htmx:responseError", le({ error: "Response Status Error Code " + f2.status + " from " + u2.pathInfo.requestPath }, u2));
          }
        }
        var Xr = {};
        function Dr() {
          return { init: function(e2) {
            return null;
          }, onEvent: function(e2, t2) {
            return true;
          }, transformResponse: function(e2, t2, r2) {
            return e2;
          }, isInlineSwap: function(e2) {
            return false;
          }, handleSwap: function(e2, t2, r2, n2) {
            return false;
          }, encodeParameters: function(e2, t2, r2) {
            return null;
          } };
        }
        function Ur(e2, t2) {
          if (t2.init) {
            t2.init(r);
          }
          Xr[e2] = le(Dr(), t2);
        }
        function Br(e2) {
          delete Xr[e2];
        }
        function Fr(e2, r2, n2) {
          if (e2 == void 0) {
            return r2;
          }
          if (r2 == void 0) {
            r2 = [];
          }
          if (n2 == void 0) {
            n2 = [];
          }
          var t2 = te(e2, "hx-ext");
          if (t2) {
            oe(t2.split(","), function(e3) {
              e3 = e3.replace(/ /g, "");
              if (e3.slice(0, 7) == "ignore:") {
                n2.push(e3.slice(7));
                return;
              }
              if (n2.indexOf(e3) < 0) {
                var t3 = Xr[e3];
                if (t3 && r2.indexOf(t3) < 0) {
                  r2.push(t3);
                }
              }
            });
          }
          return Fr(u(e2), r2, n2);
        }
        var Vr = false;
        re().addEventListener("DOMContentLoaded", function() {
          Vr = true;
        });
        function jr(e2) {
          if (Vr || re().readyState === "complete") {
            e2();
          } else {
            re().addEventListener("DOMContentLoaded", e2);
          }
        }
        function _r() {
          if (Q.config.includeIndicatorStyles !== false) {
            re().head.insertAdjacentHTML("beforeend", "<style>                      ." + Q.config.indicatorClass + "{opacity:0}                      ." + Q.config.requestClass + " ." + Q.config.indicatorClass + "{opacity:1; transition: opacity 200ms ease-in;}                      ." + Q.config.requestClass + "." + Q.config.indicatorClass + "{opacity:1; transition: opacity 200ms ease-in;}                    </style>");
          }
        }
        function zr() {
          var e2 = re().querySelector('meta[name="htmx-config"]');
          if (e2) {
            return E(e2.content);
          } else {
            return null;
          }
        }
        function $r() {
          var e2 = zr();
          if (e2) {
            Q.config = le(Q.config, e2);
          }
        }
        jr(function() {
          $r();
          _r();
          var e2 = re().body;
          zt(e2);
          var t2 = re().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");
          e2.addEventListener("htmx:abort", function(e3) {
            var t3 = e3.target;
            var r3 = ae(t3);
            if (r3 && r3.xhr) {
              r3.xhr.abort();
            }
          });
          const r2 = window.onpopstate ? window.onpopstate.bind(window) : null;
          window.onpopstate = function(e3) {
            if (e3.state && e3.state.htmx) {
              ar();
              oe(t2, function(e4) {
                ce(e4, "htmx:restored", { document: re(), triggerEvent: ce });
              });
            } else {
              if (r2) {
                r2(e3);
              }
            }
          };
          setTimeout(function() {
            ce(e2, "htmx:load", {});
            e2 = null;
          }, 0);
        });
        return Q;
      }();
    });
  }
});
export default require_htmx_min();
//# sourceMappingURL=htmx__org.js.map
