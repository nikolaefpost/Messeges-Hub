export const currentTime = (seconds: number) => {
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds

// Get hours and minutes
    const hours = date.getHours().toString().padStart(2, '0'); // Ensures double digit
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Ensures double digit

    return `${hours}:${minutes}`;
}