import os
from app import create_app
from flask import send_from_directory
import os


app = create_app()

# ✅ Create upload folders
os.makedirs("uploads/students", exist_ok=True)
os.makedirs("uploads/qr", exist_ok=True)

# ✅ Serve uploads folder
app.static_folder = "uploads"
app.static_url_path = "/uploads"

UPLOAD_FOLDER = "uploads"

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)
