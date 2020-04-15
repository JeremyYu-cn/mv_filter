## video filter

* This is a NodeJs API about video compose, video filter and video format method.You can use it to control the video on the server.Before to use it you must install the `ffmpeg` software.

---

### how to use
e.g
```
    const Filter = require('node-vf');
    const filter = new Filter();
    filter.concatVideo([mv1.mp4, mv2.mp4], 'outpurt.mp4', false) // to concat videos
```

---

### api

* concat video
    ```
