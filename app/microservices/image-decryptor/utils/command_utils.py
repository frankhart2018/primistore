import subprocess
from typing import Optional


def run_command(command) -> Optional[str]:
    try:
        result = subprocess.run(
            command, check=True, shell=True, text=True, capture_output=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None


def decrypt_aes(key, iv, encrypted_string) -> Optional[str]:
    decrypted = run_command(
        f"echo '{encrypted_string}' | openssl aes-256-cbc -d -a -K {key} -iv {iv}"
    )

    return decrypted
