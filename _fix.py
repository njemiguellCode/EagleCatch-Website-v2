with open("assets/js/item.js", "rb") as f:
    data = f.read()
lines = data.split(b"
")
for i, line in enumerate(lines):
    if b"backUrl" in line and b"var backUrl" not in line and b"ref" not in line:
        print(f"Line {i+1}: {line}")
