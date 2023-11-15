import cv2
import numpy as np
from collections import defaultdict


def convert_strict_bw(img):
    img_new = img.copy()
    img_new[img_new < 100] = 0
    img_new[img_new >= 100] = 255

    return img_new


def get_row_stats(img):
    row_indices = []
    current_row = 0
    fetched_cols = False
    rows, cols = img.shape

    row_stats = defaultdict(list)
    for i in range(rows):
        this_row = img[i, :]
        if np.all(np.unique(this_row) == this_row[0]):  # ignore all white rows
            continue

        values, counts = np.unique(this_row, return_counts=True)
        black_ratio = counts[0] / counts.sum()
        if (
            black_ratio > 0.8
        ):  # ignore all black rows (horizontal lines separating boxes)
            continue

        row_indices.append(i)
        if (
            len(row_indices) > 2 and row_indices[-1] - row_indices[-2] > 1
        ):  # if index was skipped that means horizontal lines were there
            current_row += 1

        current_value = row_stats.get(current_row, (-1, -1))[1]
        black_count = counts[0]
        if black_count > current_value:
            row_stats[current_row] = (i, black_count)

    return row_stats


def decode_values(row_stats, img):
    data = []

    for row_idx, val in row_stats.items():
        img_row_idx, _ = val
        this_row = img[img_row_idx, :]
        zeros = np.where(this_row == 0)
        zeros_diff = np.diff(zeros)
        zeros_diff = zeros_diff[zeros_diff > 1]

        max_val = max(zeros_diff)
        threshold = max_val - (max_val % 10)

        i = 0
        inner_data = []
        while i < len(zeros_diff):
            if zeros_diff[i] < threshold:
                inner_data.append(1)
                i += 2
            else:
                inner_data.append(0)
                i += 1
        data.append(inner_data)

    data_arr = np.array(data)

    return data_arr


def decode_memory(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

    strict_bw = convert_strict_bw(img)
    row_stats = get_row_stats(strict_bw)
    data_arr = decode_values(row_stats, strict_bw)

    return data_arr
