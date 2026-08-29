# Aprincar Extension Platform v1

V1 game extensions use `bundleMode: single-html`. The source technology is unrestricted, but executable remote code is not allowed. The resulting game runs inside an iframe with `sandbox="allow-scripts"` and talks to the host through a transferred `MessagePort`.

Supported permissions: storage, audio, haptics, fullscreen, drawing, handwriting, camera, microphone, network, geolocation. Camera/microphone/network/geolocation are considered sensitive and should only be approved exceptionally.

Trust levels: `official`, `curated`, `community`, `experimental`.
