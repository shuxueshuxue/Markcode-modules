from ctypes import CDLL
from _ctypes import LoadLibrary

def load_dll(path: str) -> CDLL:
    handle = LoadLibrary(path)
    return CDLL(name=path,handle = handle) if handle != 0 else handle