function IntervalTimer(callback, interval) {
    let timerId, startTime, remaining = 0;
    let state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

    this.pause = function () {
        if (state != 1) return;

        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.resume = function () {
        if (state != 2) return;

        state = 3;
        window.setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function () {
        if (state != 3) return;

        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    startTime = new Date();
    timerId = window.setInterval(callback, interval);
    state = 1;
}

export default IntervalTimer

// var timer = new IntervalTimer(function () {
//     alert("Done!");
// }, 5000);

// window.setTimeout(function () {
//     timer.pause();
//     window.setTimeout(function () {
//         timer.resume();
//     }, 5000);
// }, 2000);