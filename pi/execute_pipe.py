from pathlib import Path
import subprocess


PIPE_PATH = Path.home() / "command-runner"
PIPE_OUTPUT_PATH = Path.home() / "output.txt"


while True:
    with open(PIPE_PATH) as f:
        command = f.read().strip()

    output = subprocess.getoutput(command)

    with open(PIPE_OUTPUT_PATH, "w") as f:
        f.write(output)
