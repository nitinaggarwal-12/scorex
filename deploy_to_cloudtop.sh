#!/bin/bash
# deploy_to_cloudtop.sh
# Automates copying and setting up the Use Case Scoring app on your Cloudtop.

set -e

CLOUDTOP_HOST="nitinagga.c.googlers.com"
REMOTE_DIR="~/usecase_scoring"

echo "========== 1. Verifying Authentication & Credentials =========="
# Check if ssh connection works, if not prompt for gcert
if ! ssh -o ConnectTimeout=3 -o BatchMode=yes "$CLOUDTOP_HOST" echo "SSH Connection Successful" &>/dev/null; then
    echo "SSH connection failed. Running 'gcert' to refresh your corp credentials..."
    gcert
fi

echo "========== 2. Copying files to Cloudtop ($CLOUDTOP_HOST) =========="
# Rsync files excluding node_modules, virtual envs, and git history
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.venv' \
    --exclude '.git' \
    --exclude '.DS_Store' \
    --exclude 'dist' \
    --exclude 'deploy_to_cloudtop.sh' \
    ./ "$CLOUDTOP_HOST:$REMOTE_DIR/"

echo "========== 3. Setting up dependencies on Cloudtop =========="
ssh "$CLOUDTOP_HOST" bash -s << 'EOF'
    set -e
    cd ~/usecase_scoring

    # Load NVM if present
    export NVM_DIR="$HOME/.nvm"
    if [ -s "$NVM_DIR/nvm.sh" ]; then
        . "$NVM_DIR/nvm.sh"
    fi

    echo "Checking Node.js..."
    if ! command -v node &> /dev/null; then
        echo "WARNING: Node.js is not installed on your Cloudtop. Please install it (e.g., using nvm: https://github.com/nvm-sh/nvm)."
    else
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    echo "Setup complete on Cloudtop!"
EOF

echo "========== Done! =========="
echo "To run the app on your Cloudtop:"
echo "1. SSH into Cloudtop: ssh $CLOUDTOP_HOST"
echo "2. Run the application:"
echo "     cd ~/usecase_scoring"
echo "     . ~/.nvm/nvm.sh"
echo "     npm run build && npm start"
