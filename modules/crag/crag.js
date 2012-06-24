(function (a) {
    function b(h, e, d) {
        var x = this,
            f = h.add(this),
            j = h.find(d.tabs),
            y = e.jquery ? e : h.children(e),
            H;
        j.length || (j = h.children());
        y.length || (y = h.parent().find(e));
        y.length || (y = a(e));
        a.extend(this, {
            click: function (A, m) {
                var I = j.eq(A);
                if (typeof A == "string" && A.replace("#", "")) {
                    I = j.filter("[href*=" + A.replace("#", "") + "]");
                    A = Math.max(j.index(I), 0)
                }
                if (d.rotate) {
                    var k = j.length - 1;
                    if (A < 0) return x.click(k, m);
                    if (A > k) return x.click(0, m)
                }
                if (!I.length) {
                    if (H >= 0) return x;
                    A = d.initialIndex;
                    I = j.eq(A)
                }
                if (A === H) return x;
                m = m || a.Event();
                m.type = "onBeforeClick";
                f.trigger(m, [A]);
                if (!m.isDefaultPrevented()) {
                    c[d.effect].call(x, A, function () {
                        m.type = "onClick";
                        f.trigger(m, [A])
                    });
                    H = A;
                    j.removeClass(d.current);
                    I.addClass(d.current);
                    return x
                }
            },
            getConf: function () {
                return d
            },
            getTabs: function () {
                return j
            },
            getPanes: function () {
                return y
            },
            getCurrentPane: function () {
                return y.eq(H)
            },
            getCurrentTab: function () {
                return j.eq(H)
            },
            getIndex: function () {
                return H
            },
            next: function () {
                return x.click(H + 1)
            },
            prev: function () {
                return x.click(H - 1)
            },
            destroy: function () {
                j.unbind(d.event).removeClass(d.current);
                y.find("a[href^=#]").unbind("click.T");
                return x
            }
        });
        a.each("onBeforeClick,onClick".split(","), function (A, m) {
            a.isFunction(d[m]) && a(x).bind(m, d[m]);
            x[m] = function (I) {
                a(x).bind(m, I);
                return x
            }
        });
        if (d.history && a.fn.history) {
            a.tools.history.init(j);
            d.event = "history"
        }
        j.each(function (A) {
            a(this).bind(d.event, function (m) {
                x.click(A, m);
                return m.preventDefault()
            })
        });
        y.find("a[href^=#]").bind("click.T", function (A) {
            x.click(a(this).attr("href"), A)
        });
        if (location.hash) x.click(location.hash);
        else if (d.initialIndex === 0 || d.initialIndex > 0) x.click(d.initialIndex)
    }
    a.tools = a.tools || {
        version: "1.2.3"
    };
    a.tools.tabs = {
        conf: {
            tabs: "a",
            current: "current",
            onBeforeClick: null,
            onClick: null,
            effect: "default",
            initialIndex: 0,
            event: "click",
            rotate: false,
            history: false
        },
        addEffect: function (h, e) {
            c[h] = e
        }
    };
    var c = {
        "default": function (h, e) {
            this.getPanes().hide().eq(h).show();
            e.call()
        },
        fade: function (h, e) {
            var d = this.getConf(),
                x = d.fadeOutSpeed,
                f = this.getPanes();
            x ? f.fadeOut(x) : f.hide();
            f.eq(h).fadeIn(d.fadeInSpeed, e)
        },
        slide: function (h, e) {
            this.getPanes().slideUp(200);
            this.getPanes().eq(h).slideDown(400, e)
        },
        ajax: function (h, e) {
            this.getPanes().eq(0).load(this.getTabs().eq(h).attr("href"), e)
        }
    },
        l;
    a.tools.tabs.addEffect("horizontal", function (h, e) {
        l || (l = this.getPanes().eq(0).width());
        this.getCurrentPane().animate({
            width: 0
        }, function () {
            a(this).hide()
        });
        this.getPanes().eq(h).animate({
            width: l
        }, function () {
            a(this).show();
            e.call()
        })
    });
    a.fn.tabs = function (h, e) {
        var d = this.data("tabs");
        if (d) {
            d.destroy();
            this.removeData("tabs")
        }
        if (a.isFunction(e)) e = {
            onBeforeClick: e
        };
        e = a.extend({}, a.tools.tabs.conf, e);
        this.each(function () {
            d = new b(a(this), h, e);
            a(this).data("tabs", d)
        });
        return e.api ? d : this
    }
})(jQuery);
(function (a) {
    function b(h, e) {
        var d = this,
            x = h.add(d),
            f = a(window),
            j, y, H, A = a.tools.expose && (e.mask || e.expose),
            m = Math.random().toString().slice(10);
        if (A) {
            if (typeof A == "string") A = {
                color: A
            };
            A.closeOnClick = A.closeOnEsc = false
        }
        var I = e.target || h.attr("rel");
        y = I ? a(I) : h;
        if (!y.length) throw "Could not find Overlay: " + I;
        h && h.index(y) == -1 && h.click(function (k) {
            d.load(k);
            return k.preventDefault()
        });
        a.extend(d, {
            load: function (k) {
                if (d.isOpened()) return d;
                var C = l[e.effect];
                if (!C) throw 'Overlay: cannot find effect : "' + e.effect + '"';
                e.oneInstance && a.each(c, function () {
                    this.close(k)
                });
                k = k || a.Event();
                k.type = "onBeforeLoad";
                x.trigger(k);
                if (k.isDefaultPrevented()) return d;
                H = true;
                A && a(y).expose(A);
                var o = e.top,
                    z = e.left,
                    g = y.outerWidth({
                        margin: true
                    }),
                    w = y.outerHeight({
                        margin: true
                    });
                if (typeof o == "string") o = o == "center" ? Math.max((f.height() - w) / 2, 0) : parseInt(o, 10) / 100 * f.height();
                if (z == "center") z = Math.max((f.width() - g) / 2, 0);
                C[0].call(d, {
                    top: o,
                    left: z
                }, function () {
                    if (H) {
                        k.type = "onLoad";
                        x.trigger(k)
                    }
                });
                A && e.closeOnClick && a.mask.getMask().one("click", d.close);
                e.closeOnClick && a(document).bind("click." + m, function (v) {
                    a(v.target).parents(y).length || d.close(v)
                });
                e.closeOnEsc && a(document).bind("keydown." + m, function (v) {
                    v.keyCode == 27 && d.close(v)
                });
                return d
            },
            close: function (k) {
                if (!d.isOpened()) return d;
                k = k || a.Event();
                k.type = "onBeforeClose";
                x.trigger(k);
                if (!k.isDefaultPrevented()) {
                    H = false;
                    l[e.effect][1].call(d, function () {
                        k.type = "onClose";
                        x.trigger(k)
                    });
                    a(document).unbind("click." + m).unbind("keydown." + m);
                    A && a.mask.close();
                    return d
                }
            },
            getOverlay: function () {
                return y
            },
            getTrigger: function () {
                return h
            },
            getClosers: function () {
                return j
            },
            isOpened: function () {
                return H
            },
            getConf: function () {
                return e
            }
        });
        a.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function (k, C) {
            a.isFunction(e[C]) && a(d).bind(C, e[C]);
            d[C] = function (o) {
                a(d).bind(C, o);
                return d
            }
        });
        j = y.find(e.close || ".close");
        if (!j.length && !e.close) {
            j = a('<a class="close"></a>');
            y.prepend(j)
        }
        j.click(function (k) {
            d.close(k)
        });
        e.load && d.load()
    }
    a.tools = a.tools || {
        version: "1.2.3"
    };
    a.tools.overlay = {
        addEffect: function (h, e, d) {
            l[h] = [e, d]
        },
        conf: {
            close: null,
            closeOnClick: true,
            closeOnEsc: true,
            closeSpeed: "fast",
            effect: "default",
            fixed: !a.browser.msie || a.browser.version > 6,
            left: "center",
            load: false,
            mask: null,
            oneInstance: true,
            speed: "normal",
            target: null,
            top: "10%"
        }
    };
    var c = [],
        l = {};
    a.tools.overlay.addEffect("default", function (h, e) {
        var d = this.getConf(),
            x = a(window);
        if (!d.fixed) {
            h.top += x.scrollTop();
            h.left += x.scrollLeft()
        }
        h.position = d.fixed ? "fixed" : "absolute";
        this.getOverlay().css(h).fadeIn(d.speed, e)
    }, function (h) {
        this.getOverlay().fadeOut(this.getConf().closeSpeed, h)
    });
    a.fn.overlay = function (h) {
        var e = this.data("overlay");
        if (e) return e;
        if (a.isFunction(h)) h = {
            onBeforeLoad: h
        };
        h = a.extend(true, {}, a.tools.overlay.conf, h);
        this.each(function () {
            e = new b(a(this), h);
            c.push(e);
            a(this).data("overlay", e)
        });
        return h.api ? e : this
    }
})(jQuery);
(function (a) {
    function b(f, j) {
        j = Math.pow(10, j);
        return Math.round(f * j) / j
    }
    function c(f, j) {
        if (j = parseInt(f.css(j), 10)) return j;
        return (f = f[0].currentStyle) && f.width && parseInt(f.width, 10)
    }
    function l(f) {
        return (f = f.data("events")) && f.onSlide
    }
    function h(f, j) {
        function y(E, D, J, L) {
            if (J === undefined) J = D / g * G;
            else if (L) J -= j.min;
            if (B) J = Math.round(J / B) * B;
            if (D === undefined || B) D = J * g / G;
            if (isNaN(J)) return m;
            D = Math.max(0, Math.min(D, g));
            J = D / g * G;
            if (L || !C) J += j.min;
            if (C) if (L) D = g - D;
            else J = j.max - J;
            J = b(J, F);
            var O = E.type == "click";
            if (P && o !== undefined && !O) {
                E.type = "onSlide";
                N.trigger(E, [J, D]);
                if (E.isDefaultPrevented()) return m
            }
            L = O ? j.speed : 0;
            O = O ?
            function () {
                E.type = "change";
                N.trigger(E, [J])
            } : null;
            if (C) {
                v.animate({
                    top: D
                }, L, O);
                j.progress && n.animate({
                    height: g - D + v.width() / 2
                }, L)
            } else {
                v.animate({
                    left: D
                }, L, O);
                j.progress && n.animate({
                    width: D + v.width() / 2
                }, L)
            }
            o = J;
            w = D;
            f.val(J);
            return m
        }
        function H() {
            if (C = j.vertical || c(k, "height") > c(k, "width")) {
                g = c(k, "height") - c(v, "height");
                z = k.offset().top + g
            } else {
                g = c(k, "width") - c(v, "width");
                z = k.offset().left
            }
        }

        function A() {
            H();
            m.setValue(j.value || j.min)
        }
        var m = this,
            I = j.css,
            k = a("<div><div/><a href='#'/></div>").data("rangeinput", m),
            C, o, z, g, w;
        f.before(k);
        var v = k.addClass(I.slider).find("a").addClass(I.handle),
            n = k.find("div").addClass(I.progress);
        a.each("min,max,step,value".split(","), function (E, D) {
            E = f.attr(D);
            if (parseFloat(E)) j[D] = parseFloat(E, 10)
        });
        var G = j.max - j.min,
            B = j.step == "any" ? 0 : j.step,
            F = j.precision;
        if (F === undefined) try {
            F = B.toString().split(".")[1].length
        } catch (M) {
            F = 0
        }
        if (f.attr("type") == "range") {
            var K = a("<input/>");
            a.each("name,readonly,disabled,required".split(","), function (E, D) {
                K.attr(D, f.attr(D))
            });
            K.val(j.value);
            f.replaceWith(K);
            f = K
        }
        f.addClass(I.input);
        var N = a(m).add(f),
            P = true;
        a.extend(m, {
            getValue: function () {
                return o
            },
            setValue: function (E, D) {
                return y(D || a.Event("api"), undefined, E, true)
            },
            getConf: function () {
                return j
            },
            getProgress: function () {
                return n
            },
            getHandle: function () {
                return v
            },
            getInput: function () {
                return f
            },
            step: function (E, D) {
                D = D || a.Event();
                m.setValue(o + (j.step == "any" ? 1 : j.step) * (E || 1), D)
            },
            stepUp: function (E) {
                return m.step(E || 1)
            },
            stepDown: function (E) {
                return m.step(-E || -1)
            }
        });
        a.each("onSlide,change".split(","), function (E, D) {
            a.isFunction(j[D]) && a(m).bind(D, j[D]);
            m[D] = function (J) {
                a(m).bind(D, J);
                return m
            }
        });
        v.drag({
            drag: false
        }).bind("dragStart", function () {
            P = l(a(m)) || l(f)
        }).bind("drag", function (E, D, J) {
            if (f.is(":disabled")) return false;
            y(E, C ? D : J)
        }).bind("dragEnd", function (E) {
            if (!E.isDefaultPrevented()) {
                E.type = "change";
                N.trigger(E, [o])
            }
        }).click(function (E) {
            return E.preventDefault()
        });
        k.click(function (E) {
            if (f.is(":disabled") || E.target == v[0]) return E.preventDefault();
            H();
            var D = v.width() / 2;
            y(E, C ? g - z - D + E.pageY : E.pageX - z - D)
        });
        j.keyboard && f.keydown(function (E) {
            if (!f.attr("readonly")) {
                var D = E.keyCode,
                    J = a([75, 76, 38, 33, 39]).index(D) != -1,
                    L = a([74, 72, 40, 34, 37]).index(D) != -1;
                if ((J || L) && !(E.shiftKey || E.altKey || E.ctrlKey)) {
                    if (J) m.step(D == 33 ? 10 : 1, E);
                    else if (L) m.step(D == 34 ? -10 : -1, E);
                    return E.preventDefault()
                }
            }
        });
        f.blur(function (E) {
            var D = a(this).val();
            D !== o && m.setValue(D, E)
        });
        a.extend(f[0], {
            stepUp: m.stepUp,
            stepDown: m.stepDown
        });
        A();
        g || a(window).load(A)
    }
    a.tools = a.tools || {
        version: "1.2.3"
    };
    var e;
    e = a.tools.rangeinput = {
        conf: {
            min: 0,
            max: 100,
            step: "any",
            steps: 0,
            value: 0,
            precision: undefined,
            vertical: 0,
            keyboard: true,
            progress: false,
            speed: 100,
            css: {
                input: "range",
                slider: "slider",
                progress: "progress",
                handle: "handle"
            }
        }
    };
    var d, x;
    a.fn.drag = function (f) {
        document.ondragstart = function () {
            return false
        };
        f = a.extend({
            x: true,
            y: true,
            drag: true
        }, f);
        d = d || a(document).bind("mousedown mouseup", function (j) {
            var y = a(j.target);
            if (j.type == "mousedown" && y.data("drag")) {
                var H = y.position(),
                    A = j.pageX - H.left,
                    m = j.pageY - H.top,
                    I = true;
                d.bind("mousemove.drag", function (k) {
                    var C = k.pageX - A;
                    k = k.pageY - m;
                    var o = {};
                    if (f.x) o.left = C;
                    if (f.y) o.top = k;
                    if (I) {
                        y.trigger("dragStart");
                        I = false
                    }
                    f.drag && y.css(o);
                    y.trigger("drag", [k, C]);
                    x = y
                });
                j.preventDefault()
            } else try {
                x && x.trigger("dragEnd")
            } finally {
                d.unbind("mousemove.drag");
                x = null
            }
        });
        return this.data("drag", true)
    };
    a.expr[":"].range = function (f) {
        var j = f.getAttribute("type");
        return j && j == "range" || !! a(f).filter("input").data("rangeinput")
    };
    a.fn.rangeinput = function (f) {
        if (this.data("rangeinput")) return this;
        f = a.extend(true, {}, e.conf, f);
        var j;
        this.each(function () {
            var y = new h(a(this), a.extend(true, {}, f));
            y = y.getInput().data("rangeinput", y);
            j = j ? j.add(y) : y
        });
        return j ? j : this
    }
})(jQuery);
var EXIF = {},
    bDebug = false;
