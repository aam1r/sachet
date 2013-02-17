# sachet


sachet allows you to handcraft your VIM development environment. By allowing you to select features and functionality that you are comfortable with, sachet generates you a small package with the appropriate configuration files, plugins, and theme so you can leverage the potential of your VIM editor.

## Instructions

To run sachet locally, clone the repository and execute the following commands:

```
bundle install
mkdir repos; ruby -rubygems refresh_repos.rb
ruby -rubygems sachet.rb
```
You can then access sachet at `http://localhost:4567`. 

## Contributions

Feel free to fork the repo, send pull requests and/or open any issues that you may come across.

## Credits

* [spf13-vim](http://vim.spf13.com/) - Several parts of the .vimrc file were taken from the spf13-vim distribution. @spf13, thank you for creating such an amazing vim resource.