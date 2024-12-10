#!
import iohelper
import os

note_path = os.environ.get('MD_FILE')
obs_vault = os.environ.get('OBS_VAULT')

class PrintManager:
    def __init__(self):
        self._print_position = ""
        self._output_file = ""

    @property
    def print_position(self):
        return self._print_position

    @print_position.setter
    def print_position(self, position):
        self._print_position = position

    @property
    def output_file(self):
        return self._output_file

    @output_file.setter
    def output_file(self, file_path):
        if not file_path:
            file_path = os.path.join(obs_vault, "Logs", "Print_temp.md")
        if file_path and not os.path.isabs(file_path):
            file_path = os.path.abspath(file_path)
        self._output_file = file_path

# Initialize an instance of PrintManager
print_manager = PrintManager()

def print(*args):
    content = "\n".join(map(str, args))
    iohelper.printh(content, print_manager.print_position, print_manager.output_file)

def input(prompt=""):
    return iohelper.inputh_prompt(prompt)