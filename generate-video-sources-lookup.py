import os
import json

def generate_ts_array(folder_path):
    ts_array = []
    
    # Iterate through each subfolder in the given directory
    for subfolder in sorted(os.listdir(folder_path)):
        subfolder_path = os.path.join(folder_path, subfolder)
        
        if os.path.isdir(subfolder_path):
            goal_files = []
            no_goal_files = []
            
            # Iterate through files in the subfolder
            for filename in sorted(os.listdir(subfolder_path)):
                file_path = os.path.join(subfolder_path, filename)
                
                if os.path.isfile(file_path):
                    # Categorize files based on prefix
                    if filename.lower().startswith('goal'):
                        goal_files.append(f"./clips/{subfolder}/{filename}")
                    elif filename.lower().startswith('no-goal') or filename.lower().startswith('nogoal'):
                        no_goal_files.append(f"./clips/{subfolder}/{filename}")
            
            # Create object for this subfolder
            subfolder_obj = {
                'goal': goal_files,
                'noGoal': no_goal_files
            }
            ts_array.append(subfolder_obj)
    
    # Convert to JavaScript code
    ts_code = f"export const videoSources = {json.dumps(ts_array, indent=2)};"
    return ts_code


"""
python generate-video-sources-lookup.py ./frontend/public/clips ./frontend/src/video-sources.ts
"""
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate JavaScript array from folder structure.')
    parser.add_argument('folder', help='Path to the root folder containing subfolders')
    parser.add_argument('output', help='Path to the typescript file to write the video sources to')
    args = parser.parse_args()
    
    if os.path.isdir(args.folder):
        ts_code = generate_ts_array(args.folder)
        with open(args.output, "w") as f:
            f.write(ts_code)
        
        print(ts_code)
    else:
        print(f"Error: {args.folder} is not a valid directory")