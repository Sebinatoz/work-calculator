Add-Type -AssemblyName System.Drawing

$size = 512
$bmp = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# 1. Background Rounded Rectangle
$rect = New-Object System.Drawing.Rectangle 16, 16, 480, 480
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
    [System.Drawing.Point]::new(0, 0),
    [System.Drawing.Point]::new(512, 512),
    [System.Drawing.Color]::FromArgb(255, 15, 23, 42), # slate-900
    [System.Drawing.Color]::FromArgb(255, 30, 41, 59)  # slate-800
)

# Rounded path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$radius = 96
$d = $radius * 2
$path.AddArc(16, 16, $d, $d, 180, 90)
$path.AddArc(480 + 16 - $d, 16, $d, $d, 270, 90)
$path.AddArc(480 + 16 - $d, 480 + 16 - $d, $d, $d, 0, 90)
$path.AddArc(16, 480 + 16 - $d, $d, $d, 90, 90)
$path.CloseFigure()

$g.FillPath($bgBrush, $path)

# Border glow
$borderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(120, 16, 185, 129), 6) # emerald-500
$g.DrawPath($borderPen, $path)

# 2. Stopwatch Crown at top (12 o'clock)
$crownBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
$g.FillRectangle($crownBrush, 240, 58, 32, 28)
$topBtnPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 52, 211, 153), 8)
$g.DrawLine($topBtnPen, 232, 58, 280, 58)

# 3. Outer Dial Circle
$dialPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 16, 185, 129), 12)
$g.DrawEllipse($dialPen, 88, 100, 336, 336)

# Dial background (slightly lighter dark)
$innerDialBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 24, 33, 50))
$g.FillEllipse($innerDialBrush, 96, 108, 320, 320)

# Dial ticks
$tickPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 148, 163, 184), 4)
$tickPenMajor = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 52, 211, 153), 6)
$cx = 256
$cy = 268
$r = 145

for ($i = 0; $i -lt 12; $i++) {
    $angle = $i * 30 * [Math]::PI / 180
    $pen = if ($i % 3 -eq 0) { $tickPenMajor } else { $tickPen }
    $innerR = if ($i % 3 -eq 0) { $r - 20 } else { $r - 12 }
    $x1 = $cx + [Math]::Sin($angle) * $innerR
    $y1 = $cy - [Math]::Cos($angle) * $innerR
    $x2 = $cx + [Math]::Sin($angle) * $r
    $y2 = $cy - [Math]::Cos($angle) * $r
    $g.DrawLine($pen, [float]$x1, [float]$y1, [float]$x2, [float]$y2)
}

# 4. Hands (Pointing to 8h00 - standard work day)
# Minute hand -> 12 o'clock
$minPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 241, 245, 249), 8)
$minPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$minPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($minPen, $cx, $cy, $cx, $cy - 105)

# Hour hand -> 8 o'clock (angle 240 deg)
$hourAngle = 240 * [Math]::PI / 180
$hx = $cx + [Math]::Sin($hourAngle) * 75
$hy = $cy - [Math]::Cos($hourAngle) * 75
$hourPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 52, 211, 153), 10)
$hourPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$hourPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($hourPen, $cx, $cy, [float]$hx, [float]$hy)

# Second Hand / Accent Hand -> pointing to 16h30 / 4:15 (angle 135 deg) in orange/coral
$secAngle = 125 * [Math]::PI / 180
$sx = $cx + [Math]::Sin($secAngle) * 115
$sy = $cy - [Math]::Cos($secAngle) * 115
$secPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 251, 146, 60), 4) # orange-400
$secPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$secPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($secPen, $cx, $cy, [float]$sx, [float]$sy)

# Center pin
$pinBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
$g.FillEllipse($pinBrush, $cx - 12, $cy - 12, 24, 24)
$innerPinBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
$g.FillEllipse($innerPinBrush, $cx - 6, $cy - 6, 12, 12)

# Save PNG
$pngPath = Join-Path (Get-Location) "build\icon.png"
$bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)

# Convert to multi-size ICO
$iconSizes = @(16, 32, 48, 64, 128, 256)
$bitmaps = @()
foreach ($s in $iconSizes) {
    $resized = New-Object System.Drawing.Bitmap $s, $s
    $rg = [System.Drawing.Graphics]::FromImage($resized)
    $rg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $rg.DrawImage($bmp, 0, 0, $s, $s)
    $rg.Dispose()
    $bitmaps += $resized
}

# Write standard ICO format
$icoPath = Join-Path (Get-Location) "build\icon.ico"
$stream = [System.IO.File]::OpenWrite($icoPath)
$writer = New-Object System.IO.BinaryWriter $stream

# ICO Header: Reserved (0), Type (1 = ICO), Count
$writer.Write([uint16]0)
$writer.Write([uint16]1)
$writer.Write([uint16]$bitmaps.Count)

$offset = 6 + ($bitmaps.Count * 16)
$pngDataList = @()

foreach ($b in $bitmaps) {
    $ms = New-Object System.IO.MemoryStream
    $b.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    $pngDataList += ,$bytes

    $w = if ($b.Width -ge 256) { 0 } else { [byte]$b.Width }
    $h = if ($b.Height -ge 256) { 0 } else { [byte]$b.Height }
    $writer.Write([byte]$w)
    $writer.Write([byte]$h)
    $writer.Write([byte]0) # color count
    $writer.Write([byte]0) # reserved
    $writer.Write([uint16]1) # planes
    $writer.Write([uint16]32) # bit count
    $writer.Write([uint32]$bytes.Length) # image size
    $writer.Write([uint32]$offset) # image offset
    $offset += $bytes.Length
}

foreach ($bytes in $pngDataList) {
    $writer.Write($bytes)
}

$writer.Close()
$stream.Close()
$bmp.Dispose()
"Generated build\icon.png and build\icon.ico successfully"
