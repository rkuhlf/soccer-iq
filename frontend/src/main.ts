import './style.css'
import { videoSources } from './video-sources.ts';

function choice<T>(list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function getVideoSources(goal: boolean): string[] {
  let ret: string[] = [];
  for (const match of videoSources) {
    const sources = goal ? match.goal : match.noGoal;
    ret = ret.concat(sources);
  }

  return ret;
}
let availableGoals = getVideoSources(true);
let availableNoGoals = getVideoSources(false);

// Returns a goal and a no-goal, not one that's been used before, from the same game.
function getNextVideo(): string {
  if (Math.random() < 0.5) {
    if (availableGoals.length == 0) {
      alert("Ran out of clips. Clips will now be repeated.");
      availableGoals = getVideoSources(true);  
    }
    const ret = choice(availableGoals);
    availableGoals = availableGoals.filter(g => g != ret);
    return ret;
  } else {
    if (availableNoGoals.length == 0) {
      alert("Ran out of clips. Clips will now be repeated.");
      availableNoGoals = getVideoSources(false);  
    }
    const ret = choice(availableNoGoals);
    availableNoGoals = availableNoGoals.filter(g => g != ret);
    return ret;
  }
}

// Object so that I can change it by reference in the event listener callback. Probably should just go ahead and refactor the video to be a class at this point.
const maxPlaybackTime = {
  max_time: 10
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

function showNextVideo(video: HTMLVideoElement) {
  video.src = getNextVideo();
  video.load();
  video.play();

  maxPlaybackTime.max_time = 10;
}

function renderCount(correct: number, total: number) {
  const correctEl = document.querySelector<HTMLButtonElement>('#correct-count')!;
  const totalEl = document.querySelector<HTMLButtonElement>('#total-count')!;
  correctEl.innerText = correct.toString();
  totalEl.innerText = total.toString();

  // I add one to the correct count and to the incorrect count because I saw it in that one 3B1B video that this can be helpful. I'm basically arbitrarily dragging you back towards 50%.
  const adjusted_correct = correct + 1;
  const adjusted_total = total + 2;
  const p = adjusted_correct / adjusted_total;
  // Use sqrt(np (1-p)), the deviation of the binomial formula, then divide by the total to make it a percent.
  const deviation = Math.sqrt(adjusted_total * p * (1 - p));

  const as_percent = (a: number) => Math.round(a * 100);
  const scorePercent = document.querySelector<HTMLButtonElement>('#score-percent')!;
  scorePercent.innerText = `${as_percent(correct / total) || 0}% ± ${as_percent(deviation / adjusted_total)}%`;

  const correctMeter = document.querySelector<HTMLButtonElement>('#correct-meter')!;
  correctMeter.style.width = `${as_percent(correct / total) || 0}%`
}

function renderResult(isCorrect: boolean) {
  const correct = document.querySelector<HTMLDivElement>('#correct-answer')!;
  const incorrect = document.querySelector<HTMLDivElement>('#incorrect-answer')!;
  const bottom = document.querySelector<HTMLButtonElement>('.bottom')!;

  bottom.classList.remove("hidden");
  if (isCorrect) {
    correct.classList.remove("hidden");
    incorrect.classList.add("hidden");
  } else {
    correct.classList.add("hidden");
    incorrect.classList.remove("hidden");
  }

  maxPlaybackTime.max_time = 20;
}

document.addEventListener('DOMContentLoaded', function () {
  // Set up the videos.
  const video = document.querySelector<HTMLVideoElement>('#video')!;
  const full = document.querySelector<HTMLButtonElement>("#video-full")!;

  setUpVideo(video, full);
  showNextVideo(video);

  // Set up the goal button event listeners.
  const options = document.querySelector<HTMLDivElement>('.options')!;
  const goal = document.querySelector<HTMLButtonElement>('#goal')!;
  const noGoal = document.querySelector<HTMLButtonElement>('#no-goal')!;

  let correctCount = 0;
  let totalCount = 0;
  renderCount(correctCount, totalCount);

  function handleChoice(correct: boolean) {
    if (correct) {
      correctCount++;
    }

    totalCount++;
    renderCount(correctCount, totalCount);
    renderResult(correct);
    video.play();

    options.classList.add("hidden");
  }
  goal.addEventListener("click", () => handleChoice(!video.src.includes("no-goal")));
  noGoal.addEventListener("click", () => handleChoice(video.src.includes("no-goal")));

  // Set up the result feedback.
  const nextButton = document.querySelector<HTMLButtonElement>('#next')!;
  const bottom = document.querySelector<HTMLDivElement>('.bottom')!;
  nextButton.addEventListener("click", () => {
    showNextVideo(video);
    bottom.classList.add("hidden");

    options.classList.remove("hidden");
  })
});