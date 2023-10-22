export function scheduleAction(time, action){
    const specificTime = new Date(time);
    const currentTime = new Date();
    const delay = specificTime - currentTime;

    if (delay > 0) {
        setTimeout(() => {
            action();
        }, delay);
    } else {
        action();
    }
}