EXIF.Tags = {
    36864: "ExifVersion",
    40960: "FlashpixVersion",
    40961: "ColorSpace",
    40962: "PixelXDimension",
    40963: "PixelYDimension",
    37121: "ComponentsConfiguration",
    37122: "CompressedBitsPerPixel",
    37500: "MakerNote",
    37510: "UserComment",
    40964: "RelatedSoundFile",
    36867: "DateTimeOriginal",
    36868: "DateTimeDigitized",
    37520: "SubsecTime",
    37521: "SubsecTimeOriginal",
    37522: "SubsecTimeDigitized",
    33434: "ExposureTime",
    33437: "FNumber",
    34850: "ExposureProgram",
    34852: "SpectralSensitivity",
    34855: "ISOSpeedRatings",
    34856: "OECF",
    37377: "ShutterSpeedValue",
    37378: "ApertureValue",
    37379: "BrightnessValue",
    37380: "ExposureBias",
    37381: "MaxApertureValue",
    37382: "SubjectDistance",
    37383: "MeteringMode",
    37384: "LightSource",
    37385: "Flash",
    37396: "SubjectArea",
    37386: "FocalLength",
    41483: "FlashEnergy",
    41484: "SpatialFrequencyResponse",
    41486: "FocalPlaneXResolution",
    41487: "FocalPlaneYResolution",
    41488: "FocalPlaneResolutionUnit",
    41492: "SubjectLocation",
    41493: "ExposureIndex",
    41495: "SensingMethod",
    41728: "FileSource",
    41729: "SceneType",
    41730: "CFAPattern",
    41985: "CustomRendered",
    41986: "ExposureMode",
    41987: "WhiteBalance",
    41988: "DigitalZoomRation",
    41989: "FocalLengthIn35mmFilm",
    41990: "SceneCaptureType",
    41991: "GainControl",
    41992: "Contrast",
    41993: "Saturation",
    41994: "Sharpness",
    41995: "DeviceSettingDescription",
    41996: "SubjectDistanceRange",
    40965: "InteroperabilityIFDPointer",
    42016: "ImageUniqueID"
};
EXIF.TiffTags = {
    256: "ImageWidth",
    257: "ImageHeight",
    34665: "ExifIFDPointer",
    34853: "GPSInfoIFDPointer",
    40965: "InteroperabilityIFDPointer",
    258: "BitsPerSample",
    259: "Compression",
    262: "PhotometricInterpretation",
    274: "Orientation",
    277: "SamplesPerPixel",
    284: "PlanarConfiguration",
    530: "YCbCrSubSampling",
    531: "YCbCrPositioning",
    282: "XResolution",
    283: "YResolution",
    296: "ResolutionUnit",
    273: "StripOffsets",
    278: "RowsPerStrip",
    279: "StripByteCounts",
    513: "JPEGInterchangeFormat",
    514: "JPEGInterchangeFormatLength",
    301: "TransferFunction",
    318: "WhitePoint",
    319: "PrimaryChromaticities",
    529: "YCbCrCoefficients",
    532: "ReferenceBlackWhite",
    306: "DateTime",
    270: "ImageDescription",
    271: "Make",
    272: "Model",
    305: "Software",
    315: "Artist",
    33432: "Copyright"
};
EXIF.GPSTags = {
    0: "GPSVersionID",
    1: "GPSLatitudeRef",
    2: "GPSLatitude",
    3: "GPSLongitudeRef",
    4: "GPSLongitude",
    5: "GPSAltitudeRef",
    6: "GPSAltitude",
    7: "GPSTimeStamp",
    8: "GPSSatellites",
    9: "GPSStatus",
    10: "GPSMeasureMode",
    11: "GPSDOP",
    12: "GPSSpeedRef",
    13: "GPSSpeed",
    14: "GPSTrackRef",
    15: "GPSTrack",
    16: "GPSImgDirectionRef",
    17: "GPSImgDirection",
    18: "GPSMapDatum",
    19: "GPSDestLatitudeRef",
    20: "GPSDestLatitude",
    21: "GPSDestLongitudeRef",
    22: "GPSDestLongitude",
    23: "GPSDestBearingRef",
    24: "GPSDestBearing",
    25: "GPSDestDistanceRef",
    26: "GPSDestDistance",
    27: "GPSProcessingMethod",
    28: "GPSAreaInformation",
    29: "GPSDateStamp",
    30: "GPSDifferential"
};
EXIF.StringValues = {
    ExposureProgram: {
        0: "Not defined",
        1: "Manual",
        2: "Normal program",
        3: "Aperture priority",
        4: "Shutter priority",
        5: "Creative program",
        6: "Action program",
        7: "Portrait mode",
        8: "Landscape mode"
    },
    MeteringMode: {
        0: "Unknown",
        1: "Average",
        2: "CenterWeightedAverage",
        3: "Spot",
        4: "MultiSpot",
        5: "Pattern",
        6: "Partial",
        255: "Other"
    },
    LightSource: {
        0: "Unknown",
        1: "Daylight",
        2: "Fluorescent",
        3: "Tungsten (incandescent light)",
        4: "Flash",
        9: "Fine weather",
        10: "Cloudy weather",
        11: "Shade",
        12: "Daylight fluorescent (D 5700 - 7100K)",
        13: "Day white fluorescent (N 4600 - 5400K)",
        14: "Cool white fluorescent (W 3900 - 4500K)",
        15: "White fluorescent (WW 3200 - 3700K)",
        17: "Standard light A",
        18: "Standard light B",
        19: "Standard light C",
        20: "D55",
        21: "D65",
        22: "D75",
        23: "D50",
        24: "ISO studio tungsten",
        255: "Other"
    },
    Flash: {
        0: "Flash did not fire",
        1: "Flash fired",
        5: "Strobe return light not detected",
        7: "Strobe return light detected",
        9: "Flash fired, compulsory flash mode",
        13: "Flash fired, compulsory flash mode, return light not detected",
        15: "Flash fired, compulsory flash mode, return light detected",
        16: "Flash did not fire, compulsory flash mode",
        24: "Flash did not fire, auto mode",
        25: "Flash fired, auto mode",
        29: "Flash fired, auto mode, return light not detected",
        31: "Flash fired, auto mode, return light detected",
        32: "No flash function",
        65: "Flash fired, red-eye reduction mode",
        69: "Flash fired, red-eye reduction mode, return light not detected",
        71: "Flash fired, red-eye reduction mode, return light detected",
        73: "Flash fired, compulsory flash mode, red-eye reduction mode",
        77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
        79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
        89: "Flash fired, auto mode, red-eye reduction mode",
        93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
        95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
    },
    SensingMethod: {
        1: "Not defined",
        2: "One-chip color area sensor",
        3: "Two-chip color area sensor",
        4: "Three-chip color area sensor",
        5: "Color sequential area sensor",
        7: "Trilinear sensor",
        8: "Color sequential linear sensor"
    },
    SceneCaptureType: {
        0: "Standard",
        1: "Landscape",
        2: "Portrait",
        3: "Night scene"
    },
    SceneType: {
        1: "Directly photographed"
    },
    CustomRendered: {
        0: "Normal process",
        1: "Custom process"
    },
    WhiteBalance: {
        0: "Auto white balance",
        1: "Manual white balance"
    },
    GainControl: {
        0: "None",
        1: "Low gain up",
        2: "High gain up",
        3: "Low gain down",
        4: "High gain down"
    },
    Contrast: {
        0: "Normal",
        1: "Soft",
        2: "Hard"
    },
    Saturation: {
        0: "Normal",
        1: "Low saturation",
        2: "High saturation"
    },
    Sharpness: {
        0: "Normal",
        1: "Soft",
        2: "Hard"
    },
    SubjectDistanceRange: {
        0: "Unknown",
        1: "Macro",
        2: "Close view",
        3: "Distant view"
    },
    FileSource: {
        3: "DSC"
    },
    Components: {
        0: "",
        1: "Y",
        2: "Cb",
        3: "Cr",
        4: "R",
        5: "G",
        6: "B"
    }
};

