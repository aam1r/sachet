#!/bin/bash
#
# @description:
# sachet auto-install script

# @usage:
# Run this script from where the sachet was extracted to

# sachet installation variables
sachet__install_home=~/
sachet__install_cwd="$(pwd)"

# check if .vimrc already exists
if [ -f "$sachet__install_home"/.vimrc ]; then
  while true; do
    read -p "~/.vimrc already exists -- Overwrite? (y/n) " choice

    case "$choice" in
      y|Y ) cp -f "$sachet__install_cwd"/vimrc "$sachet__install_home"/.vimrc; break;;
      n|N ) exit;;
      * ) echo "Please answer y or n";;
    esac
  done
else
  echo "Copying sachet's .vimrc to ~/.vimrc"
  cp "$sachet__install_cwd"/vimrc "$sachet__install_home"/.vimrc
fi

echo ".. Successfully copied vimrc to ~/.vimrc"

# check if .vim folder already exists
if [ -d "$sachet__install_home"/.vim ]; then
  while true; do
    read -p "~/.vim directory already exists -- Overwrite? (y/n) " choice

    case "$choice" in
      y|Y ) cp -rf "$sachet__install_cwd"/vim/ "$sachet__install_home"/.vim/; break;;
      n|N ) exit;;
      * ) echo "Please answer y or n";;
    esac
  done
else
  echo "Copying sachet's .vim/ to ~/.vim/"
  cp -r "$sachet__install_cwd"/vim/ "$sachet__install_home"/.vim/
fi

echo ".. Successfully copied vim/ to ~/.vim/"

echo ""
echo "Your sachet has successfully been installed. Restart all Vim instances."
echo "Thank you for using sachet"