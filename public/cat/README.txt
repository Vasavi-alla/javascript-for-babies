Barnaby's sprite skin — the video-to-GIF trick
==============================================

Drop THREE looping animated images into this folder and Barnaby wears
them automatically (his walking, chasing, and petting behavior stays):

  walk.webp   (or walk.gif)   — walking loop
  sit.webp    (or sit.gif)    — sitting / idle loop
  sleep.webp  (or sleep.gif)  — sleeping loop
  pet.webp    (or pet.gif)    — OPTIONAL: shown while being petted
                                (falls back to the sit loop if absent)

Note: .webp is checked FIRST — if both exist for a mood, the .webp wins.

Rules:
  - side view, FACING RIGHT (the app mirrors him when walking left)
  - transparent background
  - roughly 240px wide; keep each file small (< ~300 KB)
  - all three must exist, or the built-in hand-drawn cat is used

How to make them from any video (the trick):
  1. Get a video or GIF of a cat walking (record one, or find a
     loopable side-view clip / pixel-art or line-art cat animation).
  2. Remove the background:  unscreen.com  (automatic, free tier,
     outputs transparent GIF) — or start from art that is already
     transparent.
  3. Convert / trim / resize:  ezgif.com  (video-to-GIF, crop, resize,
     optimize, and GIF-to-WebP — WebP is smaller with better edges).
     Or with ffmpeg installed:
       ffmpeg -i cat.mp4 -vf "fps=12,scale=240:-1" -loop 0 walk.webp
       (add hflip inside -vf if your cat faces left)
  4. Name the files as above, drop them here, reload the app.

Delete the files to bring the hand-drawn Barnaby back.
