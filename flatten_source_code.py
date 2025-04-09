import sys
from pathlib import Path
def exec(file):
    file_path = Path(file)
    if not file_path.exists():
        print("File không tồn tại/ Không tìm thấy file");
    
    with open(file, 'r') as f:
        code = f.read().replace('\n', ' ')
        code =code.replace('\t',' ')
        code =code.replace('  ', '')

    print(code)
    return
if __name__ == '__main__':
    if len(sys.argv) !=2:
        print("Using python flatten_source_code.py <input_file>")
        exit(1)
    exec(sys.argv[1])

