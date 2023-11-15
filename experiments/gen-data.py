from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from tqdm import tqdm
import shutil
import os


NUM_RUNS = 500


def main():
    options = webdriver.ChromeOptions()
    options.binary_location = (
        "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
    )
    options.add_experimental_option(
        "prefs",
        {
            "download.default_directory": "/Users/siddhartha/Desktop/projects/others/primistore/experiments/data",
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "safebrowsing.enabled": True,
        },
    )
    browser = webdriver.Chrome(
        executable_path="./chromedriver-mac-arm64/chromedriver", options=options
    )

    if os.path.exists("data"):
        shutil.rmtree("data")
        os.mkdir("data")
    for _ in tqdm(range(NUM_RUNS), desc="Downloading data"):
        browser.get("http://localhost:3000")
        browser.maximize_window()

        browser.find_element(by="xpath", value="//button[@id='download-image']").click()
        time.sleep(1)

        browser.find_element(by="xpath", value="//button[@id='download-data']").click()
        time.sleep(1)

    browser.close()


if __name__ == "__main__":
    main()
