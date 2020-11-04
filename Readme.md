    How to set up the project on our systems?
    - 1: clone the repo
    - 2: open the repo in vs code
    - 3: run using 'live server'

    How to run the project?
    - 1: run using 'live server' feature of vscode or serve the HTML normally

    How you’re representing objects in your system? Tell us about the data structure
    - Not representing any of the drawn objects, this is a stateless drawing board.

    How the undo-redo functionality is working? Discuss the approach here.
    - The functions work as follows: - A history array is initialized with no elements along with a pointer (p) initialized as -1. - Whenever a change is made to the state of the canvas, an image is saved in the history array with the state after the change, and p is incremented. - If undo is requested, we subtract p by 1, clear the canvas, and draw the pth state from the history array. - If redo is requested, we add 1 to p, clear the canvas, and draw the pth state from the history array.

    Websites that helped you complete this assignment if any.
    - Github.com

    Problems you faced if any.
    - None
