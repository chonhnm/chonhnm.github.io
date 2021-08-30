## The Three States
Git has three main states that your files can reside in: <b>modified<b>, <b>staged<b>, and <b>committed<b>:

- Modified means that you have changed the file but have not committed it to your database yet.
- Staged means that you have marked a modified file in its current version to go into your next commit snapshot.
- Committed means that the data is safely stored in your local database.

## First-Time Git Setup

`git config` let you get and set configuration variables:
- `git config --system` affect every user. file in `/etc/gitconfig`
- `git config --global` affect every repository of yours. file in `~/.gitconfig` or `~/.config/git/config`
- `git config --local` affect current repository. file in `.git/config`

you can view all of your settings and where they are coming from using:
```
git config --list --show-origin
```
you can set your identity:
```
git config --global user.name "your name"
git config --global user.email "your_email@example.com"
```
you can config your default editor
```
git config --global core.editor emacs
```
By default Git will create a branch called <b>master<b> when you create a new repository with `git init`.
you can set <b>main<b> as the default branch name by:
```
git config --global init.defaultHBranch main
```
you can check a specific key's value:
```
git config user.name
```

## Getting Help

for detail help information:
```
git help <verb>
git <verb> --help
man git-<verb>
```
for a quicker refresher
```
git <verb> -h
```
