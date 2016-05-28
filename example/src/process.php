<?php

/**
 * Nov, 06, 2015
 * created by Dhiraj Sharma
 * TODO : need to ducument the file 
 */
$projectDir = "../ProjectDir/";
$ext = '.java';
$CompileTimeError;
$RunTimeError;
$Output;
$CompileTimeErrorFile = "CompileTimeError.txt";
$RunTimeErrorFile = "RunTimeError.txt";
$OutputFile = "Output.txt";
$all = $CompileTimeErrorFile . " " . $RunTimeErrorFile . " " . $OutputFile;

function filewrite($file, $classContent) {
    $file = fopen($file, "w");
    if ($file) {
        fwrite($file, urldecode($classContent));
        fclose($file);
        $writeStatus = true;
        return $writeStatus;
    } else {
        $writeStatus = false;
        return $writeStatus;
    }
}

function compile($javaFile, $className) {
    global $all, $projectDir, $CompileTimeErrorFile, $RunTimeErrorFile, $OutputFile;
    $chdir = chdir($projectDir);
    shell_exec("rm -rf " . $all);
    shell_exec("javac " . $javaFile . " 2> " . $CompileTimeErrorFile . "; chmod -R 777 ./");
    $CompileTimeError = file_get_contents($CompileTimeErrorFile);
    if (trim($CompileTimeError) == "") {
        shell_exec("java " . $className . " 2> " . $RunTimeErrorFile . "; chmod -R 777 ./");
        $RunTimeError = file_get_contents($RunTimeErrorFile);
        if (trim($RunTimeError == "")) {
            shell_exec("java " . $className . " > " . $OutputFile . "; chmod -R 777 ./");
        }
    }

    $GLOBALS['CompileTimeError'] = file_get_contents($CompileTimeErrorFile);
    $GLOBALS['RunTimeError'] = file_get_contents($RunTimeErrorFile);
    $GLOBALS['Output'] = file_get_contents($OutputFile);
//    shell_exec("rm -rf ./*");
}

if ($_POST) {
    $className = $_POST['className'];
    $classContent = (string)$_POST['classContent'];
    $javaFile = $className . $ext;
    $file = $projectDir . $javaFile;

    if (file_exists($file)) {
        $writeStatus = filewrite($file, $classContent);
        $classCreated = false;
    } else {
        if (touch($file)) {
            $classCreated = true;
            chmod($file, 0777);
            $writeStatus = filewrite($file, $classContent);
        } else {
            $classCreated = false;
        }
    }
    if ($writeStatus == true) {
        compile($javaFile, $className);
    }
}

$data = array(
    "classStatus" => $classCreated,
//    "classContent"=>$classContent,
    "writeStatus" => $writeStatus,
    "CompileTimeError" => $CompileTimeError,
    "RunTimeError" => $RunTimeError,
    "Output" => $Output
);
echo json_encode($data);
?>
