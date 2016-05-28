<html>
    <head>
        <script src="js/jquery-1.11.3.js"></script>
        <script type="text/javascript" src="js/shortcut.js"></script>
        <script src="js/mousetrap.js"></script>
        <script src="js/mousetrap-record.js"></script>
        <script src="js/mousetrap.min.js"></script>
        <script type="text/javascript">
            function init() {
                shortcut("Shift+F1", function () {
                    alert("Help Me!");
                });
                shortcut("Ctrl+S", function () {
                    alert("Saved!");
                });
                shortcut("Right", function () {
                    alert("Right");
                });
            }
            addEvent(window, 'load', init);
        </script>
        <script type="text/javascript">
            Mousetrap.bind('ctrl+shift+up', function (e, combo) {
                console.log(combo); // logs 'ctrl+shift+up'
            });
        </script>
    </head>
    <body>
        <textarea name="message" class="mousetrap"></textarea>
        jksahdkjahskjdhasjkdhkajshdkj
    </body>
</html>