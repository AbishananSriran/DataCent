mkdir func
pip install -t func --platform manylinux2014_x86_64 --only-binary :all: mangum -r requirements.in
copy cloudflare.json func
copy worldcities.csv func
copy kmeans.py func
copy server.py func
copy serverless.py func
cd func
tar -acf ../func.zip *
cd ..
rem rmdir /s /q func
