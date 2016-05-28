(function (h, e, g) {
    var n = {
        beforeShow: b,
        move: b,
        change: b,
        show: b,
        hide: b,
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false, showPalette: false, showPaletteOnly: false, hideAfterPaletteSelect: false, togglePaletteOnly: false, showSelectionPalette: true, localStorageKey: false, appendTo: "body", maxSelectionSize: 7, cancelText: "cancel", chooseText: "choose", togglePaletteMoreText: "more", togglePaletteLessText: "less", clearText: "Clear Color Selection", noColorSelectedText: "No Color Selected", preferredFormat: false, className: "", containerClassName: "", replacerClassName: "", showAlpha: false, theme: "sp-light", palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]], selectionPalette: [], disabled: false}, d = [], i = !!/msie/i.exec(h.navigator.userAgent), l = (function () {
        function v(z, y) {
            return !!~("" + z).indexOf(y)
        }
        var x = document.createElement("div");
        var w = x.style;
        w.cssText = "background-color:rgba(0,0,0,.5)";
        return v(w.backgroundColor, "rgba") || v(w.backgroundColor, "hsla")
    })(), m = (function () {
        var v = e("<input type='color' value='!' />")[0];
        return v.type === "color" && v.value !== "!"
    })(), r = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "<div class='sp-dd'>&#9660;</div>", "</div>"].join(""), q = (function () {
        var v = "";
        if (i) {
            for (var w = 1; w <= 6; w++) {
                v += "<div class='sp-" + w + "'></div>"
            }
        }
        return["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", v, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("")
    })();
    function u(x, z, D, v) {
        var B = [];
        for (var A = 0; A < x.length; A++) {
            var C = x[A];
            if (C) {
                var w = tinycolor(C);
                var F = w.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                F += (tinycolor.equals(z, C)) ? " sp-thumb-active" : "";
                var E = w.toString(v.preferredFormat || "rgb");
                var y = l ? ("background-color:" + w.toRgbString()) : "filter:" + w.toFilter();
                B.push('<span title="' + E + '" data-color="' + w.toRgbString() + '" class="' + F + '"><span class="sp-thumb-inner" style="' + y + ';" /></span>')
            } else {
                var G = "sp-clear-display";
                B.push(e("<div />").append(e('<span data-color="" style="background-color:transparent;" class="' + G + '"></span>').attr("title", v.noColorSelectedText)).html())
            }
        }
        return"<div class='sp-cf " + D + "'>" + B.join("") + "</div>"
    }
    function p() {
        for (var v = 0; v < d.length; v++) {
            if (d[v]) {
                d[v].hide()
            }
        }
    }
    function o(x, v) {
        var w = e.extend({}, n, x);
        w.callbacks = {move: t(w.move, v), change: t(w.change, v), show: t(w.show, v), hide: t(w.hide, v), beforeShow: t(w.beforeShow, v)};
        return w
    }
    function s(a6, ai) {
        var a5 = o(ai, a6), a1 = a5.flat, X = a5.showSelectionPalette, x = a5.localStorageKey, ak = a5.theme, S = a5.callbacks, F = f(ae, 10), P = false, aK = 0, ag = 0, aL = 0, ax = 0, M = 0, aw = 0, aW = 0, ap = 0, Z = 0, Q = 0, aA = 0, aX = 1, aj = [], al = [], a3 = {}, aG = a5.selectionPalette.slice(0), aF = a5.maxSelectionSize, y = "sp-dragging", H = null;
        var Y = a6.ownerDocument, O = Y.body, E = e(a6), aU = false, aM = e(q, Y).addClass(ak), v = aM.find(".sp-picker-container"), J = aM.find(".sp-color"), aJ = aM.find(".sp-dragger"), N = aM.find(".sp-hue"), a0 = aM.find(".sp-slider"), aC = aM.find(".sp-alpha-inner"), aa = aM.find(".sp-alpha"), aD = aM.find(".sp-alpha-handle"), L = aM.find(".sp-input"), R = aM.find(".sp-palette"), a4 = aM.find(".sp-initial"), ao = aM.find(".sp-cancel"), am = aM.find(".sp-clear"), I = aM.find(".sp-choose"), aO = aM.find(".sp-palette-toggle"), T = E.is("input"), C = T && m && E.attr("type") === "color", az = T && !a1, aS = (az) ? e(r).addClass(ak).addClass(a5.className).addClass(a5.replacerClassName) : e([]), au = (az) ? aS : E, K = aS.find(".sp-preview-inner"), U = a5.color || (T && E.val()), aN = false, W = a5.preferredFormat, ar = W, G = !a5.showButtons || a5.clickoutFiresChange, D = !U, a2 = a5.allowEmpty && !C;
        function w() {
            if (a5.showPaletteOnly) {
                a5.showPalette = true
            }
            aO.text(a5.showPaletteOnly ? a5.togglePaletteMoreText : a5.togglePaletteLessText);
            if (a5.palette) {
                aj = a5.palette.slice(0);
                al = e.isArray(aj[0]) ? aj : [aj];
                a3 = {};
                for (var ba = 0; ba < al.length; ba++) {
                    for (var a9 = 0; a9 < al[ba].length; a9++) {
                        var a8 = tinycolor(al[ba][a9]).toRgbString();
                        a3[a8] = true
                    }
                }
            }
            aM.toggleClass("sp-flat", a1);
            aM.toggleClass("sp-input-disabled", !a5.showInput);
            aM.toggleClass("sp-alpha-enabled", a5.showAlpha);
            aM.toggleClass("sp-clear-enabled", a2);
            aM.toggleClass("sp-buttons-disabled", !a5.showButtons);
            aM.toggleClass("sp-palette-buttons-disabled", !a5.togglePaletteOnly);
            aM.toggleClass("sp-palette-disabled", !a5.showPalette);
            aM.toggleClass("sp-palette-only", a5.showPaletteOnly);
            aM.toggleClass("sp-initial-disabled", !a5.showInitial);
            aM.addClass(a5.className).addClass(a5.containerClassName);
            ae()
        }
        function aH() {
            if (i) {
                aM.find("*:not(input)").attr("unselectable", "on")
            }
            w();
            if (az) {
                E.after(aS).hide()
            }
            if (!a2) {
                am.hide()
            }
            if (a1) {
                E.after(aM).hide()
            } else {
                var a9 = a5.appendTo === "parent" ? E.parent() : e(a5.appendTo);
                if (a9.length !== 1) {
                    a9 = e("body")
                }
                a9.append(aM)
            }
            aP();
            au.bind("click.spectrum touchstart.spectrum", function (bb) {
                if (!aU) {
                    av()
                }
                bb.stopPropagation();
                if (!e(bb.target).is("input")) {
                    bb.preventDefault()
                }
            });
            if (E.is(":disabled") || (a5.disabled === true)) {
                V()
            }
            aM.click(k);
            L.change(aQ);
            L.bind("paste", function () {
                setTimeout(aQ, 1)
            });
            L.keydown(function (bb) {
                if (bb.keyCode == 13) {
                    aQ()
                }
            });
            ao.text(a5.cancelText);
            ao.bind("click.spectrum", function (bb) {
                bb.stopPropagation();
                bb.preventDefault();
                at();
                aE()
            });
            am.attr("title", a5.clearText);
            am.bind("click.spectrum", function (bb) {
                bb.stopPropagation();
                bb.preventDefault();
                D = true;
                aI();
                if (a1) {
                    an(true)
                }
            });
            I.text(a5.chooseText);
            I.bind("click.spectrum", function (bb) {
                bb.stopPropagation();
                bb.preventDefault();
                if (ay()) {
                    an(true);
                    aE()
                }
            });
            aO.text(a5.showPaletteOnly ? a5.togglePaletteMoreText : a5.togglePaletteLessText);
            aO.bind("click.spectrum", function (bb) {
                bb.stopPropagation();
                bb.preventDefault();
                a5.showPaletteOnly = !a5.showPaletteOnly;
                if (!a5.showPaletteOnly && !a1) {
                    aM.css("left", "-=" + (v.outerWidth(true) + 5))
                }
                w()
            });
            c(aa, function (bd, bc, bb) {
                aX = (bd / aw);
                D = false;
                if (bb.shiftKey) {
                    aX = Math.round(aX * 10) / 10
                }
                aI()
            }, B, a7);
            c(N, function (bc, bb) {
                Z = parseFloat(bb / ax);
                D = false;
                if (!a5.showAlpha) {
                    aX = 1
                }
                aI()
            }, B, a7);
            c(J, function (bi, bg, bf) {
                if (!bf.shiftKey) {
                    H = null
                } else {
                    if (!H) {
                        var bd = Q * aK;
                        var bb = ag - (aA * ag);
                        var bc = Math.abs(bi - bd) > Math.abs(bg - bb);
                        H = bc ? "x" : "y"
                    }
                }
                var be = !H || H === "x";
                var bh = !H || H === "y";
                if (be) {
                    Q = parseFloat(bi / aK)
                }
                if (bh) {
                    aA = parseFloat((ag - bg) / ag)
                }
                D = false;
                if (!a5.showAlpha) {
                    aX = 1
                }
                aI()
            }, B, a7);
            if (!!U) {
                ad(U);
                aB();
                ar = W || tinycolor(U).format;
                aT(U)
            } else {
                aB()
            }
            if (a1) {
                A()
            }
            function ba(bb) {
                if (bb.data && bb.data.ignore) {
                    ad(e(bb.target).closest(".sp-thumb-el").data("color"));
                    aI()
                } else {
                    ad(e(bb.target).closest(".sp-thumb-el").data("color"));
                    aI();
                    an(true);
                    if (a5.hideAfterPaletteSelect) {
                        aE()
                    }
                }
                return false
            }
            var a8 = i ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            R.delegate(".sp-thumb-el", a8, ba);
            a4.delegate(".sp-thumb-el:nth-child(1)", a8, {ignore: true}, ba)
        }
        function aP() {
            if (x && h.localStorage) {
                try {
                    var a8 = h.localStorage[x].split(",#");
                    if (a8.length > 1) {
                        delete h.localStorage[x];
                        e.each(a8, function (ba, bb) {
                            aT(bb)
                        })
                    }
                } catch (a9) {
                }
                try {
                    aG = h.localStorage[x].split(";")
                } catch (a9) {
                }
            }
        }
        function aT(a8) {
            if (X) {
                var a9 = tinycolor(a8).toRgbString();
                if (!a3[a9] && e.inArray(a9, aG) === -1) {
                    aG.push(a9);
                    while (aG.length > aF) {
                        aG.shift()
                    }
                }
                if (x && h.localStorage) {
                    try {
                        h.localStorage[x] = aG.join(";")
                    } catch (ba) {
                    }
                }
            }
        }
        function aV() {
            var ba = [];
            if (a5.showPalette) {
                for (var a9 = 0; a9 < aG.length; a9++) {
                    var a8 = tinycolor(aG[a9]).toRgbString();
                    if (!a3[a8]) {
                        ba.push(aG[a9])
                    }
                }
            }
            return ba.reverse().slice(0, a5.maxSelectionSize)
        }
        function aY() {
            var a8 = aR();
            var a9 = e.map(al, function (ba, bb) {
                return u(ba, a8, "sp-palette-row sp-palette-row-" + bb, a5)
            });
            aP();
            if (aG) {
                a9.push(u(aV(), a8, "sp-palette-row sp-palette-row-selection", a5))
            }
            R.html(a9.join(""))
        }
        function aq() {
            if (a5.showInitial) {
                var a8 = aN;
                var a9 = aR();
                a4.html(u([a8, a9], a9, "sp-palette-row-initial", a5))
            }
        }
        function B() {
            if (ag <= 0 || aK <= 0 || ax <= 0) {
                ae()
            }
            aM.addClass(y);
            H = null;
            E.trigger("dragstart.spectrum", [aR()])
        }
        function a7() {
            aM.removeClass(y);
            E.trigger("dragstop.spectrum", [aR()])
        }
        function aQ() {
            var a9 = L.val();
            if ((a9 === null || a9 === "") && a2) {
                ad(null);
                an(true)
            } else {
                var a8 = tinycolor(a9);
                if (a8.isValid()) {
                    ad(a8);
                    an(true)
                } else {
                    L.addClass("sp-validation-error")
                }
            }
        }
        function av() {
            if (P) {
                aE()
            } else {
                A()
            }
        }
        function A() {
            var a8 = e.Event("beforeShow.spectrum");
            if (P) {
                ae();
                return
            }
            E.trigger(a8, [aR()]);
            if (S.beforeShow(aR()) === false || a8.isDefaultPrevented()) {
                return
            }
            p();
            P = true;
            e(Y).bind("click.spectrum", ac);
            e(h).bind("resize.spectrum", F);
            aS.addClass("sp-active");
            aM.removeClass("sp-hidden");
            ae();
            aB();
            aN = aR();
            aq();
            S.show(aN);
            E.trigger("show.spectrum", [aN])
        }
        function ac(a8) {
            if (a8 && a8.type == "click" && a8.button == 2) {
                return
            }
            if (G) {
                an(true)
            } else {
                at()
            }
            aE()
        }
        function aE() {
            if (!P || a1) {
                return
            }
            P = false;
            e(Y).unbind("click.spectrum", ac);
            e(h).unbind("resize.spectrum", F);
            aS.removeClass("sp-active");
            aM.addClass("sp-hidden");
            S.hide(aR());
            E.trigger("hide.spectrum", [aR()])
        }
        function at() {
            ad(aN, true)
        }
        function ad(a8, ba) {
            if (tinycolor.equals(a8, aR())) {
                aB();
                return
            }
            var a9, bb;
            if (!a8 && a2) {
                D = true
            } else {
                D = false;
                a9 = tinycolor(a8);
                bb = a9.toHsv();
                Z = (bb.h % 360) / 360;
                Q = bb.s;
                aA = bb.v;
                aX = bb.a
            }
            aB();
            if (a9 && a9.isValid() && !ba) {
                ar = W || a9.getFormat()
            }
        }
        function aR(a8) {
            a8 = a8 || {};
            if (a2 && D) {
                return null
            }
            return tinycolor.fromRatio({h: Z, s: Q, v: aA, a: Math.round(aX * 100) / 100}, {format: a8.format || ar})
        }
        function ay() {
            return !L.hasClass("sp-validation-error")
        }
        function aI() {
            aB();
            S.move(aR());
            E.trigger("move.spectrum", [aR()])
        }
        function aB() {
            L.removeClass("sp-validation-error");
            aZ();
            var ba = tinycolor.fromRatio({h: Z, s: 1, v: 1});
            J.css("background-color", ba.toHexString());
            var bf = ar;
            if (aX < 1 && !(aX === 0 && bf === "name")) {
                if (bf === "hex" || bf === "hex3" || bf === "hex6" || bf === "name") {
                    bf = "rgb"
                }
            }
            var a8 = aR({format: bf}), bb = "";
            K.removeClass("sp-clear-display");
            K.css("background-color", "transparent");
            if (!a8 && a2) {
                K.addClass("sp-clear-display")
            } else {
                var bc = a8.toHexString(), bg = a8.toRgbString();
                if (l || a8.alpha === 1) {
                    K.css("background-color", bg)
                } else {
                    K.css("background-color", "transparent");
                    K.css("filter", a8.toFilter())
                }
                if (a5.showAlpha) {
                    var bd = a8.toRgb();
                    bd.a = 0;
                    var a9 = tinycolor(bd).toRgbString();
                    var be = "linear-gradient(left, " + a9 + ", " + bc + ")";
                    if (i) {
                        aC.css("filter", tinycolor(a9).toFilter({gradientType: 1}, bc))
                    } else {
                        aC.css("background", "-webkit-" + be);
                        aC.css("background", "-moz-" + be);
                        aC.css("background", "-ms-" + be);
                        aC.css("background", "linear-gradient(to right, " + a9 + ", " + bc + ")")
                    }
                }
                bb = a8.toString(bf)
            }
            if (a5.showInput) {
                L.val(bb)
            }
            if (a5.showPalette) {
                aY()
            }
            aq()
        }
        function aZ() {
            var ba = Q;
            var a8 = aA;
            if (a2 && D) {
                aD.hide();
                a0.hide();
                aJ.hide()
            } else {
                aD.show();
                a0.show();
                aJ.show();
                var bd = ba * aK;
                var bb = ag - (a8 * ag);
                bd = Math.max(-aL, Math.min(aK - aL, bd - aL));
                bb = Math.max(-aL, Math.min(ag - aL, bb - aL));
                aJ.css({top: bb + "px", left: bd + "px"});
                var a9 = aX * aw;
                aD.css({left: (a9 - (aW / 2)) + "px"});
                var bc = (Z) * ax;
                a0.css({top: (bc - ap) + "px"})
            }
        }
        function an(a9) {
            var a8 = aR(), bb = "", ba = !tinycolor.equals(a8, aN);
            if (a8) {
                bb = a8.toString(ar);
                aT(a8)
            }
            if (T) {
                E.val(bb)
            }
            if (a9 && ba) {
                S.change(a8);
                E.trigger("change", [a8])
            }
        }
        function ae() {
            aK = J.width();
            ag = J.height();
            aL = aJ.height();
            M = N.width();
            ax = N.height();
            ap = a0.height();
            aw = aa.width();
            aW = aD.width();
            if (!a1) {
                aM.css("position", "absolute");
                aM.offset(a(aM, au))
            }
            aZ();
            if (a5.showPalette) {
                aY()
            }
            E.trigger("reflow.spectrum")
        }
        function z() {
            E.show();
            au.unbind("click.spectrum touchstart.spectrum");
            aM.remove();
            aS.remove();
            d[af.id] = null
        }
        function ab(a8, a9) {
            if (a8 === g) {
                return e.extend({}, a5)
            }
            if (a9 === g) {
                return a5[a8]
            }
            a5[a8] = a9;
            w()
        }
        function ah() {
            aU = false;
            E.attr("disabled", false);
            au.removeClass("sp-disabled")
        }
        function V() {
            aE();
            aU = true;
            E.attr("disabled", true);
            au.addClass("sp-disabled")
        }
        aH();
        var af = {show: A, hide: aE, toggle: av, reflow: ae, option: ab, enable: ah, disable: V, set: function (a8) {
                ad(a8);
                an()
            }, get: aR, destroy: z, container: aM};
        af.id = d.push(af) - 1;
        return af
    }
    function a(C, D) {
        var B = 0;
        var z = C.outerWidth();
        var F = C.outerHeight();
        var v = D.outerHeight();
        var E = C[0].ownerDocument;
        var w = E.documentElement;
        var A = w.clientWidth + e(E).scrollLeft();
        var x = w.clientHeight + e(E).scrollTop();
        var y = D.offset();
        y.top += v;
        y.left -= Math.min(y.left, (y.left + z > A && A > z) ? Math.abs(y.left + z - A) : 0);
        y.top -= Math.min(y.top, ((y.top + F > x && x > F) ? Math.abs(F + v - B) : B));
        return y
    }
    function b() {
    }
    function k(v) {
        v.stopPropagation()
    }
    function t(w, x) {
        var y = Array.prototype.slice;
        var v = y.call(arguments, 2);
        return function () {
            return w.apply(x, v.concat(y.call(arguments)))
        }
    }
    function c(A, F, w, x) {
        F = F || function () {
        };
        w = w || function () {
        };
        x = x || function () {
        };
        var G = document;
        var I = false;
        var z = {};
        var J = 0;
        var H = 0;
        var C = ("ontouchstart" in h);
        var B = {};
        B.selectstart = E;
        B.dragstart = E;
        B["touchmove mousemove"] = y;
        B["touchend mouseup"] = D;
        function E(K) {
            if (K.stopPropagation) {
                K.stopPropagation()
            }
            if (K.preventDefault) {
                K.preventDefault()
            }
            K.returnValue = false
        }
        function y(O) {
            if (I) {
                if (i && G.documentMode < 9 && !O.button) {
                    return D()
                }
                var N = O.originalEvent.touches;
                var L = N ? N[0].pageX : O.pageX;
                var K = N ? N[0].pageY : O.pageY;
                var P = Math.max(0, Math.min(L - z.left, H));
                var M = Math.max(0, Math.min(K - z.top, J));
                if (C) {
                    E(O)
                }
                F.apply(A, [P, M, O])
            }
        }
        function v(L) {
            var K = (L.which) ? (L.which == 3) : (L.button == 2);
            if (!K && !I) {
                if (w.apply(A, arguments) !== false) {
                    I = true;
                    J = e(A).height();
                    H = e(A).width();
                    z = e(A).offset();
                    e(G).bind(B);
                    e(G.body).addClass("sp-dragging");
                    if (!C) {
                        y(L)
                    }
                    E(L)
                }
            }
        }
        function D() {
            if (I) {
                e(G).unbind(B);
                e(G.body).removeClass("sp-dragging");
                x.apply(A, arguments)
            }
            I = false
        }
        e(A).bind("touchstart mousedown", v)
    }
    function f(w, y, v) {
        var x;
        return function () {
            var A = this, z = arguments;
            var B = function () {
                x = null;
                w.apply(A, z)
            };
            if (v) {
                clearTimeout(x)
            }
            if (v || !x) {
                x = setTimeout(B, y)
            }
        }
    }
    var j = "spectrum.id";
    e.fn.spectrum = function (y, v) {
        if (typeof y == "string") {
            var x = this;
            var w = Array.prototype.slice.call(arguments, 1);
            this.each(function () {
                var z = d[e(this).data(j)];
                if (z) {
                    var A = z[y];
                    if (!A) {
                        throw new Error("Spectrum: no such method: '" + y + "'")
                    }
                    if (y == "get") {
                        x = z.get()
                    } else {
                        if (y == "container") {
                            x = z.container
                        } else {
                            if (y == "option") {
                                x = z.option.apply(z, w)
                            } else {
                                if (y == "destroy") {
                                    z.destroy();
                                    e(this).removeData(j)
                                } else {
                                    A.apply(z, w)
                                }
                            }
                        }
                    }
                }
            });
            return x
        }
        return this.spectrum("destroy").each(function () {
            var z = e.extend({}, y, e(this).data());
            var A = s(this, z);
            e(this).data(j, A.id)
        })
    };
    e.fn.spectrum.load = true;
    e.fn.spectrum.loadOpts = {};
    e.fn.spectrum.draggable = c;
    e.fn.spectrum.defaults = n;
    e.spectrum = {};
    e.spectrum.localization = {};
    e.spectrum.palettes = {};
    e.fn.spectrum.processNativeColorInputs = function () {
        if (!m) {
            e("input[type=color]").spectrum({preferredFormat: "hex6"})
        }
    };
    (function () {
        var Z = /^[\s,#]+/, L = /\s+$/, ae = 0, Q = Math, U = Q.round, al = Q.min, N = Q.max, E = Q.random;
        var ag = function ag(ao, aq) {
            ao = (ao) ? ao : "";
            aq = aq || {};
            if (ao instanceof ag) {
                return ao
            }
            if (!(this instanceof ag)) {
                return new ag(ao, aq)
            }
            var ap = ad(ao);
            this._r = ap.r, this._g = ap.g, this._b = ap.b, this._a = ap.a, this._roundA = U(100 * this._a) / 100, this._format = aq.format || ap.format;
            this._gradientType = aq.gradientType;
            if (this._r < 1) {
                this._r = U(this._r)
            }
            if (this._g < 1) {
                this._g = U(this._g)
            }
            if (this._b < 1) {
                this._b = U(this._b)
            }
            this._ok = ap.ok;
            this._tc_id = ae++
        };
        ag.prototype = {isDark: function () {
                return this.getBrightness() < 128
            }, isLight: function () {
                return !this.isDark()
            }, isValid: function () {
                return this._ok
            }, getFormat: function () {
                return this._format
            }, getAlpha: function () {
                return this._a
            }, getBrightness: function () {
                var ao = this.toRgb();
                return(ao.r * 299 + ao.g * 587 + ao.b * 114) / 1000
            }, setAlpha: function (ao) {
                this._a = F(ao);
                this._roundA = U(100 * this._a) / 100;
                return this
            }, toHsv: function () {
                var ao = C(this._r, this._g, this._b);
                return{h: ao.h * 360, s: ao.s, v: ao.v, a: this._a}
            }, toHsvString: function () {
                var ap = C(this._r, this._g, this._b);
                var ar = U(ap.h * 360), aq = U(ap.s * 100), ao = U(ap.v * 100);
                return(this._a == 1) ? "hsv(" + ar + ", " + aq + "%, " + ao + "%)" : "hsva(" + ar + ", " + aq + "%, " + ao + "%, " + this._roundA + ")"
            }, toHsl: function () {
                var ao = H(this._r, this._g, this._b);
                return{h: ao.h * 360, s: ao.s, l: ao.l, a: this._a}
            }, toHslString: function () {
                var ap = H(this._r, this._g, this._b);
                var ar = U(ap.h * 360), aq = U(ap.s * 100), ao = U(ap.l * 100);
                return(this._a == 1) ? "hsl(" + ar + ", " + aq + "%, " + ao + "%)" : "hsla(" + ar + ", " + aq + "%, " + ao + "%, " + this._roundA + ")"
            }, toHex: function (ao) {
                return ac(this._r, this._g, this._b, ao)
            }, toHexString: function (ao) {
                return"#" + this.toHex(ao)
            }, toHex8: function () {
                return am(this._r, this._g, this._b, this._a)
            }, toHex8String: function () {
                return"#" + this.toHex8()
            }, toRgb: function () {
                return{r: U(this._r), g: U(this._g), b: U(this._b), a: this._a}
            }, toRgbString: function () {
                return(this._a == 1) ? "rgb(" + U(this._r) + ", " + U(this._g) + ", " + U(this._b) + ")" : "rgba(" + U(this._r) + ", " + U(this._g) + ", " + U(this._b) + ", " + this._roundA + ")"
            }, toPercentageRgb: function () {
                return{r: U(ah(this._r, 255) * 100) + "%", g: U(ah(this._g, 255) * 100) + "%", b: U(ah(this._b, 255) * 100) + "%", a: this._a}
            }, toPercentageRgbString: function () {
                return(this._a == 1) ? "rgb(" + U(ah(this._r, 255) * 100) + "%, " + U(ah(this._g, 255) * 100) + "%, " + U(ah(this._b, 255) * 100) + "%)" : "rgba(" + U(ah(this._r, 255) * 100) + "%, " + U(ah(this._g, 255) * 100) + "%, " + U(ah(this._b, 255) * 100) + "%, " + this._roundA + ")"
            }, toName: function () {
                if (this._a === 0) {
                    return"transparent"
                }
                if (this._a < 1) {
                    return false
                }
                return an[ac(this._r, this._g, this._b, true)] || false
            }, toFilter: function (ar) {
                var at = "#" + am(this._r, this._g, this._b, this._a);
                var ap = at;
                var ao = this._gradientType ? "GradientType = 1, " : "";
                if (ar) {
                    var aq = ag(ar);
                    ap = aq.toHex8String()
                }
                return"progid:DXImageTransform.Microsoft.gradient(" + ao + "startColorstr=" + at + ",endColorstr=" + ap + ")"
            }, toString: function (ar) {
                var ao = !!ar;
                ar = ar || this._format;
                var aq = false;
                var ap = this._a < 1 && this._a >= 0;
                var at = !ao && ap && (ar === "hex" || ar === "hex6" || ar === "hex3" || ar === "name");
                if (at) {
                    if (ar === "name" && this._a === 0) {
                        return this.toName()
                    }
                    return this.toRgbString()
                }
                if (ar === "rgb") {
                    aq = this.toRgbString()
                }
                if (ar === "prgb") {
                    aq = this.toPercentageRgbString()
                }
                if (ar === "hex" || ar === "hex6") {
                    aq = this.toHexString()
                }
                if (ar === "hex3") {
                    aq = this.toHexString(true)
                }
                if (ar === "hex8") {
                    aq = this.toHex8String()
                }
                if (ar === "name") {
                    aq = this.toName()
                }
                if (ar === "hsl") {
                    aq = this.toHslString()
                }
                if (ar === "hsv") {
                    aq = this.toHsvString()
                }
                return aq || this.toHexString()
            }, _applyModification: function (aq, ap) {
                var ao = aq.apply(null, [this].concat([].slice.call(ap)));
                this._r = ao._r;
                this._g = ao._g;
                this._b = ao._b;
                this.setAlpha(ao._a);
                return this
            }, lighten: function () {
                return this._applyModification(K, arguments)
            }, brighten: function () {
                return this._applyModification(w, arguments)
            }, darken: function () {
                return this._applyModification(J, arguments)
            }, desaturate: function () {
                return this._applyModification(P, arguments)
            }, saturate: function () {
                return this._applyModification(aa, arguments)
            }, greyscale: function () {
                return this._applyModification(z, arguments)
            }, spin: function () {
                return this._applyModification(af, arguments)
            }, _applyCombination: function (ap, ao) {
                return ap.apply(null, [this].concat([].slice.call(ao)))
            }, analogous: function () {
                return this._applyCombination(S, arguments)
            }, complement: function () {
                return this._applyCombination(X, arguments)
            }, monochromatic: function () {
                return this._applyCombination(M, arguments)
            }, splitcomplement: function () {
                return this._applyCombination(V, arguments)
            }, triad: function () {
                return this._applyCombination(A, arguments)
            }, tetrad: function () {
                return this._applyCombination(ak, arguments)
            }};
        ag.fromRatio = function (ao, ar) {
            if (typeof ao == "object") {
                var ap = {};
                for (var aq in ao) {
                    if (ao.hasOwnProperty(aq)) {
                        if (aq === "a") {
                            ap[aq] = ao[aq]
                        } else {
                            ap[aq] = I(ao[aq])
                        }
                    }
                }
                ao = ap
            }
            return ag(ao, ar)
        };
        function ad(ap) {
            var aq = {r: 0, g: 0, b: 0};
            var ao = 1;
            var ar = false;
            var at = false;
            if (typeof ap == "string") {
                ap = O(ap)
            }
            if (typeof ap == "object") {
                if (ap.hasOwnProperty("r") && ap.hasOwnProperty("g") && ap.hasOwnProperty("b")) {
                    aq = B(ap.r, ap.g, ap.b);
                    ar = true;
                    at = String(ap.r).substr(-1) === "%" ? "prgb" : "rgb"
                } else {
                    if (ap.hasOwnProperty("h") && ap.hasOwnProperty("s") && ap.hasOwnProperty("v")) {
                        ap.s = I(ap.s);
                        ap.v = I(ap.v);
                        aq = ab(ap.h, ap.s, ap.v);
                        ar = true;
                        at = "hsv"
                    } else {
                        if (ap.hasOwnProperty("h") && ap.hasOwnProperty("s") && ap.hasOwnProperty("l")) {
                            ap.s = I(ap.s);
                            ap.l = I(ap.l);
                            aq = T(ap.h, ap.s, ap.l);
                            ar = true;
                            at = "hsl"
                        }
                    }
                }
                if (ap.hasOwnProperty("a")) {
                    ao = ap.a
                }
            }
            ao = F(ao);
            return{ok: ar, format: ap.format || at, r: al(255, N(aq.r, 0)), g: al(255, N(aq.g, 0)), b: al(255, N(aq.b, 0)), a: ao}
        }
        function B(aq, ap, ao) {
            return{r: ah(aq, 255) * 255, g: ah(ap, 255) * 255, b: ah(ao, 255) * 255}
        }
        function H(ao, at, av) {
            ao = ah(ao, 255);
            at = ah(at, 255);
            av = ah(av, 255);
            var aw = N(ao, at, av), aq = al(ao, at, av);
            var ar, ax, ap = (aw + aq) / 2;
            if (aw == aq) {
                ar = ax = 0
            } else {
                var au = aw - aq;
                ax = ap > 0.5 ? au / (2 - aw - aq) : au / (aw + aq);
                switch (aw) {
                    case ao:
                        ar = (at - av) / au + (at < av ? 6 : 0);
                        break;
                    case at:
                        ar = (av - ao) / au + 2;
                        break;
                    case av:
                        ar = (ao - at) / au + 4;
                        break
                }
                ar /= 6
            }
            return{h: ar, s: ax, l: ap}
        }
        function T(au, ax, at) {
            var ao, av, aw;
            au = ah(au, 360);
            ax = ah(ax, 100);
            at = ah(at, 100);
            function ar(aA, az, ay) {
                if (ay < 0) {
                    ay += 1
                }
                if (ay > 1) {
                    ay -= 1
                }
                if (ay < 1 / 6) {
                    return aA + (az - aA) * 6 * ay
                }
                if (ay < 1 / 2) {
                    return az
                }
                if (ay < 2 / 3) {
                    return aA + (az - aA) * (2 / 3 - ay) * 6
                }
                return aA
            }
            if (ax === 0) {
                ao = av = aw = at
            } else {
                var ap = at < 0.5 ? at * (1 + ax) : at + ax - at * ax;
                var aq = 2 * at - ap;
                ao = ar(aq, ap, au + 1 / 3);
                av = ar(aq, ap, au);
                aw = ar(aq, ap, au - 1 / 3)
            }
            return{r: ao * 255, g: av * 255, b: aw * 255}
        }
        function C(ao, ar, au) {
            ao = ah(ao, 255);
            ar = ah(ar, 255);
            au = ah(au, 255);
            var av = N(ao, ar, au), ap = al(ao, ar, au);
            var aq, ax, aw = av;
            var at = av - ap;
            ax = av === 0 ? 0 : at / av;
            if (av == ap) {
                aq = 0
            } else {
                switch (av) {
                    case ao:
                        aq = (ar - au) / at + (ar < au ? 6 : 0);
                        break;
                    case ar:
                        aq = (au - ao) / at + 2;
                        break;
                    case au:
                        aq = (ao - ar) / at + 4;
                        break
                }
                aq /= 6
            }
            return{h: aq, s: ax, v: aw}
        }
        function ab(at, aA, ay) {
            at = ah(at, 360) * 6;
            aA = ah(aA, 100);
            ay = ah(ay, 100);
            var ar = Q.floor(at), av = at - ar, aq = ay * (1 - aA), ap = ay * (1 - av * aA), az = ay * (1 - (1 - av) * aA), ax = ar % 6, ao = [ay, ap, aq, aq, az, ay][ax], au = [az, ay, ay, ap, aq, aq][ax], aw = [aq, aq, az, ay, ay, ap][ax];
            return{r: ao * 255, g: au * 255, b: aw * 255}
        }
        function ac(ar, aq, ao, at) {
            var ap = [R(U(ar).toString(16)), R(U(aq).toString(16)), R(U(ao).toString(16))];
            if (at && ap[0].charAt(0) == ap[0].charAt(1) && ap[1].charAt(0) == ap[1].charAt(1) && ap[2].charAt(0) == ap[2].charAt(1)) {
                return ap[0].charAt(0) + ap[1].charAt(0) + ap[2].charAt(0)
            }
            return ap.join("")
        }
        function am(at, ar, ao, ap) {
            var aq = [R(W(ap)), R(U(at).toString(16)), R(U(ar).toString(16)), R(U(ao).toString(16))];
            return aq.join("")
        }
        ag.equals = function (ap, ao) {
            if (!ap || !ao) {
                return false
            }
            return ag(ap).toRgbString() == ag(ao).toRgbString()
        };
        ag.random = function () {
            return ag.fromRatio({r: E(), g: E(), b: E()})
        };
        function P(ap, aq) {
            aq = (aq === 0) ? 0 : (aq || 10);
            var ao = ag(ap).toHsl();
            ao.s -= aq / 100;
            ao.s = v(ao.s);
            return ag(ao)
        }
        function aa(ap, aq) {
            aq = (aq === 0) ? 0 : (aq || 10);
            var ao = ag(ap).toHsl();
            ao.s += aq / 100;
            ao.s = v(ao.s);
            return ag(ao)
        }
        function z(ao) {
            return ag(ao).desaturate(100)
        }
        function K(ap, aq) {
            aq = (aq === 0) ? 0 : (aq || 10);
            var ao = ag(ap).toHsl();
            ao.l += aq / 100;
            ao.l = v(ao.l);
            return ag(ao)
        }
        function w(ao, aq) {
            aq = (aq === 0) ? 0 : (aq || 10);
            var ap = ag(ao).toRgb();
            ap.r = N(0, al(255, ap.r - U(255 * -(aq / 100))));
            ap.g = N(0, al(255, ap.g - U(255 * -(aq / 100))));
            ap.b = N(0, al(255, ap.b - U(255 * -(aq / 100))));
            return ag(ap)
        }
        function J(ap, aq) {
            aq = (aq === 0) ? 0 : (aq || 10);
            var ao = ag(ap).toHsl();
            ao.l -= aq / 100;
            ao.l = v(ao.l);
            return ag(ao)
        }
        function af(aq, ar) {
            var ap = ag(aq).toHsl();
            var ao = (U(ap.h) + ar) % 360;
            ap.h = ao < 0 ? 360 + ao : ao;
            return ag(ap)
        }
        function X(ap) {
            var ao = ag(ap).toHsl();
            ao.h = (ao.h + 180) % 360;
            return ag(ao)
        }
        function A(ap) {
            var ao = ag(ap).toHsl();
            var aq = ao.h;
            return[ag(ap), ag({h: (aq + 120) % 360, s: ao.s, l: ao.l}), ag({h: (aq + 240) % 360, s: ao.s, l: ao.l})]
        }
        function ak(ap) {
            var ao = ag(ap).toHsl();
            var aq = ao.h;
            return[ag(ap), ag({h: (aq + 90) % 360, s: ao.s, l: ao.l}), ag({h: (aq + 180) % 360, s: ao.s, l: ao.l}), ag({h: (aq + 270) % 360, s: ao.s, l: ao.l})]
        }
        function V(ap) {
            var ao = ag(ap).toHsl();
            var aq = ao.h;
            return[ag(ap), ag({h: (aq + 72) % 360, s: ao.s, l: ao.l}), ag({h: (aq + 216) % 360, s: ao.s, l: ao.l})]
        }
        function S(ap, at, au) {
            at = at || 6;
            au = au || 30;
            var ao = ag(ap).toHsl();
            var ar = 360 / au;
            var aq = [ag(ap)];
            for (ao.h = ((ao.h - (ar * at >> 1)) + 720) % 360; --at; ) {
                ao.h = (ao.h + ar) % 360;
                aq.push(ag(ao))
            }
            return aq
        }
        function M(aq, au) {
            au = au || 6;
            var at = ag(aq).toHsv();
            var aw = at.h, av = at.s, ap = at.v;
            var ar = [];
            var ao = 1 / au;
            while (au--) {
                ar.push(ag({h: aw, s: av, v: ap}));
                ap = (ap + ao) % 1
            }
            return ar
        }
        ag.mix = function (az, ay, av) {
            av = (av === 0) ? 0 : (av || 50);
            var at = ag(az).toRgb();
            var aq = ag(ay).toRgb();
            var ao = av / 100;
            var ax = ao * 2 - 1;
            var aw = aq.a - at.a;
            var au;
            if (ax * aw == -1) {
                au = ax
            } else {
                au = (ax + aw) / (1 + ax * aw)
            }
            au = (au + 1) / 2;
            var ar = 1 - au;
            var ap = {r: aq.r * au + at.r * ar, g: aq.g * au + at.g * ar, b: aq.b * au + at.b * ar, a: aq.a * ao + at.a * (1 - ao)};
            return ag(ap)
        };
        ag.readability = function (ax, aw) {
            var at = ag(ax);
            var aq = ag(aw);
            var ar = at.toRgb();
            var ap = aq.toRgb();
            var au = at.getBrightness();
            var ao = aq.getBrightness();
            var av = (Math.max(ar.r, ap.r) - Math.min(ar.r, ap.r) + Math.max(ar.g, ap.g) - Math.min(ar.g, ap.g) + Math.max(ar.b, ap.b) - Math.min(ar.b, ap.b));
            return{brightness: Math.abs(au - ao), color: av}
        };
        ag.isReadable = function (ap, ao) {
            var aq = ag.readability(ap, ao);
            return aq.brightness > 125 && aq.color > 500
        };
        ag.mostReadable = function (aw, av) {
            var ar = null;
            var ap = 0;
            var ax = false;
            for (var au = 0; au < av.length; au++) {
                var aq = ag.readability(aw, av[au]);
                var at = aq.brightness > 125 && aq.color > 500;
                var ao = 3 * (aq.brightness / 125) + (aq.color / 500);
                if ((at && !ax) || (at && ax && ao > ap) || ((!at) && (!ax) && ao > ap)) {
                    ax = at;
                    ap = ao;
                    ar = ag(av[au])
                }
            }
            return ar
        };
        var ai = ag.names = {aliceblue: "f0f8ff", antiquewhite: "faebd7", aqua: "0ff", aquamarine: "7fffd4", azure: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "000", blanchedalmond: "ffebcd", blue: "00f", blueviolet: "8a2be2", brown: "a52a2a", burlywood: "deb887", burntsienna: "ea7e5d", cadetblue: "5f9ea0", chartreuse: "7fff00", chocolate: "d2691e", coral: "ff7f50", cornflowerblue: "6495ed", cornsilk: "fff8dc", crimson: "dc143c", cyan: "0ff", darkblue: "00008b", darkcyan: "008b8b", darkgoldenrod: "b8860b", darkgray: "a9a9a9", darkgreen: "006400", darkgrey: "a9a9a9", darkkhaki: "bdb76b", darkmagenta: "8b008b", darkolivegreen: "556b2f", darkorange: "ff8c00", darkorchid: "9932cc", darkred: "8b0000", darksalmon: "e9967a", darkseagreen: "8fbc8f", darkslateblue: "483d8b", darkslategray: "2f4f4f", darkslategrey: "2f4f4f", darkturquoise: "00ced1", darkviolet: "9400d3", deeppink: "ff1493", deepskyblue: "00bfff", dimgray: "696969", dimgrey: "696969", dodgerblue: "1e90ff", firebrick: "b22222", floralwhite: "fffaf0", forestgreen: "228b22", fuchsia: "f0f", gainsboro: "dcdcdc", ghostwhite: "f8f8ff", gold: "ffd700", goldenrod: "daa520", gray: "808080", green: "008000", greenyellow: "adff2f", grey: "808080", honeydew: "f0fff0", hotpink: "ff69b4", indianred: "cd5c5c", indigo: "4b0082", ivory: "fffff0", khaki: "f0e68c", lavender: "e6e6fa", lavenderblush: "fff0f5", lawngreen: "7cfc00", lemonchiffon: "fffacd", lightblue: "add8e6", lightcoral: "f08080", lightcyan: "e0ffff", lightgoldenrodyellow: "fafad2", lightgray: "d3d3d3", lightgreen: "90ee90", lightgrey: "d3d3d3", lightpink: "ffb6c1", lightsalmon: "ffa07a", lightseagreen: "20b2aa", lightskyblue: "87cefa", lightslategray: "789", lightslategrey: "789", lightsteelblue: "b0c4de", lightyellow: "ffffe0", lime: "0f0", limegreen: "32cd32", linen: "faf0e6", magenta: "f0f", maroon: "800000", mediumaquamarine: "66cdaa", mediumblue: "0000cd", mediumorchid: "ba55d3", mediumpurple: "9370db", mediumseagreen: "3cb371", mediumslateblue: "7b68ee", mediumspringgreen: "00fa9a", mediumturquoise: "48d1cc", mediumvioletred: "c71585", midnightblue: "191970", mintcream: "f5fffa", mistyrose: "ffe4e1", moccasin: "ffe4b5", navajowhite: "ffdead", navy: "000080", oldlace: "fdf5e6", olive: "808000", olivedrab: "6b8e23", orange: "ffa500", orangered: "ff4500", orchid: "da70d6", palegoldenrod: "eee8aa", palegreen: "98fb98", paleturquoise: "afeeee", palevioletred: "db7093", papayawhip: "ffefd5", peachpuff: "ffdab9", peru: "cd853f", pink: "ffc0cb", plum: "dda0dd", powderblue: "b0e0e6", purple: "800080", red: "f00", rosybrown: "bc8f8f", royalblue: "4169e1", saddlebrown: "8b4513", salmon: "fa8072", sandybrown: "f4a460", seagreen: "2e8b57", seashell: "fff5ee", sienna: "a0522d", silver: "c0c0c0", skyblue: "87ceeb", slateblue: "6a5acd", slategray: "708090", slategrey: "708090", snow: "fffafa", springgreen: "00ff7f", steelblue: "4682b4", tan: "d2b48c", teal: "008080", thistle: "d8bfd8", tomato: "ff6347", turquoise: "40e0d0", violet: "ee82ee", wheat: "f5deb3", white: "fff", whitesmoke: "f5f5f5", yellow: "ff0", yellowgreen: "9acd32"};
        var an = ag.hexNames = aj(ai);
        function aj(aq) {
            var ap = {};
            for (var ao in aq) {
                if (aq.hasOwnProperty(ao)) {
                    ap[aq[ao]] = ao
                }
            }
            return ap
        }
        function F(ao) {
            ao = parseFloat(ao);
            if (isNaN(ao) || ao < 0 || ao > 1) {
                ao = 1
            }
            return ao
        }
        function ah(aq, ao) {
            if (Y(aq)) {
                aq = "100%"
            }
            var ap = G(aq);
            aq = al(ao, N(0, parseFloat(aq)));
            if (ap) {
                aq = parseInt(aq * ao, 10) / 100
            }
            if ((Q.abs(aq - ao) < 0.000001)) {
                return 1
            }
            return(aq % ao) / parseFloat(ao)
        }
        function v(ao) {
            return al(1, N(0, ao))
        }
        function x(ao) {
            return parseInt(ao, 16)
        }
        function Y(ao) {
            return typeof ao == "string" && ao.indexOf(".") != -1 && parseFloat(ao) === 1
        }
        function G(ao) {
            return typeof ao === "string" && ao.indexOf("%") != -1
        }
        function R(ao) {
            return ao.length == 1 ? "0" + ao : "" + ao
        }
        function I(ao) {
            if (ao <= 1) {
                ao = (ao * 100) + "%"
            }
            return ao
        }
        function W(ao) {
            return Math.round(parseFloat(ao) * 255).toString(16)
        }
        function D(ao) {
            return(x(ao) / 255)
        }
        var y = (function () {
            var at = "[-\\+]?\\d+%?";
            var ar = "[-\\+]?\\d*\\.\\d+%?";
            var ao = "(?:" + ar + ")|(?:" + at + ")";
            var aq = "[\\s|\\(]+(" + ao + ")[,|\\s]+(" + ao + ")[,|\\s]+(" + ao + ")\\s*\\)?";
            var ap = "[\\s|\\(]+(" + ao + ")[,|\\s]+(" + ao + ")[,|\\s]+(" + ao + ")[,|\\s]+(" + ao + ")\\s*\\)?";
            return{rgb: new RegExp("rgb" + aq), rgba: new RegExp("rgba" + ap), hsl: new RegExp("hsl" + aq), hsla: new RegExp("hsla" + ap), hsv: new RegExp("hsv" + aq), hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}
        })();
        function O(ap) {
            ap = ap.replace(Z, "").replace(L, "").toLowerCase();
            var ao = false;
            if (ai[ap]) {
                ap = ai[ap];
                ao = true
            } else {
                if (ap == "transparent") {
                    return{r: 0, g: 0, b: 0, a: 0, format: "name"}
                }
            }
            var aq;
            if ((aq = y.rgb.exec(ap))) {
                return{r: aq[1], g: aq[2], b: aq[3]}
            }
            if ((aq = y.rgba.exec(ap))) {
                return{r: aq[1], g: aq[2], b: aq[3], a: aq[4]}
            }
            if ((aq = y.hsl.exec(ap))) {
                return{h: aq[1], s: aq[2], l: aq[3]}
            }
            if ((aq = y.hsla.exec(ap))) {
                return{h: aq[1], s: aq[2], l: aq[3], a: aq[4]}
            }
            if ((aq = y.hsv.exec(ap))) {
                return{h: aq[1], s: aq[2], v: aq[3]}
            }
            if ((aq = y.hex8.exec(ap))) {
                return{a: D(aq[1]), r: x(aq[2]), g: x(aq[3]), b: x(aq[4]), format: ao ? "name" : "hex8"}
            }
            if ((aq = y.hex6.exec(ap))) {
                return{r: x(aq[1]), g: x(aq[2]), b: x(aq[3]), format: ao ? "name" : "hex"}
            }
            if ((aq = y.hex3.exec(ap))) {
                return{r: x(aq[1] + "" + aq[1]), g: x(aq[2] + "" + aq[2]), b: x(aq[3] + "" + aq[3]), format: ao ? "name" : "hex"}
            }
            return false
        }
        h.tinycolor = ag
    })();
    e(function () {
        if (e.fn.spectrum.load) {
            e.fn.spectrum.processNativeColorInputs()
        }
    })
})(window, jQuery);