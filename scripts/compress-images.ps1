Add-Type -AssemblyName System.Drawing

$srcPath = "d:\Free_lancer\E-commerce\Web\public\images\gayathri-logo.png"
$ogPath = "d:\Free_lancer\E-commerce\Web\public\images\og-image.jpg"
$webLogoPath = "d:\Free_lancer\E-commerce\Web\public\images\gayathri-logo-opt.png"

$src = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source image: $($src.Width) x $($src.Height)"

# 1. Create Web-Optimized Logo (width: 900px, high quality bicubic)
$targetWidth = 900
$targetHeight = [int]($src.Height * ($targetWidth / $src.Width))
$dest = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$g.DrawImage($src, 0, 0, $targetWidth, $targetHeight)
$g.Dispose()

# Save optimized PNG
$dest.Save($webLogoPath, [System.Drawing.Imaging.ImageFormat]::Png)
$dest.Dispose()

# 2. Create Open Graph 1200x630 banner for WhatsApp Link Preview
$ogWidth = 1200
$ogHeight = 630
$ogBmp = New-Object System.Drawing.Bitmap $ogWidth, $ogHeight
$ogG = [System.Drawing.Graphics]::FromImage($ogBmp)
$ogG.Clear([System.Drawing.Color]::White)
$ogG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Draw logo centered in 1200x630 canvas
$logoW = 1000
$logoH = [int]($src.Height * ($logoW / $src.Width))
$posX = [int](($ogWidth - $logoW) / 2)
$posY = [int](($ogHeight - $logoH) / 2)

$ogG.DrawImage($src, $posX, $posY, $logoW, $logoH)
$ogG.Dispose()

# Save OG image as JPEG with 88% quality (perfect for WhatsApp < 300KB)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)

$ogBmp.Save($ogPath, $jpegCodec, $encoderParams)
$ogBmp.Dispose()
$src.Dispose()

Write-Host "Done! Generated gayathri-logo-opt.png and og-image.jpg"
