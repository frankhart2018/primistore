import numpy as np


def decode_charset(data_arr: np.ndarray, charset_path: str) -> str:
    with open(charset_path, "r") as f:
        charset = [val.strip() for val in f.readlines()]
        charset = [x if x != "" else " " for x in charset]

    byte_size_data = data_arr.reshape(-1, 8).astype(str).tolist()
    data = [
        str(int("".join(byte_arr), 2))
        for byte_arr in byte_size_data
        if len(set(byte_arr)) != 1 and "1" in byte_arr
    ]
    decrypted = "".join([charset[int(val) - 1] for val in data])
    data_string = ".".join(data)

    return decrypted, data_string
