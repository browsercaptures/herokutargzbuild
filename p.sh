yarn pretty

git add .
git commit -m "$*"
git push --set-upstream origin master

. archive.sh
git add repo.tar.gz
git commit -m "repo.tar.gz"
git push