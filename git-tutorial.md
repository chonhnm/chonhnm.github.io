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
```

the rules for patterns in the `.gitignore` file:
- Blank lines or lines starting with # are ignored.

- Standard glob patterns work, and will be applied recursively throughout the entire working tree.

- You can start patterns with a forward slash (/) to avoid recursivity.

- You can end patterns with a forward slash (/) to specify a directory.

- You can negate a pattern by starting it with an exclamation point (!).

```
# ignore all .a files
*.a

# but do track lib.a, even though you're ignoring .a files above
!lib.a

# only ignore the TODO file in the current directory, not subdir/TODO
/TODO

# ignore all files in any directory named build
build/

# ignore doc/notes.txt, but not doc/server/arch.txt
doc/*.txt

# ignore all .pdf files in the doc/ directory and any of its subdirectories
doc/**/*.pdf
```

### ignore local change to files

- .gitignore
 - 说明：显式地阻止提交文件。
 - 优势：.gitignore 文件本身提交至远程仓库，全组共享忽略文件配置。
 - 局限：如果项目已经存在远程仓库，即使被加入 .gitignore，仍然可以进行修改并提交。本地的修改会显示在 git status 结果中。
- .git/info/exclude
 - 说明：显式地阻止提交文件。
 - 优势：exclude 文件本身不会提交至远程仓库，因此适合放一些个人定制的 「gitignore」 项目。
 - 局限：和 .gitignore 存在同样地局限。文件若已存在远程仓库，则本地修改仍可以提交至远程仓库。本地的修改会显示在 git status 结果中。
- assume-unchanged
 - 说明：声明本地远程都不会修改这个文件。
 - 优势：git 直接跳过这些文件的处理以提升性能。文件不会出现在 git status。
 - 局限：不适合本地或远程需要修改的文件。本地会忽略掉之后远程文件的修改。
- skip-worktree
 - 说明：声明忽略文件的本地修改。
 - 优势：本地可以对文件做一些个人定制。文件不会出现在 git status。
 - 局限：拉取远程文件更新，或切换分支时有可能出现冲突，需要撤销忽略后手动解决冲突。

```
git update-index --assume-unchanged /path/to/file
git update-index --skip-worktree /path/to/file
git update-index --no-skip-worktree /path/to/file
```

find hide files
```
git ls-files -v | grep -E 'h '
```