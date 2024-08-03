export const formatNumber = number => `0${number}`.slice(-2);

export const getRemaining = (time) => {
    const remainingTime = Math.max(0, time); // Ensure the timer doesn't go below 0
    const mins = Math.floor(remainingTime / 600);
    const secs = Math.floor(remainingTime % 600 / 10);
    const tenths = Math.floor((remainingTime) % 10); // Extract tenths of a second
    return { mins: formatNumber(mins), secs: formatNumber(secs), tenths: tenths };
}