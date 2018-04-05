xset s off
xset -dpms
xset s noblank
#chromium-browser --kiosk file:///home/pi/streameDevice/splashScreen.html
#chromium-browser --start-maximized --kiosk --use-fake-ui-for-media-stream --ignore-certificate-errors --disable-restore-session-state --no-first-run --touch-events=enabled --fast --fast-start --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble --disable-tab-switcher --disable-translate --enable-low-res-tiling file:///home/pi/streameDevice/splashScreen.html
#chromium-browser --noerrdialogs --kiosk --start-maximized --disable-restore-session-state --incognito file:///home/pi/streameDevice/splashScreen.html
#chromium-browser  --start-maximized --enable-native-gpu-memory-buffers --enable-checker-imaging --ignore-certificate-errors --disable-restore-session-state --no-first-run --touch-events=enabled --fast --fast-start --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble --disable-tab-switcher --disable-translate --enable-low-res-tiling file:///home/pi/streameDevice/splashScreen.html
chromium-browser --kiosk --start-maximized --enable-native-gpu-memory-buffers --enable-checker-imaging --ignore-certificate-errors --disable-restore-session-state --no-first-run --touch-events=enabled --fast --fast-start --disable-popup-blocking --disable-infobars --disable-session-crashed-bubble --disable-tab-switcher --disable-translate --enable-low-res-tiling file:///home/pi/streameDevice/splashScreen.html
