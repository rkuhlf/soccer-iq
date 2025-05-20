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

function setUpVideo(video: HTMLVideoElement, playPause: HTMLButtonElement, max_time: number) {
  video.removeAttribute('controls');

  video.addEventListener('timeupdate', function () {
    if (this.currentTime > max_time) {
      this.pause();
      playPause.innerText = "Play";
    }
  });

  video.addEventListener('play', function () {
    if (this.currentTime > max_time) {
      this.currentTime = 0;
    }
  });

  playPause.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      playPause.innerText = "Pause";
    } else {
      video.pause();
      playPause.innerText = "Play";
    }
  });
}

function showNextVideo(video1: HTMLVideoElement, video2: HTMLVideoElement, playPause1: HTMLButtonElement, playPause2: HTMLButtonElement) {
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

  playPause1.innerText = "Play";
  playPause2.innerText = "Play";
}

function renderCount(correct: number, total: number) {
  const score = document.querySelector<HTMLButtonElement>('#score')!;
  score.innerText = `${correct} / ${total}`;
}

function renderResult(correct: boolean) {
  const result = document.querySelector<HTMLDivElement>('#result')!;
  const resultText = document.querySelector<HTMLButtonElement>('#result-text')!;

  result.classList.remove("hidden");
  resultText.innerText = correct ? "Correct!" : "Incorrect.";
}

document.addEventListener('DOMContentLoaded', function () {
  // Set up the videos.
  const video1 = document.querySelector<HTMLVideoElement>('#video1')!;
  const video2 = document.querySelector<HTMLVideoElement>('#video2')!;
  const playPause1 = document.querySelector<HTMLButtonElement>("#video1-play")!;
  const playPause2 = document.querySelector<HTMLButtonElement>("#video2-play")!;

  setUpVideo(video1, playPause1, 9);
  setUpVideo(video2, playPause2, 9);
  showNextVideo(video1, video2, playPause1, playPause2);

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
    showNextVideo(video1, video2, playPause1, playPause2);
    result.classList.add("hidden");

    goal1.classList.remove("hidden");
    goal2.classList.remove("hidden");
  })
});