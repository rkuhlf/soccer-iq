import argparse
from moviepy import VideoFileClip
from datetime import timedelta
import os


def parse_timestamp(ts_str):
    """Parse timestamp string in format HH:MM:SS or MM:SS"""
    try:
        if ts_str.count(':') == 2:
            hours, minutes, seconds = map(float, ts_str.split(':'))
        elif ts_str.count(':') == 1:
            minutes, seconds = map(float, ts_str.split(':'))
            hours = 0
        else:
            raise ValueError("Invalid timestamp format")
        
        return timedelta(hours=hours, minutes=minutes, seconds=seconds).total_seconds()
    except ValueError as e:
        raise ValueError(f"Invalid timestamp format: {ts_str}. Expected HH:MM:SS or MM:SS") from e

def generate_clips(video_path: str, timestamps: list[str], output_prefix="clip"):
    """Generate video clips based on timestamps"""
    video = VideoFileClip(video_path)
    duration = video.duration
    
    for i, ts_str in enumerate(timestamps, 1):
        try:
            timestamp = parse_timestamp(ts_str)
            
            # Calculate start and end times
            start = max(0, timestamp - 10)
            end = min(duration, timestamp + 10)
            
            # Generate clip
            clip = video.subclipped(start, end)
            
            # Generate output filename
            output_name = f"{output_prefix}_{i:02d}_{ts_str.replace(':', '-')}.mp4"
            
            # Write clip to file
            clip.write_videofile(output_name, codec="libx264", audio_codec="aac")
            print(f"Created clip: {output_name} (from {start:.1f}s to {end:.1f}s)")
            
            clip.close()
        except Exception as e:
            print(f"Error processing timestamp {ts_str}: {str(e)}")
    
    video.close()

def main():
    parser = argparse.ArgumentParser(description="Generate video clips around specified timestamps")
    parser.add_argument("video", help="Input video file path")
    parser.add_argument("timestamps", help="File containing timestamps (one per line, format HH:MM:SS or MM:SS)")
    parser.add_argument("--output", "-o", default="clip", help="Output file prefix (default: clip)")
    
    args = parser.parse_args()
    
    # Read timestamps from file
    with open(args.timestamps, 'r') as f:
        timestamps = [line.strip() for line in f if line.strip()]
    
    generate_clips(args.video, timestamps, args.output)

"""
python parse-clips.py ./raw-videos/barca-real.webm ./timestamps/barca-real-goals.txt --output ./frontend/public/clips/barca-real/goal ;
python parse-clips.py ./raw-videos/barca-real.webm ./timestamps/barca-real-no-goals.txt --output ./frontend/public/clips/barca-real/no-goal ;
python parse-clips.py ./raw-videos/barca-villareal.webm ./timestamps/barca-villareal-goals.txt --output ./frontend/public/clips/barca-villareal/goal ;
python parse-clips.py ./raw-videos/barca-villareal.webm ./timestamps/barca-villareal-no-goals.txt --output ./frontend/public/clips/barca-villareal/no-goal ;
python parse-clips.py ./raw-videos/sunderland-coventry.webm ./timestamps/sunderland-coventry-goals.txt --output ./frontend/public/clips/sunderland-coventry/goal ;
python parse-clips.py ./raw-videos/sunderland-coventry.webm ./timestamps/sunderland-coventry-no-goals.txt --output ./frontend/public/clips/sunderland-coventry/no-goal ;
python parse-clips.py ./raw-videos/birmingham-leeds.mkv ./timestamps/birmingham-leeds-goals.txt --output ./frontend/public/clips/birmingham-leeds/goal ;
python parse-clips.py ./raw-videos/birmingham-leeds.mkv ./timestamps/birmingham-leeds-no-goals.txt --output ./frontend/public/clips/birmingham-leeds/no-goal ;
python parse-clips.py ./raw-videos/portugal-spain.webm ./timestamps/portugal-spain-goals.txt --output ./frontend/public/clips/portugal-spain/goal ;
python parse-clips.py ./raw-videos/portugal-spain.webm ./timestamps/portugal-spain-no-goals.txt --output ./frontend/public/clips/portugal-spain/no-goal ;
python parse-clips.py ./raw-videos/watford-luton.webm ./timestamps/watford-luton-goals.txt --output ./frontend/public/clips/watford-luton/goal ;
python parse-clips.py ./raw-videos/watford-luton.webm ./timestamps/watford-luton-no-goals.txt --output ./frontend/public/clips/watford-luton/no-goal
python parse-clips.py ./raw-videos/inter-juventus.webm ./timestamps/inter-juventus-goals.txt --output ./frontend/public/clips/inter-juventus/goal ;
python parse-clips.py ./raw-videos/inter-juventus.webm ./timestamps/inter-juventus-no-goals.txt --output ./frontend/public/clips/inter-juventus/no-goal
"""
if __name__ == "__main__":
    main()