function addEvent(a, b, c) {
    if (a.addEventListener) a.addEventListener(b, c, false);
    else a.attachEvent && a.attachEvent("on" + b, c)
}
function imageHasData(a) {
    return !!a.exifdata
}
function getByteAt(a, b) {
    return a.charCodeAt(b)
}
function getStringAt(a, b, c) {
    for (var l = "", h = 0; h < c; h++) {
        var e = getByteAt(a, b + h);
        if (e == 0) return l;
        l += String.fromCharCode(e)
    }
    return new String(l)
}

function getShortAt(a, b, c) {
    return c ? getByteAt(a, b) << 8 | getByteAt(a, b + 1) : getByteAt(a, b) | getByteAt(a, b + 1) << 8
}
function getSLongAt(a, b, c) {
    a = getLongAt(a, b, c);
    return a > 2147483647 ? a - 4294967296 : a
}
function getLongAt(a, b, c) {
    return c ? getByteAt(a, b + 0) << 24 | getByteAt(a, b + 1) << 16 | getByteAt(a, b + 2) << 8 | getByteAt(a, b + 3) << 0 : getByteAt(a, b + 0) << 0 | getByteAt(a, b + 1) << 8 | getByteAt(a, b + 2) << 16 | getByteAt(a, b + 3) << 24
}

function findEXIFinJPEG(a) {
    if (getByteAt(a, 0) != 255 || getByteAt(a, 1) != 216) return false;
    for (var b = 2, c = a.length; b < c;) {
        if (getByteAt(a, b) != 255) {
            bDebug && log("Not a valid marker at offset " + b + ", found: " + getByteAt(a, b));
            return false
        }
        var l = getByteAt(a, b + 1);
        if (l == 22400) {
            bDebug && log("Found 0xFFE1 marker");
            return readEXIFData(a, b + 4, getShortAt(a, b + 2, true) - 2)
        } else if (l == 225) {
            bDebug && log("Found 0xFFE1 marker");
            return readEXIFData(a, b + 4, getShortAt(a, b + 2, true) - 2)
        } else b += 2 + getShortAt(a, b + 2, true)
    }
    return null
}

