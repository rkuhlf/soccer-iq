import './style.css'
import { videoSources } from './video-sources.ts';

function choice<T>(list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

// Returns a goal and a no-goal, not one that's been used before, from the same game.
function getNextVideoPair(): {goal: string, noGoal: string} {
  const match = choice(videoSources);

  return {
    goal: choice(match.goal),
    noGoal: choice(match.noGoal),
  };
}

function setUpVideo(video: HTMLVideoElement, playPause: HTMLButtonElement, max_time: number) {
  video.removeAttribute('controls');

  video.addEventListener('timeupdate', function() {
      if (this.currentTime > max_time) {
          this.pause();
          this.currentTime = max_time;
      }
  });

  // Prevent seeking past 10 seconds
  video.addEventListener('seeked', function() {
      if (this.currentTime > max_time) {
          this.currentTime = max_time;
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

document.addEventListener('DOMContentLoaded', function() {
  const video1 = document.querySelector<HTMLVideoElement>('#video1')!;
  const video2 = document.querySelector<HTMLVideoElement>('#video2')!;
  const playPause1 = document.querySelector<HTMLButtonElement>("#video1-play")!;
  const playPause2 = document.querySelector<HTMLButtonElement>("#video2-play")!;

  setUpVideo(video1, playPause1, 9);
  setUpVideo(video2, playPause2, 9);
  
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
});