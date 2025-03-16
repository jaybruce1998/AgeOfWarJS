import os

# Path to the folder containing the scripts
source_folder = r"C:\Users\Jay\Documents\AgeFlash\scripts"
output_file = "all.as"

# Dictionary to store unique code blocks
code_map = {}

def consolidate_scripts():
    for root, _, files in os.walk(source_folder):
        for file in files:
            if file.endswith(".as"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    code = f.read().strip()
                    
                    # Create a relative path (remove base folder)
                    relative_path = os.path.relpath(file_path, source_folder)
                    
                    if code in code_map:
                        # If code already exists, add the new header
                        code_map[code].append(relative_path)
                    else:
                        # If code is unique, create a new entry
                        code_map[code] = [relative_path]

    # Write consolidated code to output file
    with open(output_file, "w", encoding="utf-8") as out:
        for code, paths in code_map.items():
            for path in paths:
                out.write(f"// {path}\n")
            out.write(f"{code}\n\n")

if __name__ == "__main__":
    consolidate_scripts()
    print(f"Consolidated code saved to '{output_file}'")
