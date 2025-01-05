/**
 * Animates a typewriter effect on a given HTML element by iterating over an array of words.
 * Each word is typed out letter by letter, then deleted, and the next word is typed.
 *
 * @param elementId - The ID of the HTML element where the typewriter effect is applied.
 * @param words - An array of strings representing the words to be typed out.
 * @param speed - The typing speed in milliseconds for each character. Default is 100ms.
 * @param deleteSpeed - The deletion speed in milliseconds for each character. Default is 50ms.
 */

export function typewriterEffect(elementId: string, words: string[], speed: number = 100, deleteSpeed: number = 50) {
  let i = 0;
  let currentWord = '';
  let currentIndex = 0;
  let element = document.getElementById(elementId);

  if (!element) return;

  /**
   * Types the next word in the array letter by letter.
   */
  const typeNextWord = (): void => {
    currentWord = words[i];
    currentIndex = 0;
    element.innerHTML = ''; // Clear the previous content

    // Type the word
    typeLetterByLetter();
  };

  /**
   * Types the next character of the current word.
   */
  const typeLetterByLetter = () => {
    if (currentIndex < currentWord.length) {
      // Append the next character to the element
      element.innerHTML += currentWord.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeLetterByLetter, speed);
    } else {
      // Once the word is typed, start deleting it
      setTimeout(deleteWord, speed * 2); // Add a delay before deletion starts
    }
  };

  /**
   * Deletes the current word letter by letter.
   */
  const deleteWord = () => {
    if (currentIndex > 0) {
      // Remove the last character
      element.innerHTML = element.innerHTML.slice(0, -1);
      currentIndex--;
      setTimeout(deleteWord, deleteSpeed);
    } else {
      // Once the word is deleted, move to the next word
      i = (i + 1) % words.length; // Loop through words
      setTimeout(typeNextWord, speed * 2); // Add a delay before typing the next word
    }
  };

  // Start the animation by typing the first word
  typeNextWord();
}
