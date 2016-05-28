<html>
    <head>
        <style type="text/css" media="screen"></style>
        <script src="js/jquery-1.11.3.js"></script>
        <script src="js/togetherjs-min.js"></script>
        <script type="text/javascript" src="js/shortcut.js"></script>
        <script src="./ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript" src="js/javaIde.js"></script>
        <!-- Bootstrap js --> 
        <script src="bootstrap-3.3.0/dist/js/bootstrap.min.js" type="text/javascript"></script> 

        <!-- Bootstrap CSS -->
        <link href="bootstrap-3.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/style.css" rel="stylesheet">
    </head>

    <?php
    $SampleCode = 'public class InfiniteLoop {
        public static void main(String[] args) {
            double d = Double.parseDouble("2.2250738585072012e-308");
                System.out.println("Value: " + d);
        }
      }';
    ?>
    <body>
        <div class="container"> 
            <div class="row page-content">
                <div class="col-xs-12">
                    <div class="collab">
                        <button class="btn btn-primary" id="compile">Compile and Run</button>
                        <button onclick="TogetherJS(this);
                          return false;" class="btn btn-primary">Start Collaboration</button>
                    </div>
                </div>
                <div class="col-xs-12 header">
                    <div class="row">
                        <div class="col-xs-8 editor-header">
                            <div>Editor</div>
                        </div>
                        <div class="col-xs-4 output-header">
                            <div class="">Output</div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-12"> 
                    <div class="row">
                        <div class="col-xs-8 editor-wrap">
                            <div id="editor"></div>
                        </div>
                        <div class="col-xs-4 console-wrap">
                            <!--div class="console-header">Output:</div -->  
                            <div class="console-content"></div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </body>
</html>
