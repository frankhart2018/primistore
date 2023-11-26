import subprocess
from typing import Optional
from enum import Enum
from dataclasses import dataclass


class CommandOutputType(Enum):
    ERROR = 1
    SUCCESS = 2


@dataclass
class CommandOutput:
    type_: CommandOutputType
    value: str


def run_command(command) -> CommandOutput:
    try:
        result = subprocess.run(
            command, check=True, shell=True, text=True, capture_output=True
        )
        return CommandOutput(CommandOutputType.SUCCESS, result.stdout.strip())
    except Exception as e:
        return CommandOutput(CommandOutputType.ERROR, str(e))


def decrypt_aes(key, iv, encrypted_string) -> CommandOutput:
    decrypted = run_command(
        f"echo '{encrypted_string}' | openssl aes-256-cbc -d -a -K {key} -iv {iv}"
    )

    return decrypted
