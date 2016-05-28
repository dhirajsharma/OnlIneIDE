var addthis_config = addthis_config || {};
addthis_config.data_track_addressbar = false;
addthis_config.data_track_clickback = false;
var editors = {};
var editor_theme = "crimson_editor";
var editor_font_size = 14;
var editor_invisible = false;
var editor_gutter = true;
var editor_tab_size = 4;
var editor_type = "null";
var editor_soft_wrap = "false";
var projecttitle = "New Project";
var loginstatus = false;
var terminal_color = "#084d11";
var terminal_mode = "H";
var root;
var languageid;
var version;
var preview = "";
var ext;
var mainfile;
var mainmode;
var cmd_execute;
var cmd_compile;
var $win = null;
var term = null;
var nodeid;
var nodetext;
var nodetype;
var connected = false;
var timeout;
var retrycount;
const RETRY_INTERVAL = 2000;
$(document).ready(function () {
    window.onbeforeunload = function () {
        return"Leaving this page may cause loss of your code!"
    };
    $("#spectrum").spectrum({color: terminal_color, showButtons: false, move: function (b) {
            terminal_color = b.toHexString();
            $(".terminal").css("background-color", b.toHexString());
            $("#terminal").css("background-color", b.toHexString());
            setCookie("terminal_color", b.toHexString())
        }});
    $("#terminal-color").spectrum({color: terminal_color, showButtons: false, move: function (b) {
            terminal_color = b.toHexString();
            $(".terminal").css("background-color", b.toHexString());
            $("#terminal").css("background-color", b.toHexString());
            setCookie("terminal_color", b.toHexString())
        }});
    $(window).bind("keydown", function (b) {
        if (b.ctrlKey || b.metaKey) {
            switch (String.fromCharCode(b.which).toLowerCase()) {
                case"d":
                    b.preventDefault();
                    alert("ctrl-D");
                    break;
                case"s":
                    b.preventDefault();
                    alert("ctrl-s");
                    break;
                case"f":
                    b.preventDefault();
                    alert("ctrl-f");
                    break;
                case"g":
                    b.preventDefault();
                    alert("ctrl-g");
                    break
                }
        }
    });
    $(window).load(function () {
        $("#home").css({visibility: "hidden"});
        var g = $("#east").height();
        var f = $("#south").height();
        var b = 345;
        if (g + f + 50 - 520 < b) {
            b = g + f + 50 - 520
        }
        if (terminal <= 0) {
            $("#cc").layout("panel", "south").panel("resize", {height: 320})
        } else {
            if (terminal > 100) {
                $("#cc").layout("panel", "south").panel("resize", {height: 195})
            } else {
                $("#cc").layout("panel", "south").panel("resize", {height: 1});
                $("#cc").layout("collapse", "west");
                $("#cc").layout("expand", "west");
                $("#cc").layout("collapse", "west")
            }
        }
        $("#cc").layout("resize");
        var e = HOME + ":8080/init?port=" + port;
        var d = {hello: "bye"};
        $.ajax({type: "GET", data: d, url: e, dataType: "json", beforeSend: function () {
                $("#loading").css({visibility: "visible"})
            }, success: function (h) {
                root = h.root;
                ext = h.ext;
                preview = h.preview;
                languageid = h.languageid;
                mainfile = h.mainfile;
                mainmode = h.mainmode;
                $("#home").css({visibility: "visible"});
                $("#preview").css("display", "none");
                if (h.compile.length <= 0) {
                    $("#compile").css("display", "none");
                    $("#separator").css("display", "none");
                    $("#execute").linkbutton({iconCls: "icon-execute-project"})
                }
                if (h.preview.length > 0) {
                    $("#cc").layout("panel", "south").panel("setTitle", "Web View");
                    $("#terminal").css("background-color", "#fff");
                    $("#south").css("background-color", "#fff");
                    $("#compile").css("display", "none");
                    $("#compileoptions").css("display", "none");
                    $("#execute").css("display", "none");
                    $("#preview").css("display", "block");
                    if (languageid === "phpdb" || languageid === "perldb" || languageid === "pythondb" || languageid === "rubydb") {
                        $("#cc").layout("panel", "south").panel("setTitle", "Result View");
                        $("#preview").linkbutton({text: "Execute"})
                    }
                    $("#separator").css("display", "none")
                }
                if (languageid === "java-maven" || languageid === "java8-maven") {
                    addNewGoogleTab(root, mainfile, false)
                } else {
                    if (terminal > 100) {
                        addNewTab(root, mainfile, null, mainmode);
                        $("#south").css("background-color", "#eee");
                        $("#east").css("background-color", "#aaa");
                        $("#cc").layout("panel", "south").panel("setTitle", "")
                    } else {
                        if (terminal <= 0) {
                            addNewTab(root, mainfile, null, mainmode)
                        }
                    }
                }
                $("#version").html("(" + h.version + ")");
                setProjectTitle(h.projecttitle)
            }});
        if (getCookie("editor_theme")) {
            editor_theme = getCookie("editor_theme")
        }
        if (getCookie("editor_type")) {
            editor_type = getCookie("editor_type")
        }
        if (getCookie("editor_font_size")) {
            editor_font_size = parseInt(getCookie("editor_font_size"));
            setEditorFontSize(editor_font_size)
        }
        if (getCookie("editor_soft_wrap")) {
            editor_soft_wrap = getCookie("editor_soft_wrap")
        }
        if (getCookie("editor_tab_size")) {
            editor_tab_size = parseInt(getCookie("editor_tab_size"))
        }
        if (getCookie("editor_invisible") && getCookie("editor_invisible") !== "false") {
            editor_invisible = getCookie("editor_invisible")
        }
        if (getCookie("editor_gutter") && getCookie("editor_gutter") !== "false") {
            editor_gutter = getCookie("editor_gutter")
        }
        if (getCookie("terminal_color")) {
            terminal_color = getCookie("terminal_color")
        }
        setTerminalMode("H");
        $("#cc").css({opacity: 1, visibility: "visible"});
        $("#loading").css({visibility: "hidden"});
        if (port > 0) {
            var c = io.connect(HOME + ":8080/?port=" + port);
            c.on("connect", function () {
                connected = true;
                clearTimeout(timeout);
                c.emit("verify", {sessionid: sessionid, port: port});
                var j = editor_font_size;
                term = new Terminal({cols: 80, rows: 24, useStyle: true, screenKeys: true, cursorBlink: true});
                $("#cc").css({opacity: 1, visibility: "visible"});
                $("#compile").click(function () {
                    saveFiles(function (k) {
                        var l = "cmd-compile";
                        c.emit("data", l);
                        c.emit("data", "\n");
                        term.focus();
                        return false
                    })
                });
                $("#execute").click(function () {
                    saveFiles(function (k) {
                        var l = "cmd-execute";
                        c.emit("data", l);
                        c.emit("data", "\n");
                        term.focus();
                        return false
                    })
                });
                $("#preview").click(function () {
                    if (languageid === "latex") {
                        saveFiles(function (k) {
                            $("#cc").layout("panel", "east").panel({href: HOME + ":8080/web_view?port=" + port, extractor: function (l) {
                                    return l
                                }})
                        })
                    } else {
                        saveFiles(function (k) {
                            $("#cc").layout("panel", "south").panel({href: HOME + ":8080/web_view?port=" + port, extractor: function (l) {
                                    return l
                                }})
                        })
                    }
                });
                $("#codingground").click(function () {
                    saveFiles(function (k) {
                        window.location = "http://www.tutorialspoint.com/codingground.htm"
                    })
                });
                term.on("data", function (k) {
                    c.emit("data", k)
                });
                term.on("title", function (k) {
                    document.title = k
                });
                var h = true;
                $("#cc").layout("panel", "center").panel({onResize: function (k, l) {
                        h = true
                    }});
                setInterval(function () {
                    if (h) {
                        var n, m;
                        if (document.getElementById("terminal")) {
                            n = (document.getElementById("terminal").clientHeight / term.element.offsetHeight);
                            m = (document.getElementById("terminal").clientWidth / term.element.offsetWidth);
                            n = n * term.rows | 0, m = m * term.cols | 0, term.resize(m, n), typeof func === "function" && func(m, n);
                            term.focus()
                        }
                        var l = HOME + ":8080/resize?port=" + port;
                        var k = {width: m, height: n};
                        $.ajax({type: "POST", url: l, data: k, dataType: "json", success: function (o) {
                            }});
                        h = false
                    }
                }, 800);
                term.open(document.getElementById("terminal"));
                if (getCookie("terminal_color")) {
                    terminal_color = getCookie("terminal_color")
                }
                setEditorFontSize(editor_font_size);
                c.on("data", function (k) {
                    term.write(k)
                });
                c.on("disconnect", function () {
                    connected = false;
                    retrycount = 0;
                    term.write("\x1b[1mDisconnected! Trying to reconnect with the server...\x1b[m\r\n");
                    i(RETRY_INTERVAL)
                });
                var i = function (k) {
                    timeout = setTimeout(function () {
                        if (!connected) {
                            term.write("\x1b[1mDisconnected! Trying to reconnect with the server...\x1b[m\r\n");
                            c.socket.reconnect();
                            retrycount++;
                            if (retrycount > 10) {
                                connected = true;
                                term.destroy();
                                $("#terminal").html('<div class="expired-session"><p>Session Expired</p><a href="http://www.tutorialspoint.com/codingground.htm"><img src="http://codingground.tutorialspoint.com/home.png"/></a></div>')
                            }
                            i(k)
                        }
                    }, k)
                };
                if (terminal > 0) {
                    terminal_color = "#2e3436"
                }
                $("#terminal").css("background-color", terminal_color, "!important");
                $(".terminal").css("background-color", terminal_color, "!important")
            })
        }
    });
    $("#cc").layout("panel", "west").panel({onExpand: function () {
            reloadTree()
        }});
    $("#home").tree({url: HOME + ":8080/load_tree?port=" + port + "&sessionid=" + sessionid, onContextMenu: function (c, b) {
            c.preventDefault();
            $("#home").tree("select", b.target);
            if (b.type === "F") {
                $("#filecontext").menu("show", {left: c.pageX, top: c.pageY})
            } else {
                if (b.type === "D") {
                    $("#dircontext").menu("show", {left: c.pageX, top: c.pageY})
                }
            }
        }, onExpand: function (b) {
            $(this).tree("select", b.target)
        }, onCollapse: function (b) {
            $(this).tree("select", b.target)
        }, onDblClick: function (b) {
            loadFile(b, false)
        }, onBeforeEdit: function (b) {
            nodeid = b.id;
            nodetext = b.text;
            nodetype = b.type
        }, onAfterEdit: function (g) {
            if (/^[a-zA-Z0-9-_+@.?:=]*$/.test(g.text) == false) {
                $.messager.alert("Message", "File name can have only these characters [a-zA-Z0-9-_+@.?:=]", "info");
                $("#home").tree("update", {target: g.target, text: nodetext});
                return false
            } else {
                if (!(g.text.length) && nodetype === "F") {
                    $.messager.alert("Message", "File name can't be null", "info");
                    $("#home").tree("update", {target: g.target, text: nodetext});
                    return false
                } else {
                    if (!(g.text.length) && nodetype === "D") {
                        $.messager.alert("Message", "Directory name can't be null", "info");
                        $("#home").tree("update", {target: g.target, text: nodetext});
                        return false
                    }
                }
            }
            var i = g.id.lastIndexOf("/");
            var j = g.id.substring(0, i);
            var c = j + "/" + g.text;
            var d = $("#home").tree("getParent", g.target);
            var f = $("#home").tree("getChildren", d.target);
            var e = true;
            $.each(f, function (k, l) {
                if (c === l.id && nodeid !== c) {
                    alert("A file with the same name already exists!");
                    $.messager.alert("Message", "A file with the same name already exists!", "info");
                    e = false
                }
            });
            if (!e) {
                $("#wait").hide();
                $("#home").tree("update", {target: g.target, text: nodetext});
                return false
            }
            var b = HOME + ":8080/rename_file?port=" + port;
            var h = {cwd: j, oldnode: nodetext, newnode: g.text, sessionid: sessionid};
            $.ajax({type: "POST", url: b, data: h, dataType: "json", beforeSend: function () {
                    $("#loading").css({visibility: "visible"})
                }, success: function (k) {
                    if (k.status) {
                        $.messager.alert("Error Message", k.message, "error");
                        $("#home").tree("update", {target: g.target, text: nodetext})
                    } else {
                        $("#home").tree("update", {target: g.target, id: c});
                        g.id = c;
                        refreshTab(j, nodetext, g.text, k.mode)
                    }
                    $("#loading").css({visibility: "hidden"})
                }})
        }, onBeforeLoad: function (b, c) {
            $("#treewait").css({visibility: "visible"})
        }, onLoadSuccess: function (b, c) {
            $("#treewait").css({visibility: "hidden"})
        }});
    $("#codebox").tabs({onBeforeClose: function (h, c) {
            if (deleting) {
                return true
            }
            var g = this;
            var d = $(g).tabs("getTab", c);
            var b = d.panel("options").id;
            if (editors[b]) {
                if (!editors[b].getSession().getUndoManager().isClean()) {
                    $.messager.defaults.ok = "Save";
                    $.messager.defaults.cancel = "No";
                    $.messager.confirm("Confirmation", "Do you want to save your changes for the file " + h, function (j) {
                        if (j) {
                            saveFiles(function (l) {
                                var m = $(g).tabs("options");
                                var n = m.onBeforeClose;
                                m.onBeforeClose = function () {
                                };
                                $(g).tabs("close", c);
                                m.onBeforeClose = n
                            })
                        } else {
                            var i = $(g).tabs("options");
                            var k = i.onBeforeClose;
                            i.onBeforeClose = function () {
                            };
                            $(g).tabs("close", c);
                            i.onBeforeClose = k
                        }
                    })
                } else {
                    var e = $(g).tabs("options");
                    var f = e.onBeforeClose;
                    e.onBeforeClose = function () {
                    };
                    $(g).tabs("close", c);
                    e.onBeforeClose = f
                }
            } else {
                var e = $(g).tabs("options");
                var f = e.onBeforeClose;
                e.onBeforeClose = function () {
                };
                $(g).tabs("close", c);
                e.onBeforeClose = f
            }
            return false
        }});
    $(".keyboard li").click(function () {
        var h = $(this);
        var d = $(this).html();
        var g;
        var f = d.match(/(.*)MathJax-Element-(\d+)(.*)/);
        if (f) {
            var i = f[2];
            g = $("#MathJax-Element-" + i).html()
        } else {
            if (d.match(/Space/)) {
                g = "\\:"
            } else {
                if (d.match(/Quad/)) {
                    g = "\\quad"
                } else {
                    if (d.match(/Enter/)) {
                        g = "\\\\"
                    }
                }
            }
        }
        var e = $("#codebox").tabs("getSelected");
        var c = e.panel("options").id;
        var b = editors[c].getCursorPosition();
        editors[c].getSession().insert(b, g)
    });
    $("#undo").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        if (editors[b].getSession().getUndoManager().hasUndo()) {
            editors[b].getSession().getUndoManager().undo(false)
        }
    });
    $("#redo").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        if (editors[b].getSession().getUndoManager().hasRedo()) {
            editors[b].getSession().getUndoManager().redo(false)
        }
    });
    var a;
    $("#cut").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        var d = editors[b].getSelectionRange();
        if (editors[b].getSession().getTextRange(d)) {
            a = editors[b].getSession().getTextRange(d);
            editors[b].getSession().remove(d)
        }
    });
    $("#delete").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        var d = editors[b].getSelectionRange();
        if (editors[b].getSession().getTextRange(d)) {
            editors[b].getSession().remove(d)
        }
    });
    $("#copy").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        var d = editors[b].getSelectionRange();
        if (editors[b].getSession().getTextRange(d)) {
            a = editors[b].getSession().getTextRange(d)
        }
    });
    $("#paste").click(function () {
        var d = $("#codebox").tabs("getSelected");
        var c = d.panel("options").id;
        var b = editors[c].getCursorPosition();
        editors[c].getSession().insert(b, a)
    });
    $("#select").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        editors[b].getSelection().selectAll()
    });
    $("#find").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        editors[b].execCommand("find")
    });
    $("#findreplace").click(function () {
        var c = $("#codebox").tabs("getSelected");
        var b = c.panel("options").id;
        editors[b].execCommand("replace")
    })
});
function openFileUpload() {
    if ($("#cc").layout("panel", "west").panel("options").collapsed) {
        $("#cc").layout("expand", "west")
    }
    var a = $("#home").tree("getSelected");
    if (a) {
        if (a.type !== "D") {
            $.messager.alert("Alert Message", "Select a directory where file will be uploaded", "info");
            return false
        }
    } else {
        $.messager.alert("Alert Message", "Select a directory where file will be uploaded", "info");
        return false
    }
    $win = $("#sign").window({title: "Upload File", iconCls: "icon-upload-file", width: "650", height: "375"});
    $win.window("open");
    $("#sign").window("refresh", HOME + ":8080/upload-file.htm?port=" + port)
}
function openShareProject() {
    saveFiles(function (a) {
        return true
    });
    $win = $("#sign").window({title: "Share Project", iconCls: "icon-share-project", width: "675", height: "460"});
    $win.window("open");
    $("#sign").window("refresh", HOME + ":8080/share-project.htm?port=" + port)
}
function openContact() {
    openWindow("http://www.tutorialspoint.com/contact.htm", "Contact Coding Ground", 675, 460)
}
function closeSign() {
    $("#sign").window("close");
    $win = null
}
function openUploadProject() {
    $win = $("#sign").window({title: "Upload project", iconCls: "icon-upload-file", width: "650", height: "435"});
    $win.window("open");
    $("#sign").window("refresh", HOME + ":8080/upload-project.htm?port=" + port)
}
function openCompileOptions() {
    $win = $("#sign").window({title: "Compilation Options", iconCls: "icon-execute-project", width: "550", height: "350"});
    $win.window("open");
    $("#sign").window("refresh", HOME + ":8080/compile-options.htm?port=" + port)
}
function createProject(a) {
    $("#wait").show();
    window.location = a
}
function reportError() {
    openWindow("http://www.tutorialspoint.com/reporterror.htm", "Report Error", 1050, 650)
}
function saveAtDropbox() {
    openWindow(HOME + ":8080/save_at_dropbox?port=" + port, "Save Project", 700, 500)
}
function saveAtGithub() {
    openWindow(HOME + ":8080/save_at_github?port=" + port, "Save Project", 1050, 500)
}
function saveAtBox() {
    openWindow(HOME + ":8080/save_at_box?port=" + port, "Save Project", 700, 500)
}
function saveAtGoogleDrive() {
    openWindow(HOME + ":8080/save_at_googledrive?port=" + port, "Save Project", 700, 500)
}
function saveAtOneDrive() {
    openWindow(HOME + ":8080/save_at_onedrive?port=" + port, "Save Project", 700, 500)
}
function listDropboxProjects() {
    openWindow(HOME + ":8080/list_dropbox_projects?port=" + port, "Import Project", 700, 500)
}
function listGithubProjects() {
    openWindow(HOME + ":8080/list_github_projects?port=" + port, "Import Project", 1050, 500)
}
function listBoxProjects() {
    openWindow(HOME + ":8080/list_box_projects?port=" + port, "Import Project", 700, 500)
}
function listOneDriveProjects() {
    openWindow(HOME + ":8080/list_onedrive_projects?port=" + port, "Import Project", 700, 500)
}
function listGoogleDriveProjects() {
    openWindow(HOME + ":8080/list_googledrive_projects?port=" + port, "Import Project", 700, 500)
}
function refreshProject() {
    window.onbeforeunload = null;
    $("#loading").css({visibility: "visible"});
    window.location = "http://www.tutorialspoint.com/codingground/index.php?port=" + port + "&sessionid=" + sessionid + "&home=" + HOME
}
function renameProject() {
    $.messager.prompt("Change Project title", "Enter your project title:", function (c) {
        if (c) {
            if (/^[a-zA-Z0-9- ]*$/.test(c) == false) {
                $.messager.alert("Alert Message", "Project title should be plain text", "info");
                return false
            } else {
                if (c.length > 25) {
                    $.messager.alert("Alert Message", "Project title should be less than 25 characters", "info");
                    return false
                } else {
                    projecttitle = c;
                    setProjectTitle(c);
                    var b = HOME + ":8080/rename_project?port=" + port;
                    var a = {projecttitle: c};
                    $.ajax({type: "POST", url: b, data: a, dataType: "json", beforeSend: function () {
                            $("#loading").css({visibility: "visible"})
                        }, success: function (d) {
                            if (d.status) {
                                $.messager.alert("Error Message", d.message, "error")
                            } else {
                                $.messager.alert("Alert Message", d.message, "info")
                            }
                            $("#loading").css({visibility: "hidden"})
                        }})
                }
            }
        }
    })
}
function setCookie(b, e) {
    var c = new Date();
    c.setTime(c.getTime() + (10 * 365 * 24 * 60 * 60));
    var a = "expires=" + c.toUTCString();
    document.cookie = b + "=" + e + "; " + a
}
function getCookie(a) {
    var d = document.cookie.split("; ");
    for (var c = 0; c < d.length; c++) {
        var b = d[c].split("=");
        if (b[0] === a) {
            return unescape(b[1])
        }
    }
    return null
}
function openWindow(b, f, e, a) {
    var d, c;
    d = (window.screen.width / 2) - ((e / 2) + 10);
    c = (window.screen.height / 2) - ((a / 2) + 50);
    window.open(b, f, "status=no,height=" + a + ",width=" + e + ",resizable=yes,left=" + d + ",top=" + c + ",screenX=" + d + ",screenY=" + c + ",toolbar=no,menubar=no,scrollbars=yes,location=no,directories=no")
}
function downloadFile() {
    var e = $("#home").tree("getSelected");
    if (!e) {
        $.messager.alert("Alert Message", "Select a file to be downloaded", "info");
        return false
    }
    if (e.type !== "F") {
        $.messager.alert("Alert Message", "Select a file to be downloaded", "info");
        return false
    }
    var c = e.id.lastIndexOf("/");
    var d = e.id.substring(0, c);
    var a = e.id.substring(c + 1, e.id.length);
    var b = HOME + ":8080/download_file?port=" + port + "&cwd=" + d + "&file=" + a + "&sessionid=" + sessionid;
    $("#download").attr("src", b)
}
$("#download").load(function () {
    var a = $("#download").contents().find("html").text();
    $("#loading").css({visibility: "hidden"});
    if (a) {
        $.messager.alert("Alert Message", a, "info")
    }
    return
});
function downloadProject() {
    saveFiles(function (b) {
        return true
    });
    var a = HOME + ":8080/download_project?port=" + port + "&sessionid=" + sessionid;
    $("#download").attr("src", a)
}
function reloadTree() {
    projecttitle = getProjectTitle();
    $("#home").tree("reload")
}
function reloadTreeWB() {
    projecttitle = getProjectTitle();
    $("#home").tree({url: HOME + ":8080/load_tree_wb?port=" + port})
}
function getFileTitle(d, b) {
    var a = d + "/" + b;
    var c = root.length;
    var f = a.length;
    var e = a.substring(c + 1, f);
    return e
}
function getTabIndex(a) {
    var e = -1;
    var c = $("#codebox").tabs("tabs");
    for (var b = 0; b < c.length; b++) {
        var d = c[b];
        if (d.panel("options").id === a) {
            e = $("#codebox").tabs("getTabIndex", d)
        }
    }
    return e
}
function addNewTab(e, c, g, h) {
    var b = e + "/" + c;
    var a = c;
    var d = getTabIndex(b);
    if ($("#codebox").tabs("exists", d)) {
        $("#codebox").tabs("select", d);
        return true
    } else {
        var f;
        if (g) {
            $("#codebox").tabs("add", {title: a, id: b, closable: true, href: HOME + ":8080/load_file?port=" + port, extractor: function (i) {
                    return i
                }, onLoad: function (i) {
                    editors[b] = new ace.edit(b);
                    editors[b].setTheme("ace/theme/" + editor_theme);
                    editors[b].setFontSize(editor_font_size);
                    editors[b].getSession().setTabSize(editor_tab_size);
                    editors[b].getSession().setMode("ace/mode/" + h);
                    editors[b].setShowInvisibles(editor_invisible);
                    editors[b].renderer.setShowGutter(editor_gutter);
                    if (editor_type === "vim") {
                        editors[b].setKeyboardHandler(require("ace/keyboard/vim").handler)
                    } else {
                        if (editor_type === "emacs") {
                            editors[b].setKeyboardHandler(require("ace/keyboard/emacs").handler)
                        } else {
                            editors[b].setKeyboardHandler(null)
                        }
                    }
                    if (editor_soft_wrap === "true") {
                        editors[b].getSession().setUseWrapMode(true)
                    } else {
                        if (editor_soft_wrap === "false") {
                            editors[b].getSession().setUseWrapMode(false)
                        } else {
                            editors[b].getSession().setUseWrapMode(true);
                            editors[b].getSession().setWrapLimitRange(parseInt(editor_soft_wrap), parseInt(editor_soft_wrap))
                        }
                    }
                    editors[b].getSession().on("change", function () {
                        editors[b].resize(true)
                    });
                    editors[b].focus()
                }})
        } else {
            $("#codebox").tabs("add", {title: a, id: b, closable: true, href: HOME + ":8080/load_file?port=" + port + "&id=" + b, extractor: function (i) {
                    return i
                }, onLoad: function (i) {
                    editors[b] = new ace.edit(b);
                    editors[b].setTheme("ace/theme/" + editor_theme);
                    editors[b].setFontSize(editor_font_size);
                    editors[b].getSession().setTabSize(editor_tab_size);
                    editors[b].getSession().setMode("ace/mode/" + h);
                    editors[b].setShowInvisibles(editor_invisible);
                    editors[b].renderer.setShowGutter(editor_gutter);
                    if (editor_type === "vim") {
                        editors[b].setKeyboardHandler(require("ace/keyboard/vim").handler)
                    } else {
                        if (editor_type === "emacs") {
                            editors[b].setKeyboardHandler(require("ace/keyboard/emacs").handler)
                        } else {
                            editors[b].setKeyboardHandler(null)
                        }
                    }
                    if (editor_soft_wrap === "true") {
                        editors[b].getSession().setUseWrapMode(true)
                    } else {
                        if (editor_soft_wrap === "false") {
                            editors[b].getSession().setUseWrapMode(false)
                        } else {
                            editors[b].getSession().setUseWrapMode(true);
                            editors[b].getSession().setWrapLimitRange(parseInt(editor_soft_wrap), parseInt(editor_soft_wrap))
                        }
                    }
                    editors[b].getSession().on("change", function () {
                        editors[b].resize(true)
                    });
                    editors[b].focus()
                }})
        }
    }
    return true
}
function addNewGoogleTab(f, c, h) {
    var b = f + "/" + c;
    var a = c;
    var e = getTabIndex(b);
    if ($("#codebox").tabs("exists", e)) {
        $("#codebox").tabs("select", e);
        return true
    } else {
        var g;
        var d = HOME + ":" + port + b + "/?port=" + port;
        $("#codebox").tabs("add", {title: a, id: b, closable: true, href: HOME + ":8080/load_file?port=" + port, extractor: function (i) {
                return'<iframe width="100%" height="100%" src="http://docs.google.com/viewer?url=' + d + '&amp;embedded=true"  frameborder="0"></iframe>'
            }})
    }
    return true
}
function addNewImageTab(i, a, j) {
    var b = i + "/" + a;
    var h = a;
    var e = getTabIndex(b);
    if ($("#codebox").tabs("exists", e)) {
        $("#codebox").tabs("select", e);
        return true
    } else {
        var g;
        var f = $("#codebox").width();
        var d = $("#codebox").height();
        var c = HOME + ":" + port + b + "/?port=" + port;
        $("#codebox").tabs("add", {title: h, id: b, closable: true, href: HOME + ":8080/load_file?port=" + port, extractor: function (k) {
                return'<iframe width="100%" height="100%" src="' + c + '" frameborder="0"></iframe>'
            }})
    }
    return true
}
function refreshTab(j, h, d, f) {
    var b = j + "/" + d;
    var a = j + "/" + h;
    var c = h;
    var k = d;
    var i = getTabIndex(b);
    var l = getTabIndex(a);
    if ($("#codebox").tabs("exists", l)) {
        var e = $("#codebox").tabs("getTab", l);
        $("#codebox").tabs("update", {tab: e, options: {title: k, id: b, href: null}});
        if (editors[a]) {
            editors[a].destroy();
            var g = editors[a].getValue();
            delete editors[a];
            editors[b] = new ace.edit(b);
            editors[b].setValue(g, -1);
            editors[b].setTheme("ace/theme/" + editor_theme);
            editors[b].setFontSize(editor_font_size);
            editors[b].getSession().setTabSize(editor_tab_size);
            editors[b].getSession().setMode("ace/mode/" + f);
            if (editor_type === "vim") {
                editors[b].setKeyboardHandler(require("ace/keyboard/vim").handler)
            } else {
                if (editor_type === "emacs") {
                    editors[b].setKeyboardHandler(require("ace/keyboard/emacs").handler)
                } else {
                    editors[b].setKeyboardHandler(null)
                }
            }
            if (editor_soft_wrap === "true") {
                editors[b].getSession().setUseWrapMode(true)
            } else {
                if (editor_soft_wrap === "false") {
                    editors[b].getSession().setUseWrapMode(false)
                } else {
                    editors[b].getSession().setUseWrapMode(true);
                    editors[b].getSession().setWrapLimitRange(parseInt(editor_soft_wrap), parseInt(editor_soft_wrap))
                }
            }
            editors[b].getSession().on("change", function () {
                editors[b].resize(true)
            });
            editors[b].resize(true);
            editors[b].getSession().getUndoManager().dirtyCounter = 1;
            editors[b].focus()
        }
    }
}
function saveFiles(g) {
    var f = false;
    for (var d in editors) {
        if (!editors[d].getSession().getUndoManager().isClean()) {
            f = true
        }
    }
    if (!f) {
        g(true)
    }
    for (var d in editors) {
        if (!editors[d].getSession().getUndoManager().isClean()) {
            var b = d;
            var e = editors[d].getValue();
            var c = HOME + ":8080/save_file?port=" + port;
            var a = {file: b, content: e};
            editors[d].getSession().getUndoManager().markClean();
            $.ajax({type: "POST", url: c, data: a, dataType: "json", beforeSend: function () {
                    $("#loading").css({visibility: "visible"})
                }, success: function (h) {
                    if (h.status) {
                        $.messager.alert("Error Message", h.message, "error")
                    }
                    $("#loading").css({visibility: "hidden"});
                    g(true)
                }})
        }
    }
}
function loadFile(f, g) {
    if (!f) {
        f = $("#home").tree("getSelected")
    }
    if (f.type === "D") {
        return false
    }
    var d = f.id.lastIndexOf("/");
    var e = f.id.substring(0, d);
    var b = f.id.substring(d + 1, f.id.length);
    var a = {cwd: e, file: b};
    var c = HOME + ":8080/get_mime_type?port=" + port;
    $.ajax({type: "POST", url: c, data: a, dataType: "json", beforeSend: function () {
            $("#loading").css({visibility: "visible"})
        }, success: function (h) {
            if (!h.status && h.loadable === "T" && h.filetype === "text") {
                addNewTab(e, f.text, false, h.mode)
            } else {
                if (!h.status && h.loadable === "T" && h.filetype === "google") {
                    addNewGoogleTab(e, f.text, false)
                } else {
                    if (!h.status && h.loadable === "T" && h.filetype === "image") {
                        addNewImageTab(e, f.text, false)
                    } else {
                        if (!h.status && h.loadable === "F" && !g) {
                            $.messager.defaults.ok = "Yes";
                            $.messager.defaults.cancel = "No";
                            $.messager.confirm("Confirmation", "File does not look editable, still you want to open it?", function (i) {
                                if (i) {
                                    addNewTab(e, f.text, false, h.mode)
                                }
                            })
                        } else {
                            if (h.status) {
                                $.messager.alert("Error Message", h.message, "error")
                            }
                        }
                    }
                }
            }
            $("#home").tree("update", {target: f.target, iconCls: h.icon});
            $("#loading").css({visibility: "hidden"})
        }});
    return true
}
var deleting = false;
function deleteFile() {
    var d = $("#home").tree("getSelected");
    if (!d || d.type === "D") {
        $.messager.alert("Message", "Select a file to be deleted", "info");
        return false
    }
    var b = d.id.lastIndexOf("/");
    var c = d.id.substring(0, b);
    var e = getFileTitle(c, d.text);
    var a = d.id.substring(b + 1, d.id.length);
    $.messager.defaults.ok = "Yes";
    $.messager.defaults.cancel = "No";
    $.messager.confirm("Confirmation", "Do you really want to delete file " + e, function (h) {
        deleting = true;
        if (h) {
            var g = HOME + ":8080/delete_file?port=" + port + "&sessionid=" + sessionid;
            var f = {cwd: c, file: a};
            $.ajax({type: "POST", url: g, data: f, dataType: "json", beforeSend: function () {
                    $("#loading").css({visibility: "visible"})
                }, success: function (k) {
                    if (k.status) {
                        $.messager.alert("Error Message", k.message, "error")
                    } else {
                        var i = c + "/" + a;
                        var j = getTabIndex(i);
                        if ($("#codebox").tabs("exists", j)) {
                            if (editors[d.id]) {
                                editors[d.id].getSession().getUndoManager().markClean()
                            }
                            $("#codebox").tabs("close", j)
                        }
                        $("#home").tree("remove", d.target)
                    }
                    $("#loading").css({visibility: "hidden"});
                    deleting = false
                }})
        }
    })
}
function deleteDir() {
    var c = $("#home").tree("getSelected");
    var d = c.text;
    if (!c) {
        $.messager.alert("Select a file or directory to be deleted", "Info");
        return false
    }
    var b = c.id;
    var a = $("#home").tree("getChildren", c.target);
    if (a.length > 0) {
        $.messager.alert("Message", d + " directory is not empty", "info");
        return false
    }
    $.messager.defaults.ok = "Yes";
    $.messager.defaults.cancel = "No";
    $.messager.confirm("Confirmation", "Do you really want to delete directory " + d, function (g) {
        if (g) {
            var f = HOME + ":8080/delete_dir?port=" + port + "&sessionid=" + sessionid;
            var e = {cwd: b, file: d};
            var h = false;
            $.ajax({type: "POST", url: f, data: e, dataType: "json", beforeSend: function () {
                    $("#loading").css({visibility: "visible"})
                }, success: function (i) {
                    if (i.status) {
                        $.messager.alert("Error Message", i.message, "error")
                    } else {
                        $("#home").tree("remove", c.target)
                    }
                    $("#loading").css({visibility: "hidden"})
                }})
        }
    })
}
function renameFile() {
    if ($("#cc").layout("panel", "west").panel("options").collapsed) {
        $("#cc").layout("expand", "west")
    }
    var a = $("#home").tree("getSelected");
    if (!a) {
        $.messager.alert("Alert Message", "Select a file or directory to rename", "info");
        return false
    }
    $("#home").tree("beginEdit", a.target);
    return true
}
function newFile() {
    if ($("#cc").layout("panel", "west").panel("options").collapsed) {
        $("#cc").layout("expand", "west")
    }
    var f = $("#home").tree("getSelected");
    $("#wait").show();
    if (!f) {
        var k = $("#home").tree("getRoot");
        $("#home").tree("select", k.target);
        f = $("#home").tree("getSelected")
    }
    $("#home").tree("expand", f.target);
    if ($("#home").tree("isLeaf", f.target) && f.type !== "D") {
        var c = $("#home").tree("getParent", f.target);
        $("#home").tree("select", c.target);
        f = $("#home").tree("getSelected")
    }
    var e = $("#home").tree("getChildren", f.target);
    var d = true;
    var j = f.id;
    var a = "Newfile." + ext;
    var g = j + "/" + a;
    var i = 1;
    while (d) {
        $.each(e, function (l, m) {
            if (m.id === g) {
                a = "Newfile(" + i + ")." + ext;
                g = j + "/" + a;
                d = false;
                return false
            }
        });
        if (!d) {
            d = true;
            i = i + 1;
            continue
        } else {
            $("#wait").hide();
            break
        }
    }
    var b = HOME + ":8080/add_file?port=" + port + "&sessionid=" + sessionid;
    var h = {cwd: j, file: a};
    $.ajax({type: "POST", url: b, data: h, dataType: "json", beforeSend: function () {
            $("#loading").css({visibility: "visible"})
        }, success: function (m) {
            if (m.status) {
                $.messager.alert("Error Message", m.message, "error")
            } else {
                $("#home").tree("append", {parent: f.target, data: [{id: g, type: "F", text: a}]});
                var l = $("#home").tree("find", g);
                $("#home").tree("select", l.target);
                addNewTab(j, a, true, "text")
            }
            $("#loading").css({visibility: "hidden"})
        }})
}
function newDir() {
    if ($("#cc").layout("panel", "west").panel("options").collapsed) {
        $("#cc").layout("expand", "west")
    }
    var f = $("#home").tree("getSelected");
    $("#wait").show();
    if (!f) {
        var k = $("#home").tree("getRoot");
        $("#home").tree("select", k.target);
        f = $("#home").tree("getSelected")
    }
    $("#home").tree("expand", f.target);
    if ($("#home").tree("isLeaf", f.target) && f.type !== "D") {
        var b = $("#home").tree("getParent", f.target);
        $("#home").tree("select", b.target);
        f = $("#home").tree("getSelected")
    }
    var d = $("#home").tree("getChildren", f.target);
    var c = true;
    var j = f.id;
    var i = "Newfolder";
    var e = j + "/" + i;
    var h = 1;
    while (c) {
        $.each(d, function (l, m) {
            if (m.id === e) {
                i = "Newfolder(" + h + ")";
                e = j + "/" + i;
                c = false;
                return false
            }
        });
        if (!c) {
            c = true;
            h = h + 1;
            continue
        } else {
            $("#wait").hide();
            break
        }
    }
    var a = HOME + "/add_dir";
    var g = {port: port, cwd: j, dir: i};
    $.ajax({type: "POST", url: a, data: g, dataType: "json", beforeSend: function () {
            $("#loading").css({visibility: "visible"})
        }, success: function (m) {
            if (m.status) {
                $.messager.alert("Error Message", m.message, "error")
            } else {
                $("#home").tree("append", {parent: f.target, data: [{iconCls: "icon-folder", id: e, type: "D", state: "open", children: [], text: i}]});
                var l = $("#home").tree("find", e);
                $("#home").tree("select", l.target)
            }
            $("#loading").css({visibility: "hidden"})
        }})
}
function setEditorTheme(b) {
    editor_theme = b;
    for (var a in editors) {
        editors[a].setTheme("ace/theme/" + editor_theme)
    }
    setCookie("editor_theme", editor_theme)
}
function setEditorType(c) {
    editor_type = c;
    var b;
    if (editor_type === "vim") {
        b = require("ace/keyboard/vim").handler
    }
    if (editor_type === "emacs") {
        b = require("ace/keyboard/emacs").handler
    }
    if (editor_type === "ace") {
        b = null
    }
    for (var a in editors) {
        editors[a].setKeyboardHandler(b)
    }
    setCookie("editor_type", editor_type)
}
function setEditorSoftWrap(b) {
    editor_soft_wrap = b;
    if (editor_soft_wrap === "true") {
        for (var a in editors) {
            editors[a].getSession().setUseWrapMode(true)
        }
    } else {
        if (editor_soft_wrap === "false") {
            for (var a in editors) {
                editors[a].getSession().setUseWrapMode(false)
            }
        } else {
            for (var a in editors) {
                editors[a].getSession().setUseWrapMode(true);
                editors[a].getSession().setWrapLimitRange(parseInt(editor_soft_wrap), parseInt(editor_soft_wrap))
            }
        }
    }
    setCookie("editor_soft_wrap", editor_soft_wrap)
}
function setEditorFontSize(b) {
    editor_font_size = parseInt(b);
    for (var a in editors) {
        editors[a].setFontSize(editor_font_size)
    }
    $(".terminal").css("font-size", editor_font_size);
    terminal_color = getCookie("terminal_color");
    if (terminal > 0) {
        terminal_color = "#2e3436"
    }
    $(".terminal").css("background-color", terminal_color);
    $("#terminal").css("background-color", terminal_color);
    if (term) {
        $("#terminal").css("background-color", terminal_color);
        $(".terminal").css("background-color", terminal_color);
        term.focus()
    }
    setCookie("editor_font_size", b)
}
function setEditorTabSize(b) {
    editor_tab_size = parseInt(b);
    for (var a in editors) {
        editors[a].getSession().setTabSize(editor_tab_size)
    }
    setCookie("editor_tab_size", b)
}
function setEditorInvisible(a) {
    editor_invisible = a;
    for (var b in editors) {
        editors[b].setShowInvisibles(a)
    }
    setCookie("editor_invisible", a)
}
function setEditorGutter(a) {
    editor_gutter = a;
    for (var b in editors) {
        editors[b].renderer.setShowGutter(a)
    }
    setCookie("editor_gutter", a)
}
function setProjectTitle(b) {
    projecttitle = b;
    var a = $("#cc").layout("panel", "west");
    a.panel("setTitle", projecttitle)
}
function getProjectTitle() {
    var b = HOME + ":8080/get_project_title?port=" + port;
    var a = {hello: "bye"};
    $.ajax({type: "GET", url: b, data: a, dataType: "json", beforeSend: function () {
            $(".loading").css({visibility: "visible"})
        }, success: function (c) {
            projecttitle = c.projecttitle;
            setProjectTitle(projecttitle)
        }})
}
function setSpectrum() {
    $("#spectrum").spectrum("toggle");
    var a = $(".icon-color").offset();
    $(".sp-container").css("top", a.top + 25);
    $(".sp-container").css("left", a.left - 180)
}
function setTerminalMode(a) {
    $("#spectrum").spectrum("hide");
    if (a == terminal_mode) {
        return
    }
}
doVertical = function () {
    var c = $(this).panel("options");
    var b = $(this).closest(".layout");
    var e = c.region;
    var d = b.layout("panel", "expand" + e.substr(0, 1).toUpperCase() + e.substr(1));
    var a = "";
    if (e == "east" || e == "west") {
        a = "position:relative; top:5px; white-space:nowrap; font-size:14px; font-weight: bold;  transform:rotate(90deg);-ms-transform:rotate(90deg);-moz-transform:rotate(90deg);-webkit-transform:rotate(90deg);-o-transform:rotate(90deg);"
    }
    d.html('<div style="' + a + '">' + c.title + "</div>")
};