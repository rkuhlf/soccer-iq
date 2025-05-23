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


Must do:
- gonna add analytics
- Gonna add a recording of all of the answers that are received.
    - Fields:
        - Timestamp
        - What the clip was.
        - What the answer was.
        - What the session ID was.
    - These should just get stuffed into a database so that later I can re-do the data analysis. This should also be enough to tell what the percentages are for a given clip.

Should do:

Could do:
- Would be nice to play a ding when you get something correct or incorrect.


TODO:
- Could add some hovering buttons overlayed on the video, they only show up when your cursor is moving on it and they go away after a little bit.
- Video should autoloop if you've allowed it to play to the end of the full clip after guessing.
- Once you get to the first pause, it should show an overlay with some more instructions.
- Want to add some metrics to see how far people are going and the percentages they get right.
    - This can feed into the IQ thing.
- There should be an IQ calculator.
    - It should keep track of the historical best estimates for what the long-term correct proportion is for each user. Based on that, we can use some Bayesian statistics to determine what the best estimate for the long term correct proportion for this user is given the score that they just got.
- It should show what the percentage guess was from past users.

Colors are from https://tailwindcss.com/docs/colors
Hosting analytics at https://console.firebase.google.com/u/1/?pli=1 (rilstarssun)