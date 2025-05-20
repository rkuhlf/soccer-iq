import './style.css'
import { videoSources } from './video-sources.ts';

function choice<T>(list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

let availableVideos = deepCopy(videoSources);

// Returns a goal and a no-goal, not one that's been used before, from the same game.
function getNextVideoPair(): { goal: string, noGoal: string } {
  if (availableVideos.length == 0) {
    alert("Ran out of clips. Clips will now be repeated.");
    availableVideos = deepCopy(videoSources);
  }
  const match = choice(availableVideos);
  // If we picked one that had no options, we'll remove it and try again.
  if (match.goal.length == 0 || match.noGoal.length == 0) {
    availableVideos = availableVideos.filter(m => m != match);
    return getNextVideoPair();
  }

  const ret = {
    goal: choice(match.goal),
    noGoal: choice(match.noGoal),
  };

  match.goal = match.goal.filter(g => g != ret.goal);
  match.noGoal = match.noGoal.filter(ng => ng != ret.noGoal);

  return ret;
}

// Object so that I can change it by reference in the event listener callback. Probably should just go ahead and refactor the video to be a class at this point.
const maxPlaybackTime = {
  max_time: 9
}
function setUpVideo(video: HTMLVideoElement, full: HTMLButtonElement) {
  video.removeAttribute('controls');

  video.addEventListener('timeupdate', function () {
    if (this.currentTime > maxPlaybackTime.max_time) {
      this.pause();
    }
  });

  video.addEventListener('play', function () {
    if (this.currentTime > maxPlaybackTime.max_time) {
      this.currentTime = 0;
    }
  });

  function togglePlaying() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  full.addEventListener('click', () => {
    video.requestFullscreen({navigationUI: 'hide'});
  });
  video.addEventListener('click', togglePlaying);
}

function showNextVideo(video1: HTMLVideoElement, video2: HTMLVideoElement) {
  // Get two different random videos
  let nextVideos = getNextVideoPair();

  if (Math.random() < 0.5) {
    video1.src = nextVideos.goal;
    video2.src = nextVideos.noGoal;
  } else {
    video2.src = nextVideos.goal;
    video1.src = nextVideos.noGoal;
  }

  video1.load();
  video2.load();

  maxPlaybackTime.max_time = 9;
}

function renderCount(correct: number, total: number) {
  const score = document.querySelector<HTMLButtonElement>('#score')!;

  // I add one to the correct count and to the incorrect count because I saw it in that one 3B1B video that this can be helpful. I'm basically arbitrarily dragging you back towards 50%.
  const adjusted_correct = correct + 1;
  const adjusted_total = total + 2;
  const p = adjusted_correct / adjusted_total;
  // Use sqrt(np (1-p)), the deviation of the binomial formula, then divide by the total to make it a percent.
  const deviation = Math.sqrt(adjusted_total * p * (1 - p));

  const as_percent = (a: number) => Math.round(a * 100);
  score.innerText = `Score: ${correct} / ${total} = ${as_percent(correct / total) || 0}% (± ${as_percent(deviation / adjusted_total)}%)`;
}

function renderResult(correct: boolean) {
  const result = document.querySelector<HTMLDivElement>('#result')!;
  const resultText = document.querySelector<HTMLButtonElement>('#result-text')!;

  result.classList.remove("hidden");
  resultText.innerText = correct ? "Correct!" : "Incorrect.";

  maxPlaybackTime.max_time = 20;
}

document.addEventListener('DOMContentLoaded', function () {
  // Set up the videos.
  const video1 = document.querySelector<HTMLVideoElement>('#video1')!;
  const video2 = document.querySelector<HTMLVideoElement>('#video2')!;
  const full1 = document.querySelector<HTMLButtonElement>("#video1-full")!;
  const full2 = document.querySelector<HTMLButtonElement>("#video2-full")!;

  setUpVideo(video1, full1);
  setUpVideo(video2, full2);
  showNextVideo(video1, video2);

  // Set up the goal button event listeners.
  const goal1 = document.querySelector<HTMLButtonElement>('#goal1')!;
  const goal2 = document.querySelector<HTMLButtonElement>('#goal2')!;

  let correctCount = 0;
  let totalCount = 0;
  renderCount(correctCount, totalCount);

  function setUpGoalButton(button: HTMLButtonElement, primaryVideo: HTMLVideoElement) {
    button.addEventListener("click", () => {
      const correct = !primaryVideo.src.includes("no-goal")
      if (correct) {
        correctCount++;
      }
  
      totalCount++;
      renderCount(correctCount, totalCount);
      renderResult(correct);
      // Play the videos automatically, since people will probably want to do that.
      video1.play();
      video2.play();

      // We don't want people to be able to change their answer.
      goal1.classList.add("hidden");
      goal2.classList.add("hidden");
    });
  }
  
  setUpGoalButton(goal1, video1);
  setUpGoalButton(goal2, video2);

  // Set up the result feedback.
  const result = document.querySelector<HTMLDivElement>('#result')!;
  const nextButton = document.querySelector<HTMLButtonElement>('#next')!;
  nextButton.addEventListener("click", () => {
    showNextVideo(video1, video2);
    result.classList.add("hidden");

    goal1.classList.remove("hidden");
    goal2.classList.remove("hidden");
  })
});