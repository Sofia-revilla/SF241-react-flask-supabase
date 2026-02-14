import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
# CORS allows your Vercel frontend to talk to this Render backend
CORS(app)

# Credentials from your Render Dashboard Environment Variables
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# 1. ADDED: Root route to fix the "Not Found" error in your screenshot
@app.route('/')
def home():
    return {"status": "Backend is live!", "info": "Use /guestbook for API calls"}, 200

# 2. GET: Fetch all entries
@app.route('/guestbook', methods=['GET'])
def get_entries():
    response = supabase.table("guestbook").select("*").order("created_at", desc=True).execute()
    return jsonify(response.data)

# 3. POST: Create new entry
@app.route('/guestbook', methods=['POST'])
def add_entry():
    data = request.json
    response = supabase.table("guestbook").insert(data).execute()
    return jsonify(response.data), 201

# 4. PUT: Update an entry
@app.route('/guestbook/<id>', methods=['PUT'])
def update_entry(id):
    data = request.json
    response = supabase.table("guestbook").update(data).eq("id", id).execute()
    return jsonify(response.data)

# 5. DELETE: Remove an entry
@app.route('/guestbook/<id>', methods=['DELETE'])
def delete_entry(id):
    supabase.table("guestbook").delete().eq("id", id).execute()
    return jsonify({"message": "Deleted successfully"}), 200

if __name__ == '__main__':
    # Fix for Render Port Scanning
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)