function readTags(a, b, c, l, h) {
    for (var e = getShortAt(a, c, h), d = {}, x = 0; x < e; x++) {
        var f = c + x * 12 + 2,
            j = l[getShortAt(a, f, h)];
        !j && bDebug && log("Unknown tag: " + getShortAt(a, f, h));
        d[j] = readTagValue(a, f, b, c, h)
    }
    return d
}

function readTagValue(a, b, c, l, h) {
    var e = getShortAt(a, b + 2, h);
    l = getLongAt(a, b + 4, h);
    c = getLongAt(a, b + 8, h) + c;
    switch (e) {
    case 1:
    case 7:
        if (l == 1) return getByteAt(a, b + 8, h);
        else {
            e = [];
            for (var d = 0; d < l; d++) e[d] = getByteAt(a, (l > 4 ? c : b + 8) + d);
            return e
        }
    case 2:
        return getStringAt(a, l > 4 ? c : b + 8, l - 1);
    case 3:
        if (l == 1) return getShortAt(a, b + 8, h);
        else {
            e = [];
            for (d = 0; d < l; d++) e[d] = getShortAt(a, (l > 2 ? c : b + 8) + 2 * d, h);
            return e
        }
    case 4:
        if (l == 1) return getLongAt(a, b + 8, h);
        else {
            e = [];
            for (d = 0; d < l; d++) e[d] = getLongAt(a, c + 4 * d, h);
            return e
        }
    case 5:
        if (l == 1) return getLongAt(a, c, h) / getLongAt(a, c + 4, h);
        else {
            e = [];
            for (d = 0; d < l; d++) e[d] = getLongAt(a, c + 8 * d, h) / getLongAt(a, c + 4 + 8 * d, h);
            return e
        }
    case 9:
        if (l == 1) return getSLongAt(a, b + 8, h);
        else {
            e = [];
            for (d = 0; d < l; d++) e[d] = getSLongAt(a, c + 4 * d, h);
            return e
        }
    case 10:
        if (l == 1) return getSLongAt(a, c, h) / getSLongAt(a, c + 4, h);
        else {
            e = [];
            for (d = 0; d < l; d++) e[d] = getSLongAt(a, c + 8 * d, h) / getSLongAt(a, c + 4 + 8 * d, h);
            return e
        }
    }
    return null
}

function readEXIFData(a, b) {
    if (getStringAt(a, b, 4) != "Exif") {
        bDebug && log("Not valid EXIF data! " + getStringAt(a, b, 4));
        return false
    }
    var c, l = b + 6;
    if (getShortAt(a, l) == 18761) c = false;
    else if (getShortAt(a, l) == 19789) c = true;
    else {
        bDebug && log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
        return false
    }
    if (getShortAt(a, l + 2, c) != 42) {
        bDebug && log("Not valid TIFF data! (no 0x002A)");
        return false
    }
    if (getLongAt(a, l + 4, c) != 8) {
        bDebug && log("Not valid TIFF data! (First offset not 8)", getShortAt(a, l + 4, c));
        return false
    }
    var h = readTags(a, l, l + 8, EXIF.TiffTags, c);
    if (h.ExifIFDPointer) {
        var e = readTags(a, l, l + h.ExifIFDPointer, EXIF.Tags, c);
        for (var d in e) {
            switch (d) {
            case "LightSource":
            case "Flash":
            case "MeteringMode":
            case "ExposureProgram":
            case "SensingMethod":
            case "SceneCaptureType":
            case "SceneType":
            case "CustomRendered":
            case "WhiteBalance":
            case "GainControl":
            case "Contrast":
            case "Saturation":
            case "Sharpness":
            case "SubjectDistanceRange":
            case "FileSource":
                e[d] = EXIF.StringValues[d][e[d]];
                break;
            case "ExifVersion":
            case "FlashpixVersion":
                e[d] = String.fromCharCode(e[d][0], e[d][1], e[d][2], e[d][3]);
                break;
            case "ComponentsConfiguration":
                e[d] = EXIF.StringValues.Components[e[d][0]] + EXIF.StringValues.Components[e[d][1]] + EXIF.StringValues.Components[e[d][2]] + EXIF.StringValues.Components[e[d][3]];
                break
            }
            h[d] = e[d]
        }
    }
    if (h.GPSInfoIFDPointer) {
        c = readTags(a, l, l + h.GPSInfoIFDPointer, EXIF.GPSTags, c);
        for (d in c) {
            switch (d) {
            case "GPSVersionID":
                c[d] = c[d][0] + "." + c[d][1] + "." + c[d][2] + "." + c[d][3];
                break
            }
            h[d] = c[d]
        }
    }
    return h
}
EXIF.getTag = function (a, b) {
    if (!imageHasData(a)) return null;
    return a.exifdata[b]
};
EXIF.getAllTags = function (a) {
    if (!imageHasData(a)) return {};
    a = a.exifdata;
    var b = {};
    for (var c in a) if (a.hasOwnProperty(c)) b[c] = a[c];
    return b
};
EXIF.pretty = function (a) {
    if (!imageHasData(a)) return "";
    a = a.exifdata;
    var b = "";
    for (var c in a) if (a.hasOwnProperty(c)) b += typeof a[c] == "object" ? c + " : [" + a[c].length + " values]\r\n" : c + " : " + a[c] + "\r\n";
    return b
};
EXIF.readFromBinaryFile = function (a) {
    return findEXIFinJPEG(a)
};

