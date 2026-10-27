<?php

if (PHP_VERSION_ID < 80200) {
    fwrite(STDERR, 'Se requiere PHP 8.2 o superior.'.PHP_EOL);
    exit(1);
}

foreach (['pdo_sqlite', 'mbstring', 'dom', 'fileinfo', 'openssl', 'tokenizer'] as $extension) {
    if (! extension_loaded($extension)) {
        fwrite(STDERR, 'Falta extensión PHP: '.$extension.PHP_EOL);
        exit(1);
    }
}
