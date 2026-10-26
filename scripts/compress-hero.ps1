Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

foreach ($name in @('hero-phone.jpg', 'hero-tv.jpg', 'hero-appliance.jpg')) {
    $path = "d:\Free_lancer\E-commerce\Web\public\images\$name"
    $tmpPath = "d:\Free_lancer\E-commerce\Web\public\images\$name.tmp.jpg"
    $img = [System.Drawing.Image]::FromFile($path)
    $img.Save($tmpPath, $jpegCodec, $encoderParams)
    $img.Dispose()
    Move-Item $tmpPath $path -Force
    $len = (Get-Item $path).Length
    Write-Host "$name compressed to $len bytes"
}