function Collage(a) {
    function b() {
        if (H != null) o.drawImage(H, 0, 0, C.width, C.height);
        else if (y != null && y != "") {
            o.fillStyle = y;
            o.fillRect(0, 0, C.width, C.height)
        } else o.clearRect(0, 0, C.width, C.height);
        for (i in z) if (z[i].isVisible()) {
            o.save();
            o.globalAlpha = z[i].getOpacity();
            o.globalCompositeOperation = z[i].getCompositeOperation();
            if (z[i].hasShadow()) {
                o.shadowColor = "#000";
                o.shadowOffsetX = 3;
                o.shadowOffsetY = 3;
                o.shadowBlur = 15
            }
            o.translate(z[i].offsetX + z[i].width / 2, z[i].offsetY + z[i].height / 2);
            o.rotate(z[i].getAngle());
            o.drawImage(z[i].getCanvas(), 0 - z[i].width / 2, 0 - z[i].height / 2);
            o.restore()
        }
    }
    function c(g) {
        b();
        o.save();
        o.lineWidth = 1;
        o.strokeStyle = "#fff";
        o.globalAlpha = 1;
        o.translate(g.offsetX + g.width / 2, g.offsetY + g.height / 2);
        o.rotate(g.getAngle());
        o.strokeRect(0 - g.width / 2, 0 - g.height / 2, g.width, g.height);
        o.drawImage(I, g.width / 2 - I.width, g.height / 2 - I.height);
        o.drawImage(k, g.width / 2 - k.width, 0 - g.height / 2);
        o.restore()
    }
    function l() {
        e = false;
        j = h
    }
    var h = 0,
        e = false,
        d = 0,
        x = 0,
        f = null,
        j = h,
        y = null,
        H = null,
        A = 0,
        m = 0,
        I = new Image,
        k = new Image;
    I.src = "img/resize.png";
    k.src = "img/rotate.png";
    var C = jQuery(a)[0];
    A = jQuery(a).offset().left;
    m = jQuery(a).offset().top;
    var o = C.getContext("2d"),
        z = [];
    C.addEventListener("mousemove", function (g) {
        if (j == 2 && e) {
            var w = f.getSquare();
            f.scale(Math.sqrt(Math.pow(w.d.x - (g.pageX - A), 2) + Math.pow(w.d.y - (g.pageY - m), 2)), Math.sqrt(Math.pow(w.b.x - (g.pageX - A), 2) + Math.pow(w.b.y - (g.pageY - m), 2)));
            c(f)
        } else if (j == 3 && e) {
            w = Math.atan2(g.pageY - m - (f.offsetY + f.height / 2), g.pageX - A - (f.offsetX + f.width / 2));
            w += Math.PI / 4;
            f.setAngle(w);
            c(f)
        } else if (j == 1 && e) {
            f.offsetX += g.pageX - A - d;
            f.offsetY += g.pageY - m - x;
            c(f)
        } else if (z.length > 0) {
            w = false;
            for (var v = z.length; v--;) if (z[v].intersect(g.pageX - A, g.pageY - m) && z[v].isVisible()) {
                w = true;
                f = z[v];
                var n;
                n = g.pageX - A;
                var G = g.pageY - m,
                    B = z[v],
                    F = B.offsetX + B.width,
                    M = B.offsetY + B.height;
                F = new Square(new Vector(F - I.width, M - I.height), new Vector(F, M - I.height), new Vector(F, M), new Vector(F - I.width, M));
                F.rotate(B.angle);
                F.alignBottomRight(B.getSquare().c);
                if (F.intersect(new Vector(n, G))) n = 2;
                else {
                    n = g.pageX - A;
                    G = g.pageY - m;
                    B = z[v];
                    F = B.offsetX + B.width;
                    F = new Square(new Vector(F - k.width, B.offsetY), new Vector(F, B.offsetY), new Vector(F, B.offsetY + k.height), new Vector(F - k.width, B.offsetY + k.height));
                    F.rotate(B.angle);
                    F.alignTopRight(B.getSquare().b);
                    n = F.intersect(new Vector(n, G)) ? 3 : 1
                }
                j = n;
                c(z[v]);
                break
            }
            if (!w) {
                j = h;
                b()
            }
        }
        d = g.pageX - A;
        x = g.pageY - m
    }, false);
    C.addEventListener("mouseout", l, false);
    C.addEventListener("mouseup", l, false);
    C.addEventListener("mouseleave", l, false);
    C.addEventListener("mousedown", function (g) {
        e = true;
        if (j == 2 || j == 3 || j == 1) {
            g.stopPropagation();
            g.preventDefault()
        }
    }, false);
    this.reset = function () {
        var g = this.getLayer(0).img;
        this.removeLayer(0);
        this.addLayer(g)
    };
    this.scale = function (g) {
        this.getLayer(0).scaleUpDown(g);
        b()
    };
    this.rotate = function (g) {
        var w = this.getLayer(0).getAngle();
        this.getLayer(0).setAngle(w + g / 360);
        b()
    };
    this.getFinalOverlay = function () {
        var g = C.height,
            w = C.width,
            v = o.getImageData(0, 0, w, g),
            n = {
                top: g,
                bottom: 0,
                left: w,
                right: 0
            };
        v = v.data;
        for (var G = 0, B = 0; B < g; B++) for (var F = 0; F < w; F++) {
            G++;
            if (v[G * 4 + 3] > 0) {
                if (B < n.top) n.top = B;
                if (F < n.left) n.left = F
            }
        }
        G = v.length / 4;
        for (B = g; B > 0; B--) for (F = w; F > 0; F--) {
            G--;
            if (v[G * 4 + 3] > 0) {
                if (B > n.bottom || B == n.botton) n.bottom = B;
                if (F > n.right || F == n.right) n.right = F
            }
        }
        n.width = n.right - n.left;
        n.height = n.bottom - n.top;
        g = document.createElement("canvas");
        g.width = n.width;
        g.height = n.height;
        w = g.getContext("2d");
        w.translate(0, 0);
        w.drawImage(C, n.left, n.top, n.width, n.height, 0, 0, n.width, n.height);
        w.save();
        n.src = g.toDataURL("image/png");
        return n
    };
    this.addLayer = function (g) {
        var w = 1,
            v = 1;
        w = 1;
        if (g.naturalHeight + 100 > C.height) v = (g.naturalHeight + 100) / C.height;
        if (g.naturalWidth + 100 > C.width) w = (g.naturalWidth + 100) / C.width;
        w = Math.max(w, v);
        if (w > 1) {
            v = g.naturalWidth / w;
            w = g.naturalHeight / w
        } else {
            v = g.naturalWidth;
            w = g.naturalHeight
        }
        g = new Layer(g, {
            width: v,
            height: w,
            x: C.width / 2 - v / 2,
            y: C.height / 2 - w / 2
        });
        z.push(g);
        b();
        return g
    };
    this.redraw = function () {
        b()
    };
    this.getCanvas = function () {
        return C
    };
    this.setBackgroundImage = function (g) {
        H = g;
        b()
    };
    this.setBackgroundColor = function (g) {
        y = g;
        b()
    };
    this.getLayers = function () {
        return z
    };
    this.getLayer = function (g) {
        return z[g]
    };
    this.getFinalLayer = function (g, w) {
        var v = z[g];
        if (o.fillText) {
            b();
            o.save();
            o.lineWidth = 1;
            o.globalAlpha = 0.8;
            o.textBaseline = "top";
            o.fillStyle = "blue";
            o.fill();
            o.font = "bold 11pt Arial";
            o.fillText(w, v.width - 2, v.height - 2);
            o.restore()
        }
        return z[g]
    };
    this.moveLayerUp = function (g) {
        g = parseInt(g);
        if (g < z.length - 1) {
            var w = z[1 + g];
            z[1 + g] = z[g];
            z[g] = w;
            b();
            return true
        } else return false
    };
    this.moveLayerDown = function (g) {
        g = parseInt(g);
        if (g > 0) {
            var w = z[g - 1];
            z[g - 1] = z[g];
            z[g] = w;
            b();
            return true
        } else return false
    };
    this.removeLayer = function (g) {
        g = parseInt(g);
        if (g >= 0 && g < z.length) {
            z.splice(g, 1);
            b()
        }
    }
}

function Layer(a, b) {
    this.img = a;
    this.offsetX = b.x;
    this.offsetY = b.y;
    this.width = b.width;
    this.height = b.height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");
    this.context.save();
    this.context.translate(this.width / 2, this.height / 2);
    this.opacity = 0;
    this.visible = true;
    this.shadow = false;
    this.compositeOperation = "source-over";
    this.angle = 0;
    this.title = "";
    this.scaleUpDown = function (c) {
        this.context.restore();
        var l = this.width * c,
            h = this.width - l,
            e = this.height * c,
            d = this.height - e;
        this.width = l;
        this.height = e;
        this.canvas.width *= c;
        this.canvas.height *= c;
        this.offsetX += h / 2;
        this.offsetY += d / 2;
        this.context.translate(this.width / 2, this.height / 2);
        this.redraw()
    };
    this.isVisible = function () {
        return this.visible
    };
    this.toggleVisible = function () {
        this.visible = !this.visible
    };
    this.hasShadow = function () {
        return this.shadow
    };
    this.toggleShadow = function () {
        this.shadow = !this.shadow
    };
    this.setShadow = function (c) {
        this.shadow = c
    };
    this.getOpacity = function () {
        return this.opacity
    };
    this.setOpacity = function (c) {
        this.opacity = c
    };
    this.getImage = function () {
        return this.img
    };
    this.setCompositeOperation = function (c) {
        this.compositeOperation = c
    };
    this.getCompositeOperation = function () {
        return this.compositeOperation
    };
    this.redraw = function () {
        var c = this.width / 2 - this.width,
            l = this.height / 2 - this.height;
        this.context.clearRect(c, l, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.img, c, l, this.width, this.height)
    };
    this.getCanvas = function () {
        this.redraw();
        return this.canvas
    };
    this.intersect = function (c, l) {
        var h = new Square(new Vector(this.offsetX, this.offsetY), new Vector(this.offsetX + this.width, this.offsetY), new Vector(this.offsetX + this.width, this.offsetY + this.height), new Vector(this.offsetX, this.offsetY + this.height));
        h.rotate(this.angle);
        return h.intersect(new Vector(c, l))
    };
    this.getSquare = function () {
        var c = new Square(new Vector(this.offsetX, this.offsetY), new Vector(this.offsetX + this.width, this.offsetY), new Vector(this.offsetX + this.width, this.offsetY + this.height), new Vector(this.offsetX, this.offsetY + this.height));
        c.rotate(this.angle);
        return c
    };
    this.scale = function (c, l) {
        this.context.restore();
        this.width = c;
        this.height = l;
        this.canvas.width = c;
        this.canvas.height = l;
        this.context.translate(this.width / 2, this.height / 2);
        this.redraw()
    };
    this.setAngle = function (c) {
        this.angle = c
    };
    this.getAngle = function () {
        return this.angle
    };
    this.setTitle = function (c) {
        this.title = c
    };
    this.getTitle = function () {
        return this.title
    }
}

