Downloading a bunch of youtube videos. Next I'll see if I can't go through and pick out six goals from one of them. Not sure how I should pick the non-goals to compare against.

Decided to just do a few non-goals scattered throughout. So that the comparison is fair, I should do the time that the ball is kicked. I can't really do the time that the ball crosses the line, since that never happens for non-goals.

Going to ignore chances and goals from set pieces, since I don't like them (and that seems like a different skill anyways).

Trying to get twice as many no-goals as goals, since more data is better and those are easier to find.

I'd like to have 20 questions, so I'll have to find 20 goals. That's definitely good enough for an MVP. I can switch to looking through highlights as well, which might be easier.


Need to show two videos side-by-side. There's a button beneath to say that it's a goal. We need to keep track of how many you got correct. When you pick your answer, it should show if you got it right, and you can watch the video forward.

I'll have to add a seeding to the random so that different people can take the same quiz.




Thinking that an abstraction wrapping the video element makes sense, because the playback controls and the video are tightly coupled.


Dang it I've only got 19. I kinda wanted at least 20. Oh well I can do one more round of clips.

Need to allow the playback to go past the end.


Okay last thing is to clean up the styles a teeny-weeny bit. And maybe add a full-screen button.

It's really annoying not to be able to scroll or to navigate the video with the arrow keys.

TODO:
- Could add some hovering buttons overlayed on the video, they only show up when your cursor is moving on it and they go away after a little bit.
- Need to add a bit more feedback when you get something correct or incorrect.
    - Should play a ding if you get it right and an enk if you get it wrong.
- Video should autoloop if you've allowed it to play to the end of the full clip after guessing.
- Want to add some metrics to see how far people are going and the percentages they get right.
- There should be an overlay at the start to say "Click to play the video, then use the buttons below to guess whether it was a goal."
- Need to make it sort of work on mobile.

Colors are from https://tailwindcss.com/docs/colors