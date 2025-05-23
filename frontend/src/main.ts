import { Firebase } from './firebase.ts';
import './style.css'
import { videoSources } from './video-sources.ts';

function choice<T>(list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

function everythingAfter(str: string, after: string): string {
  return str.substring(str.indexOf(after) + after.length);
}

function hide(el: HTMLElement) {
  el.classList.add('hidden');
}

function show(el: HTMLElement) {
  el.classList.remove('hidden');
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
      availableGoals = getVideoSources(true);
    }
    const ret = choice(availableGoals);
    availableGoals = availableGoals.filter(g => g != ret);
    return ret;
  } else {
    if (availableNoGoals.length == 0) {
      availableNoGoals = getVideoSources(false);
    }
    const ret = choice(availableNoGoals);
    availableNoGoals = availableNoGoals.filter(g => g != ret);
    return ret;
  }
}

// Object so that I can change it by reference in the event listener callback. Probably should just go ahead and refactor the video to be a class at this point.
const videoState = {
  max_time: 10,
  // We keep track of this flag so we can autostart the video if you use the back arrow when you only paused because you reached the end.
  paused_because_reached_end: false,
  previously_shown_first_pause_overlay: false,
}
function setUpVideo(video: HTMLVideoElement) {
  const firstOverlay = document.querySelector<HTMLDivElement>("#first-overlay")!;
  firstOverlay.addEventListener('click', () => {
    hide(firstOverlay);
    if (video.paused) {
      video.play();
    }
  });

  const secondOverlay = document.querySelector<HTMLDivElement>("#second-overlay")!;
  hide(secondOverlay);
  secondOverlay.addEventListener('click', () => {
    hide(secondOverlay);
  });

  video.addEventListener('timeupdate', function () {
    if (this.currentTime > videoState.max_time) {
      this.pause();
      videoState.paused_because_reached_end = true;

      if (!videoState.previously_shown_first_pause_overlay) {
        videoState.previously_shown_first_pause_overlay = true;
        show(secondOverlay);

        const options = document.querySelector<HTMLDivElement>('.options')!;
        show(options);
      }
    }
  });

  video.addEventListener('play', function () {
    videoState.paused_because_reached_end = false;
    if (this.currentTime > videoState.max_time) {
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

  video.addEventListener('click', togglePlaying);
  document.addEventListener('keydown', e => {
    // Check if spacebar is pressed (keyCode 32 or ' ')
    const isSpacebar = e.key === ' ' || e.keyCode === 32;

    // Check if the focused element is NOT a button, input, textarea, or select
    const activeElement = document.activeElement;
    const isFocusOnInteractiveElement = activeElement &&
      (activeElement.tagName === 'BUTTON' ||
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT');

    if (isSpacebar && !isFocusOnInteractiveElement) {
      e.preventDefault();
      togglePlaying();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      video.currentTime = Math.max(0, video.currentTime - 1);
      if (video.paused && videoState.paused_because_reached_end) {
        video.play();
      }
    } else if (e.key === 'ArrowRight') {
      video.currentTime = Math.min(videoState.max_time, video.currentTime + 1);
    }
  });
}

function showNextVideo(video: HTMLVideoElement) {
  video.src = getNextVideo();
  video.load();
  video.play();

  videoState.max_time = 10;
}

function renderCount(correct: number, total: number) {
  const correctEl = document.querySelector<HTMLButtonElement>('#correct-count')!;
  const totalEl = document.querySelector<HTMLButtonElement>('#total-count')!;
  correctEl.innerText = correct.toString();
  totalEl.innerText = total.toString();

  // I add one to the correct count and to the incorrect count because I saw it in that one 3B1B video that this can be helpful. I'm basically arbitrarily dragging you back towards 50%.
  // const adjusted_correct = correct + 1;
  // const adjusted_total = total + 2;
  // const p = adjusted_correct / adjusted_total;
  // // Use sqrt(np (1-p)), the deviation of the binomial formula, then divide by the total to make it a percent.
  // const deviation = Math.sqrt(adjusted_total * p * (1 - p));

  const as_percent = (a: number) => Math.round(a * 100);
  const scorePercent = document.querySelector<HTMLButtonElement>('#score-percent')!;
  scorePercent.innerText = `${as_percent(correct / total) || 0}%`; // ± ${as_percent(deviation / adjusted_total)}%`;

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

  videoState.max_time = 20;
}

document.addEventListener('DOMContentLoaded', function () {
  const firebase = new Firebase();
  
  // Set up the videos.
  const video = document.querySelector<HTMLVideoElement>('#video')!;
  // const full = document.querySelector<HTMLButtonElement>("#video-full")!;

  setUpVideo(video);
  showNextVideo(video);

  // Set up the goal button event listeners.
  const options = document.querySelector<HTMLDivElement>('.options')!;
  const goal = document.querySelector<HTMLButtonElement>('#goal')!;
  const noGoal = document.querySelector<HTMLButtonElement>('#no-goal')!;

  let correctCount = 0;
  let totalCount = 0;
  renderCount(correctCount, totalCount);

  function handleChoice(correct: boolean) {
    // Update UI.
    if (correct) {
      correctCount++;
    }
    totalCount++;
    renderCount(correctCount, totalCount);
    renderResult(correct);
    video.play();

    options.classList.add("hidden");

    // Update database.
    firebase.recordResponse(everythingAfter(video.src, "clips/"), correct);
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
  });



  const shareBtn = document.querySelector<HTMLButtonElement>('#shareBtn')!;
  const shareText = document.querySelector('#shareText')!;

  if (!navigator.share) {
    hide(shareBtn);
  }

  const websiteUrl = 'https://footballiq.netlify.app';
  const shareMessage = `I got ${correctCount} out of ${totalCount}. Think your football IQ is higher than mine? Check it out: ${websiteUrl}`;

  shareText.textContent = shareMessage;
  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      // Use the Web Share API if available (mobile devices)
      await navigator.share({
        title: 'Football IQ Challenge',
        text: shareMessage,
        url: websiteUrl
      });
    }
  });
});