function Square(a, b, c, l) {
    function h(f, j, y, H) {
        p = f;
        r = y.subtract(f);
        q = j;
        s = H.subtract(j);
        rCrossS = e(r, s);
        if (!(rCrossS <= x && rCrossS >= -1 * x)) {
            t = e(q.subtract(p), s) / rCrossS;
            u = e(q.subtract(p), r) / rCrossS;
            if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
                intPoint = p.add(r.scalarMult(t));
                return new Vector(intPoint.x, intPoint.y)
            }
            return null
        }
    }
    function e(f, j) {
        return f.x * j.y - j.x * f.y
    }
    function d(f, j, y, H) {
        p = f;
        r = j.subtract(f);
        q = y;
        s = H.subtract(y);
        rCrossS = e(r, s);
        if (rCrossS <= x && rCrossS >= -1 * x) return false;
        t = e(q.subtract(p), s) / rCrossS;
        u = e(q.subtract(p), r) / rCrossS;
        return 0 <= u && u <= 1 && 0 <= t && t <= 1 ? true : false
    }
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = l;
    this.origin = h(a, b, c, l);
    this.intersect = function (f) {
        return !d(this.origin, f, this.a, this.b) && !d(this.origin, f, this.b, this.c) && !d(this.origin, f, this.c, this.d) && !d(this.origin, f, this.d, this.a)
    };
    this.rotate = function (f) {
        var j = Math.sqrt(Math.pow(this.origin.x - this.a.x, 2) + Math.pow(this.origin.y - this.a.y, 2)),
            y = Math.atan2(this.a.y - this.origin.y, this.a.x - this.origin.x),
            H = Math.atan2(this.b.y - this.origin.y, this.b.x - this.origin.x),
            A = Math.atan2(this.c.y - this.origin.y, this.c.x - this.origin.x),
            m = Math.atan2(this.d.y - this.origin.y, this.d.x - this.origin.x);
        this.a.x = this.origin.x + j * Math.cos(f + y);
        this.a.y = this.origin.y + j * Math.sin(f + y);
        this.b.x = this.origin.x + j * Math.cos(f + H);
        this.b.y = this.origin.y + j * Math.sin(f + H);
        this.c.x = this.origin.x + j * Math.cos(f + A);
        this.c.y = this.origin.y + j * Math.sin(f + A);
        this.d.x = this.origin.x + j * Math.cos(f + m);
        this.d.y = this.origin.y + j * Math.sin(f + m)
    };
    this.alignBottomRight = function (f) {
        f = new Vector(f.x - this.c.x, f.y - this.c.y);
        this.a = this.a.add(f);
        this.b = this.b.add(f);
        this.c = this.c.add(f);
        this.d = this.d.add(f);
        this.origin = h(this.a, this.b, this.c, this.d)
    };
    this.alignTopRight = function (f) {
        f = new Vector(f.x - this.b.x, f.y - this.b.y);
        this.a = this.a.add(f);
        this.b = this.b.add(f);
        this.c = this.c.add(f);
        this.d = this.d.add(f);
        this.origin = h(this.a, this.b, this.c, this.d)
    };
    var x = 1.0E-5
}

function Vector(a, b) {
    this.x = a;
    this.y = b;
    this.scalarMult = function (c) {
        return new Vector(this.x * c, this.y * c)
    };
    this.dot = function (c) {
        return this.x * c.x + this.y * c.y
    };
    this.perp = function () {
        return new Vector(-1 * this.y, this.x)
    };
    this.subtract = function (c) {
        return this.add(c.scalarMult(-1))
    };
    this.add = function (c) {
        return new Vector(this.x + c.x, this.y + c.y)
    }
};
var CanvasOverlay_overlay_;

function CanvasOverlay(a) {
    this.map_ = a.map;
    this.imgsrc_ = a.img || null;
    this.opacity_ = a.opacity || 1;
    this.context_ = this.div_ = null;
    this.display_ = true;
    this.collage_ = null;
    this.setMap(this.map_)
}
CanvasOverlay.prototype = new google.maps.OverlayView;
CanvasOverlay.prototype.show = function () {
    this.div_.style.display = "block";
    this.display_ = true
};
CanvasOverlay.prototype.hide = function () {
    this.div_.style.display = "none";
    this.display_ = false
};
CanvasOverlay.prototype.toggle = function () {
    this.display_ ? this.hide() : this.show()
};
CanvasOverlay.prototype.getCurrentProjection = function () {
    return this.getProjection()
};
CanvasOverlay.prototype.getDimension = function () {
    var a = this.getProjection(),
        b = this.map_.getBounds(),
        c = a.fromLatLngToDivPixel(b.getSouthWest());
    a = a.fromLatLngToDivPixel(b.getNorthEast());
    return {
        left: c.x,
        top: a.y,
        width: a.x - c.x,
        height: c.y - a.y
    }
};
CanvasOverlay.prototype.draw = function () {
    var a = this.getDimension(),
        b = this.div_;
    b.style.left = a.left + "px";
    b.style.top = a.top + "px";
    b.style.width = a.width + "px";
    b.style.height = a.height + "px";
    b = this.canvas_;
    b.setAttribute("width", a.width);
    b.setAttribute("height", a.height);
    this.collage_ && this.collage_.redraw()
};
CanvasOverlay.prototype.onAdd = function () {
    CanvasOverlay_overlay_ = this;
    google.maps.event.addListener(this.map_, "center_changed", function () {
        CanvasOverlay_overlay_ && CanvasOverlay_overlay_.draw()
    });
    window.onresize = function () {
        CanvasOverlay_overlay_ && CanvasOverlay_overlay_.draw()
    };
    var a = document.createElement("div");
    a.style.position = "absolute";
    a.style.margin = 0;
    a.style.padding = 0;
    var b = document.createElement("canvas");
    b.style.position = "absolute";
    b.style.top = 0;
    b.style.left = 0;
    var c = this.getDimension();
    b.setAttribute("width", c.width);
    b.setAttribute("height", c.height);
    b.style.margin = 0;
    b.style.padding = 0;
    b.id = "CanvasOverlay_drawzone_canvas";
    a.appendChild(b);
    this.div_ = a;
    this.canvas_ = b;
    if (this.imgsrc_ != null) {
        this.img_ = new Image;
        this.img_.onload = function () {
            CanvasOverlay_overlay_.collage_ = new Collage("#" + CanvasOverlay_overlay_.canvas_.id);
            CanvasOverlay_overlay_.collage_.addLayer(CanvasOverlay_overlay_.img_).setOpacity(CanvasOverlay_overlay_.opacity_);
            CanvasOverlay_overlay_.collage_.redraw()
        };
        this.img_.src = this.imgsrc_
    }
    this.getPanes().overlayImage.appendChild(a)
};
CanvasOverlay.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);
    CanvasOverlay_overlay_ = this.div_ = null
};

