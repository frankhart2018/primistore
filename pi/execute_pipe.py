from pathlib import Path
import subprocess
import json
from dataclasses import dataclass
from typing import Dict
import time


PIPE_PATH = Path.home() / "command-runner"
PIPE_OUTPUT_DIR = Path.home() / "pipe-comm"
LOG_PATH = PIPE_OUTPUT_DIR / "pipe-executor.log"


@dataclass
class Execution:
    command_obj: Dict[str, str]
    result: str
    timestamp: str

    def serialize(self):
        return f"{self.timestamp}\n{self.command_obj}\n{self.result}\n{'*' * 50}\n"


while True:
    execution = None
    try:
        with open(PIPE_PATH) as f:
            command = f.read().strip()

        try:
            command_obj = json.loads(command)
        except:
            command_obj = {"cmd": "", "outputPath": "output.txt"}

        process = subprocess.Popen(
            command_obj["cmd"],
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        output, error = process.communicate()
        output_path = PIPE_OUTPUT_DIR / command_obj["outputPath"]

        with open(output_path, "w") as f:
            result = error.decode() if error else output.decode()
            f.write(result)

        execution = Execution(command_obj, result, str(output_path))
    except Exception as e:
        execution = Execution({}, str(e), str(time.time()))

    with open(LOG_PATH, "a") as f:
        f.write(json.dumps(execution.serialize()) + "\n")
