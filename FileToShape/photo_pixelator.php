#!/usr/bin/env php
<?php

$opt_def = array(
    'm' => 32,
    'd' => 0.99,
    'i' => 'false',
    'e' => 'true',
);
if (count($argv) == 1)
{
    echo "Stupid/Simple image pixelator\n";
    echo "Creates a text dump of pixels suitable for MoI FileToShape command\n";
    echo "Usage:\n";
    echo "photo_pixelator.php [-m max pixels per side] [-d max density] [-i invert true/false] [-e equalize true/false] -f source filespec\n";
    echo "e.g., photo_pixelator.php -m32 -f img.gif\n";
    echo "or    photo_pixelator.php -m16 -itrue -d0.95 -f img.gif\n";
    echo "defaults:\n";
    foreach ($opt_def as $k => $v) echo "-$k = $v\n";
    exit;
}
$options = getopt('i::e::d::m::f:');

foreach ($opt_def as $k => $v)
{
    if (!isset($options[$k]))
    {
        $options[$k] = $v;
    }
}

$inv = false;
if (preg_match('/t(rue)/i',$options['i']))
    $inv = true;
$equalize = false;
if (preg_match('/t(rue)/i',$options['e']))
    $equalize = true;

$specbits = pathinfo($options['f']);
$basespec = $specbits['filename'];
$ext = $specbits['extension'];

$image = new Imagick($options['f']);

$image->modulateImage(100,0,100);

if($image->getImageHeight() <= $image->getImageWidth())
    $image->resizeImage($options['m'],0,Imagick::FILTER_LANCZOS,1);
else
    $image->resizeImage(0,$options['m'],Imagick::FILTER_LANCZOS,1);

if ($equalize)
    $image->equalizeImage();
$h = $image->getImageHeight();
$w = $image->getImageWidth();

$image->writeImage($basespec.'_'.$w.'x'.$h.'.'.$ext);

$it = $image->getPixelIterator();

$data = array(array(),array());
foreach( $it as $row => $pixels )
{
    foreach ( $pixels as $column => $pixel )
    {
        $v = $pixel->getColor();
        $val = $options['d']*$v['r']/256;
        if ($inv) $val = 1.0 - $val;
        $data[$column][$row] = sprintf("%1.3f",$val);
    }
}

$fp = fopen($basespec.'_'.$w.'x'.$h.'_pix.csv', 'w');
for ($i=0;$i<count($data);$i++)
    for ($j=0;$j<count($data[$i]);$j++)
        fwrite($fp, "$j,$i,".$data[$i][$j]."\n");
fclose($fp);
