import sys
import random

# Default number of tasks
tasks = 10

# Min and max tasks to generate
min_tasks = 1
max_tasks = 50

# Priority boundaries
lower_bound_priority = 1
upper_bound_priority = 5

# Output path
path = "test_data.txt"

# Set tasks to argument if provided, else default
if len(sys.argv) > 1:
    tasks = min(max(int(sys.argv[1]), min_tasks), max_tasks)

def main():
    # Always overwrites
    with open(path, "w+", encoding="utf-8") as f:
        text = ""
        # Just wanted the text indexes to start from 1
        for i in range(1, tasks+1):
            text += str(random.randint(lower_bound_priority, upper_bound_priority)) + " data string number " + str(i) + "\n"
        
        f.write(text)
        

if __name__ == "__main__":
    main()
