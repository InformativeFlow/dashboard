## Comando para unir imágenes y video en un solo archivo .mp4

(Todas las imágenes deben tener exactamente la misma resolución que el video)

```
ffmpeg \
-loop 1 -framerate 24 -t 10 -i img1.jpg \
-i video.mp4 \
-loop 1 -framerate 24 -t 10 -i img2.jpg \
-loop 1 -framerate 24 -t 10 -i img3.jpg \
-filter_complex "[0][1][2][3]concat=n=4:v=1:a=0" out.mp4
```
