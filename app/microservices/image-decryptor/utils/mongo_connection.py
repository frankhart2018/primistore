import pymongo

from .constants import CONN_STRING, DB_NAME


class MongoDB:
    def __init__(self, collection):
        self.__client = pymongo.MongoClient(CONN_STRING)
        self.__db = self.__client[DB_NAME]
        self.__collection = self.__db[collection]

    def find_one(self, query_dict):
        return self.__collection.find_one(query_dict)
