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

# Chapter 2

## Recording changes to the repository

each file in your working directory can be in one of two states: tracked or untracked.

- tracked files are files that were in the last snapshot, as well as any newly staged files;
  they can be unmodified, modified, or staged. In short, tracked files are files that Git knows about.
- untracked files are everything else.
- so you cannot make files that belong to last snapshot untracked.(build.gradle cannot be untracked)

### the lifecycle of the status of your files
- untracked --add--> staged
- unmodified --(edit it)--> modified --add--> staged
- staged --commit--> unmodified --(remove the file)--> untracked

you can check the status of your files:
```
git status
```
you can track new file by:
```
git add <file_name>
```
you can stage modified file by:
```
git add <file_name>
```

`git add` is a multipurpose command:
- you use it to begin tracking new files
- to stage files
- to do other things like marking merge-conflicted files as resolved

### short status

```
$ git status -s
 M README
MM Rakefile
A  lib/git.rb
M  lib/simplegit.rb
?? LICENSE.txt
```
There are two columns to the output
- the left-hand column indicates the status of the staging area(changes to be committed)
- the right-hand column indicates the status of the working tree(changes not staged for commit)

### Ignoring Files

```
$ cat .gitignore
*.[oa]
*~
