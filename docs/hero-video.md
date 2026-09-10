# Hero cursor video

`public/media/hero-scrub.mp4` is an optimized copy of the original homepage
video, preserving its 97 frames at 24 fps. The original asset is:

https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4

The original 3840×2160 video is expensive to seek backwards and forwards.
The bundled 1600×900 H.264 copy uses an independent keyframe for every frame,
no B-frames, and front-loaded MP4 metadata. It is approximately 2.6 MiB.
Serving it with the site also avoids a separate media host during interaction.

To regenerate with FFmpeg (after downloading the source to `original.mp4`):

```sh
ffmpeg -i original.mp4 -an -vf 'scale=1600:900' \
  -c:v libx264 -preset fast -crf 21 -g 1 -keyint_min 1 -bf 0 \
  -pix_fmt yuv420p -movflags +faststart public/media/hero-scrub.mp4
```

Keep the 24 fps cadence aligned with `FRAME_DURATION` in
`hooks/use-background-video.ts`. Desktop pointer input selects frames while
the video stays paused. Input is coalesced, limited to at most 30 seeks per
second, and waits for `seeked` before decoding the latest target. Touch
devices use native playback; reduced-motion mode pauses on the first frame.
