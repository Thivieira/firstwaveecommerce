<?php

// Forked from https://gist.github.com/1809044
// Available from https://gist.github.com/nichtich/5290675#file-deploy-php

$TITLE   = 'Git Deployment Hamster - DEVPLANS';
$VERSION = '0.1';

echo <<<EOT
<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>$TITLE</title>
</head>
<body style="background-color: #000000; color: #FFFFFF; font-weight: bold; padding: 0 10px;">
<pre>
  o-o    $TITLE
 /\\"/\   v$VERSION
(`=*=') 
 ^---^`-.
EOT;

// Check whether client is allowed to trigger an update

$allowed_ips = array(
    '189.4.73.'
);
$allowed = false;

$headers = apache_request_headers();

if (@$headers["X-Forwarded-For"]) {
    $ips = explode(",", $headers["X-Forwarded-For"]);
    $ip  = $ips[0];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

foreach ($allowed_ips as $allow) {
    if (stripos($ip, $allow) !== false) {
        $allowed = true;
        break;
    }
}

if (!$allowed) {
    header('HTTP/1.1 403 Forbidden');
    echo "<span style=\"color: #ff0000\">Sorry, no hamster - better convince your parents!</span>\n";
    echo "</pre>\n</body>\n</html>";
    exit;
}

flush();

// Actually run the update

$commands = array(
    'echo $PWD',
    'whoami',
    'git pull',
    'git status',
    'npm i',
    'npm run build',
    'pm2 restart nextjs',
);

$output = "\n";

$log = "####### " . date('Y-m-d H:i:s') . " #######\n";

foreach ($commands as $command) {
    // Run it
    $tmp = shell_exec("$command 2>&1");
    // Output
    $output .= "<span style=\"color: #6BE234;\">\$</span> <span style=\"color: #729FCF;\">{$command}\n</span>";
    $output .= htmlentities(trim($tmp)) . "\n";

    $log  .= "\$ $command\n" . trim($tmp) . "\n";
}

$log .= "\n";

file_put_contents('deploy-log.txt', $log, FILE_APPEND);

echo $output;

?>
</pre>
</body>

</html>