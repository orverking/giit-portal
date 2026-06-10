# Push this project to GitHub

## 1. Initialize git

```bash
git init
git add .
git commit -m "Initial GIIT portal"
```

## 2. Create your GitHub repo
Create an empty repository on GitHub, then connect it:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## 3. Confirm these files are NOT committed
Because `.gitignore` is included, these should stay out of GitHub:
- `.env`
- `node_modules/`
- `frontend/dist/`
- `backend/uploads/`
- logs

## 4. Commit future changes

```bash
git add .
git commit -m "Describe your change"
git push
```
