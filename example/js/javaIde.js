$(document).ready(function () {
    shortcut.add("Ctrl+S", function () {
        console.log("Hi there let me help u save ur file!");
    });

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/java");
    editor.setFontSize("16px");

    var fileContentList = [];
    var className = "";

    $("#editor").find(".ace_text-input").focus();

    $("#compile").click(function () {
        className = getClassName(editor, sendDataToServer);
    });

});

function getClassName(editor, callBackFunct) {
    var fileContentList = editor.getSession().getDocument().getAllLines();
    var regexForClass = /\s*(public|private|protected|default|\s*)\s*[static]?\s*class\s*\w*\s*[{]?/;
    $.each(fileContentList, function (index, value) {
        var textContent = fileContentList[index];

        if (regexForClass.test(textContent)) {
            var parts = textContent.split(" ");
            var partsWithoutSpace = [];

            for (i = 0; i < parts.length; i++) {
                if ($.trim(parts[i]).length > 0) {
                    partsWithoutSpace.push(parts[i]);
                }
            }

            var classIndex = partsWithoutSpace.indexOf('class');

            var className = partsWithoutSpace[classIndex + 1];
            if (className.indexOf("{") > -1) {
                var partList = className.split("{");
                className = partList[0];
            }
            callBackFunct(editor, className);
            return false;
        }
    });
}

function sendDataToServer(editor, className) {
    var code = editor.getSession().getValue();
    var serverInput = {
        "className": className,
        "classContent": code
    }
    console.log(code);
    $.ajax({
        type: 'POST',
        url: 'src/process.php',
        data: serverInput,
        success: function (data) {
            
            var compileOptObj = jQuery.parseJSON(data);
            if (compileOptObj.CompileTimeError) {
                console.log(compileOptObj.CompileTimeError);
                $(".console-content").html(compileOptObj.CompileTimeError);
                $(".console-content").removeClass("compile-success");
                $(".console-content").addClass("compile-error");
            } else if (compileOptObj.RunTimeError) {
                console.log(compileOptObj.RunTimeError);
                $(".console-content").html(compileOptObj.RunTimeError);
                $(".console-content").removeClass("compile-success");
                $(".console-content").addClass("compile-error");
            } else if (compileOptObj.Output) {
                console.log(compileOptObj.Output);
                $(".console-content").html(compileOptObj.Output);
                $(".console-content").removeClass("compile-error");
                $(".console-content").addClass("compile-success");
            }
        },
        error: function (data) {
            console.log('fail' + data);
        }
    });
}
