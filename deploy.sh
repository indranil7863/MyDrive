set -e
echo "deployment started....."
cd /home/user/Desktop/my_drive_frontend/MyDrive
echo "git pull..."
git pull
echo "git pull completed!"
echo "running the test cases...."
npm run test 
echo "start building..."
npm run build
echo "build complete!"
echo "start deploying on aws..."
aws s3 cp dist/ s3://storage-app-indranil --recursive
echo "deployment completed!"


