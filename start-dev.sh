#!/bin/bash

# Start both frontend and backend in development mode

echo "🚀 Starting Public AI Bookmark development servers..."

# Check if tmux is available
if command -v tmux &> /dev/null; then
    echo "Using tmux to manage sessions..."
    
    # Create new tmux session
    tmux new-session -d -s ai-bookmark
    
    # Split window into two panes
    tmux split-window -h
    
    # Start backend in left pane
    tmux send-keys -t ai-bookmark:0.0 "cd /Users/imran/Documents/code/public-ai-bookmark-api && npm run start:dev" Enter
    
    # Start frontend in right pane
    tmux send-keys -t ai-bookmark:0.1 "cd /Users/imran/Documents/code/public-ai-bookmark && npm run dev" Enter
    
    # Attach to session
    tmux attach-session -t ai-bookmark
    
else
    echo "tmux not found. Please install tmux or start the servers manually:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "cd /Users/imran/Documents/code/public-ai-bookmark-api"
    echo "npm run start:dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "cd /Users/imran/Documents/code/public-ai-bookmark"
    echo "npm run dev"
fi