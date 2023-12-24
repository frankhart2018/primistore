from pathlib import Path
import subprocess
import json


PIPE_PATH = Path.home() / "command-runner"
PIPE_OUTPUT_DIR = Path.home() / "pipe-outputs"


while True:
    with open(PIPE_PATH) as f:
        command = f.read().strip()

    try:
        command_obj = json.loads(command)
    except:
        command_obj = {"cmd": "", "outputPath": "output.txt"}

    output = subprocess.getoutput(command_obj["cmd"])
    output_path = PIPE_OUTPUT_DIR / command_obj["outputPath"]

    with open(output_path, "w") as f:
        f.write(output)
