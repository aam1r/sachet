#!/bin/bash
#
# @description:
# sachet auto-install script

# @usage:
# Run this script from where the sachet was extracted to

set -e

# sachet installation variables
sachet__install_home=~/
sachet__install_cwd="$(pwd)"

# check if .vimrc already exists
if [ -f "$sachet__install_home".vimrc ]; then
  echo "Moving your ~/.vimrc to ~/.vimrc.old"
  mv "$sachet__install_home".vimrc "$sachet__install_home".vimrc.old

  echo ".. Successfully moved ~/.vimrc to ~/.vimrc.old"
fi

echo "Copying sachet's .vimrc to ~/.vimrc"
cp "$sachet__install_cwd"/vimrc "$sachet__install_home".vimrc

echo ".. Successfully copied vimrc to ~/.vimrc"

# check if .vim folder already exists
if [ -d "$sachet__install_home".vim ]; then
  echo "Moving your ~/.vim/ to ~/.vim.old/"
  mv "$sachet__install_home".vim/ "$sachet__install_home".vim.old/
  
  echo ".. Successfully moved ~/.vim/ to ~/.vim.old/"
fi

echo "Copying sachet's .vim/ to ~/.vim/"
cp -r "$sachet__install_cwd"/vim/ "$sachet__install_home".vim/

echo ".. Successfully copied vim/ to ~/.vim/"

echo ""
echo "Your sachet has successfully been installed. Restart all Vim instances."
echo "Thank you for using sachet"
