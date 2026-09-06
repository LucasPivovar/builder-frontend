param([Parameter(Mandatory=$true)][string]$SourceIcon)
Add-Type -AssemblyName System.Drawing
$assetDir = Join-Path $PSScriptRoot '..\src\assets\brand'
$source = [System.Drawing.Bitmap]::FromFile($SourceIcon)

function New-Canvas([int]$width, [int]$height) {
  $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $bitmap.SetResolution(144, 144)
  return $bitmap
}
function Set-Quality($graphics) {
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
}
function Draw-WhiteImage($graphics, $image, $rect) {
  $matrix = New-Object System.Drawing.Imaging.ColorMatrix
  $matrix.Matrix00=0; $matrix.Matrix11=0; $matrix.Matrix22=0
  $matrix.Matrix30=1; $matrix.Matrix31=1; $matrix.Matrix32=1; $matrix.Matrix33=1
  $attributes = New-Object System.Drawing.Imaging.ImageAttributes
  $attributes.SetColorMatrix($matrix)
  $graphics.DrawImage($image, $rect, 0, 0, $image.Width, $image.Height, [System.Drawing.GraphicsUnit]::Pixel, $attributes)
  $attributes.Dispose()
}
function Save-Icon([bool]$white, [string]$name) {
  $canvas=New-Canvas 1024 1024; $g=[System.Drawing.Graphics]::FromImage($canvas); Set-Quality $g; $g.Clear([System.Drawing.Color]::Transparent)
  $rect=New-Object System.Drawing.Rectangle(0,0,1024,1024)
  if($white){Draw-WhiteImage $g $source $rect}else{$g.DrawImage($source,$rect)}
  $canvas.Save((Join-Path $assetDir $name),[System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $canvas.Dispose()
}
function Save-Logo([bool]$white, [string]$name) {
  $canvas=New-Canvas 1800 420; $g=[System.Drawing.Graphics]::FromImage($canvas); Set-Quality $g; $g.Clear([System.Drawing.Color]::Transparent)
  $iconRect=New-Object System.Drawing.Rectangle(20,20,380,380)
  if($white){Draw-WhiteImage $g $source $iconRect}else{$g.DrawImage($source,$iconRect)}
  $font=New-Object System.Drawing.Font('Arial',112,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
  $astroBrush=New-Object System.Drawing.SolidBrush($(if($white){[System.Drawing.Color]::White}else{[System.Drawing.Color]::FromArgb(23,17,38)}))
  $builderBrush=New-Object System.Drawing.SolidBrush($(if($white){[System.Drawing.Color]::White}else{[System.Drawing.Color]::FromArgb(63,74,230)}))
  $format=New-Object System.Drawing.StringFormat; $format.FormatFlags=[System.Drawing.StringFormatFlags]::NoWrap
  $y=139; $g.DrawString('Astro',$font,$astroBrush,410,$y,$format); $astroWidth=$g.MeasureString('Astro',$font,1000,$format).Width
  $g.DrawString('Builder',$font,$builderBrush,372+$astroWidth,$y,$format)
  $canvas.Save((Join-Path $assetDir $name),[System.Drawing.Imaging.ImageFormat]::Png)
  $format.Dispose(); $astroBrush.Dispose(); $builderBrush.Dispose(); $font.Dispose(); $g.Dispose(); $canvas.Dispose()
}
Save-Icon $false 'astrobuilder-icon-v2.png'
Save-Icon $true 'astrobuilder-icon-white-v2.png'
Save-Logo $false 'astrobuilder-logo-v2.png'
Save-Logo $true 'astrobuilder-logo-white-v2.png'
$source.Dispose()
