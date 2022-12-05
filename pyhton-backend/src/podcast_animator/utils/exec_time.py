import time


def exec_time(func):
    def wrapper():
        start_time = time.time()
        result = func()
        elapsed = time.time() - start_time
        print(func.__name__, elapsed)
        return result

    return wrapper
