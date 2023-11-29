import subprocess


def get_ip():
    output = subprocess.getoutput("ifconfig | grep inet")
    output = [
        line.strip() for line in output.split("\n") if line.strip().startswith("inet ")
    ]
    ips = [line.split()[1] for line in output]
    ips = [ip for ip in ips if ip.startswith("192.") or ip.startswith("10.")]
    if len(ips) == 1:
        print(ips[0])
    else:
        raise RuntimeError(f"Cannot determine a single IP, found: {ips}")


if __name__ == "__main__":
    get_ip()
