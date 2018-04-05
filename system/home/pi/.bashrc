if [ $(tty) == "/dev/tty1" ]; then
       sudo -s && cd /home/pi/streameDevice/ && npm start && exit &
#       xinit
       startx
fi