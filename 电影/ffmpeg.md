## 烧录字幕

```
ffmpeg -i input_video.mkv ^
-vf "subtitles=subtitle.srt" ^
-c:v libx264 ^
-preset medium ^
-crf 23 ^
-c:a copy ^
output.mkv
```

## 下载视频

方法1：

```
yt-dlp --cookies-from-browser chrome [BV链接](https://www.bilibili.com/video/BV1Gm421s74y)
```

方法2：导出 Cookie

安装浏览器扩展：

```
Get cookies.txt LOCALLY
```

登录 Bilibili 后：

打开 B站 点击扩展 导出 cookies.txt

```
yt-dlp --cookies cookies.txt https://www.bilibili.com/video/BV1Gm421s74y
```
