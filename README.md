# Node 
node v10.22.0

# Install angular/cli package globally
npm install @angular/cli@6.2.4 -g

# Installations
npm install --force
npm i @types/node@7.0.7 --save-dev
npm i @amcharts/amcharts4@4.4.7 --save
npm install --save-dev --unsafe-perm node-sass

# Build UI
node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build --prod --build-optimizer false