function ControlPanel(a, b) {
    var c = false,
        l = false,
        h = false,
        e, d, x = supports_canvas(),
        f = supports_filereader(),
        j = new google.maps.Geocoder,
        y;
    a.style.padding = "6px 5px 5px 5px";
    var H = document.createElement("DIV");
    H.style.textAlign = "left";
    try {
        H.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
    } catch (A) {
        H.style.backgroundColor = "#ffffff"
    }
    H.style.border = "1px solid gray";
    a.appendChild(H);
    var m = document.createElement("DIV");
    m.id = "ThannControl";
    m.style.padding = "5px 10px 0px 4px";
    m.style.cursor = "pointer";
    m.style.textAlign = "center";
    m.title = "Open/close control panel";
    m.innerHTML = "ThannMap<sub style=\"color:black;font:9px 'Lucida Grande','Trebuchet MS',Verdana,sans-serif;\">V.1 beta</sub><span style=\"color:black;font:14px 'Lucida Grande','Trebuchet MS',Verdana,sans-serif;\">::Control</span>";
    H.appendChild(m);
    var I = '<h2 class="current">MapView</h2><div class="pane" style="display:block">';
    I += '<input type="radio" name="mapview" id="ROADMAP"><label for="ROADMAP">Street view</label><br />';
    I += '<input type="radio" name="mapview" id="SATELLITE"><label for="SATELLITE">Satellite view</label><br />';
    I += '<input type="radio" name="mapview" id="HYBRID"><label for="HYBRID">Hybrid view</label><br />';
    I += '<input type="radio" name="mapview" id="TERRAIN"><label for="TERRAIN">Terrain view</label><br />';
    I += "</div>";
    var k = '<h2>Blueprint</h2><div class="pane">';
    if (!x || !f) {
        k += '<div style="padding:5px;text-align:justify;background-color:red;">Required functionality (<i>';
        x || (k += " canvas ");
        f || (k += " filereader ");
        k += "</i>) is not supported by this browser. Consider to revisit this page with another browser, like Mozilla Firefox 3.6+ or Google Chrome 5+</div><hr />";
        k += 'Load local file: <span class="clearinput"><input disabled="disabled" type="file" id="OVERLAYFILE"></span><hr />'
    } else k += '<div style="text-align:center;width:100%;">Load local file: <span class="clearinput"><input type="file" id="OVERLAYFILE"></span></div><hr />';
    k += '<button id="OVERLAYREMOVEBLUEPRINT" class="OVERLAYBUTTONS">Remove the Blueprint</button><br />';
    k += '<input type="range" id="OVERLAYOPACITY" min=0 max=1 step=.1 value=1 /><br />';
    k += '<button id="OVERLAYRESETBLUEPRINT" class="OVERLAYBUTTONS">Reset the Blueprint</button><br />';
    k += '<button id="OVERLAYBIGSCALEUPBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">Scale &gt;&gt;</button>';
    k += '<button id="OVERLAYSMALLSCALEUPBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">Scale &gt;</button>';
    k += '<button id="OVERLAYSMALLSCALEDOWNBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">&lt; Scale</button>';
    k += '<button id="OVERLAYBIGSCALEDOWNBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">&lt;&lt; Scale</button>';
    k += '<button id="OVERLAYROTATEBIGCLOCKWISEBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">Rotate &gt;&gt;</button>';
    k += '<button id="OVERLAYROTATESMALLCLOCKWISEBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">Rotate &gt;</button>';
    k += '<button id="OVERLAYROTATESMALLCOUNTERCLOCKWISEBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">&lt; Rotate</button>';
    k += '<button id="OVERLAYROTATEBIGCOUNTERCLOCKWISEBLUEPRINT" class="OVERLAYBUTTONS QUATERBUTTON">&lt;&lt; Rotate</button><br />';
    k += "<hr />";
    k += '<button id="OVERLAYSETGOVERLAY" class="OVERLAYBUTTONS">Set as GroundOverlay</button>';
    k += '<button id="OVERLAYREMOVEGOVERLAY" class="OVERLAYBUTTONS">Remove the GroundOverlay</button><br /><br />';
    k += '<button id="OVERLAYSRCGOVERLAY" class="OVERLAYBUTTONS" rel="#overlay_output">Get Source For GroundOverlay (GMaps API V3)</button>';
    k += "</div>";
    x = '<h2 class="notyet">Digitize</h2><div class="pane">';
    x += "Not yet implemented, next to come...";
    x += "</div>";
    f = '<h2>Locate</h2><div style="text-align:center;" class="pane">';
    f += '<div id="OVERLAYLOCATIONCURRENT">No current location available</div><br />';
    f += '<input style="width:98%;" id="OVERLAYLOCATIONSEARCH" type="search" placeholder="Enter address" /><br />';
    f += '<button style="width:100%;" id="OVERLAYLOCATIONBUTTON">Locate</button><br />';
    f += "</div>";
    var C = '<h2 class="notyet">Map Styler</h2><div class="pane">';
    C += "Not yet implemented";
    C += "</div>";
    var o = '<h2 class="notyet">Directions</h2><div class="pane">';
    o += "Not yet implemented";
    o += "</div>";
    var z = '<h2 class="notyet">Settings</h2><div class="pane">';
    z += "Not yet implemented";
    z += "</div>";
    var g = '<h2>Contact and Imprint</h2><div class="pane">';
    g += '<h3>Contact me</h3><br />Suggestions? Bugs? Useful? Anything else?<br /><a href="mailto:dfddurstewitz@googlemail.com">Write me a mail</a> or jabber (pidgin) me: dfddurstewitz@googlemail.com<br /><br />';
    g += '<h3>Imprint</h3><br />Frank Durstewitz<br />Im Thann 12<br />75399 Unterreichenbach<br />Germany<br /><br /><small style="color:silver;">last change 2010-06-19, &copy 2010 by dfd</small>';
    g += "</div>";
    var w = document.createElement("DIV");
    w.style.display = "none";
    w.style.textAlign = "left";
    w.style.fontFamily = "Arial,sans-serif";
    w.style.fontSize = "12px";
    w.style.padding = "4px";
    w.style.width = "300px";
    w.title = "";
    w.id = "ThannControl_accordeon";
    w.innerHTML = k + f + I + x + C + o + z + g;
    H.appendChild(w);
    google.maps.event.addDomListener(m, "click", function () {
        if (w.style.display == "none") {
            w.style.display = "block";
            if (!l) {
                l = true;
                jQuery("#ThannControl_accordeon").tabs("#ThannControl_accordeon div.pane", {
                    tabs: "h2",
                    effect: "slide",
                    initialIndex: null
                });
                jQuery(".OVERLAYBUTTONS").css("width", "100%").attr("disabled", "disabled");
                jQuery(".HALFBUTTON").css("width", "50%");
                jQuery(".QUATERBUTTON").css("width", "25%");
                jQuery("#OVERLAYOPACITY").attr("disabled", "disabled").rangeinput({
                    keyboard: false
                }).hide();
                jQuery(":range").change(function (v, n) {
                    if (c) {
                        c.collage_.getLayer(0).setOpacity(n);
                        c.draw()
                    }
                });
                jQuery("#OVERLAYSRCGOVERLAY").overlay({
                    mask: {
                        color: "#fff",
                        loadSpeed: 200,
                        opacity: 0.5
                    },
                    closeOnClick: true,
                    onBeforeLoad: function () {
                        _gaq.push(["_trackEvent", "Map", "GroundOverlay", "show the source"]);
                        if (h && e && d) {
                            var v = d.getSouthWest().toString(),
                                n = d.getNorthEast().toString(),
                                G = "/*\n  Generated by ThannMap @ http://thannmap.appspot.com)\n";
                            G += "  " + (new Date).toGMTString() + "\n";
                            G += "  Original filename: " + y + "\n";
                            G += "*/\n\n";
                            G += "var ThannMapOverlayBounds = new google.maps.LatLngBounds(\n";
                            G += "  new google.maps.LatLng" + v + ",\n";
                            G += "  new google.maps.LatLng" + n + ");\n";
                            G += "var ThannMapOverlay = new google.maps.GroundOverlay(\n  image_url_here,\n  ThannMapOverlayBounds);\n";
                            G += "ThannMapOverlay.setMap(map_object_here);\n";
                            jQuery("#overlay_output_textarea").val(G);
                            jQuery("#overlay_output_image").attr("src", e)
                        }
                        return true
                    },
                    onLoad: function () {
                        jQuery("#overlay_output_textarea").select();
                        jQuery("#overlay_output button").removeAttr("disabled")
                    }
                })
            }
        } else w.style.display = "none"
    });
    jQuery("#ThannControl_accordeon h2").live("click", function () {
        _gaq.push(["_trackEvent", "Map", jQuery(this).text(), ""])
    });
    jQuery("#OVERLAYRESETBLUEPRINT").live("click", function () {
        if (c) {
            c.collage_.reset();
            c.collage_.getLayer(0).setOpacity(jQuery(":range").val());
            c.draw()
        }
    });
    jQuery("#OVERLAYSMALLSCALEUPBLUEPRINT").live("click", function () {
        c && c.collage_.scale(1.01)
    });
    jQuery("#OVERLAYSMALLSCALEDOWNBLUEPRINT").live("click", function () {
        c && c.collage_.scale(0.99)
    });
    jQuery("#OVERLAYBIGSCALEUPBLUEPRINT").live("click", function () {
        c && c.collage_.scale(1.1)
    });
    jQuery("#OVERLAYBIGSCALEDOWNBLUEPRINT").live("click", function () {
        c && c.collage_.scale(0.9)
    });
    jQuery("#OVERLAYROTATESMALLCLOCKWISEBLUEPRINT").live("click", function () {
        c && c.collage_.rotate(3)
    });
    jQuery("#OVERLAYROTATEBIGCLOCKWISEBLUEPRINT").live("click", function () {
        c && c.collage_.rotate(60)
    });
    jQuery("#OVERLAYROTATESMALLCOUNTERCLOCKWISEBLUEPRINT").live("click", function () {
        c && c.collage_.rotate(-3)
    });
    jQuery("#OVERLAYROTATEBIGCOUNTERCLOCKWISEBLUEPRINT").live("click", function () {
        c && c.collage_.rotate(-60)
    });
    jQuery('input[name="mapview"]').live("click", function () {
        switch (this.id) {
        case "ROADMAP":
            b.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            break;
        case "SATELLITE":
            b.setMapTypeId(google.maps.MapTypeId.SATELLITE);
            break;
        case "HYBRID":
            b.setMapTypeId(google.maps.MapTypeId.HYBRID);
            break;
        case "TERRAIN":
            b.setMapTypeId(google.maps.MapTypeId.TERRAIN);
            break
        }
        this.blur()
    });
    jQuery("#OVERLAYFILE").live("change", function () {
        jQuery(this).blur();
        jQuery(".OVERLAYBUTTONS").attr("disabled", "disabled");
        jQuery(":range").removeAttr("disabled");
        jQuery(".HALFBUTTON").removeAttr("disabled");
        jQuery(".QUATERBUTTON").removeAttr("disabled");
        jQuery("#OVERLAYREMOVEBLUEPRINT").removeAttr("disabled");
        jQuery("#OVERLAYSETGOVERLAY").removeAttr("disabled");
        jQuery("#OVERLAYRESETBLUEPRINT").removeAttr("disabled");
        if (h) {
            h.setMap(null);
            h = false
        }
        try {
            var v = document.getElementById("OVERLAYFILE").files;
            jQuery(".clearinput").html(jQuery(".clearinput").html());
            if (v && v.length > 0) {
                for (var n = 0; n < v.length; n++) {
                    var G = v[n];
                    if (G.type.match(/image.*/)) {
                        var B = new FileReader;
                        B.onload = function (K) {
                            c && c.setMap(null);
                            y = G.fileName;
                            c = new CanvasOverlay({
                                overlay: "blueprint",
                                map: b,
                                opacity: jQuery(":range").val(),
                                img: K.target.result
                            })
                        };
                        B.readAsDataURL(G);
                        var F = new FileReader;
                        F.onloadend = function () {
                            var K = findEXIFinJPEG(F.result);
                            if ("GPSLatitude" in K) {
                                var N = K.GPSLatitude,
                                    P = K.GPSLongitude;
                                b.setCenter(new google.maps.LatLng((N[0] + N[1] / 60 + N[2] / 3600) * ((K.GPSLatitudeRef || "N") == "N" ? 1 : -1), (P[0] + P[1] / 60 + P[2] / 3600) * ((K.GPSLongitudeRef || "W") == "W" ? -1 : 1)))
                            }
                        };
                        F.readAsBinaryString(G)
                    } else alert("This filetype is not supported.\nOnly files of type image can be used.")
                }
                return false
            }
        } catch (M) {}
        _gaq.push(["_trackEvent", "Map", "Blueprint", "load a local file"])
    });
    jQuery("#OVERLAYREMOVEBLUEPRINT").live("click", function () {
        if (c) {
            c.setMap(null);
            c = false
        }
        jQuery(".OVERLAYBUTTONS").attr("disabled", "disabled");
        jQuery(this).attr("disabled", "disabled").blur()
    });
    jQuery("#OVERLAYREMOVEGOVERLAY").live("click", function () {
        jQuery(".OVERLAYBUTTONS").attr("disabled", "disabled");
        jQuery("#OVERLAYOPACITY").attr("disabled", "disabled");
        if (h) {
            h.setMap(null);
            h = false
        }
    });
    jQuery("#OVERLAYSETGOVERLAY").live("click", function () {
        if (c) {
            b.setOptions({
                draggableCursor: "wait"
            });
            jQuery(".OVERLAYBUTTONS").attr("disabled", "disabled");
            jQuery("#OVERLAYOPACITY").attr("disabled", "disabled");
            var v = c.getCurrentProjection();
            c.collage_.redraw();
            var n = c.collage_.getFinalOverlay(),
                G = b.getBounds(),
                B = v.fromLatLngToContainerPixel(G.getNorthEast());
            v.fromLatLngToContainerPixel(G.getSouthWest());
            G = B.y + n.top;
            var F = B.x + n.left;
            B = G + n.height;
            var M = F - n.width;
            G = new google.maps.Point(F, G);
            B = new google.maps.Point(M, B);
            G = new google.maps.Point(n.right, n.top);
            B = new google.maps.Point(n.left, n.bottom);
            B = v.fromContainerPixelToLatLng(B);
            v = v.fromContainerPixelToLatLng(G);
            d = new google.maps.LatLngBounds(B, v);
            e = n.src;
            h = new google.maps.GroundOverlay(e, d, {
                clickable: false
            });
            h.setMap(b);
            c.setMap(null);
            c = null;
            jQuery("#OVERLAYREMOVEGOVERLAY").removeAttr("disabled");
            jQuery("#OVERLAYSRCGOVERLAY").removeAttr("disabled");
            b.setOptions({
                draggableCursor: "crosshair"
            })
        }
    });
    jQuery("#OVERLAYLOCATIONSEARCH").live("keydown", function (v) {
        v.keyCode == "13" && jQuery("#OVERLAYLOCATIONBUTTON").trigger("click")
    });
    jQuery("#OVERLAYLOCATIONBUTTON").live("click", function () {
        var v = document.getElementById("OVERLAYLOCATIONSEARCH").value;
        if (j) j.geocode({
            address: v
        }, function (n, G) {
            if (G == google.maps.GeocoderStatus.OK) {
                b.fitBounds(n[0].geometry.viewport);
                var B = n[0].partial_match == true ? "<br />(partial address match)" : "",
                    F = Geo.toLat(n[0].geometry.location.lat(), "dms", 0),
                    M = Geo.toLon(n[0].geometry.location.lng(), "dms", 0);
                B += "<br />" + F + "&nbsp;&nbsp;-&nbsp;&nbsp;" + M;
                document.getElementById("OVERLAYLOCATIONCURRENT").innerHTML = n[0].formatted_address + B
            } else document.getElementById("OVERLAYLOCATIONCURRENT").innerHTML = "Location not available or too many requests"
        });
        else document.getElementById("OVERLAYLOCATIONCURRENT").innerHTML = "Geocoding not possible.";
        _gaq.push(["_trackEvent", "Map", "Location", "search a location"])
    });
    jQuery("button").live("click", function () {
        jQuery(this).blur()
    })
}
var Geo = {};
Geo.parseDMS = function (a) {
    if (typeof b == "object") throw new TypeError("Geo.parseDMS - dmsStr is [DOM?] object");
    if (!isNaN(a)) return Number(a);
    b = String(a).trim().replace(/^-/, "").replace(/[NSEW]jQuery/i, "").split(/[^0-9.,]+/);
    b[b.length - 1] == "" && b.splice(b.length - 1);
    if (b == "") return NaN;
    switch (b.length) {
    case 3:
        var b = b[0] / 1 + b[1] / 60 + b[2] / 3600;
        break;
    case 2:
        b = b[0] / 1 + b[1] / 60;
        break;
    case 1:
        b = b[0];
        if (/[NS]/i.test(a)) b = "0" + b;
        if (/[0-9]{7}/.test(b)) b = b.slice(0, 3) / 1 + b.slice(3, 5) / 60 + b.slice(5) / 3600;
        break;
    default:
        return NaN
    }
    if (/^-|[WS]jQuery/i.test(a.trim())) b = -b;
    return Number(b)
};
Geo.toDMS = function (a, b, c) {
    if (typeof a == "object") throw new TypeError("Geo.toDMS - deg is [DOM?] object");
    if (isNaN(a)) return "";
    if (typeof b == "undefined") b = "dms";
    if (typeof c == "undefined") switch (b) {
    case "d":
        c = 4;
        break;
    case "dm":
        c = 2;
        break;
    case "dms":
        c = 0;
        break;
    default:
        b = "dms";
        c = 0
    }
    a = Math.abs(a);
    switch (b) {
    case "d":
        a = a.toFixed(c);
        if (a < 100) a = "0" + a;
        if (a < 10) a = "0" + a;
        dms = a + "\u00b0";
        break;
    case "dm":
        b = (a * 60).toFixed(c);
        a = Math.floor(b / 60);
        b = (b % 60).toFixed(c);
        if (a < 100) a = "0" + a;
        if (a < 10) a = "0" + a;
        if (b < 10) b = "0" + b;
        dms = a + "\u00b0" + b + "\u2032";
        break;
    case "dms":
        var l = (a * 3600).toFixed(c);
        a = Math.floor(l / 3600);
        b = Math.floor(l / 60) % 60;
        c = (l % 60).toFixed(c);
        if (b < 10) b = "0" + b;
        if (c < 10) c = "0" + c;
        dms = a + "\u00b0" + b + "\u2032" + c + "\u2033";
        break
    }
    return dms
};
Geo.toLat = function (a, b, c) {
    b = Geo.toDMS(a, b, c);
    return b == "" ? "" : b + (a < 0 ? "S" : "N")
};
Geo.toLon = function (a, b, c) {
    b = Geo.toDMS(a, b, c);
    return b == "" ? "" : b + (a < 0 ? "W" : "E")
};
Geo.toBrng = function (a, b, c) {
    a = (Number(a) + 360) % 360;
    return Geo.toDMS(a, b, c).replace("360", "0")
};
var map, geocoder;
google.maps.event.addDomListener(window, "load", loaded);

function loaded() {
    initialize()
}

function initialize() {
    geocoder = new google.maps.Geocoder;
//    var a = google.loader.ClientLocation || false;
    document.getElementById("mapbox").style.width="900px";
    document.getElementById("mapbox").style.height="500px";
var a = {
        zoom: 8,
        dragCursor: "move",
        draggableCursor: "crosshair",
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center:new google.maps.LatLng(32.400255,-110.740814)
    };
    map = new google.maps.Map(document.getElementById("mapbox"), a);
    a = document.createElement("DIV");
    new ControlPanel(a, map);
    a.index = -1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(a)
}

function supports_canvas() {
    return !!document.createElement("canvas").getContext
}
function supports_filereader() {
    try {
        new FileReader;
        return true
    } catch (a) {
        return false
    }
};